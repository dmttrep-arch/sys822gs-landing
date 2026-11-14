(() => {
  const supported = ['ru', 'en', 'zh'];
  const params = new URLSearchParams(location.search);
  let lang = params.get('lang') || localStorage.getItem('milonchka-lang') || 'ru';
  if (!supported.includes(lang)) lang = 'ru';
  localStorage.setItem('milonchka-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

  const en = {
    'Каталог':'Catalog','О компании':'Company','Условия поставки':'Supply terms','Контакты':'Contacts','Запрос КП':'Request quote','Запросить коммерческое предложение':'Request a quotation','Перейти в каталог':'View catalog','Весь каталог':'Full catalog',
    'МЕЖДУНАРОДНЫЕ КОРПОРАТИВНЫЕ ПОСТАВКИ':'INTERNATIONAL B2B SUPPLY','Серверное оборудование для AI и центров обработки данных':'Server hardware for AI and data centers','AI-серверы, серверная память, накопители и сетевые компоненты для корпоративных заказчиков, системных интеграторов и вычислительных инфраструктур.':'AI servers, server memory, storage and network components for enterprises, system integrators and compute infrastructure.',
    'товарных позиций':'catalog items','категорий':'categories','цены в долларах США':'prices in US dollars','индивидуальные условия':'individual terms','КАТЕГОРИИ':'CATEGORIES','Оборудование для профессиональной инфраструктуры':'Hardware for professional infrastructure','От высокоплотных GPU-систем до компонентов для модернизации действующих серверных платформ.':'From high-density GPU systems to components for upgrading existing server platforms.',
    'Серверное оборудование':'Server systems','Серверная оперативная память':'Server memory','Жёсткие диски':'Hard drives','Твердотельные накопители':'Solid-state drives','Сетевое оборудование':'Networking','КАТАЛОГ':'CATALOG','Подберите конфигурацию':'Choose a configuration','Поиск работает по производителю, модели, артикулу и характеристикам. Добавьте несколько позиций и укажите количество.':'Search by manufacturer, model, part number or specification. Add the required items and quantities.',
    'Все категории':'All categories','Все производители':'All manufacturers','Любой объём':'Any capacity','Любая скорость':'Any speed','Все':'All','ОТДЕЛЬНЫЙ КОНФИГУРАТОР':'DEDICATED CONFIGURATOR','Серверная память DDR5 RDIMM':'DDR5 RDIMM server memory','Выберите производителя, объём и скорость на отдельной странице. Все 26 вариантов собраны в компактную таблицу без повторяющихся фотографий.':'Choose manufacturer, capacity and speed on a dedicated page. All 26 options are organized in a compact list without repeated photos.','Подобрать память':'Configure memory',
    'Выбор для проекта':'Project choice','Специальное предложение':'Special offer','Добавить в запрос':'Add to quote','По запросу':'On request','Заводской артикул: уточняется':'Manufacturer PN: to be confirmed','Тип: DDR5 ECC RDIMM':'Type: DDR5 ECC RDIMM','Объём':'Capacity','Скорость':'Speed','Тип':'Type','Количество':'Quantity','Цена':'Price',
    'УСЛОВИЯ ПОСТАВКИ':'SUPPLY TERMS','Комплектация':'Configuration','Спецификация проверяется и фиксируется в коммерческом предложении.':'The specification is verified and recorded in the commercial quotation.','Поставка':'Delivery','Разовые, регулярные и поэтапные отгрузки.':'One-time, recurring and phased shipments.','Коммерческие условия':'Commercial terms','Оплата, гарантия, логистика и экспортный контроль согласовываются для конкретной поставки.':'Payment, warranty, logistics and export-control terms are agreed for each shipment.',
    'О КОМПАНИИ':'COMPANY','Международная торговая компания, специализирующаяся на профессиональном серверном оборудовании и компонентах для вычислительных систем.':'An international trading company specializing in professional server hardware and compute-system components.','Мы формируем предложение под техническое задание заказчика без заявлений о неподтверждённых остатках и сроках.':'We prepare quotations against the customer specification without claiming unconfirmed stock or lead times.','Серверное оборудование и компоненты':'Server hardware and components','Управление прайс-листом':'Price-list management',
    'Выбранное оборудование':'Selected equipment','Добавьте товары из каталога.':'Add products from the catalog.','Согласен на обработку данных для подготовки КП.':'I consent to data processing for quotation preparation.','Отправить запрос менеджеру':'Send request','Имя *':'Name *','Компания *':'Company *','Телефон / Telegram *':'Phone / Telegram *','Комментарий':'Comment',
    'КОНФИГУРАТОР ПАМЯТИ':'MEMORY CONFIGURATOR','Подберите серверную память по производителю, объёму и скорости. В карточках нет повторяющихся фотографий: точная маркировка и заводской артикул подтверждаются перед заказом.':'Select server memory by manufacturer, capacity and speed. Repeated product photos are removed; exact labeling and manufacturer part number are confirmed before ordering.','26 ВАРИАНТОВ':'26 OPTIONS','Выберите конфигурацию':'Choose a configuration','Совместимость зависит от процессора, системной платы, BIOS и правил заполнения каналов памяти конкретного сервера.':'Compatibility depends on the processor, motherboard, BIOS and memory-channel population rules of the server.','Производитель, модель или артикул':'Manufacturer, model or part number','Сбросить фильтры':'Reset filters','В запрос':'Add','Оригинальный модуль':'Original module','Контрактная позиция':'Contract item','Заводской PN уточняется':'Manufacturer PN to be confirmed','Добавлено в запрос':'Added to quote',
    'Изображение наверху страницы является нейтральной иллюстрацией категории. Для модулей без указанного PN фотография этикетки, ревизия и страна производства подтверждаются в коммерческом предложении.':'The image at the top is a neutral category illustration. For modules without a stated PN, label photo, revision and country of manufacture are confirmed in the commercial quotation.',
    'Нейтральное изображение категории · точный корпус подтверждается':'Neutral category image · exact chassis to be confirmed','Нейтральное изображение категории · точная система подтверждается':'Neutral category image · exact system to be confirmed','Фото семейства · комплектация подтверждается':'Product-family image · configuration to be confirmed','Нейтральное изображение категории · не фото конкретной сборки':'Neutral category image · not the exact build','Нейтральное изображение RDIMM · не фото конкретного артикула':'Neutral RDIMM image · not the exact part number','Нейтральное изображение категории · модель уточняется':'Neutral category image · model to be confirmed'
  };
  const zh = {
    'Каталог':'产品目录','О компании':'关于公司','Условия поставки':'供货条款','Контакты':'联系方式','Запрос КП':'询价单','Запросить коммерческое предложение':'申请报价','Перейти в каталог':'查看目录','Весь каталог':'全部产品',
    'МЕЖДУНАРОДНЫЕ КОРПОРАТИВНЫЕ ПОСТАВКИ':'国际企业级供应','Серверное оборудование для AI и центров обработки данных':'面向 AI 与数据中心的服务器设备','AI-серверы, серверная память, накопители и сетевые компоненты для корпоративных заказчиков, системных интеграторов и вычислительных инфраструктур.':'为企业客户、系统集成商和计算基础设施提供 AI 服务器、服务器内存、存储及网络组件。',
    'товарных позиций':'个产品','категорий':'个类别','цены в долларах США':'美元报价','индивидуальные условия':'定制条款','КАТЕГОРИИ':'产品类别','Оборудование для профессиональной инфраструктуры':'专业基础设施设备','От высокоплотных GPU-систем до компонентов для модернизации действующих серверных платформ.':'从高密度 GPU 系统到现有服务器平台升级组件。',
    'Серверное оборудование':'服务器设备','Серверная оперативная память':'服务器内存','Жёсткие диски':'机械硬盘','Твердотельные накопители':'固态硬盘','Сетевое оборудование':'网络设备','КАТАЛОГ':'产品目录','Подберите конфигурацию':'选择配置','Поиск работает по производителю, модели, артикулу и характеристикам. Добавьте несколько позиций и укажите количество.':'可按制造商、型号、料号和规格搜索。选择产品并填写数量。',
    'Все категории':'全部类别','Все производители':'全部制造商','Любой объём':'任意容量','Любая скорость':'任意速率','Все':'全部','ОТДЕЛЬНЫЙ КОНФИГУРАТОР':'独立配置器','Серверная память DDR5 RDIMM':'DDR5 RDIMM 服务器内存','Выберите производителя, объём и скорость на отдельной странице. Все 26 вариантов собраны в компактную таблицу без повторяющихся фотографий.':'在独立页面选择制造商、容量和速率。26 个选项以紧凑列表呈现，不重复显示图片。','Подобрать память':'配置内存',
    'Выбор для проекта':'项目推荐','Специальное предложение':'特别报价','Добавить в запрос':'加入询价','По запросу':'询价','Заводской артикул: уточняется':'制造商料号：待确认','Тип: DDR5 ECC RDIMM':'类型：DDR5 ECC RDIMM','Объём':'容量','Скорость':'速率','Тип':'类型','Количество':'数量','Цена':'价格',
    'УСЛОВИЯ ПОСТАВКИ':'供货条款','Комплектация':'配置','Спецификация проверяется и фиксируется в коммерческом предложении.':'规格将在正式报价中核实并确认。','Поставка':'交付','Разовые, регулярные и поэтапные отгрузки.':'支持一次性、定期及分批交付。','Коммерческие условия':'商务条款','Оплата, гарантия, логистика и экспортный контроль согласовываются для конкретной поставки.':'付款、质保、物流及出口管制条款按具体订单确认。',
    'О КОМПАНИИ':'关于公司','Международная торговая компания, специализирующаяся на профессиональном серверном оборудовании и компонентах для вычислительных систем.':'专注于专业服务器设备和计算系统组件的国际贸易公司。','Мы формируем предложение под техническое задание заказчика без заявлений о неподтверждённых остатках и сроках.':'我们依据客户技术需求制作报价，不承诺未经确认的库存和交期。','Серверное оборудование и компоненты':'服务器设备与组件','Управление прайс-листом':'价格表管理',
    'Выбранное оборудование':'已选设备','Добавьте товары из каталога.':'请从目录中添加产品。','Согласен на обработку данных для подготовки КП.':'我同意为制作报价处理所提交的信息。','Отправить запрос менеджеру':'发送询价','Имя *':'姓名 *','Компания *':'公司 *','Телефон / Telegram *':'电话 / Telegram *','Комментарий':'备注',
    'КОНФИГУРАТОР ПАМЯТИ':'内存配置器','Подберите серверную память по производителю, объёму и скорости. В карточках нет повторяющихся фотографий: точная маркировка и заводской артикул подтверждаются перед заказом.':'按制造商、容量和速率选择服务器内存。页面不重复展示产品图片；准确标签和制造商料号将在下单前确认。','26 ВАРИАНТОВ':'26 个选项','Выберите конфигурацию':'选择配置','Совместимость зависит от процессора, системной платы, BIOS и правил заполнения каналов памяти конкретного сервера.':'兼容性取决于处理器、主板、BIOS 以及服务器的内存通道安装规则。','Производитель, модель или артикул':'制造商、型号或料号','Сбросить фильтры':'重置筛选','В запрос':'加入询价','Оригинальный модуль':'原厂模块','Контрактная позиция':'合同供货产品','Заводской PN уточняется':'制造商料号待确认','Добавлено в запрос':'已加入询价',
    'Изображение наверху страницы является нейтральной иллюстрацией категории. Для модулей без указанного PN фотография этикетки, ревизия и страна производства подтверждаются в коммерческом предложении.':'页面顶部图片为中性类别示意图。对于未标明料号的模块，标签照片、版本和原产国将在正式报价中确认。',
    'Нейтральное изображение категории · точный корпус подтверждается':'中性类别图片 · 具体机箱待确认','Нейтральное изображение категории · точная система подтверждается':'中性类别图片 · 具体系统待确认','Фото семейства · комплектация подтверждается':'产品系列图片 · 配置待确认','Нейтральное изображение категории · не фото конкретной сборки':'中性类别图片 · 非具体装机照片','Нейтральное изображение RDIMM · не фото конкретного артикула':'中性 RDIMM 图片 · 非具体料号照片','Нейтральное изображение категории · модель уточняется':'中性类别图片 · 型号待确认'
  };
  Object.assign(en, {
    'LTGPU4212 / AS4212-A8V4 / NVIDIA RTX PRO 6000':'LTGPU4212 / AS4212-A8V4 / NVIDIA RTX PRO 6000','Двухпроцессорный сервер на базе AMD EPYC 9965 с ускорителем NVIDIA RTX PRO 6000, 128 ГБ DDR5 ECC и резервированным питанием.':'Dual-socket server based on AMD EPYC 9965 with an NVIDIA RTX PRO 6000 accelerator, 128 GB of DDR5 ECC memory and redundant power.','Серверная платформа: 1 × LTGPU4212 / AS4212-A8V4':'Server platform: 1 × LTGPU4212 / AS4212-A8V4','Процессоры: 2 × AMD EPYC 9965':'Processors: 2 × AMD EPYC 9965','Оперативная память: 2 × GEIL 64GB DDR5-5600 ECC RDIMM, всего 128 ГБ':'System memory: 2 × GEIL 64GB DDR5-5600 ECC RDIMM, 128 GB total','Накопители: 2 × Micron 960GB M.2 + 1 × Huawei 3.84TB SAS':'Storage: 2 × Micron 960GB M.2 + 1 × Huawei 3.84TB SAS','Графический ускоритель: 1 × NVIDIA RTX PRO 6000, PN 900-2G153-0000-000':'GPU accelerator: 1 × NVIDIA RTX PRO 6000, PN 900-2G153-0000-000','Блоки питания: 4 × 2700 Вт':'Power supplies: 4 × 2700 W','Конфигурация по спецификации поставщика. Заводские артикулы модулей памяти и накопителей подтверждаются в коммерческом предложении.':'Configuration according to the supplier specification. Manufacturer part numbers for the memory modules and storage devices are confirmed in the commercial quotation.',
    'AI-сервер для обучения моделей с восемью ускорителями P800-OAM и 768 ГБ суммарной памяти ускорителей.':'AI training server with eight P800-OAM accelerators and 768 GB of aggregate accelerator memory.','Ускорители: 8 × P800-OAM':'Accelerators: 8 × P800-OAM','Память ускорителей: 96 ГБ каждый, всего 768 ГБ':'Accelerator memory: 96 GB each, 768 GB total','Процессоры: 2 × Intel Xeon 8563C':'Processors: 2 × Intel Xeon 8563C','Оперативная память: DDR5-5600 RDIMM':'System memory: DDR5-5600 RDIMM','Модули памяти: 24 × 64 ГБ':'Memory modules: 24 × 64 GB','Общая оперативная память: 1536 ГБ':'Total system memory: 1536 GB','Точная комплектация поставки и заводской SKU фиксируются в коммерческом предложении.':'The exact supply configuration and manufacturer SKU are recorded in the commercial quotation.',
    'Прайс-лист':'Price list','Локальное управление':'Local management','Защищённый доступ':'Protected access','Введите пароль администратора. Сессия автоматически завершится через 30 минут.':'Enter the administrator password. The session will end automatically after 30 minutes.','Пароль':'Password','Войти':'Sign in','Неверный пароль. Доступ запрещён.':'Incorrect password. Access denied.','Не удалось проверить доступ. Повторите попытку.':'Unable to verify access. Please try again.','Закрыть':'Close',
    'Международные корпоративные поставки':'International B2B supply','Категории':'Categories','Отдельный конфигуратор':'Dedicated configurator','Условия поставки':'Supply terms','О компании':'Company','Конфигуратор памяти':'Memory configurator','Запрос КП ·':'Request quote ·','Ориентир по позициям с ценой:':'Estimated total for priced items:','· есть позиции «По запросу»':'· includes on-request items','GPU-серверы':'GPU servers','Высокоскоростная оптика':'High-speed optics','Конфигурация под заказ':'Built to order','Фото модуля 64 ГБ DDR5-5600 · точный PN подтверждается':'64 GB DDR5-5600 module image · exact PN to be confirmed',
    'Высокоплотная 8U GPU-система для обучения и инференса AI-моделей на платформе NVIDIA HGX B300 NVL8.':'High-density 8U GPU system for AI model training and inference on the NVIDIA HGX B300 NVL8 platform.',
    'Конфигурируемая серверная платформа для профессиональной графики, AI и вычислительных задач с ускорителем RTX PRO 6000.':'Configurable server platform for professional graphics, AI and compute workloads with RTX PRO 6000.',
    'Вычислительная AI-платформа на базе ускорителей Kunlunxin P800; состав узла формируется под задачу заказчика.':'AI compute platform based on Kunlunxin P800 accelerators; node configuration is tailored to the customer workload.',
    'Стоечная серверная платформа общего назначения для виртуализации, корпоративных приложений и хранения данных.':'General-purpose rack server platform for virtualization, enterprise applications and data storage.',
    'Платформа класса 4U для построения многопроцессорного GPU-узла; число и тип ускорителей определяются после проверки совместимости.':'4U platform for a multi-GPU compute node; accelerator type and quantity are selected after compatibility review.',
    'Корпоративный жёсткий диск Exos M большой ёмкости для плотных систем хранения и архивных массивов.':'High-capacity Exos M enterprise hard drive for dense storage systems and archival arrays.',
    'Жёсткий диск IronWolf Pro для многодисковых NAS, непрерывной работы и хранения больших объёмов данных.':'IronWolf Pro hard drive for multi-bay NAS, continuous operation and high-capacity storage.',
    'Дата-центровый NVMe SSD форм-фактора E1.S для облачных и гипермасштабируемых систем с интерфейсом PCIe 5.0.':'E1.S data-center NVMe SSD for cloud and hyperscale systems with PCIe 5.0.',
    'Корпоративный NVMe SSD серии 7450 PRO для серверных загрузочных и прикладных рабочих нагрузок.':'Micron 7450 PRO enterprise NVMe SSD for server boot and application workloads.',
    'Корпоративный накопитель M.2 ёмкостью 960 ГБ; назначение и совместимость зависят от подтверждённой серии и артикула.':'960 GB enterprise M.2 SSD; intended use and compatibility depend on the confirmed series and part number.',
    'Корпоративный SAS SSD ёмкостью 3,84 ТБ; применение и совместимость определяются после подтверждения точной модели.':'3.84 TB enterprise SAS SSD; use case and compatibility depend on the confirmed exact model.',
    'Двухпортовый оптический модуль OSFP для соединений общей пропускной способностью 800 Гбит/с на многомодовом волокне.':'Dual-port OSFP optical transceiver delivering 800 Gb/s aggregate bandwidth over multimode fiber.',
    'Контрактный серверный модуль на новых микросхемах Samsung для совместимых DDR5 RDIMM-платформ; не является оригинальным модулем Samsung.':'Contract-manufactured server module using new Samsung DRAM chips for compatible DDR5 RDIMM platforms; not an original Samsung module.',
    'Серверный ECC RDIMM Huixinlong ёмкостью 64 ГБ для совместимых платформ DDR5-5600.':'64 GB Huixinlong ECC RDIMM for compatible DDR5-5600 server platforms.',
    'Платформа NVIDIA HGX B300 NVL8':'NVIDIA HGX B300 NVL8 platform','Форм-фактор 8U':'8U form factor','Конфигурация требует подтверждения':'Configuration subject to confirmation','Корпус класса 4U':'4U-class chassis','Платформа с NVIDIA RTX PRO 6000':'Platform with NVIDIA RTX PRO 6000','Процессоры, память и накопители — по согласованной спецификации':'Processors, memory and storage per agreed specification','Фото конкретной сборки запрашивается у поставщика':'Photo of the exact build is requested from the supplier','Платформа для задач искусственного интеллекта':'Platform for artificial-intelligence workloads','Конфигурация формируется по техническому заданию':'Configuration is built against the technical specification','Фото конкретной системы запрашивается у поставщика':'Photo of the exact system is requested from the supplier','Стоечная серверная платформа':'Rack server platform','Точная комплектация согласовывается индивидуально':'Exact configuration is agreed individually','До 8 GPU — в зависимости от платформы':'Up to 8 GPUs depending on platform','Точная модель и комплектация — по запросу':'Exact model and configuration on request','Магнитный жёсткий диск':'Hard disk drive','Серия IronWolf Pro':'IronWolf Pro series','Накопитель для NAS':'NAS drive','Форм-фактор E1.S':'E1.S form factor','Форм-фактор M.2':'M.2 form factor','Ёмкость 960 ГБ':'960 GB capacity','Ёмкость 3,84 ТБ':'3.84 TB capacity','Точная модель — по запросу':'Exact model on request','Интерфейс SAS':'SAS interface','Оптический трансивер 800 Гбит/с':'800 Gb/s optical transceiver','До 50 м при соблюдении требований к оптической линии':'Up to 50 m with a compliant optical link',
    'Серверная конфигурация LTGPU4212 / RTX PRO 6000':'LTGPU4212 server configuration / RTX PRO 6000','Вычислительная платформа Kunlunxin P800':'Kunlunxin P800 compute platform','Серверная платформа 4U для конфигурации до 8 GPU':'4U server platform for up to 8 GPUs','OEM DDR5-5600 RDIMM 64GB, новые микросхемы Samsung':'OEM DDR5-5600 RDIMM 64GB with new Samsung DRAM chips','Seagate ST30000NM004K, Exos M, 30 ТБ':'Seagate ST30000NM004K, Exos M, 30 TB','Seagate IronWolf Pro ST30000NT011, 30 ТБ':'Seagate IronWolf Pro ST30000NT011, 30 TB','Micron M.2 SSD, 960 ГБ — модель уточняется':'Micron M.2 SSD, 960 GB — model to be confirmed','Huawei SAS SSD, 3,84 ТБ — модель уточняется':'Huawei SAS SSD, 3.84 TB — model to be confirmed',
    'КОНФИГУРАЦИЯ УТОЧНЯЕТСЯ В КП':'CONFIGURATION CONFIRMED IN QUOTATION','Предварительная конфигурация. Точные параметры процессоров, памяти, накопителей, сети и охлаждения подтверждаются в коммерческом предложении.':'Preliminary configuration. Exact processor, memory, storage, networking and cooling parameters are confirmed in the commercial quotation.','Предварительная конфигурация по предложению поставщика. Заводской SKU сервера, состав компонентов и совместимость подтверждаются в коммерческом предложении.':'Preliminary supplier configuration. Server SKU, component list and compatibility are confirmed in the commercial quotation.','Точная модель сервера, корпус, количество ускорителей и заводской SKU подтверждаются до оформления заказа.':'Exact server model, chassis, accelerator count and manufacturer SKU are confirmed before ordering.','Изображение семейства. Процессоры, память, контроллеры, накопители и заводской номер подтверждаются в коммерческом предложении.':'Product-family image. Processors, memory, controllers, storage and serial number are confirmed in the commercial quotation.','Совместимость с конкретными ускорителями, включая GeForce RTX 5090, количество GPU, питание и охлаждение подтверждаются инженерной спецификацией.':'Compatibility with specific accelerators, including GeForce RTX 5090, GPU count, power and cooling are confirmed by the engineering specification.','Артикул указан для SED-исполнения 3,84 ТБ; доступность и ревизия подтверждаются при заказе.':'The stated part number is for the 3.84 TB SED version; availability and revision are confirmed when ordering.','Серия, интерфейс, ресурс записи и заводской артикул должны быть подтверждены поставщиком до заказа.':'Series, interface, endurance and manufacturer part number must be confirmed by the supplier before ordering.','Серия, форм-фактор, скорость интерфейса, ресурс записи и заводской артикул должны быть подтверждены поставщиком до заказа.':'Series, form factor, interface speed, endurance and manufacturer part number must be confirmed by the supplier before ordering.','HK MILONCHKA LIMITED осуществляет поставки серверного оборудования, оперативной памяти, накопителей и сетевых компонентов для корпоративных заказчиков, центров обработки данных, системных интеграторов и проектов искусственного интеллекта.':'HK MILONCHKA LIMITED supplies server hardware, memory, storage and network components to enterprise customers, data centers, system integrators and artificial-intelligence projects.','Возможны разовые и регулярные поставки, включая поэтапную отгрузку. Объём, сроки, техническая комплектация и условия передачи согласовываются индивидуально.':'One-time and recurring supply, including phased shipments, is available. Volume, schedule, technical configuration and delivery terms are agreed individually.'
  });
  Object.assign(zh, {
    'LTGPU4212 / AS4212-A8V4 / NVIDIA RTX PRO 6000':'LTGPU4212 / AS4212-A8V4 / NVIDIA RTX PRO 6000','Двухпроцессорный сервер на базе AMD EPYC 9965 с ускорителем NVIDIA RTX PRO 6000, 128 ГБ DDR5 ECC и резервированным питанием.':'基于双路 AMD EPYC 9965 的服务器，配备 NVIDIA RTX PRO 6000 加速器、128 GB DDR5 ECC 内存和冗余电源。','Серверная платформа: 1 × LTGPU4212 / AS4212-A8V4':'服务器平台：1 × LTGPU4212 / AS4212-A8V4','Процессоры: 2 × AMD EPYC 9965':'处理器：2 × AMD EPYC 9965','Оперативная память: 2 × GEIL 64GB DDR5-5600 ECC RDIMM, всего 128 ГБ':'系统内存：2 × GEIL 64GB DDR5-5600 ECC RDIMM，共 128 GB','Накопители: 2 × Micron 960GB M.2 + 1 × Huawei 3.84TB SAS':'存储：2 × Micron 960GB M.2 + 1 × Huawei 3.84TB SAS','Графический ускоритель: 1 × NVIDIA RTX PRO 6000, PN 900-2G153-0000-000':'图形加速器：1 × NVIDIA RTX PRO 6000，PN 900-2G153-0000-000','Блоки питания: 4 × 2700 Вт':'电源：4 × 2700 W','Конфигурация по спецификации поставщика. Заводские артикулы модулей памяти и накопителей подтверждаются в коммерческом предложении.':'配置依据供应商规格。内存模块和存储设备的制造商料号将在正式报价中确认。',
    'AI-сервер для обучения моделей с восемью ускорителями P800-OAM и 768 ГБ суммарной памяти ускорителей.':'配备八个 P800-OAM 加速器和 768 GB 加速器总内存的 AI 训练服务器。','Ускорители: 8 × P800-OAM':'加速器：8 × P800-OAM','Память ускорителей: 96 ГБ каждый, всего 768 ГБ':'加速器内存：每个 96 GB，共 768 GB','Процессоры: 2 × Intel Xeon 8563C':'处理器：2 × Intel Xeon 8563C','Оперативная память: DDR5-5600 RDIMM':'系统内存：DDR5-5600 RDIMM','Модули памяти: 24 × 64 ГБ':'内存模块：24 × 64 GB','Общая оперативная память: 1536 ГБ':'系统内存总量：1536 GB','Точная комплектация поставки и заводской SKU фиксируются в коммерческом предложении.':'具体供货配置和制造商 SKU 将在正式报价中确认。',
    'Прайс-лист':'价格表','Локальное управление':'本地管理','Защищённый доступ':'受保护访问','Введите пароль администратора. Сессия автоматически завершится через 30 минут.':'请输入管理员密码。会话将在 30 分钟后自动结束。','Пароль':'密码','Войти':'登录','Неверный пароль. Доступ запрещён.':'密码错误，拒绝访问。','Не удалось проверить доступ. Повторите попытку.':'无法验证访问权限，请重试。','Закрыть':'关闭',
    'Международные корпоративные поставки':'国际企业级供应','Категории':'产品类别','Отдельный конфигуратор':'独立配置器','Условия поставки':'供货条款','О компании':'关于公司','Конфигуратор памяти':'内存配置器','Запрос КП ·':'询价单 ·','Ориентир по позициям с ценой:':'有价格产品预估合计：','· есть позиции «По запросу»':'· 包含询价产品','GPU-серверы':'GPU 服务器','Высокоскоростная оптика':'高速光模块','Конфигурация под заказ':'定制配置','Фото модуля 64 ГБ DDR5-5600 · точный PN подтверждается':'64 GB DDR5-5600 模块图片 · 具体料号待确认',
    'Высокоплотная 8U GPU-система для обучения и инференса AI-моделей на платформе NVIDIA HGX B300 NVL8.':'基于 NVIDIA HGX B300 NVL8 平台的高密度 8U GPU 系统，适用于 AI 模型训练与推理。','Конфигурируемая серверная платформа для профессиональной графики, AI и вычислительных задач с ускорителем RTX PRO 6000.':'搭载 RTX PRO 6000 的可配置服务器平台，适用于专业图形、AI 与计算任务。','Вычислительная AI-платформа на базе ускорителей Kunlunxin P800; состав узла формируется под задачу заказчика.':'基于昆仑芯 P800 加速器的 AI 计算平台，节点配置按客户工作负载定制。','Стоечная серверная платформа общего назначения для виртуализации, корпоративных приложений и хранения данных.':'通用机架式服务器平台，适用于虚拟化、企业应用和数据存储。','Платформа класса 4U для построения многопроцессорного GPU-узла; число и тип ускорителей определяются после проверки совместимости.':'用于构建多 GPU 计算节点的 4U 平台；加速卡型号与数量需经兼容性确认。','Корпоративный жёсткий диск Exos M большой ёмкости для плотных систем хранения и архивных массивов.':'适用于高密度存储系统和归档阵列的大容量 Exos M 企业级硬盘。','Жёсткий диск IronWolf Pro для многодисковых NAS, непрерывной работы и хранения больших объёмов данных.':'适用于多盘位 NAS、持续运行和大容量存储的 IronWolf Pro 硬盘。','Дата-центровый NVMe SSD форм-фактора E1.S для облачных и гипермасштабируемых систем с интерфейсом PCIe 5.0.':'面向云和超大规模系统的 E1.S 数据中心 NVMe SSD，支持 PCIe 5.0。','Корпоративный NVMe SSD серии 7450 PRO для серверных загрузочных и прикладных рабочих нагрузок.':'Micron 7450 PRO 企业级 NVMe SSD，适用于服务器启动和应用负载。','Корпоративный накопитель M.2 ёмкостью 960 ГБ; назначение и совместимость зависят от подтверждённой серии и артикула.':'960 GB 企业级 M.2 SSD；用途和兼容性取决于确认后的系列与料号。','Корпоративный SAS SSD ёмкостью 3,84 ТБ; применение и совместимость определяются после подтверждения точной модели.':'3.84 TB 企业级 SAS SSD；应用和兼容性取决于确认后的具体型号。','Двухпортовый оптический модуль OSFP для соединений общей пропускной способностью 800 Гбит/с на многомодовом волокне.':'双端口 OSFP 光模块，通过多模光纤提供 800 Gb/s 总带宽。','Контрактный серверный модуль на новых микросхемах Samsung для совместимых DDR5 RDIMM-платформ; не является оригинальным модулем Samsung.':'采用全新 Samsung DRAM 芯片的合同制造服务器内存，适用于兼容的 DDR5 RDIMM 平台；并非 Samsung 原厂模块。','Серверный ECC RDIMM Huixinlong ёмкостью 64 ГБ для совместимых платформ DDR5-5600.':'适用于兼容 DDR5-5600 服务器平台的 64 GB Huixinlong ECC RDIMM。',
    'Платформа NVIDIA HGX B300 NVL8':'NVIDIA HGX B300 NVL8 平台','Форм-фактор 8U':'8U 规格','Конфигурация требует подтверждения':'配置待确认','Корпус класса 4U':'4U 级机箱','Платформа с NVIDIA RTX PRO 6000':'搭载 NVIDIA RTX PRO 6000 的平台','Процессоры, память и накопители — по согласованной спецификации':'处理器、内存和存储按确认规格配置','Фото конкретной сборки запрашивается у поставщика':'具体整机照片需向供应商确认','Платформа для задач искусственного интеллекта':'面向人工智能工作负载的平台','Конфигурация формируется по техническому заданию':'按技术需求定制配置','Фото конкретной системы запрашивается у поставщика':'具体系统照片需向供应商确认','Стоечная серверная платформа':'机架式服务器平台','Точная комплектация согласовывается индивидуально':'具体配置单独确认','До 8 GPU — в зависимости от платформы':'最多 8 张 GPU，取决于平台','Точная модель и комплектация — по запросу':'具体型号与配置请询价','Магнитный жёсткий диск':'机械硬盘','Серия IronWolf Pro':'IronWolf Pro 系列','Накопитель для NAS':'NAS 硬盘','Форм-фактор E1.S':'E1.S 规格','Форм-фактор M.2':'M.2 规格','Ёмкость 960 ГБ':'960 GB 容量','Ёмкость 3,84 ТБ':'3.84 TB 容量','Точная модель — по запросу':'具体型号请询价','Интерфейс SAS':'SAS 接口','Оптический трансивер 800 Гбит/с':'800 Gb/s 光模块','До 50 м при соблюдении требований к оптической линии':'符合光链路要求时最长 50 米',
    'Серверная конфигурация LTGPU4212 / RTX PRO 6000':'LTGPU4212 服务器配置 / RTX PRO 6000','Вычислительная платформа Kunlunxin P800':'昆仑芯 P800 计算平台','Серверная платформа 4U для конфигурации до 8 GPU':'最多支持 8 张 GPU 的 4U 服务器平台','OEM DDR5-5600 RDIMM 64GB, новые микросхемы Samsung':'OEM DDR5-5600 RDIMM 64GB，采用全新 Samsung DRAM 芯片','Seagate ST30000NM004K, Exos M, 30 ТБ':'Seagate ST30000NM004K，Exos M，30 TB','Seagate IronWolf Pro ST30000NT011, 30 ТБ':'Seagate IronWolf Pro ST30000NT011，30 TB','Micron M.2 SSD, 960 ГБ — модель уточняется':'Micron M.2 SSD，960 GB — 型号待确认','Huawei SAS SSD, 3,84 ТБ — модель уточняется':'Huawei SAS SSD，3.84 TB — 型号待确认',
    'КОНФИГУРАЦИЯ УТОЧНЯЕТСЯ В КП':'配置以正式报价为准','Предварительная конфигурация. Точные параметры процессоров, памяти, накопителей, сети и охлаждения подтверждаются в коммерческом предложении.':'初步配置。处理器、内存、存储、网络和散热的具体参数以正式报价为准。','Предварительная конфигурация по предложению поставщика. Заводской SKU сервера, состав компонентов и совместимость подтверждаются в коммерческом предложении.':'供应商初步配置。服务器 SKU、组件清单和兼容性以正式报价为准。','Точная модель сервера, корпус, количество ускорителей и заводской SKU подтверждаются до оформления заказа.':'服务器具体型号、机箱、加速卡数量及制造商 SKU 将在下单前确认。','Изображение семейства. Процессоры, память, контроллеры, накопители и заводской номер подтверждаются в коммерческом предложении.':'产品系列图片。处理器、内存、控制器、存储及序列号以正式报价为准。','Совместимость с конкретными ускорителями, включая GeForce RTX 5090, количество GPU, питание и охлаждение подтверждаются инженерной спецификацией.':'包括 GeForce RTX 5090 在内的具体加速卡兼容性、GPU 数量、供电和散热以工程规格为准。','Артикул указан для SED-исполнения 3,84 ТБ; доступность и ревизия подтверждаются при заказе.':'所列料号对应 3.84 TB SED 版本；库存和版本在下单时确认。','Серия, интерфейс, ресурс записи и заводской артикул должны быть подтверждены поставщиком до заказа.':'系列、接口、写入耐久度和制造商料号须在下单前由供应商确认。','Серия, форм-фактор, скорость интерфейса, ресурс записи и заводской артикул должны быть подтверждены поставщиком до заказа.':'系列、规格、接口速率、写入耐久度和制造商料号须在下单前由供应商确认。','HK MILONCHKA LIMITED осуществляет поставки серверного оборудования, оперативной памяти, накопителей и сетевых компонентов для корпоративных заказчиков, центров обработки данных, системных интеграторов и проектов искусственного интеллекта.':'HK MILONCHKA LIMITED 为企业客户、数据中心、系统集成商和人工智能项目供应服务器设备、内存、存储及网络组件。','Возможны разовые и регулярные поставки, включая поэтапную отгрузку. Объём, сроки, техническая комплектация и условия передачи согласовываются индивидуально.':'支持一次性和定期供应，包括分批交付。数量、周期、技术配置和交付条件均单独商定。'
  });
  const dict = lang === 'en' ? en : lang === 'zh' ? zh : {};

  function dynamic(value) {
    if (lang === 'ru') return value;
    let m;
    if ((m = value.match(/^Найдено:\s*(\d+)$/))) return lang === 'zh' ? `找到：${m[1]}` : `Found: ${m[1]}`;
    if ((m = value.match(/^(\d+)\s+вариант(?:ов|а)?$/i))) return lang === 'zh' ? `${m[1]} 个选项` : `${m[1]} OPTIONS`;
    if ((m = value.match(/^(\d+)\s+позиц(?:ий|ии|ия)$/))) return lang === 'zh' ? `${m[1]} 个产品` : `${m[1]} items`;
    if ((m = value.match(/^Запрос КП\s*·\s*(\d+)$/))) return lang === 'zh' ? `询价单 · ${m[1]}` : `Request quote · ${m[1]}`;
    if ((m = value.match(/^Объём:\s*(.+)$/))) return `${dict['Объём']}: ${m[1]}`;
    if ((m = value.match(/^Скорость:\s*(.+)$/))) return `${dict['Скорость']}: ${m[1]}`;
    if ((m = value.match(/^(Объём|Скорость|Тип)\s*·$/))) return `${dict[m[1]]} ·`;
    if ((m = value.match(/^Количество\s+(.+)$/))) return `${dict['Количество']} ${m[1]}`;
    if ((m = value.match(/^(Samsung|SK hynix|Micron) DDR5 ECC RDIMM (\d+) ГБ, (\d+) МТ\/с для совместимых корпоративных серверов; точная совместимость проверяется по спецификации платформы\.$/))) return lang === 'zh' ? `${m[1]} DDR5 ECC RDIMM，${m[2]} GB，${m[3]} MT/s，适用于兼容的企业服务器；具体兼容性以服务器规格为准。` : `${m[1]} DDR5 ECC RDIMM, ${m[2]} GB, ${m[3]} MT/s for compatible enterprise servers; verify compatibility against the server specification.`;
    if (/^\d+(?:[.,]\d+)? ГБ$/.test(value)) return value.replace('ГБ', 'GB').replace(',', '.');
    if (/^\d+ МТ\/с$/.test(value)) return value.replace('МТ/с', 'MT/s');
    if (/^\d+(?:[.,]\d+)? ТБ$/.test(value)) return value.replace('ТБ', 'TB').replace(',', '.');
    if (value === 'Конфигурация уточняется в КП') return lang === 'zh' ? '配置以正式报价为准' : 'Configuration confirmed in quotation';
    const exact = dict[value];
    if (exact) return exact;
    return value
      .replace(/КОНФИГУРАЦИЯ УТОЧНЯЕТСЯ В КП/g, lang === 'zh' ? '配置以正式报价为准' : 'CONFIGURATION CONFIRMED IN QUOTATION')
      .replace(/Артикул:/g, lang === 'zh' ? '料号：' : 'Part number:')
      .replace(/ГБ/g, 'GB')
      .replace(/ТБ/g, 'TB')
      .replace(/МТ\/с/g, 'MT/s')
      .replace(/Гбит\/с/g, 'Gb/s')
      .replace(/нм/g, 'nm');
  }

  function translateTree(root) {
    if (lang === 'ru' || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.parentElement?.closest('script,style')) continue;
      const raw = node.nodeValue;
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const next = dynamic(trimmed);
      if (next !== trimmed) node.nodeValue = raw.replace(trimmed, next);
    }
    root.querySelectorAll?.('input[placeholder],textarea[placeholder]').forEach(el => {
      const next = dynamic(el.placeholder);
      if (next !== el.placeholder) el.placeholder = next;
    });
    root.querySelectorAll?.('[aria-label]').forEach(el => {
      const next = dynamic(el.getAttribute('aria-label'));
      if (next !== el.getAttribute('aria-label')) el.setAttribute('aria-label', next);
    });
    root.querySelectorAll?.('[alt],[title]').forEach(el => {
      for (const attr of ['alt', 'title']) {
        if (!el.hasAttribute(attr)) continue;
        const current = el.getAttribute(attr);
        const next = dynamic(current);
        if (next !== current) el.setAttribute(attr, next);
      }
    });
  }

  function languageUrl(code) {
    const url = new URL(location.href);
    url.searchParams.set('lang', code);
    return url.pathname + '?' + url.searchParams.toString() + url.hash;
  }

  function addSwitcher() {
    const nav = document.querySelector('.top .nav');
    if (!nav || nav.querySelector('.lang-switch')) return;
    const control = document.createElement('nav');
    control.className = 'lang-switch';
    control.setAttribute('aria-label', lang === 'zh' ? '语言' : lang === 'en' ? 'Language' : 'Язык');
    control.innerHTML = `<a href="${languageUrl('ru')}" class="${lang === 'ru' ? 'active' : ''}" lang="ru">RU</a><a href="${languageUrl('en')}" class="${lang === 'en' ? 'active' : ''}" lang="en">EN</a><a href="${languageUrl('zh')}" class="${lang === 'zh' ? 'active' : ''}" lang="zh-CN">中文</a>`;
    const actions = nav.querySelector('.nav-actions');
    const cart = nav.querySelector('.cart-trigger');
    nav.insertBefore(control, actions || cart || null);
    control.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link) localStorage.setItem('milonchka-lang', link.getAttribute('lang') === 'zh-CN' ? 'zh' : link.getAttribute('lang'));
    });
    const style = document.createElement('style');
    style.textContent = `.lang-switch{display:flex;margin-left:auto;padding:3px;border:1px solid #45483f;border-radius:999px;background:#20221d;gap:2px;white-space:nowrap}.navlinks+.lang-switch{margin-left:0}.lang-switch a{height:30px;min-width:36px;padding:0 9px;display:grid;place-items:center;border-radius:999px;color:#aeb2a9;font:600 10px "IBM Plex Mono",monospace;letter-spacing:.04em}.lang-switch a.active{background:#98e24c;color:#11120f}.nav-actions{margin-left:0!important}@media(max-width:680px){.top .nav{height:auto!important;min-height:66px;flex-wrap:wrap;padding:8px 0}.lang-switch{order:3;width:100%;margin:0 0 2px!important}.lang-switch a{flex:1}.top .navlinks{display:none}}`;
    document.head.appendChild(style);
  }

  function localizeMeta() {
    if (lang === 'en') {
      document.title = location.pathname.includes('memory') ? 'DDR5 RDIMM Server Memory Configurator — HK MILONCHKA LIMITED' : 'HK MILONCHKA LIMITED — Server Hardware and Components';
    } else if (lang === 'zh') {
      document.title = location.pathname.includes('memory') ? 'DDR5 RDIMM 服务器内存配置器 — HK MILONCHKA LIMITED' : 'HK MILONCHKA LIMITED — 服务器设备与组件';
    }
  }

  function preserveLanguageInLinks() {
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      if (link.closest('.lang-switch')) return;
      const url = new URL(link.href, location.origin);
      url.searchParams.set('lang', lang);
      link.href = url.pathname + '?' + url.searchParams.toString() + url.hash;
    });
  }

  function preserveLanguageInNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
    const links = node.matches?.('a[href^="/"]') ? [node] : [...node.querySelectorAll?.('a[href^="/"]') || []];
    links.forEach(link => {
      if (link.closest('.lang-switch')) return;
      const url = new URL(link.href, location.origin);
      url.searchParams.set('lang', lang);
      link.href = url.pathname + '?' + url.searchParams.toString() + url.hash;
    });
  }

  function run() {
    addSwitcher();
    localizeMeta();
    translateTree(document.body);
    preserveLanguageInLinks();
    if (lang !== 'ru') {
      const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) { translateTree(node); preserveLanguageInNode(node); }
        else if (node.nodeType === Node.TEXT_NODE) translateTree(node.parentElement);
      })));
      observer.observe(document.body, {childList:true,subtree:true});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
