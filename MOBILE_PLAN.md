# VEXON Studio — План адаптации к мобильным
**Цель:** идеальная мобильная версия для CWV / Mobile-First индексации Яндекса и Google · Mobile Lighthouse 95+ · CR на мобиле = CR на десктопе.

> Контекст: 70%+ трафика приходит с мобильных. Яндекс и Google ранжируют по mobile-first индексу. Сайт с плохой мобильной версией не выйдет в ТОП-1, даже если контент идеален.

---

## 0. Диагностика — что сломано сейчас

### 🔴 Критично (ломает UX на мобиле)

| # | Проблема | Где | Эффект |
|---|---|---|---|
| 1 | **Нет бургер-меню** | `layout.css:175` — `.nav-links { display: none }` при <860px | На мобиле невозможно попасть на страницы услуг, кейсы, тарифы — только через прокрутку и CTA |
| 2 | **Hover-only dropdown** | `vexon-nav` | На тачах ссылки в меню недоступны (toggle есть, но кнопки скрыты) |
| 3 | **Terminal-блок в hero** | `index.html:95-124` | Огромный кодовый блок на мобиле выглядит как стена — занимает 70% первого экрана, бьёт по CR |
| 4 | **Boot-экран на каждой загрузке** | `vexon-boot` | На мобиле = +0.5–1.5s к LCP, ухудшает CWV. Должен быть только при первой загрузке (cookies/sessionStorage) |
| 5 | **Touch targets < 44px** | калькулятор, чекбоксы, ссылки в футере | Apple/Google требуют 44×44px минимум — иначе минус в Lighthouse и реальные мисклики |
| 6 | **Input font-size < 16px** | формы | iOS делает zoom при фокусе — UX-катастрофа |
| 7 | **Tilt-эффекты на тач-устройствах** | `data-tilt`, `data-magnet` | Дёрганые акселерометр-эффекты, тратят CPU |
| 8 | **Spotlight выключен правильно**, но grain/scanline остаются | `base.css` | На слабых Android тратят GPU без пользы |
| 9 | **Шрифты грузятся блокирующе** | `<link>` Google Fonts в `<head>` | +200–500ms к FCP на 3G |
| 10 | **Нет mobile-specific OG-image** | OG = JPG | На Telegram/iMessage картинка кропается |

### 🟡 Важно (ухудшает CWV/CR)

| # | Проблема | Эффект |
|---|---|---|
| 11 | Container gutter 20px на <768px | Текст почти впритык к краю, не дотягиваем до 16px на узких |
| 12 | Footer 5→3→2→1 колонка — слишком резкие переходы | На 481–700px колонки сжимаются и режут текст |
| 13 | `h-xl` использует `clamp(40px, 7vw, 88px)` — на iPhone SE H1 = 40px | Хорошо, но `7vw` на 360px даёт ~25px, clamp работает корректно ✅ — но `letter-spacing: -0.04em` режет восприятие |
| 14 | Калькулятор на узких экранах — checkbox 16×16, метка справа | Сложно попасть пальцем, перепутывается тап на price/check |
| 15 | Hero-trust блок (4 пункта в строку) | Переносится 2×2 ок, но gap 24px — слишком плотно |
| 16 | Process-grid `repeat(4,1fr)` → 2 кол при 1024 → 1 кол при 600 | На 700px (тираж планшетов) — 2 кол норм, но текст плотный |
| 17 | Cases — `case-wide` ломается, нет mobile-варианта | Стат-блоки могут расползтись |
| 18 | Sticky-bar (`vexon-sticky`) на мобиле — `.sticky-text` скрыт <640px | Остаётся только кнопка — ОК, но `vexon-tg` и `sticky-bar` могут наложиться |
| 19 | Cookies-bar — занимает много места внизу | На iPhone SE при открытой клавиатуре блокирует кнопку отправки формы |
| 20 | Нет dynamic viewport units (`dvh`, `svh`, `lvh`) | Hero `100vh` на iOS обрезается под нижней панелью Safari |
| 21 | Нет safe-area для iPhone notch | Контент под "чёлкой" на iPhone 14+ Pro в горизонтальном режиме |
| 22 | `theme-color: #121414` — есть ✅, но нет `media (prefers-color-scheme: dark)` варианта |
| 23 | Нет skeleton/placeholder при медленной сети | Белый/чёрный flash перед загрузкой компонентов |
| 24 | Webvisor Яндекса жирный | На 3G/4G замедляет — нужно подгружать асинхронно |

