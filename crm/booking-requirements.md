# CRM - Модуль управления бронированиями

## Текущее состояние

Система бронирования уже работает:
- Клиенты бронируют через `pages/booking.html`
- Данные сохраняются в Firebase Firestore (коллекция `bookings`)
- Уведомления: Telegram + Email (EmailJS)
- Поддержка: 3 терапевта, 6 услуг, 2 языка (EN/GR)

---

## Требования к админ-панели бронирований

### 1. Просмотр бронирований

**Список всех заявок:**
- Имя клиента
- Телефон, email
- Услуга
- Терапевт
- Дата и время (или "callback")
- Тип оплаты (GESY/Private)
- Статус (pending/confirmed/cancelled)
- Дата создания

**Фильтры:**
- По статусу
- По терапевту
- По услуге
- По дате
- Поиск по имени/телефону

**Сортировка:**
- По дате (новые первые)
- По статусу

### 2. Управление бронированиями

**Действия:**
- Подтвердить бронь (pending → confirmed)
- Отменить бронь (→ cancelled)
- Изменить дату/время
- Добавить заметку
- Удалить (только cancelled)

**При подтверждении:**
- Автоматическое создание события в Google Calendar терапевта
- Отправка подтверждения клиенту (email/SMS)

**При отмене:**
- Удаление события из Google Calendar
- Уведомление клиенту

### 3. Управление расписанием

**Блокировка слотов:**
- Выбрать терапевта
- Выбрать дату/диапазон дат
- Выбрать время или "весь день"
- Указать причину (отпуск, праздник, etc.)

**Просмотр занятости:**
- Календарь на неделю/месяц
- Цветовая индикация: свободно/занято/заблокировано
- По терапевтам

### 4. Управление терапевтами

**Список терапевтов:**
- Имя (EN/GR)
- Должность
- Email для уведомлений
- Google Calendar email
- GESY код
- Активен/неактивен

**Редактирование:**
- Изменить данные
- Назначить услуги
- Деактивировать (не удалять)

### 5. Управление услугами

**Список услуг:**
- Название (EN/GR)
- Цены (GESY/Private)
- Активна/неактивна

**Редактирование:**
- Изменить название/цены
- Деактивировать

---

## Техническая архитектура

### Frontend
- Отдельное SPA или страница в `pages/admin/`
- Firebase Auth для входа
- Responsive (desktop + tablet)

### Backend (Firebase)
- Firestore: bookings, therapists, services, blockedSlots
- Cloud Functions: Google Calendar sync
- Auth: Email/password для админов

### Интеграции
- Google Calendar API (создание/удаление событий)
- EmailJS или Firebase Functions (уведомления клиентам)
- Telegram Bot (уведомления админам)

---

## Структура данных (Firestore)

```
bookings/{id}
  - clientName: string
  - phone: string
  - email: string (optional)
  - service: string (service ID)
  - therapistId: string
  - bookingType: "appointment" | "callback"
  - date: timestamp (null for callbacks)
  - timeSlot: string "HH:MM" (null for callbacks)
  - paymentType: "gesy" | "private" | null
  - status: "pending" | "confirmed" | "cancelled"
  - message: string (optional)
  - googleEventId: string (optional)
  - notes: string (admin notes)
  - createdAt: timestamp
  - updatedAt: timestamp

therapists/{id}
  - name: string
  - nameEl: string
  - title: string
  - titleEl: string
  - email: string
  - calendarEmail: string
  - gesyCode: string
  - services: array of service IDs
  - isActive: boolean
  - photo: string (URL)

services/{id}
  - name: string
  - nameEl: string
  - description: string
  - pricing: {
      type: "fixed" | "from" | "custom"
      gesyPrice: number | null
      privatePrice: number | null
      customText: string | null
      customTextEl: string | null
    }
  - isActive: boolean

blockedSlots/{id}
  - therapistId: string
  - date: timestamp
  - timeSlot: string | null (null = весь день)
  - reason: string
  - createdBy: string (admin ID)
  - createdAt: timestamp
```

---

## Приоритеты реализации

### MVP (первая версия)
1. Просмотр списка бронирований
2. Фильтрация по статусу/дате
3. Изменение статуса (confirm/cancel)
4. Вход через Firebase Auth

### Версия 2
5. Google Calendar интеграция
6. Управление терапевтами
7. Блокировка слотов

### Версия 3
8. Управление услугами
9. Календарь занятости
10. Аналитика

---

## Связь с другими модулями CRM

Этот модуль станет частью общей CRM:
- **Клиенты** — связь бронирований с профилями клиентов
- **Финансы** — оплаты за визиты
- **Аналитика** — статистика по услугам, терапевтам
- **Напоминания** — SMS/email клиентам перед визитом

---

*Создано: Январь 2026*
*Статус: Планирование*
