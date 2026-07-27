# DNS: sys822.ru → Cloudflare Pages (обязательно для «безупречного» сайта)

**Симптом сейчас:** `sys822.ru/robots.txt` и `/hero.png` отдают HTML (старая версия).  
**Эталон:** https://sys822gs-landing.pages.dev/ (SEO + UTM + статика).

Домен в Pages: `status=pending`, ошибка: **CNAME record not set**.  
Зона `sys822.ru` **не** в аккаунте `dmttrep@gmail.com` — DNS меняется там, где куплен домен / где сейчас Cloudflare DNS.

## Шаги (5–15 мин)

1. Войти в панель DNS домена `sys822.ru` (регистратор или Cloudflare-аккаунт владельца зоны).
2. **Удалить** A/AAAA на `sys822.ru`, если они ведут на старый хост (сейчас часто `162.159.143.30`).
3. **Создать** записи:

| Тип | Имя | Значение | TTL |
|-----|-----|----------|-----|
| CNAME | `@` или `sys822.ru` | `sys822gs-landing.pages.dev` | Auto |
| CNAME | `www` | `sys822gs-landing.pages.dev` | Auto |

4. Если apex CNAME запрещён — **перенести NS** на Cloudflare (аккаунт `dmttrep@gmail.com`) и включить CNAME flattening, либо ALIAS/ANAME у регистратора.
5. Cloudflare Dashboard → Pages → **sys822gs-landing** → Custom domains → дождаться **Active** для `sys822.ru` и `www.sys822.ru`.

## Проверка после DNS

```powershell
powershell -ExecutionPolicy Bypass -File C:\sys822gs-landing\scripts\smoke.ps1 -BaseUrl https://sys822.ru
```

Ожидается: canonical, UTM, `robots.txt` как text/plain, `hero.png` ~2.6 MB.

## Пока DNS не готов

В рекламе и постах временно можно давать mirror с полным функционалом:

`https://sys822gs-landing.pages.dev/?utm_source=...`

После активации домена — только **https://sys822.ru/** (canonical уже в HTML).