### 🟢 Минор (косметика)

- Кнопки `btn` не имеют `min-height: 48px` — добавить
- Лого SVG жёстко 32px — на маленьких можно 28px
- В калькуляторе `id="calc-sum"` крупный — на 320px может вылезать
- В `vexon-form` `field-grid` ломается на 2 колонки <500px — нужно проверить

---

## 1. Брейкпоинты — стратегия

> Текущая система использует разные брейки (480, 600, 640, 700, 740, 760, 768, 860, 900, 1024, 1100, 1200). **Нужна унификация.**

### 1.1 Новая система — 5 брейкпоинтов

```css
/* tokens.css — добавить */
:root {
  --bp-xs: 360px;   /* малые телефоны (iPhone SE, mini)        */
  --bp-sm: 480px;   /* большие телефоны (iPhone Pro Max, Galaxy)*/
  --bp-md: 768px;   /* планшеты, портретный режим              */
  --bp-lg: 1024px;  /* планшеты ландшафт, маленькие ноуты      */
  --bp-xl: 1280px;  /* десктопы                                 */
}
```

### 1.2 Container — прогрессивный gutter

```css
:root { --gutter: 64px; }
@media (max-width: 1280px) { :root { --gutter: 48px; } }
@media (max-width: 1024px) { :root { --gutter: 32px; } }
@media (max-width: 768px)  { :root { --gutter: 20px; } }
@media (max-width: 480px)  { :root { --gutter: 16px; } }
@media (max-width: 360px)  { :root { --gutter: 12px; } }
```

### 1.3 Принципы

- **Mobile-first медиа-запросы НЕ нужны** (всё уже написано desktop-first, переписывать большой объём) — оставляем `max-width`
- **Унифицировать 5 точек:** 480 / 768 / 1024 / 1280 (плюс 360 для самых узких)
- **Никаких "магических" чисел** типа 740, 860, 900 — выбираем ближайший брейк
- **Тестировать на:** iPhone SE (375×667), iPhone 14 (390×844), Galaxy S23 (360×780), iPad Mini (768×1024)

---

## 2. Типографика — fluid + читабельность

### 2.1 Текущее состояние

```css
.h-xl  { font-size: clamp(40px, 7vw, 88px); }   /* OK, но шрифт слишком плотный на мобиле */
.h-lg  { font-size: clamp(28px, 3.4vw, 44px); } /* OK */
.h-md  { font-size: clamp(18px, 1.8vw, 22px); } /* OK */
body   { font-size: 16px; }                     /* ❌ нужно 17–18px для мобайл-чтения */
.body-lg { font-size: 15px; }                   /* ❌ слишком мало для мобильного абзаца */
```

### 2.2 Что менять

```css
/* tokens.css или base.css */
body { font-size: 16px; line-height: 1.6; }
@media (max-width: 768px) {
  body { font-size: 17px; line-height: 1.65; }
}

.h-xl {
  font-size: clamp(36px, 9vw, 88px);
  line-height: 1.05;
  letter-spacing: -0.03em;            /* мягче на мобиле */
}
.h-lg {
  font-size: clamp(26px, 5.5vw, 44px);
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.body-lg { font-size: 16px; line-height: 1.6; }
@media (max-width: 768px) {
  .body-lg { font-size: 16px; }
  .body-md { font-size: 15px; }
}

/* hero-sub слишком большой на мобиле */
.hero-sub { font-size: 17px; }
@media (max-width: 480px) { .hero-sub { font-size: 16px; line-height: 1.55; } }
```

### 2.3 Доп. правила

