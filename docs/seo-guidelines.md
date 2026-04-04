# SEO Guidelines

## Purpose
Стандарт для всех страниц `righttrackphysio.com.cy`.
Каждая важная страница должна быть индексируемой, канонической, связанной с языковой парой, встроенной во внутреннюю перелинковку и поддерживать коммерческий или информационный спрос.

---

## 1. Page Types

### Полный каталог типов страниц

| Тип | Пример | Индексация | Основной intent |
|-----|--------|------------|-----------------|
| Homepage | `index.html` | index, follow | Главная точка входа, бренд + навигация |
| Service page | `pages/services/physiotherapy.html` | index, follow | Коммерческий: описание услуги, цены, CTA |
| Blog hub | `pages/blog.html` | index, follow | Навигация по контенту |
| Blog article | `pages/blog/sciatica-treatment-guide-cyprus.html` | index, follow | Информационный: ответ на запрос |
| Team / clinician page | `pages/tony-profile.html` | index, follow | E-E-A-T, квалификация специалиста |
| Community hub | `pages/community.html` | index, follow | Навигация по событиям и активностям |
| Seminar / event page | `pages/seminar-muay-thai.html` | index, follow (до и во время события) | Событие: регистрация, детали, дата |
| Resource page | `pages/resources/return-to-running-guide.html` | index, follow | Информационный: evergreen полезный контент |
| Partnership page | `pages/paeek-partnership.html` | index, follow | Доверие + бренд: партнёрство с организацией |
| Campaign / promo page | `pages/padel-camp.html` | index, follow (пока актуальна) | Конверсия: регистрация на конкретное мероприятие |
| Booking page | `pages/booking.html` | index, follow | Конверсия: запись на приём |
| Legal page | `pages/privacy.html` | noindex, follow | Юридическое соответствие |
| Utility / admin page | `pages/manage-rtphysio-2026/` | noindex + Disallow | Внутреннее управление |
| 404 page | `404.html` | noindex, follow | Восстановление навигации |

### Правила

- каждый самостоятельный search intent = отдельный URL
- один URL = один primary intent в текущем состоянии страницы
- страница может эволюционировать по lifecycle (например, event → resource), но после переработки должна иметь один чёткий intent, одну актуальную schema-модель и одну каноническую роль
- utility-страницы не становятся SEO landing pages без обоснования
- новый тип страницы должен быть добавлен в эту таблицу перед первой реализацией

---

## 2. URL Rules

- только `https://righttrackphysio.com.cy`
- без `www`
- только lowercase
- дефисы в slug
- EN: `page-name.html`
- EL: `page-name-el.html`
- не создавать индексируемые дубли через query params
- `?lang=`, `?utm=`, `?gclid=`, `?fbclid=` не должны становиться отдельными индексируемыми URL
- query URLs должны канонизироваться на чистый URL
- query URLs не попадают в sitemap
- не создавать EN/EL пары искусственно, если эквивалентной страницы нет

### URL-пути по типу

| Тип | Путь |
|-----|------|
| Homepage | `/index.html`, `/index-el.html` |
| Service | `/pages/services/{slug}.html` |
| Blog | `/pages/blog/{slug}.html` |
| Team | `/pages/{name}-profile.html` |
| Community hub | `/pages/community.html` |
| Seminar / event | `/pages/seminar-{slug}.html` или `/pages/{slug}.html` |
| Resource | `/pages/resources/{slug}.html` |
| Partnership | `/pages/{partner}-partnership.html` |
| Campaign / promo | `/pages/{slug}.html` |
| Legal | `/pages/{slug}.html` |

### Retired и replaced URLs

- если страница удалена и есть замена → `301` на замену
- если страница удалена без замены → `410` или удаление + cleanup всех внутренних ссылок
- если страница поглощена другой (merge) → `301` на поглотившую + обновить canonical, sitemap, internal links
- если выбран отдельный resource URL вместо event URL → `301` с event URL на resource URL (не держать оба)
- если event page трансформирована в resource page на том же URL → не создавать второй competing URL
- не оставлять retired URLs в sitemap, навигации или внутренних ссылках

### Canonical после архитектурных решений

- canonical всегда указывает на финальный URL-owner данного intent
- если два URL конкурировали за один intent и принято решение в пользу одного → второй получает `301` или `noindex` + canonical на winner
- canonical не должен вести на redirecting URL
- canonical URL должен отдавать `200 OK`

---

## 3. Indexation Rules

