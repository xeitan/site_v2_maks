/**
 * НейроSEO - Interactive Logic & Calculations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCalculator();
    initSlider();
    initModals();
    initScrollReveal();
    initTiltEffect();
});

/* ==========================================================================
   NAVIGATION & BURGER MENU
   ========================================================================== */
function initNavigation() {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');

    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
}

/* ==========================================================================
   CALCULATOR LOGIC
   ========================================================================== */
function initCalculator() {
    // Inputs
    const trafficSlider = document.getElementById('trafficSlider');
    const convSlider = document.getElementById('convSlider');
    const platformCheckboxes = document.querySelectorAll('input[name="platforms"]');
    const tariffRadios = document.querySelectorAll('input[name="tariff"]');

    // Outputs
    const valTraffic = document.getElementById('valTraffic');
    const valConv = document.getElementById('valConv');
    const resCurrentLeads = document.getElementById('resCurrentLeads');
    const resTrafficM1 = document.getElementById('resTrafficM1');
    const resLeadsM1 = document.getElementById('resLeadsM1');
    const resTrafficM2 = document.getElementById('resTrafficM2');
    const resLeadsM2 = document.getElementById('resLeadsM2');
    const resGrowthPercent = document.getElementById('resGrowthPercent');
    const tariffDescription = document.getElementById('tariffDescription');
    const formTariff = document.getElementById('formTariff');
    const formTraffic = document.getElementById('formTraffic');
    const formConv = document.getElementById('formConv');

    if (!trafficSlider) return;

    // Platform config and stable random-ish multiplier mapping
    const platformConfig = {
        site: { multiplier: 1.0 },
        dzen: { multiplier: 1.5, minViews: 3000 },
        vk: { multiplier: 1.3, minViews: 3000 },
        tenchat: { multiplier: 1.2, minViews: 3000 },
        telegram: { multiplier: 1.4, minViews: 3000 },
        vc: { multiplier: 1.6, minViews: 3000 }
    };

    // Tariff configs
    const tariffConfig = {
        diy: {
            name: "НейроSEO (Самостоятельно)",
            m1Growth: 0.20,
            m2Growth: 0.22,
            badge: "Базовый",
            details: `
                <h4>В тариф входит самостоятельно:</h4>
                <ul>
                    <li><i class="fa-solid fa-check text-orange"></i> Доступ к AI-платформе агентства</li>
                    <li><i class="fa-solid fa-check text-orange"></i> Подключение каналов Дзен, Telegram, VK, VC.ru</li>
                    <li><i class="fa-solid fa-check text-orange"></i> Готовые SEO-алгоритмы генерации контента</li>
                    <li><i class="fa-solid fa-xmark text-red"></i> Разработка ИИ-сайтов не включена</li>
                    <li><i class="fa-solid fa-xmark text-red"></i> Накрутка ПФ не включена</li>
                </ul>
            `
        },
        agency: {
            name: "НейроSEO под ключ",
            m1Growth: 0.36,
            m2Growth: 0.36,
            badge: "Под ключ",
            details: `
                <h4>В тариф входит под ключ:</h4>
                <ul>
                    <li><i class="fa-solid fa-check text-orange"></i> Полный аутсорсинг всех процессов</li>
                    <li><i class="fa-solid fa-check text-orange"></i> Создание дополнительных сайтов с ИИ</li>
                    <li><i class="fa-solid fa-check text-orange"></i> Упаковка и постинг в Дзен, VK, VC.ru, Telegram</li>
                    <li><i class="fa-solid fa-check text-orange"></i> Оптимизация и накрутка поведенческих факторов (ПФ)</li>
                    <li><i class="fa-solid fa-check text-orange"></i> Оптимизация под ИИ-выдачу (AIO)</li>
                </ul>
            `
        },
        aggressive: {
            name: "Агрессивный рост",
            m1Growth: 0.50,
            m2Growth: 0.55,
            badge: "Агрессивный рост",
            details: `
                <h4>В тариф входит с гарантией:</h4>
                <ul>
                    <li><i class="fa-solid fa-check text-orange"></i> Создание широкой сетки ИИ-сайтов (сателлитов)</li>
                    <li><i class="fa-solid fa-check text-orange"></i> <strong>Юридическая гарантия роста лидов</strong></li>
                    <li><i class="fa-solid fa-check text-orange"></i> Привязка цены лида к договору</li>
                    <li><i class="fa-solid fa-check text-orange"></i> ORM/SERM — Управление репутацией бренда</li>
                    <li><i class="fa-solid fa-check text-orange"></i> Приоритетная поддержка 24/7</li>
                </ul>
            `
        }
    };

    function calculate() {
        const tSite = parseInt(trafficSlider.value);
        const cSite = parseFloat(convSlider.value) / 100;
        
        // Update display text
        valTraffic.textContent = tSite.toLocaleString('ru-RU');
        valConv.textContent = convSlider.value + '%';

        // Find active tariff
        let activeTariffKey = 'diy';
        tariffRadios.forEach(radio => {
            if (radio.checked) activeTariffKey = radio.value;
        });
        const tariff = tariffConfig[activeTariffKey];

        // Highlight selected radio card styling
        document.querySelectorAll('.tariff-radio-card').forEach(card => {
            card.classList.remove('checked');
            if (card.querySelector('input').checked) {
                card.classList.add('checked');
            }
        });

        // Platform checkboxes styling
        document.querySelectorAll('.platform-checkbox').forEach(chk => {
            chk.classList.remove('checked');
            if (chk.querySelector('input').checked) {
                chk.classList.add('checked');
            }
        });

        // 1. Calculate base traffic and leads
        let totalBaseTraffic = 0;
        let totalBaseLeads = 0;

        platformCheckboxes.forEach(chk => {
            if (chk.checked) {
                const key = chk.value;
                if (key === 'site') {
                    totalBaseTraffic += tSite;
                    totalBaseLeads += tSite * cSite;
                } else {
                    // Platform logic:
                    // If site traffic is 0, platform traffic is minViews (3000 views / month)
                    // If site traffic > 0, platform traffic is site traffic * multiplier (from 1.2 to 1.6), but not less than 3000
                    let platformTraffic = 0;
                    if (tSite === 0) {
                        platformTraffic = platformConfig[key].minViews;
                    } else {
                        platformTraffic = Math.max(tSite * platformConfig[key].multiplier, platformConfig[key].minViews);
                    }
                    totalBaseTraffic += platformTraffic;
                    // Fixed 2% conversion from platforms to leads
                    totalBaseLeads += platformTraffic * 0.02;
                }
            }
        });

        // If no platforms are selected
        if (totalBaseTraffic === 0) {
            totalBaseTraffic = 0;
            totalBaseLeads = 0;
        }

        // Round baseline
        totalBaseLeads = Math.round(totalBaseLeads);

        // 2. Calculate forecasts based on selected tariff
        const trafficM1 = Math.round(totalBaseTraffic * (1 + tariff.m1Growth));
        const leadsM1 = Math.round(totalBaseLeads * (1 + tariff.m1Growth));

        const trafficM2 = Math.round(trafficM1 * (1 + tariff.m2Growth));
        const leadsM2 = Math.round(leadsM1 * (1 + tariff.m2Growth));

        // 3. Update output UI
        animateNumber(resCurrentLeads, totalBaseLeads);
        animateNumber(resTrafficM1, trafficM1);
        animateNumber(resLeadsM1, leadsM1);
        animateNumber(resTrafficM2, trafficM2);
        animateNumber(resLeadsM2, leadsM2);

        // Growth display
        const avgGrowthPct = Math.round(tariff.m1Growth * 100);
        resGrowthPercent.textContent = `+${avgGrowthPct}%`;

        // Update details html
        tariffDescription.innerHTML = tariff.details;

        // Sync inputs with form hidden variables
        formTariff.value = tariff.name;
        formTraffic.value = tSite;
        formConv.value = convSlider.value;
    }

    // Add event listeners
    trafficSlider.addEventListener('input', calculate);
    convSlider.addEventListener('input', calculate);
    platformCheckboxes.forEach(chk => chk.addEventListener('change', calculate));
    tariffRadios.forEach(radio => radio.addEventListener('change', calculate));

    // Run first calculation
    calculate();
}