- **Никогда меньше 14px** для текста на мобиле (Яндекс/Google пометят как issue)
- **Кнопки/формы — `font-size: 16px` минимум** (защита от iOS zoom)
- **Mono-шрифт** в hero `.term-line` уменьшить до 11px на мобиле (сейчас может вылезать)
- **Line-height** на мобиле — 1.55–1.7 для основного текста

---

## 3. Навигация — полноценное бургер-меню

> **САМОЕ КРИТИЧНОЕ.** Сейчас на мобиле сайт неюзабелен — пользователь не может попасть на услуги.

### 3.1 Что делаем

В `vexon-nav` добавить мобильный режим:

```html
<button class="nav-burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu">
  <span></span><span></span><span></span>
</button>

<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="mobile-menu-inner">
    <div class="mm-section">
      <div class="mm-head">// разработка</div>
      <a href="/services/websites">Разработка сайтов <span class="arr">→</span></a>
      <a href="/services/apps">Разработка приложений <span class="arr">→</span></a>
      <a href="/services/bots">Telegram-боты и Mini Apps <span class="arr">→</span></a>
      <a href="/services/ai">ИИ-решения и автоматизация <span class="arr">→</span></a>
    </div>
    <div class="mm-section">
      <div class="mm-head">// маркетинг и дизайн</div>
      <a href="/services/ads">Реклама и маркетинг <span class="arr">→</span></a>
      <a href="/services/seo">SEO и контент-маркетинг <span class="arr">→</span></a>
      <a href="/services/analytics">Сквозная аналитика и CRM <span class="arr">→</span></a>
      <a href="/services/ux">Дизайн интерфейсов <span class="arr">→</span></a>
      <a href="/services/branding">Брендинг и айдентика <span class="arr">→</span></a>
    </div>
    <div class="mm-section">
      <div class="mm-head">// навигация</div>
      <a href="/#cases">Кейсы</a>
      <a href="/#pricing">Тарифы</a>
      <a href="/#contact">Контакты</a>
    </div>
    <div class="mm-foot">
      <a href="tel:+79788970009" class="mm-call">+7 (978) 897-00-09</a>
      <a href="https://t.me/Tigo_web" target="_blank" rel="noopener" class="btn btn-primary">Написать в Telegram</a>
    </div>
  </div>
</div>
```

### 3.2 CSS (skeleton)

```css
.nav-burger {
  display: none;
  width: 44px; height: 44px;
  position: relative;
  border: 1px solid var(--line);
  background: var(--surface);
}
.nav-burger span {
  position: absolute; left: 12px; right: 12px; height: 2px;
  background: var(--ink); transition: transform .25s var(--ease), opacity .25s var(--ease);
}
.nav-burger span:nth-child(1) { top: 14px; }
.nav-burger span:nth-child(2) { top: 21px; }
.nav-burger span:nth-child(3) { top: 28px; }
.nav-burger[aria-expanded="true"] span:nth-child(1) { top: 21px; transform: rotate(45deg); }
.nav-burger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.nav-burger[aria-expanded="true"] span:nth-child(3) { top: 21px; transform: rotate(-45deg); }

@media (max-width: 860px) { .nav-burger { display: block; } }

.mobile-menu {
  position: fixed;
  inset: 60px 0 0 0;                  /* под навбаром */
  background: var(--bg);
  z-index: 49;
  overflow-y: auto;
  overscroll-behavior: contain;        /* не скроллить body под меню */
  transform: translateX(100%);
  transition: transform .35s var(--ease);
  padding-bottom: env(safe-area-inset-bottom);
  visibility: hidden;
}
.mobile-menu.open {
  transform: translateX(0);
  visibility: visible;
}
body.menu-open { overflow: hidden; }   /* блок скролла страницы */

.mobile-menu-inner { padding: 24px 20px 40px; }
.mm-section + .mm-section { margin-top: 28px; }
.mm-head {
  font-family: var(--mono); font-size: 11px; color: var(--acid);
  letter-spacing: .08em; text-transform: uppercase; margin-bottom: 8px;
  padding-bottom: 8px; border-bottom: 1px solid var(--line);
}
.mobile-menu a {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 52px;                    /* тач-таргет */
  font-family: var(--mono); font-size: 14px; font-weight: 500;
  color: var(--ink-2); letter-spacing: .04em;
  border-bottom: 1px solid var(--line);
  padding: 0 4px;
}
.mobile-menu a:active { background: var(--surface); color: var(--acid); }
.mm-foot { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
.mm-call {
  display: flex; align-items: center; justify-content: center;
  min-height: 52px; border: 1px solid var(--line);
  font-family: var(--mono); font-size: 14px; color: var(--ink); letter-spacing: .04em;
}
```

