# Продвижение sys822.ru — команда агентов

Сайт: **https://sys822.ru/** · SKU: **SYS-822GS-NB3RT-01-G2** · цена в коммуникации: **от $1M, условия по запросу**.

## Роли (Cursor Task / ручное исполнение)

| Агент | Фокус | Модель / угол | Deliverables |
|-------|--------|---------------|--------------|
| **MKT-SEO** | SEO, schema, индексация | тех + RU/EN keywords | meta, sitemap, Search Console |
| **MKT-CONTENT** | Habr, VC, Telegram, LinkedIn | контент-стратег | календарь, черновики постов |
| **MKT-OUTREACH** | B2B интеграторы, CTO AI | холодный/warm outreach | 50 ICP, 2 шаблона писем |
| **MKT-CHANNELS** | Telegram Ads, посевы, партнёры | медиа + бюджет | тест $100–300, UTM-ссылки |
| **MKT-ANALYTICS** | UTM, лиды, SQL | метрики | отчёт weekly, воронка |
| **MKT-LEGAL** | формулировки РФ | право/комплаенс | проверка «без гарантий/дилерства» |

## Что берём сейчас (выбрано)

| Слой | Решение | Почему |
|------|---------|--------|
| Хостинг | Cloudflare Pages + `sys822.ru` | уже задеплоено |
| Атрибуция | UTM → Telegram | без self-host |
| Контент | TG / LinkedIn / VC / Habr | органика РФ |
| Outreach | CSV ICP + шаблоны A/B | SQL, не спам |
| Аналитика | Cloudflare Web Analytics | 1 клик, без Umami пока |

**Отложено:** Umami, Dub, n8n, Twenty, Listmonk, Postiz — после 5+ SQL.

Промпт агента: **`AGENT_PROMPT.md`**. Запуск дня: **`LAUNCH_DAY.md`**. DNS: **`DNS_FIX.md`**.

## KPI 30 дней

- **5–15 SQL** (роль + срок + бюджетный коридор)
- **300–800** уникальных визитов (органика + контент)
- **15–40** заявок формы (часть отфильтровать)

## Старт недели 1

См. `WEEK1_CHECKLIST.md`, UTM — `utm_links.md`, генератор — `scripts/generate_utm.ps1`.
