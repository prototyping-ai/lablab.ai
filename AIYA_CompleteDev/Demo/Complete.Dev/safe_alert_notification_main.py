"""
safe_alert_notification — LangGraph Safety Alert Agent
Sends email (with image attachment) and/or SMS when a safety threshold is triggered.
Triggered by the front-end whenever the environment safety agent flags a hazard.
"""

import os
import base64
import uuid
import logging
import requests
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, END

load_dotenv()

# ── Logging ───────────────────────────────────────────────────────────────────
LOG_DIR = "/mnt/efs/spaces/f41ca315-62fd-41ba-be75-7088fbf8bbec/0c5ad400-6ad2-4c1a-ac54-d1463837c9e5/logs"
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='{"time":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}',
    handlers=[
        logging.FileHandler(f"{LOG_DIR}/safe_alert_notification.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger("safe_alert_notification")

# ── Temp image storage ────────────────────────────────────────────────────────
TEMP_DIR = "/tmp/safe_alert_images"
os.makedirs(TEMP_DIR, exist_ok=True)


# ── LangGraph State ───────────────────────────────────────────────────────────
class AlertState(TypedDict):
    # Inputs
    to_email: str
    email_from: str
    subject: str
    body: str
    image_base64: Optional[str]        # raw base64 or data-URI
    sms_recipient: Optional[str]       # phone number e.g. "+15550001234"
    # Intermediate
    attachment_path: Optional[str]     # decoded image saved on disk
    # Output
    email_sent: bool
    sms_sent: bool
    error: Optional[str]
    result: Optional[dict]


# ── Node 1: Decode base64 image → temp file ───────────────────────────────────
def decode_image_node(state: AlertState) -> AlertState:
    """Decode base64 image and save to a temp file for email attachment."""
    raw = state.get("image_base64")
    if not raw:
        logger.info("decode_image_node: no image provided, skipping")
        return {**state, "attachment_path": None}

    try:
        # Strip data-URI prefix if present  (data:image/jpeg;base64,<data>)
        if "," in raw:
            raw = raw.split(",", 1)[1]

        image_bytes = base64.b64decode(raw)
        filename = f"alert_{uuid.uuid4().hex}.jpg"
        path = os.path.join(TEMP_DIR, filename)

        with open(path, "wb") as f:
            f.write(image_bytes)

        logger.info(f"decode_image_node: image saved to {path} ({len(image_bytes)} bytes)")
        return {**state, "attachment_path": path, "error": None}

    except Exception as exc:
        logger.error(f"decode_image_node error: {exc}")
        return {**state, "attachment_path": None, "error": str(exc)}


# ── Node 2: Send Email via SMTP2GO HTTP API (port 443) ───────────────────────
def send_email_node(state: AlertState) -> AlertState:
    """Send email via SMTP2GO REST API over HTTPS — no SMTP port needed."""
    try:
        api_key      = os.getenv("SMTP2GO_API_KEY")
        sender_email = os.getenv("EMAIL_SENDER")

        if not api_key or not sender_email:
            raise ValueError("SMTP2GO_API_KEY and EMAIL_SENDER must be set in .env")

        payload = {
            "api_key":  api_key,
            "to":       [state["to_email"]],
            "sender":   f"{state['email_from']} <{sender_email}>",
            "subject":  state["subject"],
            "text_body": state["body"],
        }

        # Attach decoded image if available
        attachment_path = state.get("attachment_path")
        if attachment_path and os.path.exists(attachment_path):
            with open(attachment_path, "rb") as img_file:
                img_b64 = base64.b64encode(img_file.read()).decode("utf-8")
            filename = os.path.basename(attachment_path)
            payload["attachments"] = [{
                "filename":  filename,
                "fileblob":  img_b64,
                "mimetype":  "image/jpeg",
            }]
            logger.info(f"send_email_node: image attached — {filename}")

        response = requests.post(
            "https://api.smtp2go.com/v3/email/send",
            json=payload,
            timeout=15
        )
        resp_json = response.json()

        if response.status_code == 200 and resp_json.get("data", {}).get("succeeded", 0) > 0:
            logger.info(f"send_email_node: email sent to {state['to_email']} via SMTP2GO API")
            return {**state, "email_sent": True, "error": None}
        else:
            err = resp_json.get("data", {}).get("failures") or resp_json
            raise ValueError(f"SMTP2GO API error: {err}")

    except Exception as exc:
        logger.error(f"send_email_node error: {exc}")
        return {**state, "email_sent": False, "error": str(exc)}


# ── Node 3: Send SMS (Twilio) ─────────────────────────────────────────────────
def send_sms_node(state: AlertState) -> AlertState:
    """Send SMS via Twilio if sms_recipient is provided and Twilio is configured."""
    sms_recipient = state.get("sms_recipient")
    if not sms_recipient:
        logger.info("send_sms_node: no SMS recipient, skipping")
        return {**state, "sms_sent": False}

    try:
        from twilio.rest import Client as TwilioClient

        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token  = os.getenv("TWILIO_AUTH_TOKEN")
        from_number = os.getenv("TWILIO_FROM_NUMBER")

        if not all([account_sid, auth_token, from_number]):
            logger.warning("send_sms_node: Twilio credentials not set, skipping SMS")
            return {**state, "sms_sent": False}

        client = TwilioClient(account_sid, auth_token)

        # Keep SMS concise — subject + first 120 chars of body
        sms_body = f"⚠️ SAFETY ALERT: {state['subject']}\n{state['body'][:120]}"

        message = client.messages.create(
            body=sms_body,
            from_=from_number,
            to=sms_recipient
        )

        logger.info(f"send_sms_node: SMS sent to {sms_recipient}, SID={message.sid}")
        return {**state, "sms_sent": True, "error": None}

    except ImportError:
        logger.warning("send_sms_node: twilio package not installed, skipping SMS")
        return {**state, "sms_sent": False}
    except Exception as exc:
        logger.error(f"send_sms_node error: {exc}")
        return {**state, "sms_sent": False, "error": str(exc)}


# ── Node 4: Cleanup + Format Output ──────────────────────────────────────────
def format_output_node(state: AlertState) -> AlertState:
    """Clean up temp image and build final response."""
    # Remove temp image file
    path = state.get("attachment_path")
    if path and os.path.exists(path):
        try:
            os.remove(path)
            logger.info(f"format_output_node: temp file removed {path}")
        except Exception:
            pass

    result = {
        "email_sent":   state.get("email_sent", False),
        "sms_sent":     state.get("sms_sent", False),
        "to_email":     state.get("to_email"),
        "sms_recipient": state.get("sms_recipient"),
        "subject":      state.get("subject"),
        "error":        state.get("error"),
    }

    logger.info(f"format_output_node: email={result['email_sent']}, sms={result['sms_sent']}")
    return {**state, "result": result}


# ── Conditional Router: skip SMS if no recipient ──────────────────────────────
def route_sms(state: AlertState) -> str:
    return "sms" if state.get("sms_recipient") else "format"


# ── Build Graph ───────────────────────────────────────────────────────────────
def build_graph():
    g = StateGraph(AlertState)
    g.add_node("decode_image", decode_image_node)
    g.add_node("send_email",   send_email_node)
    g.add_node("sms",          send_sms_node)
    g.add_node("format",       format_output_node)

    g.set_entry_point("decode_image")
    g.add_edge("decode_image", "send_email")
    g.add_conditional_edges("send_email", route_sms, {
        "sms":    "sms",
        "format": "format",
    })
    g.add_edge("sms",    "format")
    g.add_edge("format", END)
    return g.compile()


alert_graph = build_graph()


# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(title="SafeAlertNotification", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response Models ─────────────────────────────────────────────────
class AlertRequest(BaseModel):
    to_email: str
    email_from: str
    subject: str
    body: str
    image_base64: Optional[str] = None    # base64 or data-URI
    sms_recipient: Optional[str] = None   # "+15550001234"


class AlertResponse(BaseModel):
    email_sent: bool
    sms_sent: bool
    to_email: str
    sms_recipient: Optional[str] = None
    subject: str
    error: Optional[str] = None


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "agent": "SafeAlertNotification"}


@app.post("/alert", response_model=AlertResponse)
async def send_alert(request: AlertRequest):
    try:
        logger.info(f"Alert received: subject='{request.subject}', to={request.to_email}, sms={request.sms_recipient}")

        state = alert_graph.invoke({
            "to_email":      request.to_email,
            "email_from":    request.email_from,
            "subject":       request.subject,
            "body":          request.body,
            "image_base64":  request.image_base64,
            "sms_recipient": request.sms_recipient,
            "attachment_path": None,
            "email_sent":    False,
            "sms_sent":      False,
            "error":         None,
            "result":        None,
        })

        if state.get("error") and not state.get("email_sent"):
            raise HTTPException(status_code=500, detail=state["error"])

        return state["result"]

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Endpoint error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))
