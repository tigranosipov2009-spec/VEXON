/* ==========================================================
   ANIMATIONS — reveal, counters, typewriter, sparkline
   No ES modules — exposes on window.VexonAnims
   ========================================================== */
(function () {
  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.count) || 0;
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const fmt = el.dataset.format || '';
    const dur = parseInt(el.dataset.duration || 1200, 10);
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      let s;
      if (fmt === 'thousand') s = Math.round(val).toLocaleString('ru-RU');
      else if (decimals) s = val.toFixed(decimals);
      else s = Math.round(val).toString();
      el.textContent = prefix + s + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function typewriter(el, text, speed, onDone) {
    speed = speed || 90;
    let i = 0;
    function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, speed);
      } else if (onDone) onDone();
    }
    tick();
  }

  function initHeroTypewriter() {
    const tw = document.getElementById('tw');
    if (!tw) return;
    const text = tw.dataset.text || '';
    setTimeout(function () { typewriter(tw, text, 90); }, 200);
  }

  function initTerminalLines() {
    const lines = document.querySelectorAll('#term-body .term-line');
    lines.forEach(function (l, i) { setTimeout(function () { l.classList.add('show'); }, 350 + i * 70); });
  }

  function initGlitch() {
    const h1 = document.querySelector('[data-glitch]');
    if (!h1) return;
    setInterval(function () {
      if (Math.random() > 0.6) {
        h1.classList.add('glitch');
        setTimeout(function () { h1.classList.remove('glitch'); }, 200);
      }
    }, 5000);
  }

  function initReveal() {
    const selector = '.reveal, .reveal-left, .reveal-right, .reveal-zoom, .stagger';
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(selector).forEach(function (el) { el.classList.add('in'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll(selector).forEach(function (el) { io.observe(el); });
  }

  function initOnViewAnimations() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('[data-count]').forEach(animateCount);
        e.target.querySelectorAll('[data-spark] i').forEach(function (b) {
          const h = b.dataset.h || '0';
          b.style.height = h + '%';
        });
        io.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.case, .stat, .deep-case, .sub-hero, .hero, .ux-metric, .source-cell, [data-count-group]')
      .forEach(function (el) { io.observe(el); });
  }

  function initProcessLine() {
    const wrap = document.getElementById('proc-wrap');
    if (!wrap || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { wrap.classList.add('in'); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(wrap);
  }

  function initKickerTypewriter() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.dataset.tw) return;
        el.dataset.tw = '1';
        const full = el.textContent;
        el.textContent = '';
        let i = 0;
        function tick() {
          if (i <= full.length) {
            el.textContent = full.slice(0, i);
            i++;
            setTimeout(tick, 28);
          }
        }
        tick();
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-typew]').forEach(function (el) { io.observe(el); });
  }

  function initLighthouse() {
    const circles = document.querySelectorAll('.lh-circle');
    if (!circles.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    circles.forEach(function (c) { io.observe(c); });
  }

  window.VexonAnims = {
    animateCount: animateCount,
    typewriter: typewriter,
    initHeroTypewriter: initHeroTypewriter,
    initTerminalLines: initTerminalLines,
    initGlitch: initGlitch,
    initReveal: initReveal,
    initOnViewAnimations: initOnViewAnimations,
    initProcessLine: initProcessLine,
    initKickerTypewriter: initKickerTypewriter,
    initLighthouse: initLighthouse
  };
})();
