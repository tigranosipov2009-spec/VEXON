/* ==========================================================
   WEB COMPONENTS — reusable HTML blocks
   ========================================================== */

const TG_URL = 'https://t.me/Tigo_web';
const TG_USER = '@Tigo_web';
const TEL = '+79788970009';
const TEL_FMT = '+7 (978) 897-00-09';
const EMAIL = 'tgrnspv@gmail.com';

/* helper: relative path prefix based on depth */
function rootPath() {
  // pages in /services/ or /legal/ need ../, root pages need ./
  const path = location.pathname;
  if (path.includes('/services/') || path.includes('/legal/')) return '../';
  return './';
}
function sitePath(p) { return rootPath() + p; }

/* ============ <vexon-nav current="..."> ============ */
class VexonNav extends HTMLElement {
  connectedCallback() {
    const current = this.getAttribute('current') || '';
    const logoSrc = sitePath('logo/photo_2_2026-05-21_15-23-50.jpg');
    /* Inline SVG с feColorMatrix:
       JPG используется как источник, фильтр переводит яркость в альфа-канал.
       Чёрный JPG-фон → прозрачный. Белый монограмм → видимый, в цвете var(--ink).
       Работает в любом браузере с SVG (Chrome/FF/Safari/Edge/iOS/Android). */
    const logoSvg = (extraClass) => `
      <svg class="logo-icon${extraClass ? ' ' + extraClass : ''}" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid meet" aria-label="VEXON Studio логотип" role="img">
        <defs>
          <filter id="vex-luma-${extraClass || 'nav'}" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="
              0 0 0 0 0.89
              0 0 0 0 0.89
              0 0 0 0 0.89
              0.299 0.587 0.114 0 0"/>
          </filter>
        </defs>
        <image href="${logoSrc}" width="256" height="256" filter="url(#vex-luma-${extraClass || 'nav'})" preserveAspectRatio="xMidYMid meet"/>
      </svg>`;
    this.innerHTML = `
      <header class="nav" role="banner">
        <div class="nav-inner">
          <a href="/" class="logo" aria-label="VEXON Studio — главная">
            ${logoSvg('')}
            <span class="logo-text">VEXON<span class="logo-sub">STUDIO</span></span>
          </a>
          <nav class="nav-links" aria-label="Главная навигация">
            <div class="nav-item">
              <button class="nav-trigger" aria-haspopup="true" aria-expanded="false">Услуги</button>
              <div class="dropdown" role="menu">
                <div class="dd-col">
                  <div class="dd-head">// разработка</div>
                  <a href="/services/websites" class="${current === 'websites' ? 'current' : ''}">Разработка сайтов<span class="arr">→</span></a>
                  <a href="/services/apps" class="${current === 'apps' ? 'current' : ''}">Разработка приложений<span class="arr">→</span></a>
                  <a href="/services/bots" class="${current === 'bots' ? 'current' : ''}">Telegram-боты и Mini Apps<span class="arr">→</span></a>
                  <a href="/services/ai" class="${current === 'ai' ? 'current' : ''}">ИИ-решения и автоматизация<span class="arr">→</span></a>
                </div>
                <div class="dd-col">
                  <div class="dd-head">// маркетинг и дизайн</div>
                  <a href="/services/ads" class="${current === 'ads' ? 'current' : ''}">Реклама и маркетинг<span class="arr">→</span></a>
                  <a href="/services/seo" class="${current === 'seo' ? 'current' : ''}">SEO и контент-маркетинг<span class="arr">→</span></a>
                  <a href="/services/analytics" class="${current === 'analytics' ? 'current' : ''}">Сквозная аналитика и CRM<span class="arr">→</span></a>
                  <a href="/services/ux" class="${current === 'ux' ? 'current' : ''}">Дизайн интерфейсов (UX/UI)<span class="arr">→</span></a>
                  <a href="/services/branding" class="${current === 'branding' ? 'current' : ''}">Брендинг и айдентика<span class="arr">→</span></a>
                </div>
              </div>
            </div>
            <a href="/#cases">Кейсы</a>
            <a href="/#pricing">Тарифы</a>
            <a href="/#contact">Контакты</a>
          </nav>
          <div class="nav-right">
            <a href="tel:${TEL}" class="nav-phone" aria-label="Позвонить ${TEL_FMT}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>${TEL_FMT}</span>
            </a>
            <a href="/#contact" class="nav-cta nav-cta-desktop">Обсудить проект</a>
            <a href="tel:${TEL}" class="nav-phone-mobile" aria-label="Позвонить ${TEL_FMT}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
            <button class="nav-burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu" type="button">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
          <div class="mobile-menu-inner">
            <div class="mm-section">
              <div class="mm-head">// разработка</div>
              <a href="/services/websites">Разработка сайтов<span class="mm-arr">→</span></a>
              <a href="/services/apps">Разработка приложений<span class="mm-arr">→</span></a>
              <a href="/services/bots">Telegram-боты и Mini Apps<span class="mm-arr">→</span></a>
              <a href="/services/ai">ИИ-решения и автоматизация<span class="mm-arr">→</span></a>
            </div>
            <div class="mm-section">
              <div class="mm-head">// маркетинг и дизайн</div>
              <a href="/services/ads">Реклама и маркетинг<span class="mm-arr">→</span></a>
              <a href="/services/seo">SEO и контент-маркетинг<span class="mm-arr">→</span></a>
              <a href="/services/analytics">Сквозная аналитика и CRM<span class="mm-arr">→</span></a>
              <a href="/services/ux">Дизайн интерфейсов (UX/UI)<span class="mm-arr">→</span></a>
              <a href="/services/branding">Брендинг и айдентика<span class="mm-arr">→</span></a>
            </div>
            <div class="mm-section">
              <div class="mm-head">// навигация</div>
              <a href="/#cases">Кейсы</a>
              <a href="/#pricing">Тарифы</a>
              <a href="/#contact">Контакты</a>
            </div>
            <div class="mm-foot">
              <a href="tel:${TEL}" class="mm-call">${TEL_FMT}</a>
              <a href="${TG_URL}" target="_blank" rel="noopener" class="btn btn-primary mm-tg">Написать в Telegram</a>
            </div>
          </div>
        </div>
      </header>
    `;

    // ===== mobile burger menu =====
    const burger = this.querySelector('.nav-burger');
    const menu = this.querySelector('.mobile-menu');
    const closeMenu = () => {
      burger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    };
    const openMenu = () => {
      burger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      menu.classList.add('open');
      document.body.classList.add('menu-open');
    };
    burger?.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });
    // close on link click (works for hash links + new pages)
    menu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
    // close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu?.classList.contains('open')) closeMenu();
    });
    // close on resize > breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && menu?.classList.contains('open')) closeMenu();
    });

    // desktop dropdown tap toggle for hybrid devices
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) {
      this.querySelectorAll('.nav-trigger').forEach(t => {
        t.addEventListener('click', e => {
          e.preventDefault();
          const item = t.closest('.nav-item');
          item.classList.toggle('open');
          t.setAttribute('aria-expanded', String(item.classList.contains('open')));
        });
      });
    }
  }
}
customElements.define('vexon-nav', VexonNav);

