# SEO Guidelines

## Purpose
Стандарт для всех новых страниц `righttrackphysio.com.cy`.
Цель: каждая важная страница должна быть индексируемой, канонической, связанной с языковой парой, встроенной во внутреннюю перелинковку и поддерживать коммерческий или информационный спрос.

---

## 1. Page Types

Разрешённые SEO-типы страниц:
- Homepage
- Services hub
- Service page
- Condition page
- Blog hub
- Blog article
- Team / clinician page
- Community / event page
- Contact / booking page
- Legal page

Правила:
- каждый важный search intent должен иметь отдельный URL
- не каждый page type обязан быть индексируемым
- `contact / booking page` индексируется только если имеет самостоятельный search intent
- utility-страницы не создаются как SEO landing pages без причины

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

---

## 3. Indexation Rules

### `index, follow`
- homepage
- services
- conditions
- blog hub
- blog posts
- team pages
- community pages
- contact / booking pages, только если полезны в поиске

### `noindex, follow`
- privacy
- terms
- disclaimer
- cookies
- thank-you pages
- internal docs
- admin / utility pages
- filter/search URLs без самостоятельной SEO-ценности

Правила:
- не использовать `robots.txt` вместо `noindex`, если Google должен читать мета-тег страницы
- не держать low-value utility pages в индексе без SEO-основания

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

Правила:
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

Правила:
- hreflang ставится только между эквивалентными страницами
- обе страницы должны взаимно ссылаться друг на друга
- если пары нет, не указывать фиктивную альтернативу
- если страница существует только на одном языке, `hreflang` не ставить
- `x-default` всегда указывает на EN

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

Для blog articles:
- `og:type="article"`
- желательно `article:published_time`
- желательно `article:modified_time`
- желательно `article:author`
- при наличии taxonomy желательно `article:section` и `article:tag`

Правила:
- locale должен соответствовать языку страницы
- OG image должен быть отдельным и осмысленным для ключевых страниц и статей

---

## 7. Structured Data

### Homepage / Clinic Pages
Использовать:
- `MedicalClinic`
- `Organization`
- `WebSite`

Минимум:
- `name`
- `url`
- `logo`
- `image`
- `description`
- `address`
- `geo`
- `telephone`
- `email`
- `openingHoursSpecification`
- `sameAs`

Желательно:
- `hasMap`
- связь `sameAs` с Google Business Profile и основными соцпрофилями

### Service Pages
Использовать:
- `Service`
- `BreadcrumbList`

Минимум:
- `name`
- `description`
- `serviceType`
- `provider`
- `areaServed`

### Condition Pages
Использовать:
- `MedicalWebPage` или подходящий page-level schema type
- `BreadcrumbList`

Дополнительно:
- `MedicalCondition` использовать только если страница действительно описывает конкретное состояние

### Blog Articles
Использовать:
- `Article` или `BlogPosting`
- `BreadcrumbList`

Минимум:
- `headline`
- `description`
- `image`
- `author`
- `publisher`
- `datePublished`
- `dateModified`
- `mainEntityOfPage`

Желательно:
- `reviewedBy`, если reviewer реально есть и указан на странице
- `MedicalCondition` или `MedicalTherapy` только если статья действительно соответствует этим сущностям

### Team / Clinician Pages
Использовать:
- `Person` или `ProfilePage`

Минимум:
- `name`
- `jobTitle`
- `description`
- `image`
- `url`

Желательно:
- `hasCredential`
- `alumniOf`
- `knowsAbout`
- `sameAs`

### FAQ
Использовать только если FAQ:
- уникален
- реально есть на странице
- не копируется массово по шаблону

Правила:
- не добавлять schema, которая не отражена в реальном visible content
- не размечать все статьи advanced medical schema по умолчанию
- для внутренних SEO-страниц `BreadcrumbList` является стандартом

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

Для blog articles:
- автор обязателен
- желательно `datePublished` и `dateModified`
- желательно блок `reviewed by`, если есть reviewer
- ссылки на связанные service pages обязательны
- желательно ссылка минимум на 1 related article

Для medical / YMYL content:
- желательно указывать квалификацию автора или reviewer
- если есть reviewer, он должен быть видим на странице, а не только в schema
- для важных статей желательно `last reviewed` или `last updated`
- утверждения медицинского характера должны быть аккуратными и не вводить в заблуждение

