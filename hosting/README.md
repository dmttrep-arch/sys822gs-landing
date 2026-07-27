# SYS-822GS landing — public deploy

Static + Telegram form API (`POST /api/lead`).

## Option A — Render (recommended, free web)

1. Open: https://render.com/deploy?repo=https://github.com/dmttrep-arch/sys822gs-landing
2. Set env:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
3. Deploy → get `https://sys822gs-landing.onrender.com`

## Option B — Cloudflare Pages

```bat
cd hosting
npm install
npx wrangler login
npm run deploy
npx wrangler pages secret put TELEGRAM_BOT_TOKEN --project-name=sys822gs-landing
npx wrangler pages secret put TELEGRAM_CHAT_ID --project-name=sys822gs-landing
```

## Local / tunnel

`start.bat` then `start_public.bat`
