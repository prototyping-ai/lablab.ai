"""
TranslatorAgent — LangGraph Translation Agent
Translates text (speech transcripts or OCR), generates pronunciation hints,
and formats output for AR overlay and avatar display.
"""

import os
import re
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
        logging.FileHandler(f"{LOG_DIR}/translator_agent.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger("translator_agent")


# ── LangGraph State ───────────────────────────────────────────────────────────
class TranslatorState(TypedDict):
    # Inputs
    text: str
    source_language: Optional[str]
    target_language: str
    context_type: Optional[str]           # "speech" | "ocr"
    conversation_context: Optional[List]
    display_on_avatar: bool
    display_on_AR_overlay: bool
    speaker_id: Optional[str]
    # Intermediate
    clean_text: Optional[str]
    detected_language: Optional[str]
    translated_text: Optional[str]
    pronunciation_hint: Optional[str]
    # Output
    result: Optional[dict]
    error: Optional[str]


# ── LLM helper ────────────────────────────────────────────────────────────────
def get_llm(temperature: float = 0.2):
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=temperature,
        api_key=os.getenv("OPENAI_API_KEY"),
    )


# ── Node 1: Preprocess ────────────────────────────────────────────────────────
def preprocess_node(state: TranslatorState) -> TranslatorState:
    """Normalize whitespace and remove common OCR artifacts."""
    try:
        text = state["text"]
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        # Remove common OCR artifacts (isolated punctuation bursts, null chars)
        text = re.sub(r'[^\x00-\x7F\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF]+', ' ', text)
        text = re.sub(r'(\s[^\w\s]\s)+', ' ', text).strip()
        logger.info(f"preprocess_node: cleaned text length={len(text)}")
        return {**state, "clean_text": text, "error": None}
    except Exception as exc:
        logger.error(f"preprocess_node error: {exc}")
        return {**state, "clean_text": state["text"], "error": str(exc)}


# ── Node 2: Translate (+ auto-detect language) ────────────────────────────────
def translate_node(state: TranslatorState) -> TranslatorState:
    """Detect source language if missing, then translate."""
    try:
        llm = get_llm()
        clean_text  = state.get("clean_text") or state["text"]
        src_lang    = state.get("source_language") or "auto"
        tgt_lang    = state.get("target_language", "en")
        ctx_type    = state.get("context_type", "speech")
        conv_ctx    = state.get("conversation_context") or []

        # Build conversation context string if present
        ctx_str = ""
        if conv_ctx:
            ctx_str = "\nConversation context:\n" + "\n".join(
                [f"  - {c}" for c in conv_ctx[:5]]
            )

        system_prompt = (
            "You are an expert multilingual translator optimized for real-time "
            "speech and OCR translation. Be accurate, natural, and context-aware."
        )

        user_prompt = f"""Translate the following {ctx_type} text.
Source language: {src_lang} (if "auto", detect it automatically)
Target language: {tgt_lang}
{ctx_str}

Text to translate:
\"\"\"{clean_text}\"\"\"

Respond ONLY with a JSON object in this exact format:
{{
  "detected_language": "<ISO 639-1 code of source language>",
  "translated_text": "<translation here>"
}}"""

        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ])

        raw = response.content.strip()
        # Strip markdown fences if present
        for fence in ("```json", "```"):
            if raw.startswith(fence):
                raw = raw[len(fence):]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()

        parsed = json.loads(raw)
        detected  = parsed.get("detected_language", src_lang)
        translated = parsed.get("translated_text", "")

        logger.info(f"translate_node: {detected} → {tgt_lang}, len={len(translated)}")
        return {**state, "detected_language": detected, "translated_text": translated, "error": None}

    except Exception as exc:
        logger.error(f"translate_node error: {exc}")
        return {**state, "translated_text": "", "error": str(exc)}


