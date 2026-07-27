"""Product knowledge for SYS-822GS-NB3RT-01-G2 sales agent."""

PRODUCT = {
    "sku": "SYS-822GS-NB3RT-01-G2",
    "brand": "Supermicro Gold Series",
    "name": "8U GPU SuperServer NVIDIA HGX B300",
    "price_public": "от $1 000 000 USD",
    "price_note": "условия поставки в Россию, логистика и сервис уточняются в КП",
    "form_factor": "8U Rackmount",
    "ready": "Ready to Ship / Gold Series — заводская сборка и тест",
    "delivery": "Поставка на территорию России (логистика и сроки — в КП)",
    "cpu": "2× Intel Xeon 6768P, 64 ядра каждый (128 всего), 2.4 ГГц, 330 Вт",
    "gpu": "NVIDIA HGX B300 8-GPU (Blackwell), NVLink 5-го поколения 1.8 ТБ/с",
    "hbm": "~2.3 ТБ HBM3e на систему",
    "ram": "2 ТБ DDR5-6400 (16×128 ГБ RDIMM)",
    "boot": "1×960 ГБ M.2 NVMe",
    "storage_expand": "8× hot-swap E1.S NVMe",
    "net": "8× 800GbE/XDR800 (NVIDIA ConnectX-8) + 2×10GbE",
    "psu": "6×6600 Вт Titanium, резерв 3+3",
    "weight": "~119 кг net",
    "use_cases": [
        "обучение LLM",
        "генеративный AI",
        "масштабный инференс",
        "HPC / научные расчёты",
    ],
}

OBJECTIONS = {
    "дорого": (
        "Цена отражает 8× B300 + Ready-to-Ship. Считаем TCO vs облачная аренда "
        "эквивалента и срок окупаемости в КП. Можем обсудить лизинг / этапы оплаты."
    ),
    "долго": (
        "Конфигурация Gold Series — без полного заводского цикла под заказ. "
        "Срок отгрузки уточним после подтверждения слота и логистики."
    ),
    "не_потянем_инфраструктуру": (
        "Узел 8U и до 6.6 кВт на блок — нужен аудит стойки: питание, охлаждение, 800GbE. "
        "Можем включить аудит ЦОДа и пусконаладку в поставку."
    ),
    "нужно_сравнить": (
        "Сравним с H100/H200-кластерами и облаком по $/токен и time-to-train. "
        "Пришлите целевую модель и датасет — дадим рамку."
    ),
    "подумаем": (
        "Ок. Зафиксирую требования и пришлю краткое КП-саммари. "
        "Когда удобно вернуться — на этой неделе или в начале следующей?"
    ),
}

KB_TEXT = f"""
SKU: {PRODUCT['sku']}
Серия: {PRODUCT['brand']} · {PRODUCT['name']}
Цена (публично): {PRODUCT['price_public']} ({PRODUCT['price_note']})
Форм-фактор: {PRODUCT['form_factor']}
Готовность: {PRODUCT['ready']}
Доставка: {PRODUCT['delivery']}
CPU: {PRODUCT['cpu']}
GPU: {PRODUCT['gpu']}
HBM: {PRODUCT['hbm']}
RAM: {PRODUCT['ram']}
Boot: {PRODUCT['boot']}
Storage expand: {PRODUCT['storage_expand']}
Сеть: {PRODUCT['net']}
PSU: {PRODUCT['psu']}
Масса: {PRODUCT['weight']}
Задачи: {', '.join(PRODUCT['use_cases'])}
""".strip()