### `index, follow`
- homepage
- service pages
- blog hub
- blog articles
- team / clinician pages
- community hub
- partnership pages
- resource pages
- seminar pages (пока событие предстоящее или недавнее)
- campaign pages (пока актуальны)
- booking page

### `noindex, follow`
- privacy, terms, disclaimer, cookies
- thank-you pages
- admin / utility pages
- filter/search URLs без самостоятельной SEO-ценности
- 404 page

### Lifecycle indexation

| Ситуация | Действие |
|----------|----------|
| Событие прошло, страница не переработана | `noindex, follow` + убрать из sitemap |
| Событие прошло, контент переработан в resource | либо трансформировать страницу на том же URL и оставить `index`, либо создать отдельный resource URL с `301` от event page |
| Кампания закончилась | `noindex, follow` + убрать из sitemap |
| Кампания повторяется (ежегодно) | Обновить контент, оставить `index` |
| Partnership завершён | Решение: оставить как кейс или `noindex` |

### Правила
- не использовать `robots.txt` вместо `noindex`, если Google должен читать мета-тег страницы
- не держать low-value utility pages в индексе без SEO-основания
- не оставлять в индексе страницы с устаревшим intent (событие прошло, акция закрыта)

---

## 4. Required Head Tags

На каждой индексируемой странице:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Primary Intent | Right Track Physiotherapy Cyprus</title>
<meta name="description" content="Unique summary of page value">
<link rel="canonical" href="https://righttrackphysio.com.cy/exact-page-path.html">
```

### Robots
- индексируемые страницы: можно не указывать или `index, follow`
- неиндексируемые страницы: `noindex, follow`

### Правила
- canonical должен указывать только на финальный self-referencing canonical URL или на утверждённый canonical target
- canonical не должен вести на redirecting URL
- canonical URL должен отдавать `200 OK`

---

## 5. Hreflang Rules

Для реальных EN/EL пар:

```html
<link rel="alternate" hreflang="en" href="https://righttrackphysio.com.cy/page.html">
<link rel="alternate" hreflang="el" href="https://righttrackphysio.com.cy/page-el.html">
<link rel="alternate" hreflang="x-default" href="https://righttrackphysio.com.cy/page.html">
```

### Правила
- hreflang ставится только между эквивалентными страницами
- обе страницы должны взаимно ссылаться друг на друга
- если пары нет — не указывать фиктивную альтернативу
- если страница существует только на одном языке — `hreflang` не ставить
- `x-default` всегда указывает на EN

### Когда НЕ создавать языковую пару
- страница временная (промо на 2 недели) — пара не нужна
- страница только для одной аудитории и не имеет смыслового аналога на другом языке
- ресурс доступен только на одном языке и перевод не планируется

### При удалении одной страницы из пары
- убрать hreflang с оставшейся страницы
- убрать удалённую из sitemap
- обновить canonical и internal links

---

## 6. Social Metadata

На всех публичных страницах:

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://righttrackphysio.com.cy/images/...">
<meta property="og:url" content="https://righttrackphysio.com.cy/...">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Right Track Physiotherapy">
<meta property="og:locale" content="en_CY">
<meta property="og:locale:alternate" content="el_CY">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### Blog articles
- `og:type="article"`
- желательно `article:published_time`, `article:modified_time`, `article:author`
- при наличии taxonomy: `article:section` и `article:tag`

### Правила консистентности

| Поле | Обязательное значение |
|------|----------------------|
| `og:site_name` | `Right Track Physiotherapy` (одинаково на всех страницах) |
| `og:locale` EN | `en_CY` |
| `og:locale` EL | `el_CY` |
| `og:locale:alternate` EN | `el_CY` |
| `og:locale:alternate` EL | `en_CY` |

- `og:site_name` никогда не меняется — это имя сайта, не имя страницы
- locale должен соответствовать языку страницы
- OG image должен быть отдельным и осмысленным для ключевых страниц и статей
- для EL-страниц `og:locale` = `el_CY`, `og:locale:alternate` = `en_CY`
- для partnership/event страниц допустимо включать бренд партнёра в `og:title`, но `og:site_name` остаётся `Right Track Physiotherapy`

---

## 7. Structured Data

### Общие правила
- schema должна отражать реальный visible content на странице
- не добавлять schema, которой нет в content
- не оставлять schema от предыдущего intent страницы (например, `Event` на странице, ставшей resource)
- `BreadcrumbList` — стандарт для всех внутренних SEO-страниц

### Homepage / Clinic Pages
- `MedicalClinic`, `Organization`, `WebSite`
- Минимум: `name`, `url`, `logo`, `image`, `description`, `address`, `geo`, `telephone`, `email`, `openingHoursSpecification`, `sameAs`
- Желательно: `hasMap`, связь `sameAs` с Google Business Profile и соцпрофилями

### Service Pages
- `Service`, `BreadcrumbList`
- Минимум: `name`, `description`, `serviceType`, `provider`, `areaServed`

### Blog Articles
- `Article` или `BlogPosting`, `BreadcrumbList`
- Минимум: `headline`, `description`, `image`, `author`, `publisher`, `datePublished`, `dateModified`, `mainEntityOfPage`
- Желательно: `reviewedBy` (если reviewer указан на странице)

### Team / Clinician Pages
- `Person` или `ProfilePage`
- Минимум: `name`, `jobTitle`, `description`, `image`, `url`
- Желательно: `hasCredential`, `alumniOf`, `knowsAbout`, `sameAs`

### Partnership Pages
- `Organization` (партнёр) + связь с `MedicalClinic` (Right Track)
- `BreadcrumbList`
- Минимум: `name`, `description`, `url` для обеих организаций
- Желательно: `Event` если страница описывает конкретное активное сотрудничество с датами

### Seminar / Event Pages (предстоящее событие)
- `Event`, `BreadcrumbList`
- Минимум: `name`, `startDate`, `location`, `organizer`, `description`
- Желательно: `performer`, `offers`, `eventStatus`, `eventAttendanceMode`
- `eventStatus` обязательно обновлять при отмене или переносе

### Resource Pages (evergreen контент, бывшее событие)
- `Article` или `HowTo` (в зависимости от формата контента), `BreadcrumbList`
- НЕ использовать `Event` как основной тип, если страница стала ресурсом
- Допустимо: `mentions` → `Event` для контекстной связи с прошедшим событием

### Campaign / Promo Pages
- `Event` (если есть даты и мероприятие), `BreadcrumbList`
- Минимум: `name`, `startDate`, `endDate`, `location`, `description`
- Альтернатива: `Service` если кампания продвигает услугу

### Community Hub
- `CollectionPage`, `BreadcrumbList`
- Содержит ссылки на дочерние страницы (events, partnerships, resources)

### FAQ
- использовать `FAQPage` только если FAQ:
  - уникален для страницы
  - реально присутствует в visible content
  - не скопирован массово по шаблону

### Condition Pages
- `MedicalWebPage` или подходящий page-level schema type
- `BreadcrumbList`
- `MedicalCondition` — только если страница описывает конкретное состояние

---

## 8. Content Rules

На каждой SEO-странице:
- один `h1`
- логичная структура `h2-h3`
- есть `<main>`
- контент соответствует одному чёткому intent
- есть внутренние ссылки на релевантные страницы
- есть входящие ссылки с hub-страниц
- язык контента совпадает с `lang` страницы

### Blog articles
- автор обязателен
- желательно `datePublished` и `dateModified`
- желательно блок `reviewed by`, если есть reviewer
- ссылки на связанные service pages обязательны
- желательно ссылка минимум на 1 related article

### Medical / YMYL content
- желательно указывать квалификацию автора или reviewer
- reviewer должен быть видим на странице, а не только в schema
- для важных статей желательно `last reviewed` / `last updated`
- медицинские утверждения должны быть аккуратными и не вводить в заблуждение

---

## 9. Internal Linking Rules

### Обязательные связи

| Откуда | Куда |
|--------|------|
| Homepage | key service pages, blog hub, community hub |
| Blog hub | blog articles |
| Service page | related blog articles, booking |
| Blog article | related service page, related articles |
| Community hub | seminar pages, partnership pages, resource pages |
| Seminar page | related service page, related blog article, optional separate resource page only если это другой самостоятельный intent |
| Resource page | related service page, related blog articles |
| Partnership page | related service page, team profile |
| Footer | legal pages, contact, core sections |

### Правила
- важная страница не глубже 3 кликов от homepage
- не оставлять orphan pages
- каждый новый URL должен получить минимум 2 внутренних ссылки
- blog post → минимум 1 service page + 1 related article
- service page → входящие минимум с 1 hub и 2 тематически релевантных страниц

### Антипаттерны
- не ссылаться на retired/removed страницы
- не ссылаться на обе страницы, если они конкурируют за один intent (поддерживать canonical winner)
- не создавать sitewide-ссылки на страницы с дублирующим intent
- при merge/redirect — обновить все внутренние ссылки на новый URL

---

## 10. Brand & Naming Consistency

### SEO-naming rules

| Контекст | Значение |
|----------|----------|
| `<title>` suffix | `\| Right Track Physiotherapy Cyprus` или `\| Right Track` (short) |
| `og:site_name` | `Right Track Physiotherapy` |
| Schema `name` (clinic) | `Right Track Physiotherapy & Performance Centre` |
| Schema `legalName` | `Right Track Physiotherapy & Performance Centre` |

### Правила
- не использовать разные варианты названия на разных страницах (`Right Track Physio`, `RT Physiotherapy`, `RightTrack`)
- в `<title>` допустим сокращённый вариант `Right Track` для длинных заголовков
- `og:site_name` — всегда `Right Track Physiotherapy` (короткое бренд-имя сайта)
- Schema `name` / `legalName` для clinic entity — всегда `Right Track Physiotherapy & Performance Centre` (полное юридическое название)
- это разные контексты: OG — бренд для соцсетей, Schema — юридическая сущность для поисковиков
- название партнёра допустимо в `<title>` event/partnership страниц, но после `|` всегда Right Track

---

## 11. Decision Framework

### Создавать новую страницу или переработать существующую?

```
Есть ли страница, покрывающая этот intent?
├─ Да → Обновить существующую. Не создавать дубль.
└─ Нет → Проверить: intent самостоятельный?
    ├─ Да → Создать новый URL
    └─ Нет → Добавить как секцию на существующую страницу