/* ==========================================================================
   CASE SLIDER (10 CASES)
   ========================================================================== */
function initSlider() {
    const sliderTrack = document.getElementById('casesSlider');
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (!sliderTrack) return;

    const cards = Array.from(sliderTrack.children);
    const totalSlides = cards.length;
    let currentIndex = 0;

    // Responsive configuration
    function getVisibleSlidesCount() {
        const width = window.innerWidth;
        if (width >= 1024) return 4; // Desktop
        if (width >= 560) return 2;  // Tablet/large mobile
        return 1;                    // Small mobile (1 slide to prevent text squeezing)
    }

    // Set slide widths dynamically
    function updateSlideLayout() {
        const visibleCount = getVisibleSlidesCount();
        const containerWidth = sliderTrack.parentElement.clientWidth;
        const gap = 24; // matches style.css gap
        const totalGapsWidth = gap * (visibleCount - 1);
        const cardWidth = (containerWidth - totalGapsWidth) / visibleCount;

        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
        });

        // Redraw dots
        dotsContainer.innerHTML = '';
        const maxIndex = totalSlides - visibleCount;
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }

        // Adjust index if out of bounds
        if (currentIndex > maxIndex) {
            currentIndex = Math.max(0, maxIndex);
        }

        goToSlide(currentIndex, false); // move without transition for instant update
    }

    function goToSlide(index, withTransition = true) {
        const visibleCount = getVisibleSlidesCount();
        const maxIndex = totalSlides - visibleCount;
        
        // Boundaries
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;

        currentIndex = index;

        const gap = 24;
        const cardWidth = parseFloat(cards[0].style.width);
        const offset = -currentIndex * (cardWidth + gap);
        
        sliderTrack.style.transition = withTransition ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        sliderTrack.style.transform = `translateX(${offset}px)`;

        // Update dots
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    // Buttons navigation
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        const visibleCount = getVisibleSlidesCount();
        const maxIndex = totalSlides - visibleCount;
        if (currentIndex >= maxIndex) {
            goToSlide(0); // loop back
        } else {
            goToSlide(currentIndex + 1);
        }
    });

    // Touch swipe support
    let startX = 0;
    let isDragging = false;

    sliderTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    sliderTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = startX - currentX;

        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
            isDragging = false;
        }
    });

    sliderTrack.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Handle resizing
    window.addEventListener('resize', updateSlideLayout);
    updateSlideLayout();
}

