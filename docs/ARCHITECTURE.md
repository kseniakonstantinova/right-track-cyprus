# Right Track Physio - Архитектура проекта

## Обзор

Сайт физиотерапевтической клиники Right Track с системой онлайн-бронирования, двуязычной поддержкой (EN/EL) и админ-панелью.

**Репозиторий:** `kseniakonstantinova/kseniakonstantinova.github.io`
**Хостинг:** GitHub Pages
**Домены:**
- `righttrackphysio.com.cy` — основной домен
- `physioclinic.com.cy` — редирект на основной

---

## Домены и DNS

### Cloudflare

Оба домена управляются через Cloudflare:

**righttrackphysio.com.cy:**
- 4x A записи -> GitHub Pages IPs (185.199.108-111.153)
- CNAME www -> kseniakonstantinova.github.io
- Proxy status: DNS only

**physioclinic.com.cy:**
- Redirect Rule -> 301 редирект на righttrackphysio.com.cy

**Nameservers (для обоих):**
- `elma.ns.cloudflare.com`
- `vin.ns.cloudflare.com`

### NIC.cy

Регистратор доменов .com.cy. Nameservers указывают на Cloudflare.

---

## Структура файлов

```
/
├── index.html                          # Главная (EN)
├── index-el.html                       # Главная (EL)
├── 404.html                            # Кастомная страница 404
├── CNAME                               # Домен для GitHub Pages
├── sitemap.xml                         # XML sitemap
├── robots.txt                          # Crawler instructions
├── .gitignore
│
├── .github/workflows/
│   ├── update-sitemap.yml              # Автообновление sitemap lastmod
│   └── site-qa.yml                     # QA проверки сайта
│
├── pages/
│   ├── booking.html                    # Система бронирования (двуязычная, i18n)
│   ├── alice-profile.html              # Профиль Alice (EN)
│   ├── alice-profile-el.html           # Профиль Alice (EL)
│   ├── tony-profile.html               # Профиль Antonis (EN)
│   ├── tony-profile-el.html            # Профиль Antonis (EL)
│   ├── blog.html                       # Блог - список статей (EN)
│   ├── blog-el.html                    # Блог - список статей (EL)
│   ├── community.html                  # Сообщество / партнёрства (EN)
│   ├── community-el.html              # Сообщество / партнёрства (EL)
│   ├── padel-camp.html                 # Padel camp лендинг (EN)
│   ├── padel-camp-el.html              # Padel camp лендинг (EL)
│   ├── seminar-muay-thai.html          # Семинар Muay Thai (EN)
│   ├── seminar-muay-thai-el.html       # Семинар Muay Thai (EL)
│   ├── paeek-partnership.html          # Партнёрство PAEEK (EN)
│   ├── paeek-partnership-el.html       # Партнёрство PAEEK (EL)
│   ├── privacy.html / privacy-el.html  # Политика конфиденциальности
│   ├── terms.html / terms-el.html      # Условия использования
│   ├── cookies.html / cookies-el.html  # Политика cookies
│   ├── disclaimer.html / disclaimer-el.html  # Дисклеймер
│   │
│   ├── services/                       # Страницы услуг (6 EN + 6 EL = 12)
│   │   ├── physiotherapy.html / -el.html
│   │   ├── athlete-rehabilitation.html / -el.html
│   │   ├── clinical-pilates.html / -el.html
│   │   ├── homecare-physiotherapy.html / -el.html
│   │   ├── performance-training.html / -el.html
│   │   └── sports-massage.html / -el.html
│   │
│   ├── blog/                           # Статьи блога (17 EN + 17 EL = 34)
│   │   ├── acl-recovery-athletes-cyprus.html / -el.html
│   │   ├── ankle-sprain-rehabilitation-guide.html / -el.html
│   │   ├── gesy-physiotherapy-cyprus-guide.html / -el.html
│   │   ├── gesy-vs-private-physiotherapy-prices-cyprus.html / -el.html
│   │   ├── hamstring-injury-stretching-myth.html / -el.html
│   │   ├── injury-prevention-combat-sports.html / -el.html
│   │   ├── ironman-history-antarctic-triathlon.html / -el.html
│   │   ├── joint-replacement-rehabilitation-cyprus.html / -el.html
│   │   ├── knee-pain-after-40-arthritis-physiotherapy.html / -el.html
│   │   ├── lower-back-pain-treatment-cyprus.html / -el.html
│   │   ├── meniscus-tear-recovery-case-study.html / -el.html
│   │   ├── office-ergonomics-neck-back-wrist-pain.html / -el.html
│   │   ├── padel-elbow-causes-prevention-treatment.html / -el.html
│   │   ├── padel-warmup-guide.html / -el.html
│   │   ├── runner-injury-prevention-exercises.html / -el.html
│   │   ├── shoulder-impingement-treatment-guide.html / -el.html
│   │   └── when-to-see-physiotherapist.html / -el.html
│   │
│   └── manage-rtphysio-2026/
│       ├── index.html                  # Админ-панель (обфусцированный URL)
│       └── mediaplan-2026.html         # Медиаплан 2026
│
├── assets/
│   ├── css/
│   │   ├── shared.css                  # Общие стили для публичных страниц
│   │   ├── service.css                 # Стили сервисных страниц
│   │   ├── blog.css                    # Стили блога
│   │   ├── blog-actions.css            # Стили лайков/шеров в блоге
│   │   ├── booking.css                 # Стили бронирования
│   │   ├── admin.css                   # Стили админ-панели
│   │   └── cookie-consent.css          # Стили cookie баннера
│   ├── js/
│   │   ├── booking/
│   │   │   ├── firebase-config.js      # Firebase конфигурация
│   │   │   ├── booking-app.js          # Основная логика бронирования
│   │   │   ├── booking-data.js         # Модели данных бронирования
│   │   │   ├── calendar.js             # Виджет календаря
│   │   │   └── time-slots.js           # Управление таймслотами
│   │   ├── admin/
│   │   │   └── admin-app.js            # Логика админ-панели
│   │   ├── cookie-consent.js           # Cookie consent логика
│   │   ├── floating-cta.js             # Плавающая CTA кнопка
│   │   ├── blog-engagement.js          # Аналитика вовлечённости блога
│   │   ├── blog-actions.js             # Лайки/шеры в статьях блога
│   │   ├── i18n.js                     # Утилиты интернационализации
│   │   └── translations.js             # Система переводов
│   ├── i18n/
│   │   ├── en.json                     # Английские переводы (для booking)
│   │   └── el.json                     # Греческие переводы (для booking)
│   ├── data/
│   │   └── january-2026-complete-extended.json
│   └── images/
│       ├── logos/        (logo-no-bg.png, rt-badge.png)
│       ├── team/         (tony, alice, charalambos — JPG + WebP, hero-team)
│       ├── services/     (6 фото услуг — JPG/JPEG + WebP)
│       ├── credentials/  (antonis/6, alice/6, charalambos/1)
│       ├── banners/      (logo, padel-camp, padel-research, seminar)
│       ├── events/       (muay-thai-speaker, paeek-team)
│       └── blog/         (ironman-cyprus)
│
├── docs/                               # Документация (в репозитории)
│   ├── site-architecture-v2-outline.md
│   ├── repeated-blocks-and-shared-data.md
│   ├── qa-code-review-agent-plan.md
│   ├── github-pr-workflow.md
│   ├── branching-policy.md
│   └── admin-panel/
│       ├── architecture.md             # Архитектура новой админ-панели (план)
│       ├── patient-scoring-ai-assistant-spec.md
│       ├── patient_admin_spec_en.md
│       └── booking-requirements.md
│
└── tools/                              # Инструменты автоматизации
    └── site-qa/
        ├── run.py                      # QA скрипт (Python)
        ├── config.json                 # Конфигурация QA
        ├── README.md
        └── output/
            ├── qa-report.md            # Последний QA отчёт
            └── qa-report.json
```