/* ============ <vexon-ticker items="..."> ============ */
class VexonTicker extends HTMLElement {
  connectedCallback() {
    const items = this.getAttribute('items') || 'ROAS: 4.8x|CR: 7.2%|Uptime: 99.9%|NPS: 72';
    const arr = items.split('|').map(s => s.trim());
    const html = arr.map(s => {
      const m = s.match(/^([^:]+):\s*(.+)$/);
      return m ? `<span>${m[1]}: <b>${m[2]}</b></span>` : `<span>${s}</span>`;
    }).join('');
    this.innerHTML = `
      <div class="ticker" aria-hidden="true">
        <div class="ticker-track">${html}${html}${html}</div>
      </div>
    `;
  }
}
customElements.define('vexon-ticker', VexonTicker);

/* ============ <vexon-footer> ============ */
class VexonFooter extends HTMLElement {
  connectedCallback() {
    const logoSrc = sitePath('logo/photo_2_2026-05-21_15-23-50.jpg');
    const logoSvgFoot = `
      <svg class="logo-icon logo-icon-foot" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid meet" aria-label="VEXON Studio логотип" role="img">
        <defs>
          <filter id="vex-luma-foot" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="
              0 0 0 0 0.89
              0 0 0 0 0.89
              0 0 0 0 0.89
              0.299 0.587 0.114 0 0"/>
          </filter>
        </defs>
        <image href="${logoSrc}" width="256" height="256" filter="url(#vex-luma-foot)" preserveAspectRatio="xMidYMid meet"/>
      </svg>`;
    this.innerHTML = `
      <footer role="contentinfo">
        <div class="container">
          <div class="foot-grid">
            <div class="foot-brand">
              <a href="/" class="logo logo-foot" aria-label="VEXON Studio — главная">
                ${logoSvgFoot}
                <span class="logo-text">VEXON<span class="logo-sub">STUDIO</span></span>
              </a>
              <p>Инженерная студия маркетинга и веб-разработки. Делаем продукты, которые приносят выручку.</p>
              <div class="foot-addr">Симферополь · Крым · работаем со всем миром · 24/7</div>
              <div class="foot-online">студия онлайн · отвечаем за час</div>
            </div>
            <div class="foot-col">
              <h5>// Разработка</h5>
              <ul>
                <li><a href="/services/websites">Сайты</a></li>
                <li><a href="/services/apps">Приложения</a></li>
                <li><a href="/services/bots">Telegram-боты</a></li>
                <li><a href="/services/ai">ИИ-решения</a></li>
              </ul>
            </div>
            <div class="foot-col">
              <h5>// Маркетинг и дизайн</h5>
              <ul>
                <li><a href="/services/ads">Реклама</a></li>
                <li><a href="/services/seo">SEO</a></li>
                <li><a href="/services/analytics">Аналитика и CRM</a></li>
                <li><a href="/services/ux">Дизайн интерфейсов</a></li>
                <li><a href="/services/branding">Брендинг</a></li>
              </ul>
            </div>
            <div class="foot-col">
              <h5>// Контакты</h5>
              <ul>
                <li><a href="tel:${TEL}">${TEL_FMT}</a></li>
                <li><a href="${TG_URL}" target="_blank" rel="noopener">Telegram ${TG_USER}</a></li>
                <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
              </ul>
            </div>
            <div class="foot-col">
              <h5>// Документы</h5>
              <ul>
                <li><a href="/legal/privacy">Политика конфиденциальности</a></li>
                <li><a href="/legal/consent">Согласие на обработку</a></li>
                <li><a href="/legal/offer">Договор-оферта</a></li>
              </ul>
            </div>
          </div>
          <div class="foot-bar">
            <span>© 2026 VEXON Studio // Симферополь · Крым</span>
            <span><a href="${TG_URL}" target="_blank" rel="noopener">${TG_USER}</a> · <a href="tel:${TEL}">${TEL_FMT}</a></span>
          </div>
        </div>
      </footer>
    `;
  }
}
customElements.define('vexon-footer', VexonFooter);

