"""LLM backend: Ollama (default) or OpenAI-compatible API."""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any


def _env(name: str, default: str = "") -> str:
    return (os.environ.get(name) or default).strip()


def chat(messages: list[dict[str, str]], temperature: float = 0.4) -> str:
    provider = _env("LLM_PROVIDER", "auto").lower()
    if provider == "auto":
        provider = "openai" if _env("OPENAI_API_KEY") else "ollama"
        # Prefer ollama if openai key known-bad / empty response path
        if provider == "openai" and not _env("OPENAI_API_KEY"):
            provider = "ollama"

    if provider == "openai":
        try:
            return _openai(messages, temperature)
        except Exception:
            return _ollama(messages, temperature)
    return _ollama(messages, temperature)


def _openai(messages: list[dict[str, str]], temperature: float) -> str:
    key = _env("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY missing")
    base = _env("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = _env("OPENAI_MODEL", "gpt-4o-mini")
    payload = {
        "model": model,
        "temperature": temperature,
        "messages": messages,
        "response_format": {"type": "json_object"},
    }
    req = urllib.request.Request(
        f"{base}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]


def _ollama(messages: list[dict[str, str]], temperature: float) -> str:
    host = _env("OLLAMA_HOST", "http://127.0.0.1:11434").rstrip("/")
    model = _env("OLLAMA_MODEL", "hermes3-agent:latest")
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "format": "json",
        "options": {"temperature": temperature},
    }
    req = urllib.request.Request(
        f"{host}/api/chat",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Ollama недоступен ({host}): {exc}") from exc
    return data.get("message", {}).get("content") or "{}"


def parse_agent_json(raw: str) -> dict[str, Any]:
    raw = (raw or "").strip()
    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.startswith("json"):
            raw = raw[4:].strip()
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return data
    except json.JSONDecodeError:
        pass
    # fallback: treat whole text as reply
    return {
        "reply": raw or "Уточните, пожалуйста, задачу — обучение, инференс или поставка узла?",
        "stage": "discovery",
        "bant": {},
        "hot": False,
        "owner_note": "",
    }