### 3.3 JS

```js
// в vexon-nav connectedCallback:
const burger = this.querySelector('.nav-burger');
const menu = this.querySelector('.mobile-menu');
burger?.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  menu.setAttribute('aria-hidden', String(open));
  menu.classList.toggle('open');
  document.body.classList.toggle('menu-open');
});
// закрывать при клике по ссылке (для якорей на той же странице)
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
}));
// закрывать по Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu?.classList.contains('open')) burger.click();
});
```

### 3.4 Логика отображения

- **Desktop ≥ 860px:** показываем `.nav-links` (как сейчас) + скрываем бургер
- **Mobile < 860px:** скрываем `.nav-links` + показываем бургер + по тапу выезжает `.mobile-menu`
- **Дополнительно:** при свайпе вправо на меню — закрывать (UX-плюс)
- **A11y:** `aria-expanded`, `aria-hidden`, `aria-controls`, фокус-trap внутри меню, Escape для закрытия

---

## 4. Hero & Sub-hero — мобильная адаптация

### 4.1 Terminal-блок в hero — критичная переработка

Сейчас на мобиле terminal стопится под текстом и занимает огромную площадь. Варианты:

**Вариант A (рекомендую):** Полностью скрыть terminal на <768px

```css
@media (max-width: 768px) { .hero .terminal { display: none; } }
```

**Вариант B:** Сжать terminal до компактного блока

```css
@media (max-width: 768px) {
  .terminal { font-size: 10px; }
  .term-body { padding: 12px; max-height: 240px; overflow: hidden; }
  .term-line { line-height: 1.4; }
}
```

**Вариант C:** Заменить на горизонтальный карусель-блок с метриками (ROAS, CR, NPS)

Рекомендую **A** — это снимает 30–50% высоты первого экрана, поднимает CTA выше fold.

### 4.2 Sub-hero (страницы услуг)

В `sub-hero` правый блок `.spec` (Mac-window terminal) на мобиле тоже забирает много места.

```css
@media (max-width: 1024px) { .sub-hero .spec { margin-top: 16px; } }
@media (max-width: 480px) { .sub-hero .spec-body { padding: 16px; gap: 12px; } }
```

Альтернатива: убрать spec-блок на <480px:

```css
@media (max-width: 480px) { .sub-hero .spec { display: none; } }
```

### 4.3 Hero meta / trust

```css
@media (max-width: 480px) {
  .hero-meta { font-size: 10px; gap: 10px; }
  .hero-trust { gap: 12px; font-size: 11px; flex-direction: column; }
  .hero-actions { width: 100%; }
  .hero-actions .btn { flex: 1; justify-content: center; min-height: 48px; }
}
```

### 4.4 Высота первого экрана — `100dvh`

```css
.hero { min-height: 100svh; }           /* small viewport — без bottom-bar Safari */
@supports (height: 100dvh) {
  .hero { min-height: 100dvh; }         /* dynamic — подстраивается */
}
```

### 4.5 Safe area для notch

```css
.nav-inner {
  padding-left: max(var(--gutter), env(safe-area-inset-left));
  padding-right: max(var(--gutter), env(safe-area-inset-right));
}
body { padding-bottom: env(safe-area-inset-bottom); }
.tg-floater { right: max(12px, env(safe-area-inset-right)); }
```

---

## 5. Touch targets — обязательные размеры

