# Technical Specification: Patient Reliability Score & AI Assistant

**Project:** Admin Panel — Patients Module (Extensions)
**Version:** 1.0
**Date:** 2026-03-19
**Depends on:** `patient_admin_spec_en.md` (base Patients module)

---

## Module 1: Patient Reliability Score (PRS)

### 1.1 Methodology

Adapted from the **Customer Health Score** model (SaaS industry), validated against healthcare no-show prediction research (PMC, Oxford Academic) and patient engagement metrics (athenahealth, PAM).

There is no single industry-standard patient reliability index in physiotherapy. This system combines automated data (visits, payments) with manual clinician input (punctuality, compliance, communication) into a single weighted score.

### 1.2 Formula

```
PRS = (Attendance × 0.35) + (Payment × 0.25) + (Punctuality × 0.15) + (Compliance × 0.15) + (Communication × 0.10)
```

Each sub-score: **0–100**. Total: **0–100**.
Window: **rolling 180 days** (events older than 180 days stop affecting the score).

### 1.3 Five Metrics

| # | Metric | Weight | Data Source | Calculation |
|---|--------|--------|-------------|-------------|
| 1 | **Attendance** | 35% | Auto from visits | 100 − (no-shows × 20) − (late cancels × 10). Rolling 180 days |
| 2 | **Payment** | 25% | Auto from financials | 100 − (overdue invoices × 15). Balance >30 days overdue = 0 |
| 3 | **Punctuality** | 15% | Manual: clinician marks | 100 − (late arrivals × 15). "Late" = >10 min |
| 4 | **Compliance** | 15% | Manual: clinician rates 1–5 | Conversion: 1→0, 2→25, 3→50, 4→75, 5→100 |
| 5 | **Communication** | 10% | Manual: clinician marks | 100 − (unreachable × 20) − (rude/difficult × 15) |

### 1.4 Tiers

| Tier | Range | Color | Behavior |
|------|-------|-------|----------|
| **Reliable** | 71–100 | Green | Normal mode |
| **At Risk** | 31–70 | Yellow | Warning badge in patient card. Recommendation: increase reminders, discuss barriers |
| **Problematic** | 0–30 | Red | Alert banner in patient card. Recommendation: require prepayment, limit booking, consider discharge |

### 1.5 UI: Where the Score Appears

#### Patient List — new column

| Column | Display |
|--------|---------|
| Score | Colored badge: `85 🟢` / `45 🟡` / `18 🔴` |

Sortable and filterable by tier.

#### Patient Card — header

Donut chart indicator next to the patient's name showing the PRS score and tier color. On click — expands into a **breakdown panel** with:
- Spider/radar chart showing all 5 sub-scores
- Trend line: score over the last 6 months
- Last 5 behavior events

#### Patient Card — "Behavior Log" section (General tab)

A timeline of all behavioral events, both automatic and manual.

**"+ Log event" button** opens a quick form:

| Field | Type | Description |
|-------|------|-------------|
| Date | Date (default: today) | When the event occurred |
| Event type | Dropdown | No-show / Late cancel / Late arrival / Rude behavior / Unreachable / Missed payment / Positive feedback |
| Note | Text area | Optional comment |

### 1.6 Automatic Events

The system creates behavior log entries automatically:

| Event | Trigger | Score Impact |
|-------|---------|--------------|
| **Visit completed** | Visit is marked as attended | Positive (counterweight) |
| **Payment overdue** | Invoice unpaid for >30 days (from Financials tab) | −15 to Payment sub-score |
| **No-show** | Booked visit marked as no-show by clinician | −20 to Attendance sub-score |

### 1.7 Manual Quick-Mark Events

One-tap buttons available on the patient card and on individual visit rows:

| Button | Event Type | Sub-score Affected |
|--------|-----------|-------------------|
| ⏰ Came late | `late_arrival` | Punctuality −15 |
| ❌ No-show | `no_show` | Attendance −20 |
| 📵 Unreachable | `unreachable` | Communication −20 |
| ⚠️ Late cancel | `late_cancel` | Attendance −10 |
| ⭐ Great compliance | `positive_feedback` | Compliance +10 |