```

### Событие → Ресурс: когда и как

```
Событие прошло. Что делать со страницей?
├─ Контент имеет evergreen ценность? (гайд, упражнения, материалы)
│   ├─ Да → Выбрать один из двух сценариев:
│   │
│   │   Сценарий A: Трансформация на месте
│   │   Условие: основной intent остаётся тем же (тема, аудитория)
│   │   Действие: переработать event page в resource page
│   │             на том же URL, заменить schema и контент
│   │
│   │   Сценарий B: Отдельный resource URL
│   │   Условие: ресурс — реально новая сущность с отдельным
│   │            search intent (другой keyword, другая аудитория)
│   │   Действие: создать resource page в /pages/resources/
│   │             301 с event URL на resource URL
│   │
│   │   В обоих случаях:
│   │   - убрать Event schema, поставить Article/HowTo
│   │   - обновить sitemap, internal links
│   │   - НЕ оставлять оба URL с одним intent
│   │
│   └─ Нет → noindex event page, убрать из sitemap
├─ Событие повторяется ежегодно?
│   └─ Да → Обновить контент event page на следующий год
│            Оставить тот же URL
└─ Оставлять ОБА URL (event + resource) с одним intent? → НЕТ
    Duplicate intent. Один URL на один intent.
```

### Duplicate intent checklist
Перед созданием новой страницы проверить:
- нет ли существующей страницы с тем же primary keyword?
- нет ли страницы, отвечающей на тот же user question?
- не пересекается ли h1 / title с существующей?
- если пересечение есть → merge, не дублировать

---

## 12. Local SEO Rules

На сайте должны быть:
- единый NAP (Name, Address, Phone)
- адрес клиники
- кликабельный телефон
- локальные модификаторы в ключевых page titles и copy, где уместно
- связь clinic entity со всеми service pages
- связь сайта с Google Business Profile

Правила:
- связь с GBP: через `sameAs`, карту и консистентные business details
- локальные модификаторы не должны превращать titles в keyword stuffing

---

## 13. Images

- `alt` обязателен и на языке страницы
- использовать WebP/AVIF где возможно
- `loading="lazy"` для below-the-fold
- задавать `width` и `height`
- использовать `srcset`, если есть responsive variants
- для важных страниц и статей — отдельное OG-image

Правила:
- LCP / hero image не должен быть lazy-loaded
- для hero / LCP image желательно `fetchpriority="high"`
- если preload используется — он должен соответствовать реально критичному ресурсу

---

## 14. CSS & Render Performance

- общий повторяющийся CSS — в shared stylesheet, не дублировать в каждой HTML-странице
- inline CSS допустим только для небольшого critical CSS или точечных page-specific overrides
- shared CSS должен быть cacheable
- после изменений в CSS — проверять mobile rendering, LCP, Core Web Vitals

---

## 15. Sitemap

`/sitemap.xml` должен содержать только:
- canonical
- indexable
- `200 OK` URLs

Для каждого URL:
- `<loc>`
- `<lastmod>`
- `xhtml:link` для `en`, `el`, `x-default` если есть языковая пара

Опционально:
- `<changefreq>`
- `<priority>`

### Правила
- `lastmod` должен отражать реальную дату значимого обновления
- query URLs не включаются
- redirecting, `noindex` и non-canonical URLs не включаются
- retired / replaced / merged страницы убираются из sitemap
- event pages после `noindex` убираются из sitemap
- не оставлять экспериментальные или deprecated URLs в sitemap

---

## 16. robots.txt

```txt
User-agent: *
Allow: /

