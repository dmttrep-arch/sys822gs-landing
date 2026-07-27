"""Detailed multi-turn sales dialogue test."""

from __future__ import annotations

import json
import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
os.chdir(ROOT)

# load .env
for line in (ROOT / ".env").read_text(encoding="utf-8").splitlines():
    if not line.strip() or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    os.environ.setdefault(k.strip(), v.strip().strip('"'))

os.environ["LLM_PROVIDER"] = "ollama"
os.environ["OLLAMA_MODEL"] = os.environ.get("OLLAMA_MODEL", "hermes3-agent:latest")

from sales import memory
from sales.agent import reply

CHAT = 88001234
# fresh session
p = memory._path(CHAT)
if p.exists():
    p.unlink()

turns = [
    "Здравствуйте. Смотрим GPU-сервер под обучение LLM on-prem.",
    "Нужно дообучать модели ~70B, сейчас сидим на облаке и дорого выходит.",
    "Я CTO, решение по закупке согласую с CEO. Бюджет ориентир около миллиона долларов.",
    "Срок — хотим ввести в стойку в течение 6–8 недель. Сколько стоит SYS-822GS на 8x B300?",
    "Дорого кажется. Есть ли смысл против аренды в облаке? И потянет ли наше питание 6 кВт?",
    "Ок, давайте коммерческое предложение. Компания Иннова AI, контакт Ivanov@innova.ai",
]

print("=" * 64)
print("DIALOGUE TEST · sales agent")
print("=" * 64)

report = []
t0 = time.time()
for i, user in enumerate(turns, 1):
    print(f"\n--- TURN {i} ---")
    print(f"USER: {user}")
    started = time.time()
    try:
        r = reply(
            CHAT,
            user,
            user_meta={"name": "Ivan Ivanov", "company": "Иннова AI", "contact": "Ivanov@innova.ai"},
        )
        dt = time.time() - started
        print(f"STAGE: {r['stage']} | HOT: {r['hot']} | notify: {r.get('notify_owner')} | {dt:.1f}s")
        print(f"BANT: {json.dumps(r['bant'], ensure_ascii=False)}")
        if r.get("owner_note"):
            print(f"OWNER_NOTE: {r['owner_note']}")
        print(f"BOT: {r['reply']}")
        report.append(
            {
                "turn": i,
                "user": user,
                "stage": r["stage"],
                "hot": r["hot"],
                "notify_owner": r.get("notify_owner"),
                "bant": r["bant"],
                "reply": r["reply"],
                "seconds": round(dt, 1),
            }
        )
    except Exception as exc:
        print(f"ERROR: {exc}")
        report.append({"turn": i, "error": str(exc)})
        break

print("\n" + "=" * 64)
print(f"DONE in {time.time()-t0:.1f}s · turns={len(report)}")
out = ROOT / "sales" / "sessions" / f"dialogue_test_{CHAT}.json"
out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Saved: {out}")

# Quick checks
final = report[-1] if report else {}
ok_price = any("1 000 000" in (x.get("reply") or "") or "1000000" in (x.get("reply") or "").replace(" ", "") for x in report)
ok_hot = any(x.get("hot") for x in report)
ok_stages = len({x.get("stage") for x in report if "stage" in x}) >= 2
print("CHECK price_mentioned:", ok_price)
print("CHECK hot_lead:", ok_hot)
print("CHECK stage_progress:", ok_stages)
print("CHECK final_stage:", final.get("stage"))