### 1.8 Score Recalculation

- Recalculated on every new event
- Window: **rolling 180 days** — events older than 180 days stop affecting the score
- Lifetime score stored separately (for analytics/reporting only, not displayed to clinician by default)

### 1.9 GeSY Registration Tracking

Physiotherapists must register every GeSY patient visit in the GeSY system to receive payment. The admin panel tracks this.

#### Visit Row — "Registered in GeSY" Button

Each visit row (for GeSY patients) shows a toggle/button:

| State | Display | Action |
|-------|---------|--------|
| Not registered | Grey button: "Register in GeSY" | Click → marks as registered, saves timestamp |
| Registered | Green checkmark + date: "✓ Registered 15 Mar" | Click → undo (with confirmation) |

**Data stored per visit:**

| Field | Type |
|-------|------|
| `gesy_registered` | boolean, default false |
| `gesy_registered_at` | timestamp, nullable |
| `gesy_registered_by` | string, nullable |

#### Dashboard Alert

If a GeSY visit is **>3 days old and not marked as registered**, the system shows a warning:
- On the visit row: orange badge "⚠️ Not registered"
- In the AI assistant suggestions (see Module 2)
- In a dedicated "Unregistered GeSY Visits" counter on the patient list page header

### 1.10 Ethics and Safeguards

- **Clinician override**: the doctor can manually upgrade/downgrade a tier with a comment (e.g., "patient has transportation issues — not penalizing no-shows")
- **Decay**: events older than 180 days stop affecting the score
- **Not for denying care**: the score affects scheduling and payment policy only, never clinical decisions
- **Transparency**: cancellation/no-show policy is signed by the patient at intake
- **Uniform application**: rules apply equally to all patients
- **Appeal step**: before any penalty (prepayment requirement, booking restriction), the system recommends a conversation with the patient first

### 1.11 Data Model (Additions)

```sql
-- Behavior events log
behavior_events (
  id                    UUID PRIMARY KEY,
  patient_id            UUID REFERENCES patients(id),
  event_date            DATE NOT NULL,
  event_type            TEXT NOT NULL,  -- no_show | late_cancel | late_arrival |
                                        -- rude | unreachable | missed_payment |
                                        -- positive_feedback | visit_completed
  note                  TEXT,
  auto_generated        BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMP DEFAULT NOW()
)

-- New fields on patients table
ALTER TABLE patients ADD COLUMN
  reliability_score       INTEGER,          -- 0-100, computed
  reliability_tier        TEXT,             -- reliable | at_risk | problematic
  compliance_rating       INTEGER,          -- 1-5, manual clinician rating
  score_override          TEXT,             -- NULL | upgraded | downgraded
  score_override_note     TEXT,
  score_updated_at        TIMESTAMP;

-- New fields on visits table (GeSY registration tracking)
ALTER TABLE visits ADD COLUMN
  gesy_registered         BOOLEAN DEFAULT FALSE,
  gesy_registered_at      TIMESTAMP,
  gesy_registered_by      TEXT;
```

---

## Module 2: AI Clinical Agent

### 2.1 Concept

An **agentic AI assistant** (Claude API with tool use) that can autonomously read patient data from the database, take actions (create reminders, mark GeSY visits, log events), and proactively surface insights. Not a simple chatbot — a full agent with 14 tools. Accessible from three interfaces: admin panel widget, Telegram bot, and scheduled proactive tasks.

### 2.2 UX: Three Modes

#### A. Floating Chat Widget (primary)

A button in the bottom-right corner on **all admin panel pages**. On click — expands into a chat panel (~400px wide).

```
┌──────────────────────────────────────────────┐
│  Patient Card: Γιάννης Π.         [Score: 85]│
│  ┌──────────────────────┐  ┌───────────────┐ │
│  │ General│Visits│Financ│  │ 🤖 Assistant  │ │
│  │                      │  │               │ │
│  │  [patient data...]   │  │ 📋 Summary:   │ │
│  │                      │  │ 12 visits in  │ │
│  │                      │  │ 3 months,     │ │
│  │                      │  │ ROM improved  │ │
│  │                      │  │ 15°→40°...    │ │
│  │                      │  │               │ │
│  │                      │  │ ⚠️ 2 GeSY     │ │
│  │                      │  │ visits not    │ │
│  │                      │  │ registered    │ │
│  │                      │  │               │ │
│  │                      │  │ [Ask...]      │ │
│  └──────────────────────┘  └───────────────┘ │
└──────────────────────────────────────────────┘
```