> WCAG: 44×44px. Material: 48×48px. iOS HIG: 44×44pt. **Целимся в 48px.**

### 5.1 Глобальное правило для кнопок и ссылок

```css
/* base.css дополнить */
.btn, button, [role="button"] {
  min-height: 48px;
  min-width: 48px;
  padding: 12px 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* увеличиваем "клик-зону" вокруг небольших иконок */
.tg-floater, .sticky-close, .nav-burger {
  min-height: 44px;
  min-width: 44px;
}

/* dropdown a — уже норм через padding 13px 18px, но проверить */
.dropdown a, .mobile-menu a { min-height: 48px; }

/* footer ссылки — узкие, нужно расширить */
.foot-col a {
  display: inline-flex;
  align-items: center;
  padding: 6px 0;
  min-height: 32px;     /* в футере допустимо 32px т.к. они в списке */
}
```

### 5.2 Калькулятор — переделать чекбоксы

```css
.calc-item {
  min-height: 56px;
  padding: 14px;
  border: 1px solid var(--line);
  margin-bottom: 8px;
  align-items: center;
  cursor: pointer;
  position: relative;
}
.calc-item input[type="checkbox"] {
  width: 22px; height: 22px;
  accent-color: var(--acid);
  flex-shrink: 0;
}
@media (max-width: 480px) {
  .calc-item { flex-wrap: wrap; }
  .calc-item .price { width: 100%; margin-top: 4px; color: var(--acid); font-weight: 700; }
}
```

### 5.3 Формы

```css
input, select, textarea {
  font-size: 16px;          /* запрет zoom на iOS */
  min-height: 48px;
  padding: 12px 14px;
}
textarea { min-height: 100px; }

@media (max-width: 480px) {
  .field-grid { grid-template-columns: 1fr !important; gap: 12px; }
}
```

---

## 6. Производительность — Core Web Vitals на 4G

> Цель: LCP < 2.5s, INP < 200ms, CLS < 0.1 на эмулированном Slow 4G.

### 6.1 Шрифты — устранить FOIT/FOUT блокировку

```html
<!-- Сейчас -->
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

<!-- Заменить на: -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" media="print" onload="this.media='all'"
      href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap"></noscript>
```

Лучший вариант: **self-host шрифты** в `/assets/fonts/` (woff2), это убирает зависимость от Google и даёт +20–40 баллов в Lighthouse.

```css
@font-face {
  font-family: 'Geist';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/assets/fonts/geist-variable.woff2') format('woff2-variations');
}
```

### 6.2 Critical CSS

- Вынести стили **первого экрана** (~5–10 КБ) в `<style>` инлайном в `<head>`
- Остальной CSS — `media="print" onload="this.media='all'"` или загружать через `requestIdleCallback`
- Сейчас 5 CSS файлов = 5 запросов → объединить в 1 `bundle.css` через minify

### 6.3 Скрипты — defer и async

```html
<!-- сейчас -->
<script src="./assets/js/components.js" defer></script>
<script src="./assets/js/animations.js" defer></script>
<script src="./assets/js/effects.js" defer></script>
<script src="./assets/js/main.js" defer></script>

<!-- лучше: -->
<script type="module" src="/assets/js/bundle.min.js"></script>
<!-- ES modules грузятся defer по умолчанию + одним HTTP/2 multiplex'ом -->
```

**Webvisor Яндекса** — самая тяжёлая часть (200–400 КБ JS). Можно:

```js
// загружать с задержкой 2s или по первому скроллу
window.addEventListener('load', () => {
  setTimeout(loadMetrika, 1500);
});
```

### 6.4 Изображения

