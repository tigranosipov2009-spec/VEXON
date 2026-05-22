# VEXON Studio — применённые изменения (Спринт 1)
**Дата:** 2026-05-22 · **Базис:** SEO_PLAN.md + MOBILE_PLAN.md

---

## 1. Удалено

### Boot-screen — полностью вырезан
- `index.html` — убран тег `<vexon-boot>`
- `assets/js/components.js` — удалён класс `VexonBoot`
- `assets/js/main.js` — удалена функция `initBoot()`, заменена на прямой `startSequence()`
- `assets/css/layout.css` — удалён блок `#boot` и `.boot-*` (≈20 строк)
- `assets/css/animations.css` — удалены keyframes `bootIn`, `bootFill`

**Эффект:** −0.5–1.5s к LCP на мобиле. Сайт открывается сразу.

---

## 2. Логотипы — только твои photo_*

| Где | Что было | Стало |
|---|---|---|
| `vexon-nav` (шапка) | inline SVG (3 ромба, не твой лого) | `<img>` с `photo_2.jpg` 36×36, alt + decoding=async |
| `vexon-footer` | inline SVG | `<img>` с `photo_2.jpg` 42×42, loading=lazy |
| favicon (все 10 страниц) | photo_2 без sizes | `photo_2.jpg` с `sizes="any"` + apple-touch 180×180 |
| OG-image (главная + 9 услуг) | photo_3 | **photo_5** (премиум-серебро) + size + alt |
| PWA-иконка | — | `photo_2.jpg` 192/512 в manifest |

---

## 3. Бургер-меню (новое!)

### `vexon-nav` теперь содержит:
- **Кнопка бургера** 44×44 с анимацией X
- **Полноэкранное мобильное меню** с тремя секциями: Разработка / Маркетинг и дизайн / Навигация
- **Подвал меню** — телефон-кнопка + кнопка Telegram
- **Доступность**: `aria-expanded`, `aria-controls`, `aria-hidden`, Escape для закрытия, авто-закрытие при ресайзе на десктоп
- **Body lock** через `body.menu-open { overflow: hidden }` — фон не скроллится
- **Safe-area** для iPhone notch учтена

### Брейкпоинт: < 860px

---

## 4. Hero terminal — сжат, но виден

Согласно твоему запросу:
- **≤ 1024px:** min-height 320px, font-size 12px
- **≤ 768px:** min-height 260px, font-size 11px, скрыты последние 5 декоративных строк кода
- **≤ 480px:** min-height 220px, font-size 10.5px, скрыто ещё больше строк

Терминал остался видимым (как ты просил), но не съедает 70% первого экрана.

---

## 5. Tokens.css — прогрессивный gutter

```
1280+   → 64px (десктоп)
1024+   → 48px
768+    → 32px (планшеты)
480+    → 24px (телефоны)
360+    → 18px (узкие)
<360    → 14px (iPhone SE landscape)
```

Плюс CSS-переменные брейкпоинтов `--bp-xs..xl` и `--nav-h` (60→56 на мобиле).

---

## 6. Base.css — мобильная типографика и тач-доступность

- `body` 16px → **17px / 1.65** на мобиле для лучшего чтения
- `html { -webkit-text-size-adjust: 100% }` — запрет ресайза при rotate
- `input, select, textarea { font-size: 16px }` — **запрет iOS zoom**
- `.btn { min-height: 48px }` — глобальное touch target
- `-webkit-tap-highlight-color: transparent` + `touch-action: manipulation`
- `body { padding-left/right: env(safe-area-inset-*) }` — iPhone notch
- `body.menu-open { overflow: hidden }`
- H1 `.h-xl` — clamp(34px..88px), уменьшен letter-spacing для мобиле
- `.h-lg` — clamp(26px..44px)
- `.body-lg` 15→16px (на 480 — 15)
- Стиль `.h1-eyebrow` — новый, для SEO-преамбулы в H1

---

## 7. Components.css — мобильные доработки

- **Hero terminal** — компактные размеры по 3 брейкам (см. §4)
- **Формы:** input/textarea/select → 16px, min-height 48px, на 480 → 1 колонка
- **Калькулятор:** чек-боксы 16→22px, тач-зона 56px, цена → акид-зелёный жирный на мобиле
- **Cookies-bar:** safe-area для notch, кнопки 48px в высоту, столбиком на мобиле
- **TG-floater:** safe-area, min-height 44px

---

## 8. Layout.css — навигация и адаптив

- `.nav { height: var(--nav-h) }` (60 desktop / 56 mobile)
- `.nav-burger` + `.mobile-menu` — полный CSS (≈90 строк)
- На < 860px: скрыт `.nav-links` + `.nav-cta-desktop`, показан бургер
- Hero-grid: gap 48→36→28 по брейкам
- Hero-actions: на 480px кнопки растягиваются на 100% ширины
- Hero-trust: gap уменьшен, font 11px на узких
- Footer: 1100→700→480 (1100 = 3 кол, 700 = 2 кол с gap 24, 480 = 1 кол)
- Footer-col-a: min-height 32px (туч-таргет в списке)

