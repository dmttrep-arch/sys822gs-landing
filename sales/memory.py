"""Session memory for sales chats."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .playbook import BANT_FIELDS, STAGES

ROOT = Path(__file__).resolve().parent
SESSIONS = ROOT / "sessions"
SESSIONS.mkdir(exist_ok=True)


def _path(chat_id: int | str) -> Path:
    return SESSIONS / f"{chat_id}.json"


def load(chat_id: int | str) -> dict[str, Any]:
    p = _path(chat_id)
    if not p.exists():
        return {
            "stage": "intro",
            "bant": {k: "" for k in BANT_FIELDS},
            "messages": [],
            "profile": {"name": "", "company": "", "contact": ""},
            "hot_sent": False,
        }
    return json.loads(p.read_text(encoding="utf-8"))


def save(chat_id: int | str, data: dict[str, Any]) -> None:
    _path(chat_id).write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def append_message(data: dict[str, Any], role: str, content: str, limit: int = 24) -> None:
    data.setdefault("messages", []).append({"role": role, "content": content})
    data["messages"] = data["messages"][-limit:]


def merge_bant(data: dict[str, Any], incoming: dict | None) -> None:
    if not isinstance(incoming, dict):
        return
    bant = data.setdefault("bant", {k: "" for k in BANT_FIELDS})
    for k in BANT_FIELDS:
        val = str(incoming.get(k) or "").strip()
        if val:
            bant[k] = val


def set_stage(data: dict[str, Any], stage: str) -> None:
    if stage in STAGES:
        data["stage"] = stage
