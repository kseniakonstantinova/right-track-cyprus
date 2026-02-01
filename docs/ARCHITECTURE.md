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
- 4x A записи → GitHub Pages IPs (185.199.108-111.153)
- CNAME www → kseniakonstantinova.github.io
- Proxy status: DNS only

**physioclinic.com.cy:**
- Redirect Rule → 301 редирект на righttrackphysio.com.cy

**Nameservers (для обоих):**
- `elma.ns.cloudflare.com`
- `vin.ns.cloudflare.com`

### NIC.cy

Регистратор доменов .com.cy. Nameservers указывают на Cloudflare.

---

## Структура файлов

```
/
├── index.html                    # Главная (EN)
├── index-el.html                 # Главная (EL)
├── CNAME                         # Домен для GitHub Pages
├── pages/
│   ├── booking.html              # Система бронирования
│   ├── alice-profile.html        # Профиль Alice (EN)
│   ├── alice-profile-el.html     # Профиль Alice (EL)
│   ├── tony-profile.html         # Профиль Tony (EN)
│   ├── tony-profile-el.html      # Профиль Tony (EL)
│   ├── tools-child-development.html
│   └── admin/
│       └── index.html            # Админ-панель
├── assets/
│   ├── css/
│   │   ├── booking.css
│   │   └── admin.css
│   ├── js/
│   │   ├── booking/
│   │   │   ├── firebase-config.js
│   │   │   ├── booking-app.js
│   │   │   ├── booking-data.js
│   │   │   ├── calendar.js
│   │   │   └── time-slots.js
│   │   ├── admin/
│   │   │   └── admin-app.js
│   │   ├── i18n.js
│   │   └── translations.js
│   ├── i18n/
│   │   ├── en.json
│   │   └── el.json
│   └── images/
│       ├── logos/
│       ├── team/
│       ├── services/
│       ├── credentials/
│       └── partnerships-logos/
├── docs/
│   ├── ARCHITECTURE.md           # Этот файл
│   └── firebase-data-structure.md
└── admin/
    └── services-credentials.md   # Учётные данные (конфиденциально)
```

---

## Языки

### Поддерживаемые языки
- **EN** — Английский (основной)
- **EL** — Греческий

### Реализация

1. **Главные страницы** — дублированные HTML файлы:
   - `index.html` / `index-el.html`
   - `alice-profile.html` / `alice-profile-el.html`

2. **Страница бронирования** — единый файл с i18n:
   - Переводы в `/assets/i18n/en.json` и `el.json`
   - Динамическое переключение через `i18n.js`

3. **Сохранение выбора** — localStorage (`language: 'en' | 'el'`)

### Двуязычные поля в Firebase

```javascript
{
  name: "Service Name",           // EN
  nameEl: "Όνομα Υπηρεσίας",     // EL
  description: "...",
  descriptionEl: "..."
}
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
- `services` — услуги (6 записей)
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

**Код:** `/assets/js/booking/booking-app.js` → `sendEmailNotification()`

---

### 3. Telegram Bot

**Bot:** @RightTrackBookingBot
**Chat ID:** `-1003649608471` (группа для уведомлений)

**Cloudflare Worker:** `https://righttrack-telegram.righttrackphysio.workers.dev`

Worker проксирует запросы к Telegram API, чтобы скрыть токен бота.

**Код:** `/assets/js/booking/booking-app.js` → `sendTelegramNotification()`

**Формат сообщений:**
```
🆕 NEW APPOINTMENT

👤 Client: John Doe
📱 Phone: +357 99 123 456
📧 Email: john@example.com
🏥 Service: Athlete Rehabilitation
👨‍⚕️ Therapist: Antonis Petri
💳 Payment: GESY
📅 Date: 15 Feb 2026
🕐 Time: 10:00
```

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

## Система бронирования

### Типы бронирования

1. **Appointment** — полное бронирование с датой и временем
2. **Callback** — запрос обратного звонка (без даты)

### Поток бронирования

```
Выбор режима (Appointment/Callback)
       ↓
Выбор услуги (6 опций)
       ↓
Выбор терапевта (фильтруется по услуге)
       ↓
[Если Appointment] Выбор даты в календаре
       ↓
[Если Appointment] Выбор времени (08:00-20:00)
       ↓
Контактная информация
       ↓
Отправка → Firebase + Telegram + Email
       ↓
Сообщение об успехе
```

### Услуги (6)

| Услуга | GESY | Private |
|--------|------|---------|
| Athlete-Centred Rehabilitation | €29 | €35 |
| Clinical Pilates | — | €80/мес |
| Kids' Physiotherapy | Custom | Custom |
| Performance Training | — | €250/мес |
| Home-care Physiotherapy | €29 | €45 |
| Sports & Remedial Massage | — | €45 |

### Терапевты (3)

1. **Antonis Petri** — Co-Founder & Lead Clinician
2. **Alice** — Clinical Pilates Specialist
3. **Charalambos** — Therapist

---

## Админ-панель

**URL:** `/pages/admin/`

**Вход:** Firebase Authentication (email/password)

**Функции:**
- Просмотр бронирований
- Изменение статусов (pending → confirmed → cancelled)
- Управление терапевтами
- Управление услугами

---

## Технический стек

| Компонент | Технология |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JS (ES6+) |
| База данных | Firebase Firestore |
| Аутентификация | Firebase Auth |
| Email | EmailJS |
| Уведомления | Telegram Bot API |
| DNS | Cloudflare |
| Хостинг | GitHub Pages |
| Serverless | Cloudflare Workers |

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

### Цветовая схема

```css
--navy: #0A1628;
--orange: #FF6B35;
--white: #ffffff;
--off-white: #F8F9FA;
--text-dark: #212529;
--text-gray: #6C757D;
```

---

## Контакты и доступы

Все учётные данные и пароли находятся в:
`/admin/services-credentials.md` (не в Git)

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

*Последнее обновление: Февраль 2026*