---

## 9. JS — `main.js` оптимизация

- `IS_TOUCH = matchMedia('(hover: none)').matches`
- `FX.initSpotlight/Magnet/Tilt/Parallax` — теперь **только если НЕ touch**
- Это убирает лагающий тилт на телефонах + экономит CPU

---

## 10. Производительность

### Шрифты — неблокирующая загрузка
- Везде Google Fonts через `preload` + `media="print" onload="this.media='all'"`
- Убраны лишние веса (`500` снят — не используется на сайте)
- Fallback через `<noscript>`

### Yandex Метрика — отложена
- Загружается через **1.5s после `load`** ИЛИ при первом user-event (scroll/touch/mousemove/keydown)
- Это **главный выигрыш по LCP** на мобиле: −300–600ms на 3G/4G

---

## 11. SEO правки

### Главная — title/description/H1
- Title: `Веб-студия VEXON в Симферополе — сайты, реклама, ИИ-решения`
- Description расширен с гео + KPI
- H1: добавлен `<span class="h1-eyebrow">Веб-студия в Симферополе</span>` перед слоганом (даёт первый ключ + локацию, не ломая креатив)
- Добавлены: `keywords`, `author`, `geo.region` (RU-CR), `geo.placename`, `geo.position`, `ICBM`, `robots` с `max-image-preview:large`

### Schema.org — 4 блока вместо 1
1. **ProfessionalService** (расширен): geo, openingHours 24/7, contactPoint, hasOfferCatalog со всеми 9 услугами, aggregateRating
2. **WebSite** + SearchAction (Sitelinks Searchbox)
3. **FAQPage** с 4 вопросами с главной
4. **BreadcrumbList**

### Service pages — все 9 обновлены
- Уникальный SEO-friendly title с гео + ключ
- Description с УТП + цена + срок
- Keywords, robots, geo-метатеги
- На `/services/websites` дополнительно: **Service schema** (AggregateOffer 20k–500k ₽) + **BreadcrumbList** (3 уровня) + полные OG-теги
- OG-image заменён на photo_5 везде

### robots.txt — переработан
- Заблокированы LLM-парсеры: GPTBot, ChatGPT-User, CCBot, anthropic-ai, Claude-Web, Google-Extended, PerplexityBot, Amazonbot — **не отдаём контент конкурентам в обучение**
- Заблокированы агрессивные SEO-сканеры: MJ12bot, AhrefsBot, SemrushBot, DotBot, BLEXBot
- Расширен Clean-param для Яндекса (utm_*, yclid, gclid, fbclid, ref, from)
- Disallow для всех UTM-URL для остальных ботов
- `Host: vexon-studio.tech` для Яндекса

### sitemap.xml
- Все lastmod обновлены на 2026-05-22
- Добавлена image-разметка для главной с premium-обложкой

---

## 12. PWA — установка на главный экран

- Создан `manifest.webmanifest` с иконками 192/512
- Все страницы линкуют на manifest
- `apple-mobile-web-app-*` метатеги на главной
- `format-detection=telephone=no` — Safari не превращает цифры из текста в ссылки-звонилки
- При желании пользователь может установить сайт как приложение

---

## 13. Что осталось из планов на следующий спринт

### SEO_PLAN — не сделано
- ❌ Страницы `/about`, `/contacts`, `/team`, `/reviews`, `/portfolio`
- ❌ Раздел `/blog/` с первыми 5 статьями
- ❌ Расширение текста кейсов (сейчас по 300 знаков, надо 1500+)
- ❌ Регистрация в Яндекс Бизнес, 2ГИС, Workspace
- ❌ Линкбилдинг
- ❌ Service schema на остальных 8 страницах услуг (есть только на websites — взят как шаблон)

### MOBILE_PLAN — не сделано
- ❌ WebP-конвертация картинок (нужно делать на этапе билда)
- ❌ Self-host шрифтов в `/assets/fonts/` (нужны исходники Geist Variable)
- ❌ Critical CSS inline + bundle (нужен билд-сетап esbuild/vite)
- ❌ Service Worker (не критично)

---

## 14. Дополнительные рекомендации (новые)

Пока работал — увидел ещё проблемы, которых нет в планах:

### A. Доступность (a11y)
- `<svg>` без `<title>` — для скрин-ридеров. Добавить `<title>VEXON Studio</title>` внутрь логотипа
- На `vexon-nav` кнопке `.nav-trigger` нужно `aria-expanded` (добавил ✅)
- Hero terminal через `aria-hidden="true"` (уже есть ✅) — норм для скрин-ридеров
- Все формы без `<label for="">` — у `vexon-form` есть, но `aria-required` на required полях нет — стоит добавить

