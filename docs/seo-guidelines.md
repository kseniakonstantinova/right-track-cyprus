# SEO Guidelines — Right Track Physiotherapy

> Стандарт для всех страниц righttrackphysio.com.cy.
> Цель: каждая важная страница должна быть индексируемой, канонической, связанной с языковой парой, встроенной во внутреннюю перелинковку.

---

## 1. Типы страниц

Разрешённые SEO-типы:
- Homepage
- Service page
- Blog hub / Blog article
- Team / clinician profile
- Community / event page
- Booking page
- Legal page (noindex)

Каждый важный search intent должен иметь отдельный URL.

---

## 2. URL Rules

- Только `https://righttrackphysio.com.cy`
- Без `www`
- Только lowercase, дефисы в slug
- EN: `page-name.html`
- EL: `page-name-el.html`
- Не создавать индексируемые дубли через query params
- `?lang=`, `?utm=`, `?gclid=`, `?fbclid=` не должны становиться отдельными индексируемыми URL

---

## 3. Indexation Rules

### `index, follow` (или без meta robots)
- homepage, services, blog hub, blog posts
- team profiles, community, booking

### `noindex, follow`
- privacy, terms, disclaimer, cookies
- thank-you pages, admin, utility pages
- campaign/event pages без долгосрочной SEO-ценности (padel-camp, seminar, paeek-partnership)

Не использовать `robots.txt` вместо `noindex`.

---

## 4. Обязательные теги в `<head>`

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Primary Intent | Right Track Physiotherapy Cyprus</title>
<meta name="description" content="Unique summary, 120–160 символов">
<link rel="canonical" href="https://righttrackphysio.com.cy/exact-page-path.html">
```

### Title
- Формат: `Тема | Right Track Physiotherapy Cyprus`
- Длина: 50–60 символов
- Ключевые слова ближе к началу

### Meta Description
- 120–160 символов
- Содержит CTA или уникальное предложение
- Уникальна для каждой страницы

### Robots
- Индексируемые: можно не указывать или `index, follow`
- Неиндексируемые: `<meta name="robots" content="noindex, follow">`

---

## 5. Hreflang (EN + EL)

Каждая страница содержит 3 тега:
```html
<link rel="alternate" hreflang="en" href="https://righttrackphysio.com.cy/page.html">
<link rel="alternate" hreflang="el" href="https://righttrackphysio.com.cy/page-el.html">
<link rel="alternate" hreflang="x-default" href="https://righttrackphysio.com.cy/page.html">
```

Правила:
- hreflang ставится только между эквивалентными страницами
- Если пары нет — не указывать фиктивную альтернативу
- `x-default` всегда указывает на EN
- Дублируется в sitemap.xml

---

## 6. Open Graph & Twitter Cards

На всех публичных страницах:
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://righttrackphysio.com.cy/assets/images/...">
<meta property="og:url" content="https://righttrackphysio.com.cy/...">
<meta property="og:type" content="website">  <!-- или "article" для блога -->
<meta property="og:site_name" content="Right Track Physiotherapy">
<meta property="og:locale" content="en_CY">  <!-- или el_CY -->
<meta property="og:locale:alternate" content="el_CY">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

---

## 7. Structured Data (JSON-LD)

### Homepage — MedicalClinic
```
@type: MedicalClinic
- name, description, url, logo, image
- medicalSpecialty: PhysicalTherapy
- address (Strovolos, Nicosia), geo (35.1475, 33.3565)
- telephone, email
- openingHoursSpecification (Mon-Fri 08-20, Sat 09-14)
- paymentAccepted: Cash, Credit Card, GESY
- aggregateRating
- sameAs (Instagram, Facebook, LinkedIn)
```

### Service Pages — Service
```
@type: Service
- name, description, provider (MedicalClinic)
- areaServed, serviceType
- offers с ценой
```

### Blog — Article + MedicalWebPage
```
@type: ["Article", "MedicalWebPage"]
- headline, description, image
- author (@type: Person — имя, должность, аффилиация)
- datePublished, dateModified
- publisher (Organization)
- citation (ссылки на научные статьи)
```

### Events — EducationEvent
```
@type: EducationEvent
- name, startDate, endDate, location
- organizer, performer, offers
```

### FAQ — FAQPage
- На всех сервисных страницах (6–8 FAQ)
- На всех блог-постах (5–7 FAQ)
- Используется только для уникальных, реально присутствующих на странице вопросов

---

## 8. Контент

На каждой SEO-странице:
- Один `h1` с ключевым словом
- Логичная структура `h2-h3`
- `<main>` элемент
- Контент соответствует одному чёткому intent
- Внутренние ссылки на релевантные страницы
- Входящие ссылки с hub-страниц
- Язык контента совпадает с `lang` страницы

Для blog articles:
- Автор обязателен
- `datePublished` и `dateModified`
- Блок `reviewed by` если есть reviewer
- Ссылки на связанные service pages обязательны

---

## 9. Internal Linking

Обязательно:
- homepage → key service pages
- service pages → related conditions + booking
- blog posts → related service + related posts
- footer → legal + contact + core sections

Правила:
- Важная страница не глубже 3 кликов от homepage
- Не оставлять orphan pages
- Каждый новый URL должен получить минимум 2 внутренних ссылки
- Booking ссылки с параметрами: `booking.html?service=athlete-rehab`

Якорные тексты для перелинковки:
- `physiotherapist in Nicosia`
- `sports physiotherapy in Cyprus`
- `home visit physiotherapy Nicosia`
- `clinical Pilates in Nicosia`
- `sports massage in Nicosia`

---

## 10. Local SEO

На сайте должны быть:
- Единый NAP (Name, Address, Phone)
- Адрес клиники
- Кликабельный телефон
- Локальные модификаторы в page titles (Nicosia, Cyprus)
- Связь clinic entity со всеми service pages
- Связь сайта с Google Business Profile

---

## 11. Изображения

- `alt` обязателен, на языке страницы
- WebP через `<picture>` с fallback
- `loading="lazy"` для below-the-fold
- Задавать `width` и `height`
- `srcset` для responsive variants
- Для важных страниц — отдельное OG-image

---

## 12. Sitemap

`/sitemap.xml` — только canonical, indexable, 200 OK URLs.

### Приоритеты
| Тип страницы | Priority | Changefreq |
|---|---|---|
| Главная (EN/EL) | 1.0 | monthly |
| Сервисы | 0.9 | monthly |
| Блог | 0.7 | monthly |
| Команда | 0.7 | monthly |
| Legal | 0.3 | yearly |

Каждый URL содержит:
- `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- `<xhtml:link>` для en, el, x-default

