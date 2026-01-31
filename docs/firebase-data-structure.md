# Firebase Data Structure for Right Track

## Overview

This document describes the data structure for services, therapists, and bookings in Firebase Firestore with bilingual support (English/Greek).

---

## Collections

### 1. `services` Collection

Each service document contains bilingual fields for all user-facing text.

```javascript
{
  id: "athlete-rehab",                    // Document ID (auto or manual)

  // Bilingual fields (use suffix El for Greek)
  name: "Athlete-Centred Rehabilitation",
  nameEl: "Αποκατάσταση Αθλητών",

  description: "MSK & Sports Rehab, Post-operative Recovery",
  descriptionEl: "Μυοσκελετική & Αθλητική Αποκατάσταση, Μετεγχειρητική Ανάρρωση",

  // Pricing object
  pricing: {
    type: "fixed",                        // "fixed", "from", or "custom"
    gesyPrice: 29,                        // null if not available
    privatePrice: 35,                     // null if custom
    display: "€29 GESY | From €35 Private",
    displayEl: "€29 ΓΕΣΥ | Από €35 Ιδιωτικά",
    customText: null,                     // For "custom" type only
    customTextEl: null
  },

  // Settings
  duration: 60,                           // Default duration in minutes
  isActive: true,                         // Show/hide in booking
  sortOrder: 1,                           // Display order

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. `therapists` Collection

Each therapist document with bilingual support.

```javascript
{
  id: "antonis",                          // Document ID

  // Bilingual fields
  name: "Antonis Petri",
  nameEl: "Αντώνης Πέτρη",

  title: "Co-Founder & Lead Clinician",
  titleEl: "Συνιδρυτής & Επικεφαλής Κλινικός",

  bio: "Dedicated physiotherapy educator...",
  bioEl: "Αφοσιωμένος εκπαιδευτής φυσιοθεραπείας...",

  // Non-translated fields
  gesyCode: "A2825",
  email: "righttrackphysio@gmail.com",
  calendarEmail: "righttrackphysio@gmail.com",
  phone: "+357 99 126 824",
  photo: "/assets/images/team/tony-photo.jpg",

  // Services this therapist can provide (array of service IDs)
  services: ["athlete-rehab", "kids-physio", "performance-training"],

  // Settings
  isActive: true,
  sortOrder: 1,

  // Working hours (optional, overrides global settings)
  workingHours: {
    monday: { start: "08:00", end: "20:00" },
    tuesday: { start: "08:00", end: "20:00" },
    // ... etc
  },

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 3. `bookings` Collection

Stores all booking requests from the website.

```javascript
{
  id: "auto-generated",                   // Firestore auto-ID

  // Client info
  clientName: "John Doe",
  phone: "+357 99 123 456",
  email: "john@example.com",              // Optional
  message: "I have a knee injury",        // Optional

  // Booking details
  service: "athlete-rehab",               // Service ID
  therapistId: "antonis",                 // Therapist ID
  paymentType: "gesy",                    // "gesy" or "private"

  // Appointment details
  bookingType: "appointment",             // "appointment" or "callback"
  date: "2026-02-15",                     // null for callbacks
  timeSlot: "10:00",                      // null for callbacks

  // Status tracking
  status: "pending",                      // "pending", "confirmed", "completed", "cancelled"
  source: "website",                      // "website", "phone", "admin"

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp,
  confirmedAt: Timestamp,                 // When confirmed
  confirmedBy: "admin-user-id"            // Who confirmed
}
```

### 4. `settings` Collection

Global settings for the booking system.

```javascript
// Document ID: "booking"
{
  workingDays: [1, 2, 3, 4, 5],           // 0=Sunday, 1=Monday, etc.
  workingHours: {
    start: "08:00",
    end: "20:00"
  },
  slotDuration: 60,                       // Default slot duration in minutes
  advanceBookingDays: 30,                 // How far ahead can book
  timezone: "Europe/Nicosia",

  // Holiday dates (booking disabled)
  holidays: [
    "2026-01-01",
    "2026-01-06",
    // ... etc
  ]
}
```

---

## Admin Panel Requirements

### Services Management

Admin should be able to:
1. Add/edit/delete services
2. Edit both EN and EL fields side-by-side
3. Set pricing (GESY and/or Private)
4. Enable/disable services
5. Reorder services (drag-drop or sort order)

**UI Example:**
```
┌─────────────────────────────────────────────────────┐
│ Edit Service: Athlete-Centred Rehabilitation        │
├─────────────────────────────────────────────────────┤
│ Name (EN): [Athlete-Centred Rehabilitation    ]     │
│ Name (EL): [Αποκατάσταση Αθλητών              ]     │
│                                                     │
│ Description (EN): [MSK & Sports Rehab...      ]     │
│ Description (EL): [Μυοσκελετική & Αθλητική... ]     │
│                                                     │
│ Pricing Type: [Fixed ▼]                             │
│ GESY Price: [29] €   Private Price: [35] €          │
│                                                     │
│ ☑ Active   Duration: [60] min                       │
│                                                     │
│ [Cancel]                              [Save]        │
└─────────────────────────────────────────────────────┘
```

### Therapists Management

Admin should be able to:
1. Add/edit/delete therapists
2. Edit EN and EL fields
3. Assign services to therapists
4. Upload/change photo
5. Set working hours per therapist

### Bookings Management

Admin should be able to:
1. View all bookings (filterable by date, status, therapist)
2. Change booking status (pending → confirmed → completed)
3. Add notes to bookings
4. Export bookings to CSV

---

## Code Usage Examples

### Getting Localized Service Name

```javascript
import { i18n } from '/assets/js/i18n.js';

// Using helper method
const serviceName = i18n.getField(service, 'name');
// Returns: service.nameEl if Greek, otherwise service.name

// Or manually
const name = i18n.isGreek ? (service.nameEl || service.name) : service.name;
```

### Getting UI Translations

```javascript
import { i18n } from '/assets/js/i18n.js';

// Initialize once
await i18n.init();

// Get translation
const title = i18n.t('booking.title');
// Returns: "Book Your Appointment" or "Κλείστε Ραντεβού"

// With fallback
const label = i18n.t('booking.newField', 'Default text');
```

### Listening for Language Changes

```javascript
import { i18n } from '/assets/js/i18n.js';

// Subscribe to changes
const unsubscribe = i18n.onLanguageChange((newLang) => {
    console.log('Language changed to:', newLang);
    refreshUI();
});

// Later, unsubscribe
unsubscribe();
```

---

## Firebase Security Rules (Suggested)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for services and therapists
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    match /therapists/{therapistId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Bookings: anyone can create, only admin can read/update
    match /bookings/{bookingId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }

    // Settings: public read, admin write
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## Migration Notes

If migrating from current hardcoded data in `booking-data.js`:

1. Create Firebase collections matching the structure above
2. Import existing data from `SERVICES` and `THERAPISTS` arrays
3. Update `booking-app.js` to use `i18n` module for UI translations
4. Keep `booking-data.js` as fallback for offline/error scenarios
