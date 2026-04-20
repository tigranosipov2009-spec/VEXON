const services = [
  {
    href: "web-development.html",
    key: "web-dev",
    title: "Разработка сайтов",
    description: "Сайты под заявку для услуг, ремонта, beauty, обучения и экспертов."
  },
  {
    href: "redesign.html",
    key: "redesign",
    title: "Редизайн и доработка",
    description: "Обновляем структуру, визуальный слой, мобильную версию и конверсию."
  },
  {
    href: "seo-structure.html",
    key: "seo",
    title: "SEO-подготовка",
    description: "Закладываем семантику, структуру страниц и контентную основу до запуска."
  },
  {
    href: "yandex-direct.html",
    key: "direct",
    title: "Яндекс Директ",
    description: "Запуск, аналитика, тест гипотез и оптимизация рекламы под лиды."
  },
  {
    href: "growth.html",
    key: "growth",
    title: "Комплексное продвижение",
    description: "Собираем сайт, SEO и трафик в единую систему роста."
  }
];

const primaryNav = [
  { href: "index.html", key: "home", label: "Главная" },
  { href: "cases.html", key: "cases", label: "Кейсы" },
  { href: "about.html", key: "about", label: "О студии" },
  { href: "contacts.html", key: "contacts", label: "Контакты" }
];

const PHONE_DISPLAY = "+7 (999) 123-45-67";
const PHONE_LINK = "+79991234567";
const TELEGRAM_LINK = "https://t.me/vexonstudio";
const EMAIL_LINK = "mailto:hello@vexon.ru";

const currentPage = document.body.dataset.page || "home";
const isServicePage = services.some((item) => item.key === currentPage);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const brandSymbol = `
  <svg viewBox="0 0 140 112" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 28 31 7h31l15 21-15 21H31Z"/>
      <path d="M60 28 75 7h31l15 21-15 21H75Z"/>
      <path d="M91 49 106 28h18l15 21-15 21h-18Z"/>
      <path d="M31 49 47 76h31l15-27"/>
      <path d="M47 76 62.5 97h31L109 76"/>
      <path d="M62.5 49 78 70"/>
      <path d="M44 28 59 7"/>
      <path d="M88 28 103 7"/>
    </g>
  </svg>
`;

const brandMark = `
  <span class="brand-mark" aria-hidden="true">
    ${brandSymbol}
  </span>
`;

const createHeader = () => `
  <header class="site-header">
    <div class="container-wide header-inner">
      <a class="brand" href="index.html" aria-label="VEXON">
        ${brandMark}
        <span class="brand-copy">
          <strong class="brand-title">VEXON</strong>
          <small class="brand-caption">studio</small>
        </span>
      </a>

      <nav class="site-nav" aria-label="Основная навигация">
        ${primaryNav
          .slice(0, 1)
          .map(
            (item) =>
              `<a class="nav-link ${currentPage === item.key ? "is-active" : ""}" href="${item.href}">${item.label}</a>`
          )
          .join("")}
        <details class="nav-services ${isServicePage ? "is-active" : ""}">
          <summary>Услуги</summary>
          <div class="services-panel" role="group" aria-label="Услуги студии">
            ${services
              .map(
                (item) => `
                  <a class="service-panel-link ${currentPage === item.key ? "is-active" : ""}" href="${item.href}">
                    <strong>${item.title}</strong>
                    <span>${item.description}</span>
                  </a>
                `
              )
              .join("")}
          </div>
        </details>
        ${primaryNav
          .slice(1)
          .map(
            (item) =>
              `<a class="nav-link ${currentPage === item.key ? "is-active" : ""}" href="${item.href}">${item.label}</a>`
          )
          .join("")}
      </nav>

      <a class="header-phone" href="tel:${PHONE_LINK}" aria-label="Позвонить в VEXON">
        <strong>${PHONE_DISPLAY}</strong>
        <span>звонок или WhatsApp</span>
      </a>

      <a class="button header-cta" href="contacts.html#brief">Получить план запуска</a>

      <button
        class="nav-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="mobile-menu"
        aria-label="Открыть меню"
      >
        <span class="nav-toggle-lines" aria-hidden="true"></span>
      </button>
    </div>

    <div class="mobile-menu" id="mobile-menu">
      <div class="container-wide">
        <div class="mobile-menu-panel">
          <div class="mobile-menu-topline">
            <a class="mobile-contact-link" href="tel:${PHONE_LINK}">${PHONE_DISPLAY}</a>
            <a class="mobile-contact-link" href="${TELEGRAM_LINK}" target="_blank" rel="noreferrer">@vexonstudio</a>
          </div>

          ${primaryNav
            .map(
              (item) =>
                `<a class="mobile-link ${currentPage === item.key ? "is-active" : ""}" href="${item.href}">${item.label}</a>`
            )
            .join("")}

          <div class="mobile-link-group">
            <strong>Услуги</strong>
            ${services
              .map(
                (item) =>
                  `<a class="mobile-link ${currentPage === item.key ? "is-active" : ""}" href="${item.href}">${item.title}</a>`
              )
              .join("")}
          </div>

          <div class="mobile-contact">
            <a class="mobile-contact-link" href="${EMAIL_LINK}">hello@vexon.ru</a>
            <a class="mobile-contact-link" href="${TELEGRAM_LINK}" target="_blank" rel="noreferrer">Telegram</a>
          </div>

          <a class="button" href="contacts.html#brief">Получить план запуска</a>
        </div>
      </div>
    </div>
  </header>
`;

