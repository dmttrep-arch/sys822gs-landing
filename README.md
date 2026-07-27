# Запуск SYS-822GS

## Публичный доступ (интернет)

1. Сначала `start.bat` (лендинг + бот)
2. Затем `start_public.bat` — Cloudflare Tunnel
3. Ссылка сохранится в `PUBLIC_URL.txt`

Текущий URL (меняется при каждом новом quick tunnel):
см. `PUBLIC_URL.txt`

Форма и API работают через тот же URL.

## Локально

| | |
|---|---|
| ПК | http://127.0.0.1:8765/ |
| Телефон Wi‑Fi | http://192.168.68.117:8765/ |
| Sales-бот | https://t.me/innvaAI_bot |

Остановка локальных сервисов: `stop.bat`  
Остановка туннеля: закрыть процесс `cloudflared` или `Stop-Process -Name cloudflared`

## Нужно

1. Python в PATH  
2. Ollama (для менеджера в боте)  
3. cloudflared (уже установлен)  
4. `.env` с токеном бота
