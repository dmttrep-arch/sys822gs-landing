"""Local landing server: static files + Telegram lead delivery."""

from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_env(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    if not path.exists():
        return env
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


ENV = load_env(ROOT / ".env")
# Process env overrides file (needed for Docker/Render/Cloud)
for key in (
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHAT_ID",
    "TELEGRAM_BOT_USERNAME",
    "TELEGRAM_NOTIFY_USERNAME",
    "HOST",
    "PORT",
):
    if os.environ.get(key):
        ENV[key] = os.environ[key]

TOKEN = ENV.get("TELEGRAM_BOT_TOKEN", "").strip()
CHAT_ID = ENV.get("TELEGRAM_CHAT_ID", "").strip()
NOTIFY_USER = ENV.get("TELEGRAM_BOT_USERNAME") or ENV.get("TELEGRAM_NOTIFY_USERNAME", "innvaAI_bot")
NOTIFY_USER = NOTIFY_USER.lstrip("@")
HOST = ENV.get("HOST", "0.0.0.0")
PORT = int(ENV.get("PORT", "8765"))


def tg_api(method: str, payload: dict) -> dict:
    if not TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is empty. Run setup_telegram.py")
    data = urllib.parse.urlencode(payload).encode("utf-8")
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{TOKEN}/{method}",
        data=data,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            raise RuntimeError(body) from exc


def send_telegram(text: str) -> dict:
    chat_id = CHAT_ID
    if not chat_id:
        raise RuntimeError(
            f"TELEGRAM_CHAT_ID пуст. Запустите setup_telegram.py и нажмите Start у бота из @{NOTIFY_USER}."
        )
    return tg_api(
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": text,
            "disable_web_page_preview": "true",
        },
    )


def format_attribution(data: dict) -> list[str]:
    attr = data.get("attribution")
    if not isinstance(attr, dict):
        return []
    lines: list[str] = []
    for key in ("utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"):
        val = str(attr.get(key) or "").strip()
        if val:
            lines.append(f"{key}: {val}")
    ref = str(attr.get("referrer") or "").strip()
    if ref:
        lines.append(f"referrer: {ref[:400]}")
    page = str(attr.get("page_url") or "").strip()
    if page:
        lines.append(f"page: {page[:400]}")
    if not lines:
        return []
    return ["", "Атрибуция:"] + lines


    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json(self, code: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._cors()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self) -> None:  # noqa: N802
        if self.path.rstrip("/") != "/api/lead":
            self._json(404, {"ok": False, "error": "not_found"})
            return

        length = int(self.headers.get("Content-Length", "0") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            data = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            self._json(400, {"ok": False, "error": "invalid_json"})
            return

        name = str(data.get("name") or "").strip()
        company = str(data.get("company") or "").strip()
        contact = str(data.get("contact") or "").strip()
        message = str(data.get("message") or "").strip() or "—"

        if not name or not company or not contact:
            self._json(400, {"ok": False, "error": "required_fields"})
            return

        if len(name) > 120 or len(company) > 160 or len(contact) > 160 or len(message) > 2000:
            self._json(400, {"ok": False, "error": "too_long"})
            return

        text = "\n".join(
            [
                "Новая заявка · SYS-822GS-NB3RT-01-G2",
                "",
                f"Имя: {name}",
                f"Компания: {company}",
                f"Контакт: {contact}",
                f"Комментарий: {message}",
                "",
                "Цена: от $1 000 000 · условия уточняйте",
                *format_attribution(data),
            ]
        )

        try:
            result = send_telegram(text)
        except Exception as exc:  # noqa: BLE001
            self._json(500, {"ok": False, "error": str(exc)})
            return

        if not result.get("ok"):
            self._json(
                502,
                {
                    "ok": False,
                    "error": result.get("description") or "telegram_error",
                    "telegram": result,
                },
            )
            return

        self._json(200, {"ok": True})

    def log_message(self, fmt: str, *args) -> None:
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))


def main() -> None:
    if not TOKEN:
        raise SystemExit("Нет TELEGRAM_BOT_TOKEN в .env — сначала setup_telegram.py")
    if not CHAT_ID:
        print(
            f"⚠ TELEGRAM_CHAT_ID пуст. Запустите setup_telegram.py и /start у бота из @{NOTIFY_USER}."
        )
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Landing: http://{HOST}:{PORT}/")
    print(f"Leads -> @{NOTIFY_USER} (chat_id={CHAT_ID or 'NOT SET'})")
    server.serve_forever()


if __name__ == "__main__":
    main()
