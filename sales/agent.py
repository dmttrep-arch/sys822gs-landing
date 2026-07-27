"""Hybrid sales agent: SalesGPT stages + BANT/MEDDIC + product KB."""

from __future__ import annotations

from typing import Any

from . import memory
from .knowledge import KB_TEXT, OBJECTIONS, PRODUCT
from .llm import chat, parse_agent_json
from .playbook import MEDDIC_HINTS, STAGE_GOALS, SYSTEM_PROMPT


def _rule_fallback(user_text: str, data: dict[str, Any]) -> dict[str, Any]:
    """Deterministic helper if LLM fails."""
    low = user_text.lower()
    stage = data.get("stage") or "intro"

    for key, ans in OBJECTIONS.items():
        if key.replace("_", " ") in low or key in low:
            return {
                "reply": ans + "\n\nКакая у вас целевая нагрузка — обучение или инференс?",
                "stage": "objections",
                "bant": data.get("bant") or {},
                "hot": False,
                "owner_note": "",
            }

    if any(w in low for w in ("цена", "стоимость", "сколько", "budget", "бюджет", "кп", "счет", "счёт")):
        return {
            "reply": (
                f"Публичная рамка — {PRODUCT['price_public']}. "
                f"{PRODUCT['price_note'].capitalize()}. "
                "Чтобы собрать КП: компания, контакт и задача (обучение/инференс/HPC)?"
            ),
            "stage": "close",
            "bant": {**(data.get("bant") or {}), "budget": data.get("bant", {}).get("budget") or "интересует КП"},
            "hot": True,
            "owner_note": f"Клиент спросил цену/КП: {user_text[:240]}",
        }

    if any(w in low for w in ("b300", "спец", "gpu", "память", "nvlink", "800g", "xeon")):
        return {
            "reply": (
                f"{PRODUCT['sku']}: {PRODUCT['gpu']}; {PRODUCT['hbm']}; "
                f"{PRODUCT['cpu']}; сеть {PRODUCT['net']}. "
                f"Готовность: {PRODUCT['ready']}. "
                "Под какую модель/нагрузку смотрите узел?"
            ),
            "stage": "pitch" if stage in ("intro", "discovery") else stage,
            "bant": data.get("bant") or {},
            "hot": False,
            "owner_note": "",
        }

    if stage == "intro":
        return {
            "reply": (
                "Здравствуйте. Я менеджер по AI-серверам — помогаю с поставкой "
                f"{PRODUCT['sku']} (8× NVIDIA B300, Ready to Ship). "
                "Какая задача ближе: обучение LLM, инференс или HPC?"
            ),
            "stage": "discovery",
            "bant": data.get("bant") or {},
            "hot": False,
            "owner_note": "",
        }

    return {
        "reply": (
            "Понял. Чтобы предложить конфигурацию и сроки, уточните: "
            "1) обучение или инференс, 2) ориентир по сроку, 3) нужен on-prem узел сейчас?"
        ),
        "stage": "qualify",
        "bant": data.get("bant") or {},
        "hot": False,
        "owner_note": "",
    }


def reply(chat_id: int | str, user_text: str, user_meta: dict | None = None) -> dict[str, Any]:
    data = memory.load(chat_id)
    if user_meta:
        prof = data.setdefault("profile", {})
        for k in ("name", "company", "contact"):
            if user_meta.get(k):
                prof[k] = user_meta[k]

    memory.append_message(data, "user", user_text)
    stage = data.get("stage") or "intro"
    bant = data.get("bant") or {}

    system = SYSTEM_PROMPT.format(
        kb=KB_TEXT,
        stage=stage,
        stage_goal=STAGE_GOALS.get(stage, ""),
        budget=bant.get("budget") or "неизвестно",
        authority=bant.get("authority") or "неизвестно",
        need=bant.get("need") or "неизвестно",
        timeline=bant.get("timeline") or "неизвестно",
        meddic=", ".join(MEDDIC_HINTS),
    )

    messages = [{"role": "system", "content": system}]
    for m in data.get("messages", [])[-12:]:
        role = "assistant" if m["role"] == "assistant" else "user"
        messages.append({"role": role, "content": m["content"]})

    try:
        raw = chat(messages)
        result = parse_agent_json(raw)
    except Exception as exc:  # noqa: BLE001
        result = _rule_fallback(user_text, data)
        result["owner_note"] = (result.get("owner_note") or "") + f" [llm_fallback: {exc}]"

    reply_text = str(result.get("reply") or "").strip()
    if not reply_text:
        result = _rule_fallback(user_text, data)
        reply_text = result["reply"]

    memory.merge_bant(data, result.get("bant"))
    memory.set_stage(data, str(result.get("stage") or stage))
    memory.append_message(data, "assistant", reply_text)

    hot = bool(result.get("hot"))
    owner_note = str(result.get("owner_note") or "").strip()
    # Auto-hot if BANT almost filled
    filled = sum(1 for k in ("budget", "authority", "need", "timeline") if (data.get("bant") or {}).get(k))
    if filled >= 3:
        hot = True
        if not owner_note:
            owner_note = "BANT почти заполнен — пора КП"

    out = {
        "reply": reply_text,
        "stage": data["stage"],
        "bant": data.get("bant") or {},
        "hot": hot,
        "owner_note": owner_note,
        "hot_sent": bool(data.get("hot_sent")),
        "profile": data.get("profile") or {},
    }

    if hot and not data.get("hot_sent"):
        data["hot_sent"] = True
        out["notify_owner"] = True
    else:
        out["notify_owner"] = False

    memory.save(chat_id, data)
    return out