# ── Node 3: Pronunciation Hints (conditional) ─────────────────────────────────
def pronunciation_node(state: TranslatorState) -> TranslatorState:
    """Generate phonetic pronunciation hints for avatar TTS display."""
    try:
        llm = get_llm(temperature=0.1)
        translated = state.get("translated_text", "")
        tgt_lang   = state.get("target_language", "en")

        prompt = f"""Generate simple phonetic pronunciation hints for an avatar speaker.
Language: {tgt_lang}
Text: \"{translated}\"

Rules:
- Use simple hyphenated syllables (e.g. "hell-oh, how ar yoo")
- Keep it short and natural-sounding
- Respond with ONLY the pronunciation string, no extra text."""

        response = llm.invoke([HumanMessage(content=prompt)])
        hint = response.content.strip().strip('"')
        logger.info("pronunciation_node: hint generated")
        return {**state, "pronunciation_hint": hint, "error": None}

    except Exception as exc:
        logger.error(f"pronunciation_node error: {exc}")
        return {**state, "pronunciation_hint": None, "error": str(exc)}


# ── Node 4: Format Output ─────────────────────────────────────────────────────
def format_node(state: TranslatorState) -> TranslatorState:
    """Package final structured JSON output."""
    result = {
        "translated_text":      state.get("translated_text", ""),
        "pronunciation_hint":   state.get("pronunciation_hint"),
        "display_for_avatar":   state.get("display_on_avatar", False),
        "display_for_AR_overlay": state.get("display_on_AR_overlay", False),
    }
    # Remove pronunciation_hint if not needed
    if not state.get("display_on_avatar"):
        result["pronunciation_hint"] = None

    logger.info("format_node: output packaged")
    return {**state, "result": result}


# ── Conditional Router ────────────────────────────────────────────────────────
def needs_pronunciation(state: TranslatorState) -> str:
    return "pronunciation" if state.get("display_on_avatar") else "format"


# ── Build Graph ───────────────────────────────────────────────────────────────
def build_graph():
    g = StateGraph(TranslatorState)
    g.add_node("preprocess",    preprocess_node)
    g.add_node("translate",     translate_node)
    g.add_node("pronunciation", pronunciation_node)
    g.add_node("format",        format_node)

    g.set_entry_point("preprocess")
    g.add_edge("preprocess", "translate")
    g.add_conditional_edges("translate", needs_pronunciation, {
        "pronunciation": "pronunciation",
        "format":        "format",
    })
    g.add_edge("pronunciation", "format")
    g.add_edge("format", END)
    return g.compile()


translator_graph = build_graph()


# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(title="TranslatorAgent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response Models ─────────────────────────────────────────────────
class TranslateRequest(BaseModel):
    text: str
    source_language: Optional[str] = None
    target_language: str = "en"
    context_type: Optional[str] = "speech"
    conversation_context: Optional[List[Any]] = None
    display_on_avatar: bool = False
    display_on_AR_overlay: bool = False
    speaker_id: Optional[str] = None


class TranslateResponse(BaseModel):
    translated_text: str
    pronunciation_hint: Optional[str] = None
    display_for_avatar: bool
    display_for_AR_overlay: bool


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "agent": "TranslatorAgent"}


@app.post("/translate", response_model=TranslateResponse)
async def translate(request: TranslateRequest):
    try:
        logger.info(f"Received translate request: src={request.source_language}, tgt={request.target_language}, avatar={request.display_on_avatar}")

        state = translator_graph.invoke({
            "text":                 request.text,
            "source_language":      request.source_language,
            "target_language":      request.target_language,
            "context_type":         request.context_type,
            "conversation_context": request.conversation_context,
            "display_on_avatar":    request.display_on_avatar,
            "display_on_AR_overlay": request.display_on_AR_overlay,
            "speaker_id":           request.speaker_id,
            "clean_text":           None,
            "detected_language":    None,
            "translated_text":      None,
            "pronunciation_hint":   None,
            "result":               None,
            "error":                None,
        })

        if state.get("error") and not state.get("result"):
            raise HTTPException(status_code=500, detail=state["error"])

        return state["result"]

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Endpoint error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))
