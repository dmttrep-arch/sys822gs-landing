# Аналитика

## Уже на сайте

- UTM сохраняются в `sessionStorage` и уходят в Telegram в блоке **«Атрибуция»** с заявкой.

## Рекомендуется (бесплатно / OSS)

1. **Cloudflare Web Analytics** (домен на CF): Dashboard → Analytics → Web Analytics → beacon на сайт.
2. **Umami** ([umami-software/umami](https://github.com/umami-software/umami)) — self-host, события `cta_click`, `form_submit`.
3. **Google Search Console** + **Яндекс.Вебмастер** — только SEO, не лиды.

## События (если подключите Umami/Plausible)

- `view_landing`
- `click_cta_quote`
- `form_submit_success`
