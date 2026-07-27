# Habr — черновик структуры (техстатья)

**Заголовок:** Supermicro SYS-822GS + HGX B300: что проверить до заказа on-prem AI-узла

## Введение (без sales)
- Класс задач: training / heavy inference, private AI
- Почему «одно шасси 8U» vs сборка из 2U

## Платформа
- SKU SYS-822GS-NB3RT-01-G2, Gold Series Ready to Ship
- Dual Xeon 6768P — роль CPU в data pipeline
- HGX B300 NVL8 — память HBM3e (~2.3 TB на систему, по публичным материалам)
- ConnectX-8 800GbE — fabric

## Инфраструктура (чеклист)
1. kW на стойку / colo
2. Охлаждение 8U
3. ToR под 800G
4. ПО и поддержка — что уточнять в КП

## Экономика (осторожно)
- CAPEX vs cloud — модель, не обещания ROI
- «От $1M» — ориентир, не оферта

## CTA
Спеки и запрос КП: https://sys822.ru/?utm_source=habr&utm_medium=article&utm_campaign=b300_deepdive

**Теги:** #hardware #ml #gpu #datacenter
