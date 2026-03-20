# Technical Specification: "Patients" Section — Physiotherapy Clinic Admin Panel

**Project:** Admin Panel — Patients Module  
**Version:** 1.0  
**Stack:** React + TypeScript, SQLite / PostgreSQL, Node.js backend  
**Target user:** Physiotherapist — no technical background assumed

---

## 1. Context and Goals

The clinic operates in two modes:

- **GeSY patients** — insured through Cyprus's national healthcare system. Visit data arrives as Excel exports from GeSY. These records are read-only and cannot be edited — view only.
- **Private patients** — pay directly. Data is entered manually by the doctor or admin.

The goal of this section is to give the doctor a single place to manage all patients: view visit history, add clinical notes, and track payments for private patients.

---

## 2. Section Structure

```
Admin Panel
└── Patients
    ├── Patient list              (main page)
    ├── Patient card              (individual page)
    │   ├── Tab: General
    │   ├── Tab: Visits
    │   └── Tab: Financials
    └── GeSY Import               (separate page)
```

---

## 3. Page: Patient List

### 3.1 Patients Table

| Column | Source | Sortable |
|---|---|---|
| Name | Manual / GeSY | Yes |
| GeSY ID | GeSY | — |
| Type | GeSY / Private | Filter |
| Last visit | Auto | Yes |
| Total visits | Auto | Yes |
| Status | Active / Discharged | Filter |
| Outstanding balance | Auto (private only) | — |

### 3.2 Search and Filters

- Search bar: by name or GeSY ID (real-time)
- Filters: Patient type (GeSY / Private / All), Status (Active / Discharged / All)
- Button **"+ Add patient"** — opens a creation form (private patients only)

### 3.3 Adding a New Private Patient

Modal with a minimal form:

**Required fields:**
- First and last name
- Phone number

**Optional fields:**
- Email
- Date of birth
- Preferred contact channel (WhatsApp / SMS / Email)
- Language (EN / RU / GR)

"Save" button — creates the record and immediately opens the patient card.

---

## 4. Page: Patient Card

Opens on row click in the list. Header shows the patient's name, type badge (GeSY or Private), and a "Back to list" link.

---

### 4.1 Tab: General

Split into two parts: **GeSY fields** (read-only) and **clinic fields** (editable).

#### Block: Personal Details (editable)

| Field | Type | Required |
|---|---|---|
| Full name | Text | Yes |
| Date of birth | Date | No |
| Phone | Phone | Yes |
| Email | Email | No |
| Preferred channel | Dropdown | No |
| Language | Dropdown | No |
| Emergency contact | Text | No |

#### Block: GeSY Data (read-only, grey background)

Shown only for GeSY patients. Fields are locked, with a lock icon on hover.

| Field | Source |
|---|---|
| GeSY ID (Έγγραφο Ταυτοποίησης) | GeSY |
| Full name from GeSY (Δικαιούχος) | GeSY |
| Exempt status | Auto: copay = 0 across all visits |

Helper text below the block: *"These fields are filled automatically from GeSY exports and cannot be edited."*

#### Block: Clinical Data (editable)

| Field | Type |
|---|---|
| Chief complaint | Text |
| Diagnosis (ICD-10) | Text |
| Affected area | Text |
| Therapy methods | Multi-select: Manual therapy / TENS / Exercise therapy / Ultrasound / Other |
| Treatment goal | Text area |
| Home programme | Text area |
| Contraindications | Text area |
| Allergies / medications | Text area |
| Planned sessions | Number (used for progress bar on Visits tab) |

#### Block: Notes and Tags

- Free-text notes field (text area)
- Tags: add custom tags (pill component with × to remove)
- Referral source: dropdown (Referral / GeSY / Walk-in / Social media / Other)

**"Save changes" button** — fixed at the bottom of the page, active only when there are unsaved changes.

---

### 4.2 Tab: Visits

A single chronological list of all visits — both GeSY and private. Each visit is labelled with a type badge.

#### Visits Table

| Column | Description |
|---|---|
| Date | Visit date |
| Type | Badge: "GeSY" (blue) or "Private" (green) |
| Procedure / Tariff | GeSY: tariff (1.45 / 1.75); Private: free text |
| Total | Full visit amount |
| GeSY payment | GeSY visits only |
| Patient payment | Copay or private payment |
| Status | GeSY: Paid / Submitted / Directed. Private: Paid / Unpaid |
| Session note | Short text, if added |

GeSY rows are read-only — grey background, lock icon on hover.  
Private rows are clickable to edit.

#### Adding a Private Visit

**"+ Add visit"** button above the table. Opens a form:

| Field | Type | Required |
|---|---|---|
| Visit date | Date (default: today) | Yes |
| Procedure / description | Text | No |
| Amount | Number (€) | Yes |
| Payment status | Paid / Unpaid | Yes |
| Payment date | Date (if Paid) | No |
| Session note | Text area | No |

#### Treatment Progress (if planned sessions is set)

Progress bar: "N of X sessions" — calculated automatically from total visit count.

---

### 4.3 Tab: Financials

For **GeSY patients** — data from the import, view only.

#### Summary Metrics

Four metric cards at the top:
- **Total visits** — all visits in the current period
- **Total revenue** — sum of all visits (€)
- **Received from GeSY** — sum of paid GeSY claims
- **Patient paid** — copay from the patient

#### Claim Status (GeSY only)

Horizontal progress bar with three segments:
- Green: Paid
- Blue: Submitted
- Orange: Directed to payment

