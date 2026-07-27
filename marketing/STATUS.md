# Статус продукта sys822.ru

Обновлено: 2026-07-27

## Продакшен (эталон)

| Проверка | URL | Статус |
|----------|-----|--------|
| Лендинг + SEO + UTM | https://sys822gs-landing.pages.dev/ | ✅ smoke OK |
| Форма → Telegram + атрибуция | `/api/lead` | ✅ |
| Деплой | `scripts/deploy.ps1` | ✅ |

## Домен sys822.ru

| Проверка | Статус |
|----------|--------|
| Открывается | ✅ 200 |
| SEO / robots / hero | ❌ старая версия (HTML на всех путях) |
| Pages custom domain | ⏳ pending — нужен CNAME |

**Действие:** `marketing/DNS_FIX.md` → после DNS: `scripts/smoke.ps1 -BaseUrl https://sys822.ru`

## Маркетинг

| Блок | Статус |
|------|--------|
| Контент TG / LinkedIn / VC | ✅ `marketing/content/` |
| ICP 53 + outreach script | ✅ |
| LAUNCH_DAY 48h | ✅ |

## Команда

См. `marketing/AGENTS.md`, промпт: `marketing/AGENT_PROMPT.md`