- If a patient card is open → AI automatically receives that patient's context
- If the patient list is open → AI works in general mode (can search across patients)
- Chat history is saved per patient

#### B. Contextual Suggestions (proactive)

The AI analyzes the patient when the card is opened and shows **badges/alerts**:

| Trigger | Message | Priority |
|---------|---------|----------|
| Last visit >21 days ago | "Patient hasn't visited in 3 weeks. Follow up?" | Medium |
| Planned sessions almost done | "8 of 10 planned sessions done. Consider reassessment" | High |
| Score dropped to Yellow/Red | "Reliability score dropped to 42. 2 no-shows last month" | High |
| Missing diagnosis/treatment goal | "Missing diagnosis and treatment goal. Complete before next visit?" | Low |
| Balance >€100 outstanding | "Outstanding balance: €145. Discuss payment plan?" | Medium |
| Patient birthday approaching | "Patient's birthday is in 3 days" | Low |
| **GeSY visit not registered (>3 days)** | **"2 GeSY visits from last week not registered. Register now?"** | **High** |
| **GeSY visit in last 3 days** | **"Reminder: register yesterday's GeSY visit"** | **Medium** |

Display: **notification dot** on the AI icon + expandable list on click. Max 3–5 suggestions per card opening.

#### C. Quick Actions (preset commands)

Buttons in the chat panel or slash-commands:

| Command | Action |
|---------|--------|
| `/summary` | Summarizes the patient's full history in 5–7 sentences |
| `/last-visits` | Brief overview of the last 5 visits |
| `/treatment-plan` | Generates/updates a treatment plan based on current data |
| `/letter` | Writes a referral letter or discharge summary |
| `/exercise` | Suggests exercises based on diagnosis and affected area |
| `/remind` | Creates a reminder for the clinician (in N days) |
| `/compare` | Compares current state with first visit (progress report) |
| **`/gesy-check`** | **Lists all GeSY visits not yet registered. One-click to mark as registered** |
| **`/gesy-remind`** | **Creates a reminder to register recent GeSY visits (visits from last 3 days)** |

### 2.3 Context Sent to AI

On each request, the AI receives a structured context bundle:

```typescript
interface AIContext {
  // Always included when patient card is open
  patient: {
    demographics: {
      name: string;
      dateOfBirth: Date;
      phone: string;
      language: 'en' | 'ru' | 'gr';
      patientType: 'gesy' | 'private';
      status: 'active' | 'discharged';
      gesyId?: string;
    };
    clinical: {
      chiefComplaint: string;
      diagnosis: string;
      affectedArea: string;
      treatmentMethods: string[];
      treatmentGoal: string;
      homeProgramme: string;
      contraindications: string;
      allergies: string;
      plannedSessions: number;
    };
    score: {
      total: number;       // 0-100
      tier: string;        // reliable | at_risk | problematic
      attendance: number;
      payment: number;
      punctuality: number;
      compliance: number;
      communication: number;
    };
    tags: string[];
    notes: string;
  };

  // Loaded on demand
  visits: Visit[];              // last 10 by default, all if requested
  behaviorLog: BehaviorEvent[]; // last 20
  financials: {
    totalOwed: number;
    lastPaymentDate: Date;
    unregisteredGesyVisits: Visit[];  // GeSY visits not yet marked as registered
  };

  // System context
  clinic: {
    therapists: Therapist[];
    services: Service[];
    currentDate: Date;
  };
}
```

### 2.4 GeSY Registration — AI Integration

The AI assistant has a special focus on GeSY registration because missed registrations = lost revenue.

