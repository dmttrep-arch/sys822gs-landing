"""Setup NEW Telegram bot for SYS-822GS landing (not remont bot).

Usage:
  python setup_telegram.py
  python setup_telegram.py --token "123456:ABC..."

Steps:
  1) Open @BotFather → /newbot
  2) Name: SYS-822GS Leads
  3) Username: sys822gs_leads_bot  (or any free *bot)
  4) Paste token here / pass --token
  5) Open the new bot → Start
"""

from __future__ import annotations

import argparse
import json
import time
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ENV_PATH = ROOT / ".env"

SUGGESTED_NAME = "SYS-822GS Leads"
SUGGESTED_USERNAME = "sys822gs_leads_bot"


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if ENV_PATH.exists():
        for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
            if not line.strip() or line.strip().startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def save_env(env: dict[str, str]) -> None:
    order = [
        "TELEGRAM_BOT_TOKEN",
        "TELEGRAM_CHAT_ID",
        "TELEGRAM_NOTIFY_USERNAME",
        "TELEGRAM_BOT_USERNAME",
        "HOST",
        "PORT",
    ]
    lines = [f"{k}={env.get(k, '')}" for k in order]
    for k, v in env.items():
        if k not in order:
            lines.append(f"{k}={v}")
    ENV_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def tg(token: str, method: str, **params) -> dict:
    data = urllib.parse.urlencode(params).encode("utf-8") if params else None
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/{method}",
        data=data,
        method="POST" if data else "GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        try:
            return json.loads(body)
        except json.JSONDecodeError as err:
            raise RuntimeError(body) from err


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--token", default="", help="Token from @BotFather")
    args = parser.parse_args()

    env = load_env()
    env.setdefault("TELEGRAM_NOTIFY_USERNAME", "")
    env.setdefault("HOST", "127.0.0.1")
    env.setdefault("PORT", "8765")
    # Reset chat until rebound to the new bot
    env["TELEGRAM_CHAT_ID"] = ""

    token = (args.token or "").strip()
    if not token:
        print("=" * 56, flush=True)
        print("Создайте НОВОГО бота:", flush=True)
        print("  1. Откройте https://t.me/BotFather", flush=True)
        print("  2. Отправьте /newbot", flush=True)
        print(f"  3. Имя: {SUGGESTED_NAME}", flush=True)
        print(f"  4. Username: {SUGGESTED_USERNAME}", flush=True)
        print("     (если занят — любой свободный, оканчивается на bot)", flush=True)
        print("  5. Скопируйте token и вставьте ниже", flush=True)
        print("=" * 56, flush=True)
        try:
            webbrowser.open("https://t.me/BotFather")
        except Exception:
            pass
        token = input("\nВставьте TELEGRAM BOT TOKEN и Enter:\n> ").strip()

    if not token or ":" not in token:
        raise SystemExit("Нужен валидный token вида 123456:AA...")

    me = tg(token, "getMe")
    if not me.get("ok"):
        raise SystemExit(f"Токен не принят Telegram: {me}")

    bot_username = me["result"]["username"]
    env["TELEGRAM_BOT_TOKEN"] = token
    env["TELEGRAM_BOT_USERNAME"] = bot_username
    save_env(env)

    print(f"Новый бот: @{bot_username}", flush=True)
    print("Жду /start в личку боту (до 5 минут)", flush=True)
    print(f"Откройте: https://t.me/{bot_username}", flush=True)
    try:
        webbrowser.open(f"https://t.me/{bot_username}")
    except Exception:
        pass

    tg(token, "deleteWebhook", drop_pending_updates=True)

    deadline = time.time() + 300
    offset = None
    found = None
    found_user = None

    while time.time() < deadline:
        params: dict = {"timeout": 25, "limit": 50}
        if offset is not None:
            params["offset"] = offset
        try:
            upd = tg(token, "getUpdates", **params)
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
            msg = item.get("message") or item.get("edited_message") or {}
            chat = msg.get("chat") or {}
            from_user = msg.get("from") or {}
            uname = (chat.get("username") or from_user.get("username") or "").lower()
            text = (msg.get("text") or "").strip()
            print(f"  update @{uname or '?'} id={chat.get('id')} {text!r}", flush=True)
            if chat.get("type") != "private":
                continue
            if text.startswith("/start"):
                found = chat.get("id")
                found_user = uname or str(found)
                break
        if found:
            break

    if not found:
        raise SystemExit(
            f"Не дождался /start. Откройте https://t.me/{bot_username} "
            f"и нажмите Start, затем снова: python setup_telegram.py --token \"...\""
        )

    env["TELEGRAM_CHAT_ID"] = str(found)
    save_env(env)

    result = tg(
        token,
        "sendMessage",
        chat_id=str(found),
        text=(
            f"✅ Бот @{bot_username} привязан к лендингу SYS-822GS.\n"
            f"Заявки с формы будут приходить сюда (@{found_user})."
        ),
    )
    if not result.get("ok"):
        raise SystemExit(result)

    print(f"Готово. chat_id={found} user=@{found_user}", flush=True)
    print("Дальше: python server.py", flush=True)
    print(f"Лендинг: http://127.0.0.1:{env.get('PORT', '8765')}/", flush=True)


if __name__ == "__main__":
    main()
