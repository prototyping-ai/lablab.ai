"""
environment_safety_agent — LangGraph Safety & Accessibility Vision Agent
Analyzes webcam snapshots for hazards, obstacles, accessibility cues, and OCR text.
Returns structured JSON for AR overlay and avatar alert system.
"""

import os
import json
import logging
from typing import Any, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing_extensions import TypedDict

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END

load_dotenv()

# ── Logging ───────────────────────────────────────────────────────────────────
LOG_DIR = "/mnt/efs/spaces/f41ca315-62fd-41ba-be75-7088fbf8bbec/0c5ad400-6ad2-4c1a-ac54-d1463837c9e5/logs"
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='{"time":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}',
    handlers=[
        logging.FileHandler(f"{LOG_DIR}/environment_safety_agent.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger("environment_safety_agent")

# ── Default Prompt ────────────────────────────────────────────────────────────
DEFAULT_PROMPT = (
    "Analyze this environment image for safety and accessibility. "
    "Identify hazards (stairs, wet floors, obstacles, low ceilings, traffic, people, dangerous objects), "
    "assist blind or deaf users by describing surroundings and visual cues, "
    "and read any visible text, signs, labels, or warnings (OCR)."
)

# ── LangGraph State ───────────────────────────────────────────────────────────
class SafetyState(TypedDict):
    # Inputs
    image: str                        # base64 or data-URI or http URL
    prompt: Optional[str]             # user-defined focus prompt
    last_alert: Optional[str]         # context: last alert sent
    location: Optional[str]           # optional GPS or room label
    timestamp: Optional[str]          # optional time context
    user_mode: Optional[str]          # "blind" | "deaf" | "general"
    # Intermediate
    raw_analysis: Optional[str]
    # Output
    result: Optional[dict]
    error: Optional[str]


# ── LLM helper ────────────────────────────────────────────────────────────────
def get_llm():
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0,
        max_tokens=1500,
        api_key=os.getenv("OPENAI_API_KEY"),
    )


# ── Node 1: Preprocess ────────────────────────────────────────────────────────
def preprocess_node(state: SafetyState) -> SafetyState:
    """Normalize image format and build context string."""
    try:
        img = state["image"].strip()
        if not img.startswith("http://") and not img.startswith("https://") and not img.startswith("data:"):
            img = f"data:image/jpeg;base64,{img}"

        prompt = state.get("prompt") or DEFAULT_PROMPT

        # Enrich prompt with user mode
        mode = state.get("user_mode", "general")
        if mode == "blind":
            prompt += " Focus on detailed narration for a blind user — describe distances, positions, and movement."
        elif mode == "deaf":
            prompt += " Focus on visual cues and signs important for a deaf user."

        # Append optional context
        context_parts = []
        if state.get("last_alert"):
            context_parts.append(f"Last alert: {state['last_alert']}")
        if state.get("location"):
            context_parts.append(f"Location: {state['location']}")
        if state.get("timestamp"):
            context_parts.append(f"Time: {state['timestamp']}")
        if context_parts:
            prompt += "\nContext: " + " | ".join(context_parts)

        logger.info(f"preprocess_node: mode={mode}, prompt_len={len(prompt)}")
        return {**state, "image": img, "prompt": prompt, "error": None}
    except Exception as exc:
        logger.error(f"preprocess_node error: {exc}")
        return {**state, "error": str(exc)}


# ── Node 2: Analyze Environment ───────────────────────────────────────────────
def analyze_node(state: SafetyState) -> SafetyState:
    """Use GPT-4o-mini vision to analyze image for hazards, OCR, and accessibility."""
    try:
        llm = get_llm()

        system_prompt = """You are an AI safety and accessibility assistant embedded in smart glasses.
Your job is to analyze real-time camera images and return structured safety information.
Always prioritize user safety — flag ALL potential hazards even if uncertain.
Be concise, clear, and actionable."""

        user_prompt = f"""{state['prompt']}

Respond ONLY with a valid JSON object in this exact format:
{{
  "description": "<one to two sentence natural language description of the environment>",
  "hazards": [
    {{"type": "<hazard type>", "severity": "<low|medium|high|critical>"}}
  ],
  "alerts": ["<urgent spoken alert for avatar>", ...],
  "ocr_text": ["<visible text, signs, labels found>", ...]
}}

Severity guide:
- critical: immediate danger (moving vehicle, fall edge, fire)
- high: urgent caution needed (wet floor, low ceiling, blocked path)
- medium: be aware (narrow passage, crowded area, steps ahead)
- low: informational (signage, general surroundings)

If no hazards are found, return empty arrays. Always include description."""

        content = [
            {"type": "text", "text": user_prompt},
            {"type": "image_url", "image_url": {"url": state["image"]}}
        ]

        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=content)
        ])

        raw = response.content.strip()
        for fence in ("```json", "```"):
            if raw.startswith(fence):
                raw = raw[len(fence):]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()

        logger.info("analyze_node: vision analysis complete")
        return {**state, "raw_analysis": raw, "error": None}

    except Exception as exc:
        logger.error(f"analyze_node error: {exc}")
        return {**state, "raw_analysis": None, "error": str(exc)}