**Proactive flow:**
1. Every time a patient card opens, the AI checks for GeSY visits in the last 7 days where `gesy_registered = false`
2. If found → high-priority suggestion: "N GeSY visits not registered"
3. The suggestion includes a **"Register all"** action button that marks all listed visits as registered in one click

**Daily summary (on dashboard):**
- AI generates a daily alert: "You have X unregistered GeSY visits across Y patients"
- Clicking opens a list grouped by patient, with bulk "Register" buttons

**`/gesy-check` command output example:**
```
📋 Unregistered GeSY visits:

1. Γιάννης Π. — 16 Mar (3 days ago) — €25.00
2. Γιάννης Π. — 18 Mar (1 day ago) — €25.00
3. Μαρία Κ. — 17 Mar (2 days ago) — €15.00

Total: 3 visits, €65.00 pending

[Register all] [Register individually]
```

### 2.5 Reminders System

The AI can create and manage reminders:

| Field | Type |
|-------|------|
| Patient | FK → patients (nullable — can be general reminder) |
| Reminder text | Text |
| Due date | Date |
| Status | pending / done / dismissed |
| Created by | ai / manual |

**Display:**
- Reminders appear as a notification badge in the top nav bar
- On click — list of pending reminders sorted by due date
- Each reminder has: "Done" / "Snooze (1 day)" / "Dismiss" actions

**AI-created reminders:**
- `/remind` command: "Remind me to check Γιάννης ROM in 2 weeks" → creates a reminder for 2026-04-02
- `/gesy-remind` command: creates reminders for all unregistered GeSY visits
- Proactive: AI suggests reminders when treatment milestones approach

### 2.6 Technical Architecture

**LLM:** Claude API (Anthropic) — Max subscription with API access. Claude Sonnet for the agentic loop (speed + cost for multiple tool calls).

**Architecture:** Firebase Cloud Function as agent backend. Runs an agentic loop: Claude decides which tools to call → function executes them against Firestore → feeds results back → repeats until final answer.

**Three interfaces to the same agent:**

| Interface | When | How |
|-----------|------|-----|
| **Admin panel widget** | At the desk | React floating chat panel. Write actions need modal confirmation |
| **Telegram bot** | On the go / mobile | Full agent chat. Write actions via inline keyboard buttons |
| **Scheduled (proactive)** | Automatic | Morning brief, GeSY alerts, payment reminders. Agent initiates, sends to Telegram + dashboard |

**Agent tools (14 total):**

Read tools (9): `get_patient`, `search_patients`, `get_visits`, `get_behavior_events`, `get_reliability_score`, `get_schedule`, `get_outstanding_balances`, `get_unregistered_gesy`, `get_clinic_stats`

Write tools (5, require confirmation): `create_reminder`, `mark_gesy_registered`, `add_behavior_event`, `update_patient_notes`, `update_booking_status`

Full tool specifications and agentic loop implementation → see `architecture.md` section 6.

### 2.7 Privacy & Security

- **Audit log**: every agent interaction logged (who, when, which patient, tools called, response)
- **No training**: Claude API does not train on API inputs
- **Minimal context**: agent fetches only what it needs via tools, not the entire database
- **Patient consent**: AI usage disclosure included in the intake form
- **Write safety**: write tools require explicit user confirmation (admin panel: modal, Telegram: inline button). Proactive tasks can only auto-execute safe writes (reminders)
- **Auth**: Firebase Auth token required for admin panel calls. Telegram bot restricted to authorized chat ID
- **No AI-only decisions**: agent recommends, the clinician decides

### 2.8 Data Model (Additions)