### B. Производительность
- `vexon-cookies` создаётся в JS и каждый раз дёргает `localStorage` — оптимально кешировать в переменной
- Все компоненты грузятся **синхронно через innerHTML** — можно вынести в `<template>` для скорости
- `data-magnet` attr остался у CTA-кнопок — теперь работает только на desktop, но атрибут в DOM. Не критично, но можно через JS убирать

### C. Контент
- Стек на главной упоминает «Claude Opus 4.7» — это будущая версия (актуально на 2026), но имя меняется. Лучше: «Claude последнее поколение» или «GPT-5+ / Claude / Llama»
- Раздел STACK можно расширить иконками (через `<img>` к иконкам сервисов)
- В FAQ есть ответы, но нет `id` у каждого `<details>` — закрытие по якорю с другого сайта не сработает

### D. Бренд и UX
- В footer `foot-addr` написано «Симферополь · Крым · работаем со всем миром · 24/7» — это супер для SEO! Но желательно вынести в structured data как `areaServed`
- На главной нет блока «**Социальные доказательства**» — кейс-логотипы, рейтинги (хотя в schema есть 37 отзывов, надо показать)
- В навигации нет ссылки на «**Блог**» — когда он появится, добавим
- Cookies-bar показывается **на каждой странице** где его нет — лучше через `localStorage` ставить флаг на 365 дней

### E. Технические долги
- Папка `legal/` не отдаёт страницы — нужно создать минимум `/legal/privacy`, `/legal/consent`, `/legal/offer` (404 ломают footer links и Я.Метрику)
- `_redirects` файл существует — нужно проверить его правила (используется ли Netlify-стиль?)
- Yandex verification meta-тег жёстко прописан — после смены домена сломается
- `Stitch_cyber_tech_marketing_agency` в корне проекта — какой-то старый дубль, можно удалить

### F. Конверсия (на основе беглого аудита)
- Форма заявки не имеет **honeypot** или капчи — будет море спама от ботов
- Нет **lead-magnet** на главной (бесплатный чек-лист, аудит, PDF) — простой способ собирать email-базу
- В hero — кнопка «Обсудить проект» ведёт на `#contact`, но **нет sticky CTA внизу при скролле** для мобилы (есть только при условии — sticky bar появляется через JS)
- Калькулятор есть, но нет автоматической **отправки сметы на email** после расчёта — большая потеря лидов

### G. SEO-инициативы за рамками текущих файлов
1. **Создать страницу `/cases/`** с 3 кейсами как отдельные статьи (АПАГА, SERGIO, СТРОЙKRAFT) — каждая по 1500+ знаков
2. **Раздел `/blog/`** с тегами и категориями (см. SEO_PLAN.md §6)
3. **Локальная посадочная** `/simferopol/` или `/krym/` — для гео-запросов
4. **Hreflang** не нужен пока всё на русском
5. **Версия для мобильных** в Яндекс Вебмастере → подтвердить, что mobile-friendly
6. **Микроразметка организации на странице контактов** — когда создадим `/contacts/`

---

## 15. Проверка после изменений

### Что проверить вручную
1. Открыть `https://vexon-studio.tech` — должен открываться **без boot-screen**
2. На мобиле (или DevTools 375×667) — должна быть **кнопка бургера**, по тапу — мобильное меню
3. По тапу на любой пункт меню — меню закрывается, переход срабатывает
4. На главной в hero — терминал виден, но компактный
5. В Lighthouse Mobile — Performance должно вырасти на 15–30 баллов
6. В Schema Validator (search.google.com/test/rich-results) — все 4 блока должны парситься
7. В Яндекс Вебмастер → Mobile-friendly → PASS

### Откатить если что-то сломалось
```bash
git diff HEAD~1 -- assets/js assets/css index.html
```
(если есть git)

---

## 16. Метрики до/после (ожидание)

| Метрика | Было (оценка) | Стало (ожидание) |
|---|---|---|
| Lighthouse Mobile Perf | 55–70 | 80–92 |
| LCP (Slow 4G) | 3.5s | 2.0–2.5s |
| FCP | 1.8s | 1.0–1.3s |
| TBT | 300–500ms | 150–200ms |
| CLS | 0.1–0.2 | 0.02–0.05 |
| Mobile-friendly Yandex | partial | PASS |
| Touch targets ≥48px | ~50% | ~95% |
| SEO Score Lighthouse | 90 | 100 |

---

**Документ актуален на:** 2026-05-22 (после Спринта 1)
**Следующий спринт:** см. SEO_PLAN.md §11 «Спринт 2» + MOBILE_PLAN.md §11
