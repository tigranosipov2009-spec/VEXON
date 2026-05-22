/* ==========================================================
   MAIN — entry, calc, form, sticky
   No ES modules — uses window.VexonAnims and window.VexonFX
   ========================================================== */
(function () {
  const A = window.VexonAnims || {};
  const FX = window.VexonFX || {};
  const IS_TOUCH = matchMedia('(hover: none)').matches;

  function startSequence() {
    A.initHeroTypewriter && A.initHeroTypewriter();
    A.initTerminalLines && A.initTerminalLines();
    A.initGlitch && A.initGlitch();
    document.querySelectorAll('.hero-trust [data-count], .sub-hero-meta [data-count]')
      .forEach(function (el) { A.animateCount && A.animateCount(el); });
  }

  function initCalc() {
    const list = document.getElementById('calc-list');
    if (!list) return;
    const sumEl = document.getElementById('calc-sum');
    const daysEl = document.getElementById('calc-days');
    const cntEl = document.getElementById('calc-count');
    const inputs = list.querySelectorAll('input[type="checkbox"]');

    // state хранится здесь, чтобы send-form мог получить актуальные значения
    const state = { items: [], sum: 0, days: 0 };

    function recalc() {
      let sum = 0, days = 0;
      const items = [];
      inputs.forEach(function (i) {
        if (i.checked) {
          sum += parseInt(i.dataset.price, 10) || 0;
          days = Math.max(days, parseInt(i.dataset.days, 10) || 0);
          const labelEl = i.parentElement && i.parentElement.querySelector('.check');
          if (labelEl) items.push(labelEl.textContent.trim());
        }
      });
      state.items = items;
      state.sum = sum;
      state.days = days;

      if (cntEl) cntEl.textContent = items.length;
      if (daysEl) daysEl.textContent = days || '—';
      if (sumEl) {
        sumEl.textContent = sum ? sum.toLocaleString('ru-RU') + ' ₽' : '0 ₽';
        sumEl.classList.add('bump');
        setTimeout(function () { sumEl.classList.remove('bump'); }, 280);
      }
    }
    inputs.forEach(function (i) { i.addEventListener('change', recalc); });
    recalc();

    // отправка сметы в TG
    const sendForm = document.getElementById('calc-send-form');
    if (!sendForm) return;
    const foot = document.getElementById('calc-foot');
    sendForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = sendForm.querySelector('#calc-submit');
      const label = btn.querySelector('.btn-label');
      const fd = new FormData(sendForm);
      const name = (fd.get('name') || '').toString().trim();
      const contact = (fd.get('contact') || '').toString().trim();
      const website = (fd.get('website') || '').toString().trim();

      if (!name || !contact) {
        if (foot) { foot.style.color = '#ffb27a'; foot.textContent = '// укажи имя и контакт'; }
        setTimeout(function(){ if (foot) { foot.style.color = ''; foot.textContent = '// смета придёт нам в Telegram, ответим в течение часа'; } }, 2500);
        return;
      }
      if (!state.items.length) {
        if (foot) { foot.style.color = '#ffb27a'; foot.textContent = '// отметь хотя бы одну позицию'; }
        setTimeout(function(){ if (foot) { foot.style.color = ''; foot.textContent = '// смета придёт нам в Telegram, ответим в течение часа'; } }, 2500);
        return;
      }

      // определяем, контакт — телефон или telegram
      const isTg = /^@|t\.me\//i.test(contact);
      const payload = {
        type: 'calc',
        name: name,
        phone: isTg ? '' : contact,
        telegram: isTg ? contact : '',
        items: state.items,
        total: state.sum.toLocaleString('ru-RU'),
        days: state.days,
        website: website,
        page: document.title + ' · #calc',
      };

      btn.disabled = true;
      label.textContent = 'отправка...';

      try {
        await window.VEXON.sendLead(payload);
        label.textContent = '✓ смета отправлена · ответим в течение часа';
        if (window.ym) try { ym(109344122, 'reachGoal', 'calc_submit'); } catch(e) {}
        setTimeout(function () {
          label.textContent = 'Отправить смету в Telegram';
          btn.disabled = false;
          sendForm.reset();
        }, 5000);
      } catch (err) {
        label.textContent = '✗ ошибка · откроем Telegram →';
        setTimeout(function () { window.open('https://t.me/Tigo_web', '_blank'); }, 1200);
        setTimeout(function () {
          label.textContent = 'Отправить смету в Telegram';
          btn.disabled = false;
        }, 4500);
      }
    });
  }

  /* sticky-bar removed */

  /* Прямая отправка в Telegram из браузера. Токен в JS — ОК по требованию владельца. */
  const TG_BOT_TOKEN = '8935719276:AAFm62H8STtlvOG_W02Wejb_EzjGKI8Z27U';
  const TG_CHAT_ID = '5391852952';
  const TG_FALLBACK = 'https://t.me/Tigo_web';

  function buildMessage(p) {
    const lines = [];
    if (p.type === 'calc') lines.push('💰 *НОВАЯ СМЕТА с калькулятора*');
    else lines.push('🔥 *НОВАЯ ЗАЯВКА с сайта*');
    lines.push('');
    if (p.name)     lines.push('👤 *Имя:* ' + p.name);
    if (p.phone)    lines.push('📞 *Телефон:* ' + p.phone);
    if (p.telegram) lines.push('✈️ *Telegram:* ' + p.telegram);
    if (p.email)    lines.push('✉️ *Email:* ' + p.email);
    if (p.service)  lines.push('🎯 *Услуга:* ' + p.service);
    if (p.type === 'calc') {
      if (Array.isArray(p.items) && p.items.length) {
        lines.push(''); lines.push('*Выбрано:*');
        p.items.forEach(function(it){ lines.push('  • ' + it); });
      }
      if (p.total) lines.push('\n💵 *Сумма:* ' + p.total + ' ₽');
      if (p.days)  lines.push('⏱ *Срок:* ' + p.days + ' дней');
    }
    if (p.message) {
      lines.push(''); lines.push('*Задача:*'); lines.push(p.message);
    }
    lines.push('');
    lines.push('🌐 *Источник:* ' + (p.page || document.title));
    lines.push('🔗 ' + location.href);
    return lines.join('\n');
  }

  async function sendLead(payload) {
    // honeypot — тихий успех, не шлём
    if (payload.website) return { ok: true, skipped: true };
    const text = buildMessage(payload);
    const r = await fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });
    if (!r.ok) throw new Error('TG ' + r.status);
    return r.json();
  }

  function initForm() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = this.querySelector('#submit-btn');
      const prog = btn.querySelector('.btn-progress');
      const label = btn.querySelector('.btn-label');
      const svg = btn.querySelector('svg');

      const fd = new FormData(form);
      const payload = {
        type: 'form',
        name: (fd.get('name') || '').toString().trim(),
        phone: (fd.get('phone') || '').toString().trim(),
        telegram: (fd.get('telegram') || '').toString().trim(),
        service: (fd.get('service') || '').toString().trim(),
        message: (fd.get('message') || '').toString().trim(),
        website: (fd.get('website') || '').toString().trim(), // honeypot
        page: document.title + ' · ' + location.pathname,
      };

      // клиентская валидация
      if (!payload.name) {
        label.textContent = '✗ укажи имя';
        setTimeout(function(){ label.textContent = 'Отправить заявку'; }, 2200);
        return;
      }
      if (!payload.phone && !payload.telegram) {
        label.textContent = '✗ нужен телефон или Telegram';
        setTimeout(function(){ label.textContent = 'Отправить заявку'; }, 2500);
        return;
      }

      btn.disabled = true;
      label.textContent = 'отправка...';
      if (prog) prog.style.width = '40%';

      try {
        await sendLead(payload);
        if (prog) prog.style.width = '100%';

        label.textContent = '✓ заявка отправлена · ответим в течение часа';
        if (svg) svg.style.display = 'none';
        if (window.ym) try { ym(109344122, 'reachGoal', 'form_submit'); } catch(e) {}

        setTimeout(function () {
          if (prog) prog.style.width = '0';
          label.textContent = 'Отправить заявку';
          if (svg) svg.style.display = '';
          btn.disabled = false;
          form.reset();
        }, 5000);
      } catch (err) {
        if (prog) prog.style.width = '0';
        label.textContent = '✗ ошибка · напишите в Telegram →';
        btn.style.background = '#ffb27a';
        // редирект на Telegram через 1.5s если сервер недоступен
        setTimeout(function () { window.open(TG_FALLBACK, '_blank'); }, 1500);
        setTimeout(function () {
          label.textContent = 'Отправить заявку';
          btn.style.background = '';
          if (svg) svg.style.display = '';
          btn.disabled = false;
        }, 4500);
      }
    });
  }

  // экспортируем для использования в калькуляторе
  window.VEXON = window.VEXON || {};
  window.VEXON.sendLead = sendLead;

  /* ===== ROI калькулятор окупаемости =====
     Расчёт основан на средних данных клиентских проектов VEXON:
     • Рост трафика (SEO + контекст) за 6 мес: +200%  (фактор 3.0)
     • Рост CR сайта (UX + скорость + лендинги): +60% от базы (с потолком 7%)
     • Закрытие в продажу: без изменений (зависит от sales-команды клиента)
     • Стоимость инвестиции = тариф SCALE 50 000 ₽ (примерный байн-вход)
  */
  function initROI() {
    const form = document.getElementById('roi-form');
    if (!form) return;

    const TRAFFIC_MULTIPLIER = 3.0;   // +200% за 6 мес (SEO + реклама + органика)
    const CR_BOOST = 1.6;             // +60% к текущей CR
    const CR_CAP = 7;                 // не выше 7% (реалистичный потолок)
    const SETUP_COST = 50000;         // средняя стартовая инвестиция (SCALE)

    function fmt(n) {
      n = Math.round(n);
      return n.toLocaleString('ru-RU') + ' ₽';
    }
    function fmtPlain(n) {
      n = Math.round(n);
      return n.toLocaleString('ru-RU');
    }

    function recalc() {
      const traffic = Math.max(0, parseFloat(document.getElementById('roi-traffic').value) || 0);
      const cr = Math.max(0, parseFloat(document.getElementById('roi-cr').value) || 0);
      const aov = Math.max(0, parseFloat(document.getElementById('roi-aov').value) || 0);
      const close = Math.max(0, Math.min(100, parseFloat(document.getElementById('roi-close').value) || 0));

      // Сейчас
      const leadsNow = traffic * (cr / 100);
      const salesNow = leadsNow * (close / 100);
      const revenueNow = salesNow * aov;

      // С VEXON
      const newCR = Math.min(CR_CAP, cr * CR_BOOST);
      const newTraffic = traffic * TRAFFIC_MULTIPLIER;
      const leadsFuture = newTraffic * (newCR / 100);
      const salesFuture = leadsFuture * (close / 100);
      const revenueFuture = salesFuture * aov;

      const delta6mo = (revenueFuture - revenueNow) * 6;
      const multi = revenueNow > 0 ? (revenueFuture / revenueNow) : (revenueFuture > 0 ? 99 : 1);

      // Окупаемость: SETUP_COST / (revenueFuture - revenueNow) → недель
      let paybackText = '—';
      if (revenueFuture > revenueNow && (revenueFuture - revenueNow) > 0) {
        const monthsToPay = SETUP_COST / (revenueFuture - revenueNow);
        if (monthsToPay <= 0.25) paybackText = '1 неделя';
        else if (monthsToPay <= 0.5) paybackText = '2 недели';
        else if (monthsToPay <= 1) paybackText = '3–4 недели';
        else if (monthsToPay < 12) paybackText = Math.ceil(monthsToPay) + ' мес';
        else paybackText = 'свыше года';
      }

      // Update UI
      document.getElementById('roi-now').textContent = fmt(revenueNow);
      document.getElementById('roi-future').textContent = fmt(revenueFuture);
      document.getElementById('roi-now-leads').textContent = fmtPlain(leadsNow);
      document.getElementById('roi-now-sales').textContent = fmtPlain(salesNow);
      document.getElementById('roi-future-leads').textContent = fmtPlain(leadsFuture);
      document.getElementById('roi-future-sales').textContent = fmtPlain(salesFuture);
      document.getElementById('roi-delta-6').textContent = fmt(Math.max(0, delta6mo));
      document.getElementById('roi-payback').textContent = paybackText;
      document.getElementById('roi-multi').textContent = multi >= 10 ? '×' + Math.round(multi) : '×' + multi.toFixed(1);
    }

    // Связываем range и number-input
    function pair(numberId, rangeId) {
      const n = document.getElementById(numberId);
      const r = document.getElementById(rangeId);
      if (!n || !r) return;
      function syncRange() {
        const v = parseFloat(n.value) || 0;
        const max = parseFloat(r.max) || 1;
        const clamped = Math.min(max, Math.max(parseFloat(r.min) || 0, v));
        r.value = clamped;
        const pct = (clamped / max) * 100;
        r.style.setProperty('--p', pct + '%');
      }
      function syncNumber() {
        n.value = r.value;
        const pct = (parseFloat(r.value) / parseFloat(r.max)) * 100;
        r.style.setProperty('--p', pct + '%');
      }
      n.addEventListener('input', function () { syncRange(); recalc(); });
      r.addEventListener('input', function () { syncNumber(); recalc(); });
      syncRange();
    }
    pair('roi-traffic', 'roi-traffic-r');
    pair('roi-cr', 'roi-cr-r');
    pair('roi-aov', 'roi-aov-r');
    pair('roi-close', 'roi-close-r');

    // Quick-pickers
    document.querySelectorAll('.roi-quick button[data-set]').forEach(function (b) {
      b.addEventListener('click', function () {
        const target = document.getElementById(b.dataset.set);
        if (!target) return;
        target.value = b.dataset.val;
        target.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });

    recalc();
  }

  /* Premium chart — анимация рисования при появлении в viewport */
  function initCharts() {
    const charts = document.querySelectorAll('.chart-pro');
    if (!charts.length) return;
    if (!('IntersectionObserver' in window)) {
      charts.forEach(c => c.classList.add('in'));
      return;
    }
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.25 });
    charts.forEach(function (c) { obs.observe(c); });
  }

  /* ====== Промежуточные CTA на страницах услуг ======
     Вставляет компактный CTA после каждой 2-й секции, чтобы путь к заявке
     не терялся при скролле. Только на /services/*. */
  function injectMidCTAs() {
    if (!/\/services\//.test(location.pathname)) return;
    const main = document.querySelector('main');
    if (!main) return;

    // только обычные секции (без sub-hero и финального CTA)
    const sections = Array.from(main.querySelectorAll('section.section'))
      .filter(s => !s.classList.contains('cta-final'));
    if (sections.length < 3) return;

    const variants = [
      {
        eye: 'нужна консультация?',
        title: 'Покажем <span class="acid">похожие кейсы</span> из вашей ниши и назовём точный срок',
        btn: 'Обсудить проект',
      },
      {
        eye: 'хочется ускориться?',
        title: 'Бесплатный аудит за 24 часа — <span class="acid">конкретные шаги роста</span>',
        btn: 'Получить аудит',
      },
      {
        eye: 'остались вопросы?',
        title: 'Ответим в течение часа · <span class="acid">без обязательств</span>',
        btn: 'Написать в Telegram',
      },
    ];

    // Вставляем после 2-й, 4-й секций (макс 2 шт — чтобы не перегружать)
    const insertAfter = [1, 3]; // индексы секций
    let used = 0;
    insertAfter.forEach(function (idx) {
      if (!sections[idx]) return;
      const v = variants[used % variants.length];
      const isTg = used === 2;
      const cta = document.createElement('section');
      cta.className = 'cta-mid';
      cta.setAttribute('aria-label', 'Быстрая связь со студией');
      cta.innerHTML = ''
        + '<div class="container cta-mid-inner">'
        +   '<div class="cta-mid-text">'
        +     '<div class="cta-mid-eyebrow">' + v.eye + '</div>'
        +     '<div class="cta-mid-title">' + v.title + '</div>'
        +   '</div>'
        +   '<div class="cta-mid-actions">'
        +     (isTg
                ? '<a href="https://t.me/Tigo_web" target="_blank" rel="noopener" class="btn btn-primary">' + v.btn + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>'
                : '<a href="#contact" class="btn btn-primary">' + v.btn + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>')
        +     '<a href="tel:+79788970009" class="cta-mid-phone">'
        +       '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
        +       '<span>+7 978 897-00-09</span>'
        +     '</a>'
        +   '</div>'
        + '</div>';
      sections[idx].insertAdjacentElement('afterend', cta);
      used++;
    });
  }

  function bootAll() {
    startSequence();
    A.initReveal && A.initReveal();
    A.initOnViewAnimations && A.initOnViewAnimations();
    A.initProcessLine && A.initProcessLine();
    A.initKickerTypewriter && A.initKickerTypewriter();
    A.initLighthouse && A.initLighthouse();
    // heavy hover-only effects — disabled on touch devices
    if (!IS_TOUCH) {
      FX.initSpotlight && FX.initSpotlight();
      FX.initMagnet && FX.initMagnet();
      FX.initTilt && FX.initTilt();
      FX.initParallax && FX.initParallax();
    }
    FX.initCodeRain && FX.initCodeRain();
    injectMidCTAs();
    initCharts();
    initCalc();
    initROI();
    initForm();
    FX.initPageTransitions && FX.initPageTransitions();

    // auto-add cookies banner if not present
    if (!document.querySelector('vexon-cookies')) {
      document.body.appendChild(document.createElement('vexon-cookies'));
    }

    if (typeof window.VEXON.pageInit === 'function') {
      window.VEXON.pageInit();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(bootAll);
    });
  } else {
    requestAnimationFrame(bootAll);
  }
})();