Disallow: /pages/manage-rtphysio-2026/
Disallow: /mediaplan-2026.html

Sitemap: https://righttrackphysio.com.cy/sitemap.xml
```

Правила:
- не блокировать CSS/JS/assets, нужные для рендера
- не использовать `Disallow` как замену `noindex`

---

## 17. Analytics

Обязательно:
- GA4 на всех публичных страницах
- Google Search Console подключен
- sitemap отправлен в GSC

Желательно:
- tracking кликов по booking
- tracking phone clicks
- tracking form submits

---

## 18. Lifecycle Rules

### New Page
1. Определить тип (см. §1) и intent
2. Проверить duplicate intent (см. §11)
3. Создать URL по правилам (см. §2)
4. Создать EN/EL пару, если это core page
5. Добавить `title`, `description`, canonical
6. Добавить hreflang
7. Добавить schema по типу (см. §7)
8. Встроить во внутреннюю перелинковку (см. §9)
9. Добавить в sitemap
10. Проверить indexability

### Update Page
- обновить `dateModified`
- обновить `lastmod` в sitemap
- проверить internal links

### Retire Page
- если есть замена → `301`
- если замены нет → `410` или удаление + cleanup links
- убрать из sitemap
- убрать из навигации и internal links
- убрать hreflang с парной страницы
- не оставлять важные legacy URLs без стратегии

### Transform Page (event → resource)

**Сценарий A — трансформация на месте** (intent тот же, URL остаётся):
- переработать контент event page в resource page
- заменить schema (Event → Article/HowTo)
- обновить title, description, OG под новый формат
- обновить `lastmod` в sitemap

**Сценарий B — отдельный resource URL** (новый самостоятельный intent):
- создать resource page с новым URL
- `301` с event URL на resource URL
- заменить schema (Event → Article/HowTo)
- обновить sitemap: убрать старый URL, добавить новый
- обновить internal links на новый URL

В обоих случаях:
- обновить hreflang если пара остаётся
- не оставлять два URL с одним intent

### Post-Release Validation
- проверить URL через GSC URL Inspection
- проверить schema / rich results validation
- проверить, что страница получила реальные внутренние ссылки

---

## 19. Release Checklist

- [ ] URL канонический и отдаёт `200`
- [ ] страница не дублирует существующий intent (проверен §11)
- [ ] тип страницы определён и соответствует §1
- [ ] `title` уникален
- [ ] `description` уникальна
- [ ] canonical корректен
- [ ] robots корректен
- [ ] hreflang корректен (или не нужен — подтверждено)
- [ ] OG / Twitter заполнены, `og:site_name` = `Right Track Physiotherapy`
- [ ] `h1` один
- [ ] есть `<main>`
- [ ] есть внутренние ссылки in/out
- [ ] schema валидна и соответствует текущему intent страницы
- [ ] страница добавлена в sitemap
- [ ] страница не блокируется `robots.txt`
- [ ] page pair EN/EL связана корректно
- [ ] mobile rendering проверен
- [ ] shared CSS / critical CSS strategy не создаёт лишнего дублирования
- [ ] для YMYL content указан author / reviewer
- [ ] для внутренних SEO-страниц добавлен `BreadcrumbList`
- [ ] brand naming в title/OG/schema консистентно (§10)

---

## Changelog

| Дата | Изменения |
|------|-----------|
| 2026-04-04 | Ревизия: добавлены типы (partnership, seminar, resource, campaign), intent rules, decision framework, brand naming, lifecycle transforms, duplicate intent prevention |
| 2026-04-04 | Правка: event→resource теперь 2 сценария (трансформация на месте vs отдельный URL), исправлено naming (OG ≠ Schema — разные контексты) |