const createFooter = () => `
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <a class="brand" href="index.html" aria-label="VEXON">
          ${brandMark}
          <span class="brand-copy">
            <strong class="brand-title">VEXON</strong>
            <small class="brand-caption">studio</small>
          </span>
        </a>
        <p class="lead footer-lead">
          Digital-студия для локального бизнеса: проектируем сайты, SEO-структуру и запуск трафика как одну систему под заявки.
        </p>
      </div>
      <div>
        <h3>Услуги</h3>
        <div class="footer-links">
          ${services.map((item) => `<a href="${item.href}">${item.title}</a>`).join("")}
        </div>
      </div>
      <div>
        <h3>Разделы</h3>
        <div class="footer-links">
          <a href="cases.html">Кейсы</a>
          <a href="about.html">О студии</a>
          <a href="contacts.html">Контакты</a>
          <a href="contacts.html#brief">Бриф на проект</a>
        </div>
      </div>
      <div>
        <h3>Связь</h3>
        <div class="footer-links">
          <a href="${EMAIL_LINK}">hello@vexon.ru</a>
          <a href="tel:${PHONE_LINK}">${PHONE_DISPLAY}</a>
          <a href="${TELEGRAM_LINK}" target="_blank" rel="noreferrer">@vexonstudio</a>
          <span>Москва / работаем по всей России</span>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© <span data-year></span> VEXON. Digital-студия под заявки.</span>
      <span>Сайт, SEO-подготовка и Яндекс Директ для локального бизнеса.</span>
    </div>
  </footer>
`;

const createMobileStickyCta = () => {
  if (currentPage === "contacts") {
    return "";
  }

  const isHomePage = currentPage === "home";

  return `
    <div class="mobile-sticky-cta">
      <div class="mobile-sticky-copy">
        <strong>${isHomePage ? "Нужен быстрый ориентир?" : "Нужен понятный следующий шаг?"}</strong>
        <span>${isHomePage ? "Расчёт и план запуска без лишних созвонов" : "Короткий бриф и маршрут по проекту"}</span>
      </div>
      <a class="button" href="${isHomePage ? "#estimate" : "contacts.html#brief"}">${isHomePage ? "Рассчитать" : "Оставить бриф"}</a>
    </div>
  `;
};

const createContactWidget = () => {
  if (currentPage === "contacts") {
    return "";
  }

  return `
    <div class="contact-widget" data-glow aria-label="Быстрые контакты">
      <a class="widget-link widget-link--primary" href="contacts.html#brief">Бриф</a>
      <a class="widget-link" href="${TELEGRAM_LINK}" target="_blank" rel="noreferrer">Telegram</a>
      <a class="widget-link" href="tel:${PHONE_LINK}">Позвонить</a>
    </div>
  `;
};

document.querySelectorAll("[data-site-header]").forEach((node) => {
  node.outerHTML = createHeader();
});

document.querySelectorAll("[data-site-footer]").forEach((node) => {
  node.outerHTML = createFooter();
});

const stickyMarkup = createMobileStickyCta();
if (stickyMarkup) {
  document.body.insertAdjacentHTML("beforeend", stickyMarkup);
  document.body.classList.add("has-mobile-sticky");
}

const widgetMarkup = createContactWidget();
if (widgetMarkup) {
  document.body.insertAdjacentHTML("beforeend", widgetMarkup);
}

document.querySelectorAll(".page-hero .focus-panel").forEach((panel) => {
  if (panel.querySelector(".focus-orbit")) {
    return;
  }

  panel.insertAdjacentHTML(
    "beforeend",
    `
      <div class="focus-orbit" aria-hidden="true">
        <div class="focus-orbit-mark">${brandSymbol}</div>
        <div class="focus-orbit-lines">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `
  );
});

const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const navServices = document.querySelector(".nav-services");

const syncHeaderHeight = () => {
  const height = siteHeader ? siteHeader.offsetHeight : 88;
  document.documentElement.style.setProperty("--header-height", `${height}px`);
};

