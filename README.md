# SYS-822GS Landing

## Deploy on Render (permanent hosting)

1. Open: https://render.com/deploy?repo=https://github.com/dmttrep-arch/sys822gs-landing
2. Create/login Render account (GitHub)
3. Set environment variables:
   - TELEGRAM_BOT_TOKEN = (token from BotFather)
   - TELEGRAM_CHAT_ID = 669802068
4. Deploy

Site URL example: `https://sys822gs-landing.onrender.com`

Form `POST /api/lead` sends leads to Telegram.

## Cloudflare Pages alternative

See `hosting/README.md`