- Все JPG/PNG → **WebP** (или AVIF, но Safari старые версии)
- Favicon JPG → PNG/SVG
- OG-image оптимизировать через [squoosh.app](https://squoosh.app): целевой вес < 200 КБ
- Hero/кейсовые скриншоты — `<picture>` с разными размерами:

```html
<picture>
  <source srcset="case-apaga-480.webp 480w, case-apaga-960.webp 960w" type="image/webp">
  <img src="case-apaga-960.jpg" alt="..." loading="lazy" width="960" height="540" decoding="async">
</picture>
```

- **`width` + `height` на ВСЕ картинки** — иначе CLS

### 6.5 Анимации — отключить на слабых

```css
/* base.css */
@media (prefers-reduced-motion: reduce),
       (max-width: 768px) and (max-resolution: 2dppx) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  body::before, body::after, .scanline, .grain { display: none; }
}
```

### 6.6 Tilt / Magnet эффекты — отключить на тач

```js
// в effects.js
const isTouch = matchMedia('(hover: none)').matches;
if (!isTouch) {
  // навешиваем tilt и magnet
}
```

### 6.7 Boot screen — показывать раз за сессию

```js
class VexonBoot extends HTMLElement {
  connectedCallback() {
    if (sessionStorage.getItem('vexon-booted')) {
      this.style.display = 'none';
      return;
    }
    sessionStorage.setItem('vexon-booted', '1');
    // ...рендер boot
  }
}
```

### 6.8 Lazy load всего, что ниже first screen

```html
<img loading="lazy" decoding="async" ... >
<iframe loading="lazy" ... >
```

---

## 7. Footer и Cookies bar

### 7.1 Footer

```css
.foot-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr;
  gap: 28px;
}
@media (max-width: 1024px) { .foot-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px)  { .foot-grid { grid-template-columns: 1fr; gap: 24px; } }

@media (max-width: 480px) {
  .foot-brand { text-align: left; }
  .foot-bar { flex-direction: column; align-items: flex-start; gap: 8px; }
}
```

### 7.2 Cookies bar

```css
.cookies-bar {
  bottom: max(12px, env(safe-area-inset-bottom));
  left: 12px; right: 12px;
}
@media (max-width: 480px) {
  .cookies-bar { padding: 14px; font-size: 12px; }
  .cookies-actions { flex-direction: column; gap: 8px; }
  .cookies-actions .btn { width: 100%; min-height: 44px; }
}
```

### 7.3 Telegram floater — не должен закрывать форму

```css
@media (max-width: 480px) {
  .tg-floater {
    bottom: max(80px, env(safe-area-inset-bottom));  /* выше cookies bar */
  }
  body.cookies-hidden .tg-floater { bottom: max(12px, env(safe-area-inset-bottom)); }
}
```

---

## 8. PWA / Web App — бонус для мобильных

> Установка на главный экран = +30% возвратов с мобилы. Простая в реализации.

### 8.1 manifest.webmanifest

```json
{
  "name": "VEXON Studio",
  "short_name": "VEXON",
  "description": "Веб-студия в Симферополе: сайты, реклама, ИИ",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#121414",
  "theme_color": "#121414",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/logo/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/logo/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/logo/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

В `<head>`:

```html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="VEXON">
```

### 8.2 Service Worker (опционально)

Простой SW для кеширования критики и оффлайн-страницы. Можно делать вторым этапом.

---

## 9. iOS / Android quirks

### 9.1 iOS Safari

- ❗ **100vh** не считает bottom toolbar → используй `100dvh` / `100svh`
- ❗ **`input` zoom при font-size < 16px** → ставим 16px
- ❗ **Hover-эффекты "залипают"** после тапа → оборачивай в `@media (hover: hover)`
- ❗ **Position: sticky** иногда лагает на iOS < 16 → проверить nav
- ❗ **`backdrop-filter`** требует `-webkit-` префикс ✅ (у тебя есть)
- ❗ **`overscroll-behavior: contain`** на open menu — иначе body скроллит за меню
- ❗ Tap delay 300ms — убирается через `touch-action: manipulation` на интерактивных

### 9.2 Android Chrome

- ❗ **Theme-color** есть ✅
- ❗ **Address bar dynamic** — лечится `100dvh`
- ❗ Для Samsung Internet — тестировать отдельно (40%+ Android в РФ)

### 9.3 Универсально

```css
html {
  -webkit-text-size-adjust: 100%;       /* запрет ресайза текста при rotate */
  text-size-adjust: 100%;
}
input, textarea, button, a {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
img { image-rendering: -webkit-optimize-contrast; }
```

---

## 10. Тестирование — чек-лист

### 10.1 Реальные устройства / эмуляция

- [ ] **iPhone SE (375×667)** — самый узкий из актуальных
- [ ] **iPhone 14/15 (390×844)** — средний
- [ ] **iPhone 14/15 Pro Max (430×932)** — большой
- [ ] **Galaxy S23 / S24 (360×780)**
- [ ] **iPad Mini (768×1024)** портрет
- [ ] **iPad Pro (1024×1366)** портрет
- [ ] **Pixel 7** (412×915)

### 10.2 Инструменты

- **Chrome DevTools** → Device toolbar + Lighthouse Mobile + Throttling Slow 4G
- **PageSpeed Insights** — раздел Mobile
- **Yandex Mobile-Friendly Test** — webmaster.yandex.ru/tools/mobile-friendly
- **Google Mobile-Friendly Test** — search.google.com/test/mobile-friendly
- **Webpagetest.org** Cable + 4G + LTE
- **BrowserStack** для реальных устройств (бесплатно есть 1 минута триал)

### 10.3 Целевые метрики Lighthouse Mobile

| Метрика | Цель |
|---|---|
| Performance | 95+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 100 |
| LCP | < 2.0s |
| INP | < 150ms |
| CLS | < 0.05 |
| FCP | < 1.5s |
| TBT | < 200ms |

---

## 11. Дорожная карта

### 🔴 Спринт 1 — Критика (Неделя 1)

- [ ] Бургер-меню в `vexon-nav` + полноэкранное мобильное меню
- [ ] Hero terminal — спрятать на <768px
- [ ] Boot screen — только раз за сессию
- [ ] Touch targets ≥ 48px везде (btn, nav, calc-item, foot-col a)
- [ ] Input font-size 16px (запрет iOS zoom)
- [ ] Container gutter — прогрессивная шкала 64/48/32/20/16
- [ ] Унифицировать брейкпоинты до 5 точек

### 🟡 Спринт 2 — Производительность (Неделя 2)

- [ ] Self-host Geist + JetBrains Mono в `/assets/fonts/`
- [ ] Critical CSS инлайн
- [ ] Минификация и бандлинг CSS/JS
- [ ] WebP + `width/height` на всех картинках
- [ ] Lazy load всего ниже first screen
- [ ] Webvisor — отложенная загрузка
- [ ] Отключить tilt/magnet на тач
- [ ] `prefers-reduced-motion` + low-end mobile

### 🟢 Спринт 3 — UX-полировка (Неделя 3)

- [ ] 100dvh / 100svh в hero
- [ ] Safe-area для iPhone notch
- [ ] Калькулятор — переработка чекбоксов
- [ ] Cookies bar и tg-floater без конфликтов
- [ ] Sticky-bar на мобиле
- [ ] Footer 1024/480 брейки
- [ ] Forms: одна колонка на 480, focus-стили

### 🔵 Спринт 4 — PWA и доводка (Неделя 4)

- [ ] manifest.webmanifest + иконки
- [ ] apple-touch-icon-180.png + maskable-512.png
- [ ] Тест на 7 устройствах из чек-листа
- [ ] Lighthouse Mobile 95+ во всех категориях
- [ ] Yandex Mobile-Friendly Test pass
- [ ] (опц) Service Worker для оффлайн

---

## 12. Что НУЖНО ОТ ТЕБЯ

### 📌 Информация

1. **Реальные устройства для тестов** — какой у тебя iPhone/Android? На каких клиенты чаще заходят (из Метрики)?
2. **Скриншоты текущих проблем** — что лично бесит на мобиле? Покажи 2–3 экрана из своего телефона.
3. **Метрика → Технологии → Устройства** — скинь топ-5 моделей пользователей и долю iOS/Android. Это меняет приоритеты.
4. **Аналитика отказов на мобиле** — где люди уходят (через Webvisor). Это часто = место поломки UX.

### 📌 Дизайн / контент

5. **Логотип в SVG** (не JPG) — для favicon, иконок PWA, лого в шапке. Сейчас в `vexon-nav.js` лого уже SVG ✅, но в `link rel="icon"` JPG.
6. **Иконки для PWA** — нужен квадратный логотип 512×512 PNG + maskable 512×512 (с safe-area отступом).
7. **OG-image** — оптимизированный 1200×630 JPG/WebP < 200 КБ.
8. **Bottom-bar контент** — если делаем sticky-bar внизу на мобиле, что в нём писать? «Обсудить проект»? Или вариант с тремя иконками: Telegram / Звонок / Форма?

### 📌 Технически

9. **Доступ к хостингу/Cloudflare** — для self-host шрифтов, gzip/brotli, HTTP/2.
10. **Согласие на минификацию + сборку** — текущая структура (5 CSS, 4 JS) удобна для разработки, но плохая для prod. ОК ли собрать через esbuild/vite билд?
11. **Готовность к замене boot screen** — он стильный, но грузит CWV. Согласен показывать его 1 раз за сессию (или вообще убрать на мобиле)?
12. **terminal-блок в hero — кейс A/B/C** — какой вариант из раздела 4.1?

### 📌 Опции (не обязательно)

13. **PWA-режим** — нужен ли установка на главный экран? (+30% возвратов, но не критично)
14. **Service Worker** — оффлайн-поддержка нужна? (для маркетингового сайта обычно нет)
15. **Push-уведомления** — никогда не использовать на маркетинговом сайте без явного запроса юзера (минус в Best Practices)

---

## 13. Антипаттерны — чего НЕ делать

- ❌ **Не использовать `position: fixed` для всего на iOS** — рендер тормозит, jumping bar Safari
- ❌ **Не блокировать pinch-to-zoom** (`user-scalable=no` в viewport) — нарушение WCAG, минус в Lighthouse
- ❌ **Не использовать `100vh`** в hero без `dvh` fallback
- ❌ **Не делать "click anywhere to close" модалок без явной кнопки** — на тачах непонятно
- ❌ **Не использовать `:hover` без `(hover: hover)`** — на тачах залипает
- ❌ **Не показывать ALL toast/popup на мобиле одновременно** (cookies + tg + sticky) — экран забит
- ❌ **Не вставлять iframe чатов / виджетов без lazy** — каждый = +500мс к LCP
- ❌ **Не использовать sticky header выше 60px на мобиле** — съедает ценный first screen
- ❌ **Не оптимизировать под планшеты в последнюю очередь** — iPad Mini = 768px = частый юзер

---

## 14. Метрики до/после

| Метрика | Сейчас (~оценка) | Цель |
|---|---|---|
| Lighthouse Mobile Perf | ~55–70 | 95+ |
| LCP (Slow 4G) | ~3.5s | <2.0s |
| INP | ~250ms | <150ms |
| CLS | ~0.15 | <0.05 |
| Mobile CR | ~1.5% | 4%+ |
| Bounce mobile | ~55% | <25% |
| Mobile-friendly Yandex | partial | PASS |
| Mobile-friendly Google | partial | PASS |

---

## 15. Чек-лист первого дня

После твоих ответов из раздела 12 — можно делать прямо сейчас:

- [ ] Добавить кнопку-бургер в `vexon-nav` + мобильное полноэкранное меню
- [ ] `display: none` для `.hero .terminal` на <768px
- [ ] Глобально `min-height: 48px` для `.btn`
- [ ] `font-size: 16px` для всех input/textarea/select
- [ ] Прогрессивный `--gutter` (64/48/32/20/16)
- [ ] Boot screen → sessionStorage
- [ ] `100dvh` + safe-area в hero и nav
- [ ] Tilt/magnet → проверка `(hover: hover)`

---

**Документ актуален на:** 2026-05-22
**Следующее обновление:** после Спринта 1 (через неделю), по результатам Lighthouse Mobile.

**См. также:** [SEO_PLAN.md](./SEO_PLAN.md)