/* ==========================================================================
   MODALS & POPUPS
   ========================================================================== */
const caseData = {
    1: {
        domain: "kottedzh-pod-klyuch.ru",
        tag: "Строительство",
        traffic: "+280%",
        leads: "124 лида/мес",
        top10: "82%",
        desc: "Кейс в сфере загородного домостроения. За счет ИИ-генерации 180 целевых страниц под узкие запросы (например, 'дом из клееного бруса с гаражом в Тосно') и регулярной публикации экспертных статей на Дзене, сайт вырос в выдаче Яндекса и Google без покупных ссылок за 60 дней.",
        queries: [
            { query: "строительство коттеджей под ключ спб", start: "72", m1: "19", m2: "3", diff: "+69" },
            { query: "купить коттедж в ленобласти от застройщика", start: "45", m1: "12", m2: "2", diff: "+43" },
            { query: "проекты загородных домов цена", start: "90", m1: "31", m2: "8", diff: "+82" },
            { query: "построить дом из бруса под ключ", start: "64", m1: "22", m2: "4", diff: "+60" }
        ]
    },
    2: {
        domain: "electrocars-msk.ru",
        tag: "Автодилер",
        traffic: "+340%",
        leads: "98 лидов/мес",
        top10: "76%",
        desc: "Продвижение автосалона электромобилей. С помощью AI была проанализирована база отзывов о конкурентах и разработана стратегия по закрытию болей клиентов (гарантия на батарею, станции зарядки). Контент размещался на VC.ru и в Telegram, что дало взрывной рост брендового трафика.",
        queries: [
            { query: "купить Zeekr 001 в Москве в наличии", start: "54", m1: "14", m2: "2", diff: "+52" },
            { query: "электромобили из Китая под заказ цена", start: "67", m1: "21", m2: "4", diff: "+63" },
            { query: "обзоры китайских электрокаров 2026", start: "41", m1: "9", m2: "1", diff: "+40" },
            { query: "тест драйв электромобилей мск", start: "88", m1: "42", m2: "9", diff: "+79" }
        ]
    },
    3: {
        domain: "crm-intellect.io",
        tag: "SaaS / IT",
        traffic: "+195%",
        leads: "310 лидов/мес",
        top10: "68%",
        desc: "B2B продвижение облачной CRM для бизнеса. Алгоритмы НейроSEO позволили занять топ выдачи по сложным коммерческим запросам за счет автогенерации 250+ страниц сравнений с конкурентами, написанных ИИ с глубокой технической точностью.",
        queries: [
            { query: "CRM система для отдела продаж внедрение", start: "38", m1: "11", m2: "2", diff: "+36" },
            { query: "лучшая CRM для малого бизнеса 2026", start: "59", m1: "18", m2: "4", diff: "+55" },
            { query: "облачная CRM цена за лицензию", start: "74", m1: "30", m2: "7", diff: "+67" },
            { query: "автоматизация продаж под ключ", start: "82", m1: "27", m2: "5", diff: "+77" }
        ]
    },
    4: {
        domain: "mebel-premium.ru",
        tag: "Мебель",
        traffic: "+220%",
        leads: "85 лидов/мес",
        top10: "71%",
        desc: "Интернет-магазин премиальной дизайнерской мебели. Создана сетка сателлитов под конкретные коллекции и мебельные тренды. AI переписал технические характеристики в продающие эмоциональные описания с учетом LSI-ключей.",
        queries: [
            { query: "дизайнерские диваны премиум класса москва", start: "48", m1: "15", m2: "2", diff: "+46" },
            { query: "купить мебель лофт из массива", start: "61", m1: "24", m2: "5", diff: "+56" },
            { query: "дорогая гостиная под заказ", start: "55", m1: "19", m2: "3", diff: "+52" }
        ]
    },
    5: {
        domain: "dent-clinica-spb.ru",
        tag: "Медицина",
        traffic: "+150%",
        leads: "140 лидов/мес",
        top10: "85%",
        desc: "Медицинский центр имплантации зубов. Сложная ниша из-за жестких алгоритмов оценки экспертности (YMYL в Google). AI был обучен на медицинских протоколах и статьях врачей клиники, что позволило выдавать 100% безопасный и авторитетный контент.",
        queries: [
            { query: "имплантация зубов под ключ спб цены", start: "35", m1: "12", m2: "1", diff: "+34" },
            { query: "установить имплант зуба отзывы врачей", start: "58", m1: "17", m2: "3", diff: "+55" },
            { query: "клиника стоматологии спб рейтинг", start: "81", m1: "29", m2: "6", diff: "+75" }
        ]
    },
    6: {
        domain: "eco-food-delivery.ru",
        tag: "Доставка еды",
        traffic: "+420%",
        leads: "560 лидов/мес",
        top10: "79%",
        desc: "Сервис доставки здорового рациона питания. AI автоматически генерировал сетку страниц под фитнес-цели и калорийность блюд. Параллельный постинг в TenChat и ВКонтакте дал мощный синергетический эффект по органическому трафику.",
        queries: [
            { query: "доставка правильного питания на неделю москва", start: "65", m1: "20", m2: "3", diff: "+62" },
            { query: "готовый рацион еды для похудения цена", start: "78", m1: "28", m2: "4", diff: "+74" },
            { query: "здоровое питание с доставкой на дом", start: "52", m1: "16", m2: "2", diff: "+50" }
        ]
    },
    7: {
        domain: "beauty-salon-sochi.ru",
        tag: "Услуги красоты",
        traffic: "+180%",
        leads: "115 лидов/мес",
        top10: "74%",
        desc: "Студия колористики и премиального ухода. Была проведена оптимизация под локальный поиск и нейро-выдачу Яндекса. AI генерировал экспертные отзывы на картах и отзовиках, что вывело карточку компании на 1 место в Картах.",
        queries: [
            { query: "сложное окрашивание волос сочи отзывы", start: "40", m1: "13", m2: "2", diff: "+38" },
            { query: "лучший салон красоты в сочи центр", start: "63", m1: "18", m2: "4", diff: "+59" },
            { query: "окрашивание аиртач сочи цена", start: "75", m1: "22", m2: "3", diff: "+72" }
        ]
    },
    8: {
        domain: "drones-shop.ru",
        tag: "Интернет-магазин",
        traffic: "+310%",
        leads: "225 лидов/мес",
        top10: "65%",
        desc: "Продажи гражданских квадрокоптеров и комплектующих. AI создал карточки товаров, оптимизировал мета-описания для 4000 SKU и сгенерировал сравнительные обзоры моделей, которые быстро вышли в топ Google Discover.",
        queries: [
            { query: "купить квадрокоптер с камерой недорого", start: "84", m1: "33", m2: "6", diff: "+78" },
            { query: "магазин радиоуправляемых дронов москва", start: "56", m1: "19", m2: "3", diff: "+53" },
            { query: "лучшие дроны для видеосъемки 2026", start: "72", m1: "21", m2: "4", diff: "+68" }
        ]
    },
    9: {
        domain: "lawyer-consult.ru",
        tag: "Юруслуги",
        traffic: "+140%",
        leads: "75 лидов/мес",
        top10: "89%",
        desc: "Адвокатское бюро по банкротству физлиц и арбитражным спорам. AI-копирайтинг на юридическую тематику с жесткой проработкой экспертности. Созданы авторитетные статьи-инструкции на VC.ru и Дзене, принесшие горячие лиды.",
        queries: [
            { query: "банкротство физических лиц под ключ цена мск", start: "51", m1: "16", m2: "3", diff: "+48" },
            { query: "юрист по арбитражным делам стоимость", start: "69", m1: "22", m2: "4", diff: "+65" },
            { query: "адвокат по гражданским спорам помощь", start: "44", m1: "11", m2: "2", diff: "+42" }
        ]
    },
    10: {
        domain: "cleanservice-msk.ru",
        tag: "Клининг",
        traffic: "+265%",
        leads: "190 лидов/мес",
        top10: "80%",
        desc: "Профессиональная клининговая компания для офисов и коттеджей. AI-генерация локальных страниц под каждый район Москвы и Подмосковья. Тексты оптимизированы под LSI, что позволило обойти старых конкурентов по низкочастотным запросам.",
        queries: [
            { query: "уборка офиса после ремонта москва цена", start: "70", m1: "21", m2: "3", diff: "+67" },
            { query: "профессиональный клининг коттеджа подмосковье", start: "53", m1: "15", m2: "2", diff: "+51" },
            { query: "мытье панорамных окон заказать недорого", start: "82", m1: "28", m2: "5", diff: "+77" }
        ]
    }
};