```sql
-- AI conversation threads
ai_conversations (
  id                    UUID PRIMARY KEY,
  patient_id            UUID REFERENCES patients(id),  -- nullable for general queries
  started_at            TIMESTAMP DEFAULT NOW(),
  last_message_at       TIMESTAMP
)

-- Individual messages in a conversation
ai_messages (
  id                    UUID PRIMARY KEY,
  conversation_id       UUID REFERENCES ai_conversations(id),
  role                  TEXT NOT NULL,    -- user | assistant | system
  content               TEXT NOT NULL,
  context_snapshot      JSONB,           -- what patient data was sent with this message
  tokens_used           INTEGER,
  model                 TEXT,            -- e.g. claude-opus-4-6, gpt-4o
  created_at            TIMESTAMP DEFAULT NOW()
)

-- Proactive AI suggestions
ai_suggestions (
  id                    UUID PRIMARY KEY,
  patient_id            UUID REFERENCES patients(id),
  suggestion_type       TEXT NOT NULL,    -- overdue_visit | score_drop | gesy_unregistered |
                                          -- missing_data | balance_due | birthday | sessions_ending
  message               TEXT NOT NULL,
  priority              TEXT NOT NULL,    -- low | medium | high
  status                TEXT DEFAULT 'pending',  -- pending | dismissed | acted_on
  created_at            TIMESTAMP DEFAULT NOW(),
  dismissed_at          TIMESTAMP
)

-- Clinician reminders (AI-created or manual)
ai_reminders (
  id                    UUID PRIMARY KEY,
  patient_id            UUID REFERENCES patients(id),  -- nullable for general reminders
  reminder_text         TEXT NOT NULL,
  due_date              DATE NOT NULL,
  status                TEXT DEFAULT 'pending',  -- pending | done | dismissed
  created_by            TEXT NOT NULL,    -- ai | manual
  created_at            TIMESTAMP DEFAULT NOW(),
  completed_at          TIMESTAMP
)
```

---

## 3. Combined Data Model Summary

All additions to the base schema from `patient_admin_spec_en.md`:

### New Tables
- `behavior_events` — patient behavior tracking for PRS
- `ai_conversations` — AI chat threads
- `ai_messages` — individual AI messages
- `ai_suggestions` — proactive AI suggestions
- `ai_reminders` — clinician reminders

### Modified Tables

**`patients`** — new columns:
- `reliability_score` (INTEGER)
- `reliability_tier` (TEXT)
- `compliance_rating` (INTEGER)
- `score_override` (TEXT)
- `score_override_note` (TEXT)
- `score_updated_at` (TIMESTAMP)

**`visits`** — new columns:
- `gesy_registered` (BOOLEAN)
- `gesy_registered_at` (TIMESTAMP)
- `gesy_registered_by` (TEXT)

---

## 4. Recommended Build Order

Building on the base module (patient list, patient card, GeSY import):

1. **GeSY Registration Tracking** — `gesy_registered` field on visits + button UI + "unregistered" alerts
2. **Behavior Log** — `behavior_events` collection + quick-mark buttons + timeline UI
3. **PRS Calculation** — scoring formula + display in list and card header
4. **AI Agent Core** — Cloud Function with agentic loop + 14 tools + system prompt
5. **Admin Panel Widget** — floating chat panel + pending action confirmations + quick commands
6. **Telegram Bot** — webhook + two-way agent chat + inline buttons for confirmations
7. **Proactive Agent** — scheduled functions: morning brief, GeSY alerts, payment reminders → Telegram + dashboard
8. **Reminders System** — creation, display, snooze/dismiss (from all three interfaces)

---

## 5. UX Requirements (Additions)

### Principles (extending base spec)

- **Score is informational, not punitive.** The PRS helps the clinician manage their schedule and identify patients who may need extra support — not to judge character.
- **AI assists, never decides.** Every AI suggestion requires explicit clinician action. No automated actions without confirmation.
- **GeSY registration is critical.** Unregistered visits = lost revenue. The system should make it impossible to forget.
- **Alert fatigue prevention.** Max 3–5 proactive suggestions per patient card opening. Clinicians can configure notification preferences. Consistently dismissed suggestion types are auto-suppressed.

### Status Colors (consistent with base spec)

- **Score Green (Reliable):** `#22C55E`
- **Score Yellow (At Risk):** `#F59E0B`
- **Score Red (Problematic):** `#EF4444`
- **GeSY Registered:** Green checkmark
- **GeSY Not Registered (>3 days):** Orange warning badge
- **AI Suggestion High Priority:** Red dot
- **AI Suggestion Medium Priority:** Orange dot
- **AI Suggestion Low Priority:** Grey dot

---

*This specification extends `patient_admin_spec_en.md`. Both documents together form the complete Patients module spec.*
