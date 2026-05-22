/* ==========================================================
   EFFECTS — cursor, magnet, tilt, parallax, rain
   No ES modules — exposes on window.VexonFX
   ========================================================== */
(function () {
  function initSpotlight() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    document.addEventListener('pointermove', function (e) {
      if (!raf) raf = requestAnimationFrame(function () {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mx', x + '%');
        document.documentElement.style.setProperty('--my', y + '%');
        raf = 0;
      });
    });
  }

  function initCursorFollow() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follow';
    document.body.appendChild(cursor);

    let x = innerWidth / 2, y = innerHeight / 2;
    let tx = x, ty = y;
    document.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; });

    function loop() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      cursor.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)';
      requestAnimationFrame(loop);
    }
    loop();

    const sel = 'a, button, input, textarea, select, label, .calc-item, .service, .case, .testi, .plan, .step, .deliv-item, .nav-trigger, .browser-tabs button, .brandkit-tab, .transform-handle';
    document.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener('pointerenter', function () { cursor.classList.add('hover'); });
      el.addEventListener('pointerleave', function () { cursor.classList.remove('hover'); });
    });
    document.addEventListener('pointerdown', function () { cursor.classList.add('click'); });
    document.addEventListener('pointerup', function () { cursor.classList.remove('click'); });
  }

  function initMagnet() {
    const els = document.querySelectorAll('[data-magnet]');
    if (!els.length || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    els.forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.2;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.2;
        el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  function initTilt() {
    const els = document.querySelectorAll('[data-tilt]');
    if (!els.length || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    els.forEach(function (el) {
      el.classList.add('tilt');
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const max = parseFloat(el.dataset.tilt) || 8;
        el.style.transform = 'perspective(800px) rotateX(' + (-py * max) + 'deg) rotateY(' + (px * max) + 'deg) translateZ(0)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  function initParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    function update() {
      const sc = window.scrollY;
      els.forEach(function (el) {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = 'translate3d(0, ' + (sc * speed * -1) + 'px, 0)';
      });
      raf = 0;
    }
    window.addEventListener('scroll', function () {
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function initCodeRain() {
    const rain = document.getElementById('rain');
    if (!rain) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const chars = '01{}[]<>/$_@*+-=;:.,?!|&%#~^';
    const cols = 5;
    for (let c = 0; c < cols; c++) {
      const s = document.createElement('span');
      let txt = '';
      for (let i = 0; i < 80; i++) txt += chars[(Math.random() * chars.length) | 0] + '\n';
      s.textContent = txt;
      s.style.left = (10 + Math.random() * 80) + '%';
      s.style.animationDuration = (16 + Math.random() * 12) + 's';
      s.style.animationDelay = (-Math.random() * 16) + 's';
      rain.appendChild(s);
    }
  }

  function initPageTransitions() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const overlay = document.createElement('div');
    overlay.className = 'page-overlay';
    document.body.appendChild(overlay);

    overlay.classList.add('in');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.classList.remove('in'); });
    });

    document.addEventListener('click', function (e) {
      const a = e.target.closest && e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      if (a.target === '_blank') return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      // pure anchor like #cases — let browser scroll smoothly
      if (href.startsWith('#')) return;

      // path with hash — if path matches current, smooth-scroll instead of reload
      if (href.indexOf('#') !== -1) {
        try {
          const url = new URL(href, location.href);
          if (url.pathname === location.pathname) {
            e.preventDefault();
            const t = url.hash ? document.querySelector(url.hash) : null;
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else if (url.hash) location.hash = url.hash;
            return;
          }
        } catch (err) { /* fallthrough */ }
      }

      // different page — transition overlay + navigate
      e.preventDefault();
      overlay.classList.add('in');
      setTimeout(function () { window.location.href = href; }, 320);
    });
  }

  window.VexonFX = {
    initSpotlight: initSpotlight,
    initCursorFollow: initCursorFollow,
    initMagnet: initMagnet,
    initTilt: initTilt,
    initParallax: initParallax,
    initCodeRain: initCodeRain,
    initPageTransitions: initPageTransitions
  };
})();
