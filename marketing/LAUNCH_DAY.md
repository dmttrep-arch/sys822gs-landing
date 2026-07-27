# Launch Day — чеклист 48 часов (sys822.ru)

> **Блокер:** пока DNS не настроен (`marketing/DNS_FIX.md`), в постах можно давать mirror:  
> `https://sys822gs-landing.pages.dev/` + те же UTM. После DNS — только `https://sys822.ru/`.

SKU: **SYS-822GS-NB3RT-01-G2** · цена в текстах: **от $1 000 000 USD · условия по запросу · поставка в РФ**  
Запрещено в публикациях: гарантия поставки, статус официального дилера NVIDIA/Supermicro без документов.

Готовые тексты: `marketing/content/`  
UTM-справка: `marketing/utm_links.md`

---

## День 0 (сегодня) — ~90 минут

### 1. Перед любой публикацией
- [ ] Открыть https://sys822.ru/ — форма заявки отвечает, Telegram-уведомление о лиде приходит
- [ ] Тест атрибуции:  
  `https://sys822.ru/?utm_source=test&utm_medium=check&utm_campaign=launch_day` → отправить заявку → в уведомлении видны UTM
- [ ] Пройтись по текстам дня: нет слов «гарантируем поставку», «официальный дилер»

### 2. Telegram (органический канал / чат ICP)
| Порядок | Файл | CTA |
|---------|------|-----|
| 1-й пост | `content/telegram_post01.md` | https://sys822.ru/?utm_source=telegram&utm_medium=organic&utm_campaign=sys822_launch&utm_content=post01 |
| 2-й пост (через 4–8 ч или утром Дня 1) | `content/telegram_post02.md` | https://sys822.ru/?utm_source=telegram&utm_medium=organic&utm_campaign=sys822_launch&utm_content=post02 |

- [ ] Опубликовать **post01** (анонс SKU)
- [ ] Запланировать / опубликовать **post02** («7 вопросов к поставщику HGX»)
- [ ] Закрепить post01 или ссылку на лендинг в описании канала (по желанию)

### 3. LinkedIn
| Язык | Файл | CTA |
|------|------|-----|
| RU | `content/linkedin_ru01.md` | https://sys822.ru/?utm_source=linkedin&utm_medium=post&utm_campaign=private_ai&utm_content=ru01 |
| EN | `content/linkedin_en01.md` | https://sys822.ru/?utm_source=linkedin&utm_medium=post&utm_campaign=hgx_b300&utm_content=en01 |

- [ ] Опубликовать RU-пост (личный профиль или company page)
- [ ] Опубликовать EN-пост (тот же день или утро Дня 1)
- [ ] Не дублировать один текст в 10 группах подряд — 2–3 релевантных комментария максимум

### 4. VC.ru — черновик
- [ ] Создать черновик на VC.ru из `content/vc_article01_full.md`
- [ ] Проверить, что в тексте одна основная CTA:  
  https://sys822.ru/?utm_source=vc&utm_medium=post&utm_campaign=capex_ai&utm_content=article01
- [ ] **Не публиковать в День 0**, если нет финальной вычитки — вынести на День 1 утро

---

## День 1 (завтра) — ~60–90 минут

### 5. Дожать контент
- [ ] Если post02 не вышел в День 0 — опубликовать утром
- [ ] Опубликовать статью VC.ru (после правки заголовка/лида под стиль площадки)
- [ ] В bio / «о себе» автора VC (если есть) — короткая ссылка на sys822.ru **без** UTM или с `utm_content=bio` (по желанию)

### 6. Outreach (не спам)
- [ ] Открыть `icp_wave1.csv` (53 цели) и следовать `OUTREACH_WAVE1_SCRIPT.md` — **10 касаний/день**
- [ ] День 1 приоритет: **КРОК, Softline, Cloud.ru, Selectel, Сбер AI** (строки с `Wave1 priority`)
- [ ] Шаблон A/B: `OUTREACH.md` · UTM:  
  https://sys822.ru/?utm_source=email&utm_medium=outreach&utm_campaign=integrator_wave1
- [ ] После отправки: `status=sent` + дата в `notes` (см. скрипт)

### 7. Контроль через 24–48 ч
- [ ] Сколько визитов с UTM telegram / linkedin / vc (Cloudflare / лог заявок)
- [ ] Сколько заявок формы, сколько с заполненной атрибуцией
- [ ] Зафиксировать 1–2 правки формулировок, если лиды путают «наличие на складе» с «по запросу»

---

## Быстрый копипаст ссылок

```
TG post01:
https://sys822.ru/?utm_source=telegram&utm_medium=organic&utm_campaign=sys822_launch&utm_content=post01

TG post02:
https://sys822.ru/?utm_source=telegram&utm_medium=organic&utm_campaign=sys822_launch&utm_content=post02

LinkedIn RU:
https://sys822.ru/?utm_source=linkedin&utm_medium=post&utm_campaign=private_ai&utm_content=ru01

LinkedIn EN:
https://sys822.ru/?utm_source=linkedin&utm_medium=post&utm_campaign=hgx_b300&utm_content=en01

VC article:
https://sys822.ru/?utm_source=vc&utm_medium=post&utm_campaign=capex_ai&utm_content=article01

Email outreach:
https://sys822.ru/?utm_source=email&utm_medium=outreach&utm_campaign=integrator_wave1
```

---

## Definition of Done (48 ч)

- [ ] Telegram: 2 поста live
- [ ] LinkedIn: RU + EN live
- [ ] VC.ru: статья опубликована **или** черновик готов к publish в тот же день
- [ ] ≥1 тестовый лид с UTM проверен
- [ ] ≥10 outreach-касаний отправлено (если есть список ICP)

Дальше — по `WEEK1_CHECKLIST.md` и `PLAN_30D.md`.