const closeMenu = () => {
  if (!navToggle || !mobileMenu) {
    return;
  }

  navToggle.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  syncHeaderHeight();
};

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open");
    syncHeaderHeight();
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    if (navServices) {
      navServices.open = false;
    }
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (navServices && navServices.open && !navServices.contains(target)) {
    navServices.open = false;
  }

  if (!mobileMenu || !navToggle || !mobileMenu.classList.contains("is-open")) {
    return;
  }

  if (!mobileMenu.contains(target) && !navToggle.contains(target)) {
    closeMenu();
  }
});

const onScroll = () => {
  document.body.classList.toggle("scrolled", window.scrollY > 12);
};

const syncLayout = () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
  syncHeaderHeight();
};

window.addEventListener("resize", syncLayout);
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("load", syncHeaderHeight);

if (document.fonts?.ready) {
  document.fonts.ready.then(syncHeaderHeight);
}

onScroll();
syncHeaderHeight();

const revealItems = [...document.querySelectorAll("[data-reveal]")];

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const horizontalRevealSelector =
    ".signal-card, .partner-feature-card, .case-proof-card, .service-item, .case-article, .contact-card";

  revealItems.forEach((item) => {
    const revealSiblings = [...(item.parentElement?.children || [])].filter((node) =>
      node.hasAttribute("data-reveal")
    );
    const revealIndex = Math.max(revealSiblings.indexOf(item), 0);
    const isHorizontal = item.matches(horizontalRevealSelector);
    const xOffset = isHorizontal ? (revealIndex % 2 === 0 ? -28 : 28) : 0;
    const yOffset = isHorizontal
      ? 16
      : item.matches(".panel, .case-card, .quote-card, .faq-item, .focus-panel")
        ? 34
        : 24;

    item.style.setProperty("--reveal-delay", `${Math.min(revealIndex, 6) * 70}ms`);
    item.style.setProperty("--reveal-x", `${xOffset}px`);
    item.style.setProperty("--reveal-y", `${yOffset}px`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -6% 0px"
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
}

if (finePointer) {
  document.querySelectorAll("[data-glow], .panel, .cta-band, .contact-widget").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const bounds = item.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      item.style.setProperty("--pointer-x", `${x}%`);
      item.style.setProperty("--pointer-y", `${y}%`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--pointer-x", "50%");
      item.style.setProperty("--pointer-y", "50%");
    });
  });
}

const formatWeeks = (min, max) => {
  const plural = (value) => {
    const mod10 = value % 10;
    const mod100 = value % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return "неделя";
    }

    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return "недели";
    }

    return "недель";
  };

  return min === max ? `${min} ${plural(max)}` : `${min}-${max} ${plural(max)}`;
};

