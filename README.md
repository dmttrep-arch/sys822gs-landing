# Deploy production (Cloudflare Pages)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy.ps1
```

Syncs `index.html`, `hero.png`, `favicon.svg` → `hosting/public`, deploys Functions + static.

Live (canonical): **https://sys822.ru/** (after DNS in `marketing/DNS_FIX.md`)  
Mirror: **https://sys822gs-landing.pages.dev/**

Smoke test after deploy:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke.ps1
```
