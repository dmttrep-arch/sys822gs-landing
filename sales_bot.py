"""Telegram sales manager bot for @innvaAI_bot."""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_env(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    # merge into process env (without overriding existing)
    for k, v in env.items():
        os.environ.setdefault(k, v)
    return env


ENV = load_env(ROOT / ".env")
TOKEN = (ENV.get("TELEGRAM_BOT_TOKEN") or os.environ.get("TELEGRAM_BOT_TOKEN") or "").strip()
OWNER_CHAT_ID = (ENV.get("TELEGRAM_CHAT_ID") or "").strip()
BOT_USERNAME = (ENV.get("TELEGRAM_BOT_USERNAME") or "innvaAI_bot").lstrip("@")


def tg(method: str, **params) -> dict:
    data = urllib.parse.urlencode({k: v for k, v in params.items() if v is not None}).encode("utf-8")
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{TOKEN}/{method}",
        data=data,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            raise RuntimeError(body) from exc


def send(chat_id: int | str, text: str) -> dict:
    # Telegram limit ~4096
    text = text[:4000]
    return tg("sendMessage", chat_id=str(chat_id), text=text, disable_web_page_preview="true")


def notify_owner(text: str) -> None:
    if not OWNER_CHAT_ID:
        print("OWNER_CHAT_ID empty — skip notify", flush=True)
        return
    send(OWNER_CHAT_ID, text)


def format_hot(chat_id: int, username: str, result: dict) -> str:
    bant = result.get("bant") or {}
    prof = result.get("profile") or {}
    return "\n".join(
        [
            "HOT LEAD · sales-agent",
            f"chat_id: {chat_id}",
            f"user: @{username or '-'}",
            f"stage: {result.get('stage')}",
            f"need: {bant.get('need') or '-'}",
            f"budget: {bant.get('budget') or '-'}",
            f"authority: {bant.get('authority') or '-'}",
            f"timeline: {bant.get('timeline') or '-'}",
            f"company: {prof.get('company') or '-'}",
            f"note: {result.get('owner_note') or '-'}",
        ]
    )


def handle_message(msg: dict) -> None:
    from sales import agent

    chat = msg.get("chat") or {}
    if chat.get("type") != "private":
        return

    chat_id = chat.get("id")
    text = (msg.get("text") or "").strip()
    if not chat_id or not text:
        return

    from_user = msg.get("from") or {}
    username = from_user.get("username") or ""
    full_name = " ".join(
        x for x in [from_user.get("first_name"), from_user.get("last_name")] if x
    )

    # Owner commands
    if OWNER_CHAT_ID and str(chat_id) == str(OWNER_CHAT_ID):
        if text.startswith("/"):
            if text.startswith("/status"):
                send(chat_id, f"Sales agent online. Bot @{BOT_USERNAME}. Sessions in sales/sessions/")
                return
            if text.startswith("/help"):
                send(chat_id, "Команды: /status /help\nКлиенты пишут боту — агент отвечает, hot-лиды приходят сюда.")
                return

    if text.startswith("/start"):
        text = "Здравствуйте, хочу узнать про сервер SYS-822GS"

    # typing
    try:
        tg("sendChatAction", chat_id=str(chat_id), action="typing")
    except Exception:
        pass

    result = agent.reply(
        chat_id,
        text,
        user_meta={"name": full_name, "contact": f"@{username}" if username else ""},
    )
    send(chat_id, result["reply"])

    if result.get("notify_owner") or (result.get("hot") and result.get("owner_note")):
        if result.get("notify_owner"):
            notify_owner(format_hot(chat_id, username, result))
        elif result.get("owner_note") and OWNER_CHAT_ID and str(chat_id) != str(OWNER_CHAT_ID):
            notify_owner(f"Note · @{username or chat_id}: {result['owner_note']}")


def main() -> None:
    if not TOKEN:
        raise SystemExit("TELEGRAM_BOT_TOKEN missing in .env")

    # Force ollama by default for this project unless overridden
    os.environ.setdefault("LLM_PROVIDER", "ollama")
    os.environ.setdefault("OLLAMA_MODEL", "hermes3-agent:latest")

    me = tg("getMe")
    if not me.get("ok"):
        raise SystemExit(me)
    print(f"Sales bot @{me['result']['username']} started", flush=True)
    print(f"Owner chat_id={OWNER_CHAT_ID or 'NOT SET'}", flush=True)
    print(f"LLM_PROVIDER={os.environ.get('LLM_PROVIDER')} MODEL={os.environ.get('OLLAMA_MODEL')}", flush=True)

    tg("deleteWebhook", drop_pending_updates=False)

    offset = None
    while True:
        params: dict = {"timeout": 50, "limit": 20, "allowed_updates": json.dumps(["message"])}
        if offset is not None:
            params["offset"] = offset
        try:
            upd = tg("getUpdates", **params)
        except Exception as exc:  # noqa: BLE001
            print("poll error:", exc, flush=True)
            time.sleep(2)
            continue

        if not upd.get("ok"):
            print("getUpdates:", upd, flush=True)
            time.sleep(2)
            continue

        for item in upd.get("result", []):
            offset = item["update_id"] + 1
            msg = item.get("message")
            if not msg:
                continue
            try:
                handle_message(msg)
            except Exception as exc:  # noqa: BLE001
                print("handle error:", exc, flush=True)
                try:
                    cid = (msg.get("chat") or {}).get("id")
                    if cid:
                        send(cid, "Технический сбой на секунду. Напишите ещё раз или уточните задачу.")
                except Exception:
                    pass


if __name__ == "__main__":
    main()