---

## Языки

### Поддерживаемые языки
- **EN** — Английский (основной)
- **EL** — Греческий

### Реализация

1. **Все публичные страницы** — дублированные HTML файлы:
   - `page.html` (EN) / `page-el.html` (EL)
   - Каждая страница имеет hreflang, self-canonical, правильный lang

2. **Страница бронирования** — единый файл с i18n:
   - Переводы в `/assets/i18n/en.json` и `el.json`
   - Динамическое переключение через `i18n.js`

3. **Сохранение выбора** — localStorage (`language: 'en' | 'el'`)

### Двуязычные поля в Firebase

```javascript
{
  name: "Service Name",           // EN
  nameEl: "Service Name EL",     // EL
  description: "...",
  descriptionEl: "..."
}
```

---

## CSS-архитектура

Исторически стили были inline в каждой странице. Текущий подход — вынесение в общие CSS файлы:

| Файл | Назначение |
|------|-----------|
| `shared.css` | Общие стили (навигация, футер, кнопки, типографика) |
| `service.css` | Стили сервисных страниц (hero, pricing, FAQ аккордеон) |
| `blog.css` | Стили блога (список статей, карточки) |
| `blog-actions.css` | Лайки, шеры, кнопки действий в статьях |
| `booking.css` | Интерфейс бронирования и календарь |
| `admin.css` | Стили админ-панели |
| `cookie-consent.css` | Cookie-баннер |