/* ============ <vexon-tg> — telegram floater ============ */
class VexonTg extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <a class="tg-floater" href="${TG_URL}" target="_blank" rel="noopener" aria-label="Написать в Telegram">
        <span><span class="acid">&gt;</span> написать в telegram</span>
      </a>
    `;
  }
}
customElements.define('vexon-tg', VexonTg);

/* sticky-bar removed — too intrusive on mobile */

/* ============ <vexon-form service="..."> ============ */
class VexonForm extends HTMLElement {
  connectedCallback() {
    const options = this.getAttribute('options') ||
      'Разработка сайта|Performance-реклама|SEO и контент|Дизайн / UX|Брендинг|Комплексный запуск';
    const opts = options.split('|').map(o => `<option>${o}</option>`).join('');
    this.innerHTML = `
      <form class="form" id="lead-form" novalidate>
        <div class="form-head"><span>// brief.json</span><span><b>● READY</b></span></div>
        <div class="field"><label for="f-name">Имя</label><input id="f-name" name="name" type="text" placeholder="Иван Иванов" required autocomplete="name" /></div>
        <div class="field-grid">
          <div class="field"><label for="f-phone">Телефон</label><input id="f-phone" name="phone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel" inputmode="tel" /></div>
          <div class="field"><label for="f-tg">Telegram</label><input id="f-tg" name="telegram" type="text" placeholder="@username" autocomplete="off" /></div>
        </div>
        <div class="field"><label for="f-service">Что нужно</label><select id="f-service" name="service">${opts}</select></div>
        <div class="field"><label for="f-msg">Коротко о задаче</label><textarea id="f-msg" name="message" rows="3" placeholder="Опишите проект и сроки"></textarea></div>
        <!-- honeypot — невидимое поле, заполняется только ботами -->
        <div class="hp-field" aria-hidden="true">
          <label for="f-website">Не заполнять</label>
          <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off" />
        </div>
        <button type="submit" class="btn btn-primary" id="submit-btn">
          <span class="btn-progress" aria-hidden="true"></span>
          <span class="btn-label">Отправить заявку</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
        <div class="form-foot">// данные не передаются третьим лицам · ответ в течение часа</div>
      </form>
    `;
  }
}
customElements.define('vexon-form', VexonForm);

/* ============ atmosphere layers ============ */
class VexonAtmosphere extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="spotlight" aria-hidden="true"></div>
    `;
  }
}
customElements.define('vexon-atmosphere', VexonAtmosphere);