const formatPrice = (value) => `от ${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

const estimatorElement = document.querySelector("[data-estimator]");

if (estimatorElement) {
  const estimatorState = {
    project: "landing",
    contour: "site",
    priority: "standard"
  };

  const estimatorConfig = {
    project: {
      landing: {
        label: "Лендинг под услугу",
        price: 140000,
        minWeeks: 4,
        maxWeeks: 5,
        focus: "Чёткая посадочная под лид",
        note: "Подходит, если нужен один сильный сценарий заявки по главной услуге без распыления по лишним экранам.",
        items: [
          "Структура под одну главную услугу и один сценарий обращения.",
          "Сильный первый экран, оффер, доверительные блоки и CTA.",
          "Адаптивная вёрстка, формы и базовая аналитика с первого релиза."
        ]
      },
      multi: {
        label: "Многостраничный сайт",
        price: 220000,
        minWeeks: 6,
        maxWeeks: 8,
        focus: "Система посадочных под рост",
        note: "Нужен, когда у бизнеса несколько услуг, направлений или районов и сайт должен масштабироваться вместе со спросом.",
        items: [
          "Карта посадочных под услуги, географию и сегменты спроса.",
          "Архитектура под SEO-масштабирование и рекламные связки.",
          "Чистый UI, формы и аналитика для дальнейшего роста."
        ]
      },
      redesign: {
        label: "Редизайн / доработка",
        price: 110000,
        minWeeks: 3,
        maxWeeks: 4,
        focus: "Усиление конверсии без старта с нуля",
        note: "Рациональный сценарий, если база уже есть, но текущий сайт не доводит человека до заявки или выглядит слабо.",
        items: [
          "UX-аудит, перепаковка оффера и переработка ключевых экранов.",
          "Чистка мобильной версии, форм и доверительных блоков.",
          "Аккуратный front-end без хаотичной переделки всего проекта."
        ]
      }
    },
    contour: {
      site: {
        label: "Только сайт",
        price: 0,
        weeks: 0,
        focus: "Чистый запуск без лишнего контура",
        note: "Фокус на структуре, подаче и сценариях заявки, без дополнительной настройки канала.",
        items: []
      },
      seo: {
        label: "Сайт + SEO-подготовка",
        price: 45000,
        weeks: 1,
        focus: "Основа под поиск и расширение",
        note: "Сразу закладываем семантику и карту посадочных, чтобы проект не пришлось пересобирать при дальнейшем росте.",
        items: ["Семантика, контентный каркас и карта посадочных под поиск."]
      },
      direct: {
        label: "Сайт + Яндекс Директ",
        price: 55000,
        weeks: 1,
        focus: "Связка посадки и рекламного запуска",
        note: "Подходит, если важно быстрее выйти в трафик и синхронизировать оффер, посадку и аналитику.",
        items: ["Подготовка посадки под рекламные кампании, аналитику и тесты гипотез."]
      },
      full: {
        label: "Полный контур",
        price: 95000,
        weeks: 2,
        focus: "Единая digital-система роста",
        note: "Самый системный сценарий: сайт, SEO-основа и платный трафик проектируются сразу в одной логике.",
        items: ["Одна стратегия для сайта, SEO-подготовки, аналитики и рекламного запуска."]
      }
    },
    priority: {
      standard: {
        label: "Спокойный запуск",
        price: 0,
        weeks: 0,
        note: "Нормальный темп с запасом на согласования, тексты и тесты до релиза."
      },
      fast: {
        label: "Ускоренный выход",
        price: 30000,
        weeks: -1,
        note: "Сокращаем цикл согласований и собираем запуск плотнее, если важно быстрее выйти в рекламу."
      }
    }
  };

  const priceNode = estimatorElement.querySelector("[data-estimate-price]");
  const timeNode = estimatorElement.querySelector("[data-estimate-time]");
  const focusNode = estimatorElement.querySelector("[data-estimate-focus]");
  const noteNode = estimatorElement.querySelector("[data-estimate-note]");
  const listNode = estimatorElement.querySelector("[data-estimate-list]");
  const ctaNode = estimatorElement.querySelector("[data-estimate-cta]");

  const updateEstimator = () => {
    const project = estimatorConfig.project[estimatorState.project];
    const contour = estimatorConfig.contour[estimatorState.contour];
    const priority = estimatorConfig.priority[estimatorState.priority];
    const totalPrice = project.price + contour.price + priority.price;
    const minWeeks = Math.max(2, project.minWeeks + contour.weeks + priority.weeks);
    const maxWeeks = Math.max(minWeeks, project.maxWeeks + contour.weeks + priority.weeks);
    const items = [...project.items, ...contour.items].slice(0, 3);
    const summary = `${project.label}, ${contour.label}, ${priority.label}`;

    if (priceNode) {
      priceNode.textContent = formatPrice(totalPrice);
    }

    if (timeNode) {
      timeNode.textContent = formatWeeks(minWeeks, maxWeeks);
    }

    if (focusNode) {
      focusNode.textContent = contour.focus || project.focus;
    }

    if (noteNode) {
      noteNode.textContent = `${project.note} ${contour.note} ${priority.note}`;
    }

    if (listNode) {
      listNode.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
    }

    if (ctaNode) {
      ctaNode.href = `contacts.html?plan=${encodeURIComponent(summary)}#brief`;
    }
  };

  estimatorElement.querySelectorAll(".estimator-option").forEach((option) => {
    option.addEventListener("click", () => {
      const group = option.closest("[data-estimator-group]");
      if (!group) {
        return;
      }

      const groupName = group.dataset.estimatorGroup;
      estimatorState[groupName] = option.dataset.value;

      group.querySelectorAll(".estimator-option").forEach((groupOption) => {
        const isActive = groupOption === option;
        groupOption.classList.toggle("is-active", isActive);
        groupOption.setAttribute("aria-pressed", String(isActive));
      });

      updateEstimator();
    });
  });

  updateEstimator();
}

document.querySelectorAll("[data-form]").forEach((form) => {
  const savedPlan = new URLSearchParams(window.location.search).get("plan");
  const taskField = form.querySelector('textarea[name="task"]');
  const status = form.querySelector(".form-status");

  if (savedPlan && taskField && !taskField.value) {
    taskField.value = `Интересует сценарий: ${savedPlan}. Нужен персональный план запуска и уточнение по составу работ.`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (status) {
      status.textContent = "Спасибо. Бриф принят — следующий шаг пришлём на почту или в Telegram.";
    }

    form.reset();

    if (savedPlan && taskField) {
      taskField.value = "";
    }
  });
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});