### CSS-переменные

```css
--navy: #0A1628;
--orange: #FF6B35;
--white: #ffffff;
--off-white: #F8F9FA;
--text-dark: #212529;
--text-gray: #6C757D;
```

---

## Внешние сервисы

### 1. Firebase

**Проект:** `righttrack-booking-167c6`
**Консоль:** https://console.firebase.google.com/project/righttrack-booking-167c6

**Используется:**
- Firestore Database — хранение данных
- Authentication — вход администраторов

**Коллекции Firestore:**
- `services` — услуги (5 записей)
- `therapists` — терапевты (3 записи)
- `bookings` — бронирования
- `settings` — настройки системы

**Конфигурация:** `/assets/js/booking/firebase-config.js`

---

### 2. EmailJS

**Сервис:** https://www.emailjs.com

**Учётные данные:**
- Service ID: `service_apg3zoa`
- Template ID: `template_35sacxf`
- Public Key: `1cMf-T1krhUJoreWv`

**Использование:** Отправка email уведомлений при новых бронированиях

**Лимит:** 200 писем/месяц (бесплатный план)

**Код:** `/assets/js/booking/booking-app.js` -> `sendEmailNotification()`

---

### 3. Telegram Bot

**Bot:** @RightTrackBookingBot
**Chat ID:** `-1003649608471` (группа для уведомлений)

**Cloudflare Worker:** `https://righttrack-telegram.righttrackphysio.workers.dev`

Worker проксирует запросы к Telegram API, чтобы скрыть токен бота.

**Код:** `/assets/js/booking/booking-app.js` -> `sendTelegramNotification()`

---

### 4. Cloudflare

**Аккаунт:** dash.cloudflare.com

**Использование:**
- DNS управление для обоих доменов
- Redirect Rules для physioclinic.com.cy
- Workers для Telegram proxy

**Workers:**
- `righttrack-telegram` — прокси для Telegram API

---

### 5. GitHub Pages

**Репозиторий:** `kseniakonstantinova/kseniakonstantinova.github.io`

**Настройки:**
- Custom domain: `righttrackphysio.com.cy`
- Enforce HTTPS: включено
- Branch: `main`

---

## CI/CD

### GitHub Actions

| Workflow | Файл | Назначение |
|----------|-------|-----------|
| Update Sitemap | `update-sitemap.yml` | Автообновление `lastmod` в sitemap.xml |
| Site QA | `site-qa.yml` | Автоматические QA проверки |

### QA-инструмент

**Путь:** `/tools/site-qa/`

Python-скрипт (`run.py`) для автоматической проверки сайта:
- Проверка ссылок, мета-тегов, hreflang
- Конфигурация в `config.json`
- Отчёты в `output/qa-report.md` и `.json`

---

## Система бронирования

### Типы бронирования

1. **Appointment** — полное бронирование с датой и временем
2. **Callback** — запрос обратного звонка (без даты)

### Поток бронирования