---

## 9. Internal Linking Rules

Обязательно:
- homepage -> key service pages
- services hub -> все важные услуги
- service pages -> related conditions + booking
- condition pages -> related service + related articles
- blog posts -> related service + related posts
- footer -> legal + contact + core sections

Правила:
- важная страница не глубже 3 кликов от homepage
- не оставлять orphan pages
- каждый новый URL должен получить минимум 2 внутренних ссылки
- каждый blog post должен ссылаться минимум на 1 service page и 1 related article
- каждый service page должен иметь входящие ссылки минимум с 1 hub и 2 тематически релевантных страниц

---

## 10. Local SEO Rules

На сайте должны быть:
- единый NAP
- адрес клиники
- кликабельный телефон
- локальные модификаторы в ключевых page titles и copy, где это уместно
- связь clinic entity со всеми service pages
- связь сайта с Google Business Profile

Правила:
- связь сайта с GBP реализуется через `sameAs`, карту и консистентные business details
- локальные модификаторы не должны превращать titles и copy в keyword stuffing

---

## 11. Images

- `alt` обязателен и на языке страницы
- использовать WebP/AVIF где возможно
- `loading="lazy"` для below-the-fold
- задавать `width` и `height`
- использовать `srcset`, если есть responsive variants
- для важных страниц и статей желательно отдельное OG-image

Правила:
- LCP / hero image не должен быть lazy-loaded
- для hero / LCP image желательно `fetchpriority="high"`
- если preload используется, он должен соответствовать реально критичному ресурсу

---

## 12. CSS & Render Performance

Правила:
- общий повторяющийся CSS должен выноситься в shared stylesheet, а не дублироваться массово в каждой HTML-странице
- inline CSS допустим только для небольшого critical CSS или точечных page-specific overrides
- нельзя повторять на десятках страниц одни и те же reset, CSS variables, footer, buttons, language switcher, common cards и media queries
- shared CSS должен быть cacheable и подключаться на всех релевантных страницах
- не создавать CSS-архитектуру, которая заметно раздувает HTML без реальной пользы для first render
- после изменений в CSS нужно проверять, что не ухудшились mobile rendering, LCP и другие Core Web Vitals

---

## 13. Sitemap

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

Правила:
- `lastmod` должен отражать реальную дату значимого обновления страницы
- query URLs не включаются
- redirecting, `noindex` и non-canonical URLs не включаются

---

## 14. robots.txt

Пример:

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

## 15. Analytics

Обязательно:
- GA4 на всех публичных страницах
- Google Search Console подключен
- sitemap отправлен в GSC

Желательно:
- tracking кликов по booking
- tracking phone clicks
- tracking form submits

---

## 16. Lifecycle Rules

### New Page
- создать URL
- создать EN/EL пару, если это core page
- добавить `title`, `description`, canonical
- добавить hreflang
- добавить schema
- встроить во внутреннюю перелинковку
- добавить в sitemap
- проверить indexability

### Update Page
- обновить `dateModified`
- обновить `lastmod` в sitemap
- проверить internal links

### Remove Page
- если есть замена: `301`
- если замены нет: `410` или удаление с cleanup links
- не оставлять важные legacy URLs без стратегии

### Post-Release Validation
- проверить URL через GSC URL Inspection
- проверить schema / rich results validation
- проверить, что страница получила реальные внутренние ссылки

---

## 17. Release Checklist

- [ ] URL канонический и отдаёт `200`
- [ ] страница не дублирует существующий intent
- [ ] `title` уникален
- [ ] `description` уникальна
- [ ] canonical корректен
- [ ] robots корректен
- [ ] hreflang корректен
- [ ] OG / Twitter заполнены
- [ ] `h1` один
- [ ] есть `<main>`
- [ ] есть внутренние ссылки in/out
- [ ] schema валидна
- [ ] страница добавлена в sitemap
- [ ] страница не блокируется `robots.txt`
- [ ] page pair EN/EL связана корректно
- [ ] mobile rendering проверен
- [ ] shared CSS / critical CSS strategy не создаёт лишнего дублирования и не ухудшает рендер
- [ ] для YMYL content указан author / reviewer, если применимо
- [ ] для внутренних SEO-страниц добавлен `BreadcrumbList`
