# DNS: привязка sys822.ru → Cloudflare Pages

Домен добавлен в Pages, но **верификация pending**: `CNAME record not set`.

Зона `sys822.ru` **не в этом Cloudflare-аккаунте** (API zones = 0). DNS правится у регистратора.

## Что поставить в DNS

| Тип | Имя | Значение | Proxy |
|-----|-----|----------|-------|
| **CNAME** | `@` (или `sys822.ru`) | `sys822gs-landing.pages.dev` | если у CF — Proxied; иначе as-is |
| **CNAME** | `www` | `sys822gs-landing.pages.dev` | то же |

Если регистратор **не даёт CNAME на apex** — используйте ANAME/ALIAS на `sys822gs-landing.pages.dev` или перенесите NS на Cloudflare в аккаунт `dmttrep@gmail.com`.

Сейчас у домена виден **A 162.159.143.30** (чужой/старый CF) — его нужно заменить на CNAME выше.

## После смены DNS (5–30 мин)

Проверка:
```
https://sys822.ru/          → SEO (canonical, UTM)
https://sys822.ru/sitemap.xml
https://sys822.ru/robots.txt
```

Пока домен не привязан — для кампаний можно временно:
`https://sys822gs-landing.pages.dev/` (уже с SEO+UTM).