Below the bar: *"Awaiting from GeSY: ~€ X"*

#### For **private patients**

- Visit list with amounts and payment statuses
- Total outstanding balance (unpaid visits)
- **"Mark as paid"** button on each unpaid row — one click to resolve

---

## 5. Page: GeSY Import

Path: `Patients → GeSY Import`

### 5.1 Upload Interface

```
┌─────────────────────────────────────────┐
│  Upload GeSY Export                      │
│                                          │
│  [ Drop Excel file here or click ]       │
│  Accepts: .xlsx, .xls                    │
│                                          │
│  Last import: 10 Mar 2026, 47 records    │
└─────────────────────────────────────────┘
```

### 5.2 Import Flow — 3 Steps

**Step 1: File upload**  
User drags or selects an Excel file.

**Step 2: Preview**  
The system shows the first 10 rows and a summary:
- Records found: N
- New patients: X
- New visits: Y
- Already imported (duplicates): Z — shown in grey, will be skipped

Buttons: **"Confirm import"** / **"Cancel"**

**Step 3: Result**  
Green banner: *"Import complete. Added X visits for Y patients."*  
Or a red banner with an error description if the file is unrecognised.

### 5.3 Import Rules

- GeSY ID (`Έγγραφο Ταυτοποίησης`) is the patient deduplication key
- Date + GeSY ID + amount = visit deduplication key (re-uploading the same file creates no duplicates)
- All imported fields are flagged `source: "gesy"` and are locked in the UI
- If a patient with the same GeSY ID already exists (created manually as private), new visits are added to the existing card and the GeSY ID is attached to it

### 5.4 Field Mapping: Excel → Database

| Excel (Greek) | DB field | Type |
|---|---|---|
| Έγγραφο Ταυτοποίησης | `gesy_patient_id` | string, unique |
| Δικαιούχος | `gesy_full_name` | string |
| Ημ. Τιμολογίου | `visit_date` | date |
| Ημ. Υποβολής | `submission_date` | date |
| Συνολικό Ποσό | `total_amount` | decimal |
| Αμοιβή από ΟΑΥ | `gesy_payment` | decimal |
| Συμπλ. | `copay` | decimal |
| Μονάδες | `units` | decimal |
| Status | `claim_status` | enum: paid / submitted / directed |

---

## 6. Data Model (simplified)

```
patients
  id                    UUID, PK
  gesy_patient_id       string, nullable, unique
  first_name            string
  last_name             string
  phone                 string
  email                 string, nullable
  date_of_birth         date, nullable
  preferred_channel     enum: whatsapp / sms / email
  language              enum: en / ru / gr
  patient_type          enum: gesy / private
  status                enum: active / discharged
  source                enum: referral / gesy / walk-in / social / other
  emergency_contact     string, nullable

  // Clinical
  chief_complaint       text, nullable
  diagnosis             string, nullable
  treatment_methods     string[]
  treatment_goal        text, nullable
  home_programme        text, nullable
  contraindications     text, nullable
  allergies             text, nullable
  planned_sessions      integer, nullable

  notes                 text, nullable
  tags                  string[]
  created_at            timestamp
  updated_at            timestamp

visits
  id                    UUID, PK
  patient_id            UUID, FK → patients
  visit_date            date
  source                enum: gesy / private

  // GeSY-only (read-only)
  gesy_submission_date  date, nullable
  gesy_total_amount     decimal, nullable
  gesy_payment          decimal, nullable
  gesy_copay            decimal, nullable
  gesy_units            decimal, nullable
  gesy_claim_status     enum: paid / submitted / directed, nullable
  gesy_import_id        UUID, nullable (reference to import batch)

  // Private-only (editable)
  procedure_description string, nullable
  private_amount        decimal, nullable
  private_paid          boolean, default false
  private_paid_date     date, nullable

  // Both
  session_note          text, nullable
  created_at            timestamp

gesy_imports
  id                    UUID, PK
  filename              string
  imported_at           timestamp
  records_total         integer
  records_new           integer
  records_duplicate     integer
  imported_by           string
```

---

## 7. UX Requirements

### Principles

- **Minimum clicks.** The doctor should reach any patient card within 2 clicks from the main screen.
- **Nothing breaks by accident.** GeSY fields are visually distinct from editable fields — grey background and a lock icon. It should be impossible to accidentally change them.
- **Consistent status colours.** Paid = green, Submitted = blue, Directed = orange. Applied everywhere a status appears.
- **No autosave.** One explicit "Save changes" button, fixed at the bottom of the page. It appears only when changes are pending.
- **Import is safe.** Always show a preview before confirming. No automatic actions without user confirmation.

### User Feedback

- Toast notifications on save / error
- Loading indicator during import
- Empty states with helpful text: *"No visits yet. Add the first visit manually or import a GeSY file."*

---

## 8. Out of Scope

- User authentication and roles — single user, single doctor
- Automated reminders and notifications
- Online appointment booking
- GeSY API integration — manual Excel upload only
- Mobile version — desktop only (tablet optional)

---

## 9. Recommended Build Order

1. **Database schema** — patients + visits + gesy_imports tables
2. **GeSY import** — Excel parsing, deduplication, preview, save
3. **Patient list** — table, search, filters
4. **Patient card** — General + Visits + Financials tabs
5. **Add private visit** — form and save
6. **UX polish** — empty states, toasts, GeSY field locking

---

*This document is written for direct use with Claude Code. All fields and logic are described in sufficient detail to implement without follow-up questions.*