# ── Node 3: Classify & Format Output ─────────────────────────────────────────
def classify_node(state: SafetyState) -> SafetyState:
    """Parse raw analysis, sort hazards by severity, and finalize output."""
    try:
        raw = state.get("raw_analysis", "{}")
        parsed = json.loads(raw)

        # Severity ordering
        severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        hazards = parsed.get("hazards", [])
        hazards_sorted = sorted(
            hazards,
            key=lambda h: severity_order.get(h.get("severity", "low"), 3)
        )

        # Elevate avatar alerts for critical/high hazards
        alerts = parsed.get("alerts", [])
        critical_hazards = [h for h in hazards_sorted if h.get("severity") in ("critical", "high")]
        if critical_hazards and not alerts:
            alerts = [f"Warning: {h['type']} detected!" for h in critical_hazards]

        result = {
            "description":  parsed.get("description", ""),
            "hazards":      hazards_sorted,
            "alerts":       alerts,
            "ocr_text":     parsed.get("ocr_text", []),
            "has_critical": any(h.get("severity") == "critical" for h in hazards_sorted),
            "user_mode":    state.get("user_mode", "general"),
        }

        logger.info(f"classify_node: hazards={len(hazards_sorted)}, critical={result['has_critical']}")
        return {**state, "result": result, "error": None}

    except json.JSONDecodeError as exc:
        logger.error(f"classify_node JSON parse error: {exc} | raw={state.get('raw_analysis')}")
        # Fallback: wrap raw text as description
        result = {
            "description": state.get("raw_analysis", "Unable to analyze environment."),
            "hazards": [],
            "alerts": [],
            "ocr_text": [],
            "has_critical": False,
            "user_mode": state.get("user_mode", "general"),
        }
        return {**state, "result": result, "error": None}
    except Exception as exc:
        logger.error(f"classify_node error: {exc}")
        return {**state, "error": str(exc)}


# ── Build Graph ───────────────────────────────────────────────────────────────
def build_graph():
    g = StateGraph(SafetyState)
    g.add_node("preprocess", preprocess_node)
    g.add_node("analyze",    analyze_node)
    g.add_node("classify",   classify_node)

    g.set_entry_point("preprocess")
    g.add_edge("preprocess", "analyze")
    g.add_edge("analyze",    "classify")
    g.add_edge("classify",   END)
    return g.compile()


safety_graph = build_graph()


# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(title="EnvironmentSafetyAgent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response Models ─────────────────────────────────────────────────
class SafetyRequest(BaseModel):
    image: str                          # base64, data-URI, or http URL
    prompt: Optional[str] = None        # custom focus prompt
    last_alert: Optional[str] = None
    location: Optional[str] = None
    timestamp: Optional[str] = None
    user_mode: Optional[str] = "general"  # "blind" | "deaf" | "general"


class HazardItem(BaseModel):
    type: str
    severity: str

class SafetyResponse(BaseModel):
    description: str
    hazards: List[HazardItem]
    alerts: List[str]
    ocr_text: List[str]
    has_critical: bool
    user_mode: str


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "agent": "EnvironmentSafetyAgent"}


@app.post("/analyze", response_model=SafetyResponse)
async def analyze(request: SafetyRequest):
    try:
        logger.info(f"Received analyze request: mode={request.user_mode}, has_prompt={bool(request.prompt)}")

        state = safety_graph.invoke({
            "image":        request.image,
            "prompt":       request.prompt,
            "last_alert":   request.last_alert,
            "location":     request.location,
            "timestamp":    request.timestamp,
            "user_mode":    request.user_mode,
            "raw_analysis": None,
            "result":       None,
            "error":        None,
        })

        if state.get("error") and not state.get("result"):
            raise HTTPException(status_code=500, detail=state["error"])

        return state["result"]

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Endpoint error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))