Автообновление `lastmod` через GitHub Actions (`update-sitemap.yml`).

---

## 13. robots.txt

```txt
User-agent: *
Allow: /

Disallow: /pages/manage-rtphysio-2026/

Sitemap: https://righttrackphysio.com.cy/sitemap.xml
```

Не блокировать CSS/JS/assets, нужные для рендера.

---

## 14. Аналитика

Обязательно:
- GA4 (`G-XQT03Q3821`) на всех публичных страницах
- Google Search Console подключен
- Sitemap отправлен в GSC

Желательно:
- Tracking кликов по booking
- Tracking phone clicks
- Tracking form submits

---

## 15. Чеклист: новая страница

### HTML `<head>`
- [ ] Title (50–60 символов, ключевые слова в начале)
- [ ] Meta description (120–160 символов)
- [ ] Meta robots (`index, follow` или `noindex, follow`)
- [ ] Canonical URL (self-referencing)
- [ ] Hreflang (en + el + x-default)
- [ ] OG-теги (title, description, image, url, type, locale)
- [ ] Twitter Card теги
- [ ] Viewport + charset
- [ ] Favicon
- [ ] GA4 скрипт

### Structured Data
- [ ] Основная схема по типу страницы (Service / Article / Event)
- [ ] FAQPage schema (5–8 вопросов)
- [ ] Для блога: author, datePublished, citation

### Контент
- [ ] H1 — один на страницу, с ключевым словом
- [ ] Alt-теги на всех изображениях
- [ ] WebP через `<picture>`
- [ ] Lazy loading на below-the-fold
- [ ] Внутренние ссылки на релевантные сервисы/статьи

### Файлы
- [ ] Создать EN + EL версии
- [ ] Добавить обе в sitemap.xml с hreflang
- [ ] Проверить robots.txt (не блокирует)

### После деплоя
- [ ] Проверить в Google Search Console
- [ ] Валидировать Schema через schema.org validator
- [ ] Проверить OG через Facebook Sharing Debugger
- [ ] Mobile rendering проверен
