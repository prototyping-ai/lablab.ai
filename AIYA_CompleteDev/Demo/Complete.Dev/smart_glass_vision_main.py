"""
smart_glass_vision — LangGraph Vision Agent
Accepts a dynamic prompt + one or more Base64 / URL images,
runs them through GPT-4o-mini, and returns an OpenAI-compatible response.
"""

import os
import json
import logging
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing_extensions import TypedDict

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, END

load_dotenv()

# ── Logging ──────────────────────────────────────────────────────────────────
LOG_DIR = "/mnt/efs/spaces/f41ca315-62fd-41ba-be75-7088fbf8bbec/0c5ad400-6ad2-4c1a-ac54-d1463837c9e5/logs"
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='{"time":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}',
    handlers=[
        logging.FileHandler(f"{LOG_DIR}/smart_glass_vision.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger("smart_glass_vision")


# ── LangGraph State ───────────────────────────────────────────────────────────
class VisionState(TypedDict):
    prompt: str
    images: List[str]          # base64 strings or http(s) URLs
    temperature: float
    max_tokens: int
    result: Optional[str]
    error: Optional[str]


# ── Nodes ─────────────────────────────────────────────────────────────────────
def vision_node(state: VisionState) -> VisionState:
    """Send prompt + images to GPT-4o-mini vision."""
    try:
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=state.get("temperature", 0),
            max_tokens=state.get("max_tokens", 1500),
            api_key=os.getenv("OPENAI_API_KEY"),
        )

        # Build multi-modal content list
        content: List[Dict] = [{"type": "text", "text": state["prompt"]}]

        for img in state["images"]:
            if img.startswith("http://") or img.startswith("https://"):
                url = img
            elif img.startswith("data:"):
                url = img                       # already a data-URI
            else:
                url = f"data:image/jpeg;base64,{img}"   # raw base64 → data-URI

            content.append({"type": "image_url", "image_url": {"url": url}})

        response = llm.invoke([HumanMessage(content=content)])
        logger.info("vision_node completed successfully")
        return {**state, "result": response.content, "error": None}

    except Exception as exc:
        logger.error(f"vision_node error: {exc}")
        return {**state, "result": None, "error": str(exc)}


def parse_node(state: VisionState) -> VisionState:
    """Strip markdown fences and validate JSON when possible."""
    if state.get("error") or not state.get("result"):
        return state

    text = state["result"].strip()

    # Remove ```json … ``` or ``` … ``` wrappers
    for fence in ("```json", "```"):
        if text.startswith(fence):
            text = text[len(fence):]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    try:
        json.loads(text)   # validate – if it parses it's clean JSON
    except json.JSONDecodeError:
        pass               # return as-is (plain text answer)

    logger.info("parse_node completed successfully")
    return {**state, "result": text}


# ── Build Graph ───────────────────────────────────────────────────────────────
def build_graph():
    g = StateGraph(VisionState)
    g.add_node("vision", vision_node)
    g.add_node("parse",  parse_node)
    g.set_entry_point("vision")
    g.add_edge("vision", "parse")
    g.add_edge("parse", END)
    return g.compile()


vision_graph = build_graph()


# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(title="SmartGlass Vision Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── OpenAI-compatible request models ─────────────────────────────────────────
class ImageUrl(BaseModel):
    url: str

class ContentItem(BaseModel):
    type: str
    text: Optional[str] = None
    image_url: Optional[ImageUrl] = None

class Message(BaseModel):
    role: str
    content: Any   # str OR List[ContentItem]

class ChatRequest(BaseModel):
    model: str = "gpt-4o-mini"
    messages: List[Message]
    temperature: Optional[float] = 0
    max_tokens: Optional[int] = 1500


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "agent": "smart_glass_vision"}


@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    try:
        prompt = ""
        images: List[str] = []

        for msg in request.messages:
            if isinstance(msg.content, str):
                prompt += msg.content
            elif isinstance(msg.content, list):
                for item in msg.content:
                    # item may be a dict (from raw JSON) or a ContentItem
                    item_dict = item if isinstance(item, dict) else item.dict()
                    if item_dict.get("type") == "text":
                        prompt += item_dict.get("text", "")
                    elif item_dict.get("type") == "image_url":
                        img_url = (item_dict.get("image_url") or {}).get("url", "")
                        if img_url:
                            images.append(img_url)

        logger.info(f"Received request — images: {len(images)}, prompt_len: {len(prompt)}")

        state = vision_graph.invoke({
            "prompt": prompt,
            "images": images,
            "temperature": request.temperature or 0,
            "max_tokens": request.max_tokens or 1500,
            "result": None,
            "error": None,
        })

        if state.get("error"):
            raise HTTPException(status_code=500, detail=state["error"])

        # OpenAI-compatible response envelope
        return {
            "id": "chatcmpl-smartglass",
            "object": "chat.completion",
            "model": "gpt-4o-mini",
            "choices": [{
                "index": 0,
                "message": {"role": "assistant", "content": state["result"]},
                "finish_reason": "stop",
            }],
            "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
        }

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Endpoint error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))