/* ============ <vexon-cookies> ============ */
class VexonCookies extends HTMLElement {
  connectedCallback() {
    if (localStorage.getItem('vexon-cookies-ok') === '1') return;
    this.innerHTML = `
      <div class="cookies-bar" id="cookies-bar" role="dialog" aria-labelledby="cookies-title">
        <div class="cookies-inner">
          <div class="cookies-text">
            <div id="cookies-title" class="cookies-head"><span class="acid">●</span> Cookies и аналитика</div>
            <div class="cookies-desc">Мы используем cookies и Яндекс Метрику, чтобы понимать как улучшать сайт. Продолжая использование, вы соглашаетесь с <a href="/legal/privacy">политикой конфиденциальности</a> и <a href="/legal/consent">обработкой персональных данных</a>.</div>
          </div>
          <div class="cookies-actions">
            <button class="btn btn-ghost cookies-decline" id="cookies-decline">Только необходимые</button>
            <button class="btn btn-primary cookies-accept" id="cookies-accept">Принять все</button>
          </div>
        </div>
      </div>
    `;
    requestAnimationFrame(() => this.querySelector('.cookies-bar')?.classList.add('show'));
    this.querySelector('#cookies-accept').addEventListener('click', () => {
      localStorage.setItem('vexon-cookies-ok', '1');
      this.querySelector('.cookies-bar').classList.remove('show');
      setTimeout(() => this.remove(), 400);
    });
    this.querySelector('#cookies-decline').addEventListener('click', () => {
      localStorage.setItem('vexon-cookies-ok', 'min');
      this.querySelector('.cookies-bar').classList.remove('show');
      setTimeout(() => this.remove(), 400);
    });
  }
}
customElements.define('vexon-cookies', VexonCookies);

/* boot screen removed — was hurting LCP on mobile */