function initModals() {
    // Escape key closes active modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

    // Click outside dialog closes modal
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function openPopup(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Case Study detailed popups
function openCasePopup(caseId) {
    const data = caseData[caseId];
    if (!data) return;

    document.getElementById('modalCaseDomain').textContent = data.domain;
    document.getElementById('modalCaseTag').textContent = data.tag;
    document.getElementById('modalCaseTraffic').textContent = data.traffic;
    document.getElementById('modalCaseLeads').textContent = data.leads;
    document.getElementById('modalCaseTop10').textContent = data.top10;
    document.getElementById('modalCaseDesc').textContent = data.desc;

    // Fill table
    const tbody = document.querySelector('#topvisorTable tbody');
    tbody.innerHTML = '';

    data.queries.forEach(q => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${q.query}</td>
            <td>${q.start} место</td>
            <td>${q.m1} место</td>
            <td class="green-text">${q.m2} место</td>
            <td class="green-text"><i class="fa-solid fa-caret-up"></i> ${q.diff}</td>
        `;
        tbody.appendChild(tr);
    });

    openPopup('caseModal');
}

// Tab switcher for AI Pages Popup
function switchTab(event, tabId) {
    const popup = document.getElementById('sites-popup');
    const tabBtns = popup.querySelectorAll('.tab-btn');
    const tabContents = popup.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Lead modal triggering
function openLeadModal(specificRequest = null) {
    const modal = document.getElementById('leadModal');
    const sub = document.getElementById('leadModalSub');
    
    // Hidden fields syncing
    const formTariff = document.getElementById('formTariff');

    if (specificRequest) {
        sub.textContent = specificRequest;
        formTariff.value = specificRequest;
    } else {
        // Sync with active calculator tariff
        const activeTariffRadio = document.querySelector('input[name="tariff"]:checked');
        const activeTariffName = activeTariffRadio ? activeTariffRadio.parentElement.querySelector('h3').textContent : 'НейроSEO';
        sub.textContent = `Тариф: ${activeTariffName}`;
        formTariff.value = activeTariffName;
    }

    openPopup('leadModal');
}

// Form submissions simulation
function handleLeadSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const site = document.getElementById('clientSite').value;
    const tariff = document.getElementById('formTariff').value;
    const traffic = document.getElementById('formTraffic').value;
    const conv = document.getElementById('formConv').value;

    // Simulate sending data
    alert(`Спасибо, ${name}! Ваша заявка успешно принята.\n\nДетали обращения:\nТариф: ${tariff}\nТелефон: ${phone}\nСайт: ${site || 'Не указан'}\nПараметры калькулятора:\n- Трафик: ${traffic} пос/мес\n- Конверсия: ${conv}%\n\nНаш проектный менеджер свяжется с вами в течение 15 минут для подтверждения условий.`);

    // Reset and close
    document.getElementById('leadForm').reset();
    closeModal('leadModal');
}

// Smooth counter animation for numbers
function animateNumber(element, targetValue) {
    if (!element) return;
    
    // Cancel any ongoing animation frame
    if (element.animationFrameId) {
        cancelAnimationFrame(element.animationFrameId);
    }
    
    const startValue = parseInt(element.textContent.replace(/\s/g, '')) || 0;
    const duration = 450; // ms
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeOutQuad
        const ease = progress * (2 - progress);
        
        const currentValue = Math.round(startValue + (targetValue - startValue) * ease);
        element.textContent = currentValue.toLocaleString('ru-RU');
        
        if (progress < 1) {
            element.animationFrameId = requestAnimationFrame(update);
        } else {
            element.textContent = targetValue.toLocaleString('ru-RU');
        }
    }
    
    element.animationFrameId = requestAnimationFrame(update);
}

// Scroll Reveal Animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.adv-card, .problem-card, .approach-card, .calc-inputs, .results-card, .direct-card, .case-card, .section-header'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal-item');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // stop observing once visible
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// 3D Tilt Hover Animation (Stripe/Apple style) for desktop screens
function initTiltEffect() {
    // Disable on touch screens or small viewports for performance
    if (window.innerWidth < 1024 || 'ontouchstart' in window) return;
    
    const elements = document.querySelectorAll(
        '.adv-card, .problem-card, .approach-card, .results-card, .direct-card, .case-card, .visual-wrapper'
    );
    
    elements.forEach(el => {
        el.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.15s ease';
        
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate relative offset (-0.5 to 0.5)
            const offsetX = (x / rect.width) - 0.5;
            const offsetY = (y / rect.height) - 0.5;
            
            // Limit max tilt angles (deg)
            const maxTilt = 8;
            const tiltX = -offsetY * maxTilt;
            const tiltY = offsetX * maxTilt;
            
            // Apply 3D rotation transform
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
            
            // Highlight card shadow direction based on mouse position
            if (el.classList.contains('case-card') || el.classList.contains('approach-card')) {
                el.style.boxShadow = `
                    ${-offsetX * 15}px ${-offsetY * 15}px 30px rgba(0,0,0,0.08), 
                    0 15px 35px rgba(255, 85, 0, 0.1)
                `;
            }
        });
        
        el.addEventListener('mouseleave', () => {
            // Restore smooth default transition
            el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease';
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            
            // Reset custom shadows
            if (el.classList.contains('case-card') || el.classList.contains('approach-card')) {
                el.style.boxShadow = '';
            }
        });
    });
}