```
Выбор режима (Appointment/Callback)
       |
Выбор услуги (5 опций)
       |
Выбор терапевта (фильтруется по услуге)
       |
[Если Appointment] Выбор даты в календаре
       |
[Если Appointment] Выбор времени (08:00-20:00)
       |
Контактная информация
       |
Отправка -> Firebase + Telegram + Email
       |
Сообщение об успехе
```

### Услуги (5)

| Услуга | GESY | Private |
|--------|------|---------|
| Athlete-Centred Rehabilitation | EUR 29 | EUR 35 |
| Clinical Pilates | -- | EUR 80/мес |
| Performance Training | -- | EUR 250/мес |
| Home-care Physiotherapy | EUR 29 | EUR 45 |
| Sports & Remedial Massage | -- | EUR 45 |

### Терапевты (3)

1. **Antonis Petri** — Founder & Lead Clinician
2. **Alice Kazanjian** — Clinical Pilates Specialist
3. **Charalambos Gregoriou** — Physiotherapist & Trainer

---

## Админ-панель

### Текущая (legacy)

**URL:** `/pages/manage-rtphysio-2026/`

**Вход:** Firebase Authentication (email/password)

**Функции:**
- Просмотр бронирований
- Изменение статусов (pending -> confirmed -> cancelled)
- Управление терапевтами
- Управление услугами
- Медиаплан (`mediaplan-2026.html`)

### Новая (в разработке)

Спецификация новой админ-панели с расширенной функциональностью:
- **Архитектура:** `docs/admin-panel/architecture.md` (React + Vite + TypeScript + Firebase)
- **AI-ассистент:** `docs/admin-panel/patient-scoring-ai-assistant-spec.md` (Patient Reliability Score)
- **Требования:** `docs/admin-panel/booking-requirements.md`

Статус: **на этапе планирования**, код не написан.

---

## Технический стек

| Компонент | Технология |
|-----------|------------|
| Frontend | HTML5, CSS3 (shared.css + page-specific), Vanilla JS (ES6+) |
| База данных | Firebase Firestore |
| Аутентификация | Firebase Auth |
| Email | EmailJS |
| Уведомления | Telegram Bot API (через Cloudflare Worker) |
| DNS | Cloudflare |
| Хостинг | GitHub Pages |
| Serverless | Cloudflare Workers |
| Аналитика | GA4 (G-XQT03Q3821) |
| CI/CD | GitHub Actions |
| QA | Python (tools/site-qa) |

---

## Конфигурационные файлы

### Firebase Config

```javascript
// /assets/js/booking/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyACv0o8NPh52XBoEuAyNuuE8IzjVb2zNvE",
  authDomain: "righttrack-booking-167c6.firebaseapp.com",
  projectId: "righttrack-booking-167c6",
  storageBucket: "righttrack-booking-167c6.firebasestorage.app",
  messagingSenderId: "550244482545",
  appId: "1:550244482545:web:4e73995eb699a8acd4d850",
  measurementId: "G-XQT03Q3821"
};
```

---

## Контакты и доступы

Все учётные данные и пароли находятся в:
`инфраструктурные/admin/services-credentials.md` (не в Git)

**Основные аккаунты:**
- GitHub: kseniakonstantinova
- Firebase: righttrack-booking-167c6
- Cloudflare: (см. credentials)
- EmailJS: (см. credentials)
- Telegram Bot: @RightTrackBookingBot

---

## Полезные ссылки

- **Сайт:** https://righttrackphysio.com.cy
- **GitHub:** https://github.com/kseniakonstantinova/kseniakonstantinova.github.io
- **Firebase Console:** https://console.firebase.google.com/project/righttrack-booking-167c6
- **Cloudflare:** https://dash.cloudflare.com
- **EmailJS:** https://dashboard.emailjs.com

---

## Статистика проекта

| Метрика | Значение |
|---------|----------|
| Всего HTML-страниц | ~60 |
| Сервисных страниц | 6 EN + 6 EL = 12 |
| Статей блога | 17 EN + 17 EL = 34 |
| CSS файлов | 7 |
| JS файлов | 12 |
| GitHub Actions workflows | 2 |

---

*Последнее обновление: 20 марта 2026*
