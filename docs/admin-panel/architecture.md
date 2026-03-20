# Admin Panel Architecture — React + TypeScript

**Project:** Right Track Physiotherapy — Admin Panel v2
**Date:** 2026-03-19
**Stack:** Vite + React 18 + TypeScript + Firebase

---

## 1. Tech Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| **Build tool** | Vite | Fastest DX, no SSR needed for private SPA. CRA deprecated, Next.js overkill for single-user admin |
| **Framework** | React 18 + TypeScript | Standard, typed, componentized |
| **Routing** | React Router v6 | BrowserRouter (Firebase Hosting handles SPA rewrites) |
| **State** | Zustand | Minimal boilerplate, no providers. One store per domain. Redux overkill for single user |
| **Server state** | TanStack Query v5 | Caching, background refetch, optimistic updates, real-time listener bridge |
| **UI** | shadcn/ui + Tailwind CSS | Copy-paste components, no lock-in, Tailwind-native. Preserves navy/orange palette |
| **Forms** | React Hook Form + Zod | Performant forms with TypeScript-first validation |
| **Charts** | Recharts | Lighter than Chart.js in React, composable, TS-native |
| **Excel parsing** | SheetJS (xlsx) | Client-side GeSY Excel import, no server needed |
| **Dates** | date-fns | Tree-shakeable, functional API |
| **AI backend** | Firebase Cloud Functions v2 + Anthropic SDK | Agentic loop with tool use, keeps API key server-side |
| **Voice-to-text** | OpenAI Whisper API | Best multilingual (EN/EL/RU), $0.006/min, trivial integration |
| **Telegram bot** | Telegram Bot API + webhook | Two-way agent interface: text, voice, inline buttons |
| **Hosting** | Firebase Hosting | SPA rewrites, preview channels, same project as Firestore |

---

## 2. Project Structure

```
/admin/                              # Vite project root (separate from static site)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── index.html
└── src/
    ├── main.tsx                     # Entry point, providers
    ├── App.tsx                      # Router setup
    │
    ├── types/                       # Shared TypeScript types
    │   ├── booking.ts
    │   ├── patient.ts               # Patient, BehaviorEvent, PRS
    │   ├── therapist.ts
    │   ├── service.ts
    │   ├── gesy.ts                  # GeSY import/registration types
    │   └── ai.ts                    # ChatMessage, QuickCommand, Suggestion
    │
    ├── lib/                         # Core infrastructure
    │   ├── firebase.ts              # Firebase app init, auth, db exports
    │   ├── firestore.ts             # Generic typed Firestore helpers
    │   ├── hooks/
    │   │   ├── useAuth.ts           # Auth state hook
    │   │   ├── useBookings.ts       # TanStack Query + Firestore
    │   │   ├── usePatients.ts       # Patient queries + PRS
    │   │   ├── useTherapists.ts
    │   │   ├── useServices.ts
    │   │   └── useRealtimeCollection.ts  # onSnapshot → React Query bridge
    │   └── stores/
    │       ├── uiStore.ts           # Sidebar, modals, toasts (Zustand)
    │       └── agentStore.ts        # AI agent: messages, pending actions, context (Zustand)
    │
    ├── services/                    # Firebase service layer (pure async functions)
    │   ├── bookingService.ts        # Bookings CRUD + queries
    │   ├── patientService.ts        # Patients CRUD, behavior events
    │   ├── therapistService.ts
    │   ├── serviceService.ts
    │   ├── gesyService.ts           # GeSY registration + import
    │   ├── analyticsService.ts      # Aggregation queries
    │   └── agentService.ts           # Cloud Function calls (agent + confirm actions)
    │
    ├── components/
    │   ├── ui/                      # shadcn/ui (Button, Dialog, Input, etc.)
    │   ├── layout/
    │   │   ├── AppLayout.tsx        # Sidebar + header + main content
    │   │   ├── Sidebar.tsx
    │   │   ├── Header.tsx
    │   │   └── NotificationBell.tsx
    │   └── common/
    │       ├── DataTable.tsx        # Reusable sortable/filterable table
    │       ├── StatCard.tsx
    │       ├── FilterBar.tsx
    │       ├── ConfirmDialog.tsx
    │       └── Toast.tsx
    │
    ├── features/                    # Feature modules (each = a route)
    │   ├── bookings/
    │   │   ├── BookingsPage.tsx
    │   │   ├── BookingDetailModal.tsx
    │   │   ├── BookingForm.tsx
    │   │   ├── BookingTable.tsx
    │   │   └── BookingFilters.tsx
    │   │
    │   ├── calendar/
    │   │   ├── CalendarPage.tsx
    │   │   ├── CalendarGrid.tsx
    │   │   └── DayDetailModal.tsx
    │   │
    │   ├── patients/                # CRM module
    │   │   ├── PatientsPage.tsx     # List + search + filters
    │   │   ├── PatientCard.tsx      # Full profile page
    │   │   ├── tabs/
    │   │   │   ├── GeneralTab.tsx   # Demographics, clinical, notes, tags
    │   │   │   ├── VisitsTab.tsx    # Visit history + GeSY registration
    │   │   │   └── FinancialsTab.tsx # Payments, balance, PRS breakdown
    │   │   ├── PatientReliabilityBadge.tsx  # Donut score indicator
    │   │   ├── BehaviorLog.tsx      # Timeline + quick-mark buttons
    │   │   └── GesyImportDialog.tsx # Excel upload + preview + confirm
    │   │
    │   ├── therapists/
    │   │   ├── TherapistsPage.tsx
    │   │   └── TherapistForm.tsx
    │   │
    │   ├── services/
    │   │   ├── ServicesPage.tsx
    │   │   └── ServiceForm.tsx
    │   │
    │   ├── analytics/
    │   │   ├── AnalyticsPage.tsx
    │   │   ├── KPICards.tsx
    │   │   └── charts/
    │   │       ├── SourcesChart.tsx
    │   │       ├── PaymentChart.tsx
    │   │       ├── TrendChart.tsx
    │   │       └── WorkloadChart.tsx
    │   │
    │   ├── statistics/
    │   │   ├── StatisticsPage.tsx
    │   │   └── TherapistReport.tsx
    │   │
    │   └── ai-agent/                 # Agentic AI assistant
    │       ├── AIAgentWidget.tsx     # FAB button + chat panel
    │       ├── ChatMessage.tsx      # Message bubble (text, actions, confirmations)
    │       ├── QuickCommands.tsx    # Preset command buttons
    │       ├── PendingActions.tsx   # Confirmation UI for write tools
    │       ├── MorningBrief.tsx     # Dashboard card with daily brief
    │       └── useAIAgent.ts       # Agent hook (send, confirm actions)
    │
    └── utils/
        ├── prs.ts                   # PRS calculation (180-day rolling)
        ├── gesyExcel.ts             # SheetJS column mapping + parsing
        ├── formatters.ts            # Date, currency, phone
        └── constants.ts             # Status labels, colors, etc.

/functions/                          # Firebase Cloud Functions
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                     # Function exports
    ├── agent/
    │   ├── agent-handler.ts         # Agentic loop: Claude API + tool execution
    │   ├── tools.ts                 # 14 tool definitions (read + write)
    │   ├── tool-executor.ts         # Firestore read/write per tool
    │   ├── system-prompt.ts         # System prompt builder
    │   └── types.ts                 # AgentResponse, PendingAction, etc.
    ├── proactive/
    │   ├── morning-brief.ts         # Scheduled (08:00): daily brief → Telegram
    │   ├── gesy-alerts.ts           # Scheduled (09:00): unregistered visit alerts
    │   ├── overdue-payments.ts      # Scheduled (Mon 09:00): weekly payment reminders
    │   └── proactive-runner.ts      # Shared: runs agent with proactive prompt, sends to Telegram
    ├── telegram/
    │   ├── bot.ts                   # Telegram bot: text + voice + callbacks → agent → reply
    │   ├── voice.ts                 # Voice message: download .ogg → Whisper API → text
    │   ├── conversation.ts          # Load/save conversation threads (memory)
    │   ├── notify.ts                # Outbound: booking notifications
    │   └── formatting.ts            # Markdown formatting for Telegram messages
    └── shared/
        ├── firebase.ts              # Admin SDK init
        └── constants.ts             # Clinic context, therapist list, etc.
```

---

## 3. Firebase Integration Pattern

### Service Layer → React Query → Components

```
Component ← useBookings() ← TanStack Query ← bookingService.getBookings() ← Firestore
                                    ↑
                          useRealtimeCollection()  (onSnapshot invalidates cache)
```

**Service layer** (`services/*.ts`): Pure async functions that call Firestore. Return typed data. No React dependencies.

**React Query hooks** (`lib/hooks/*.ts`): Wrap service functions. Handle caching (5-min stale time), loading/error states, background refetch.

**Real-time bridge** (`useRealtimeCollection`): Firestore `onSnapshot` listener that invalidates React Query cache on changes. Used for bookings and notifications only (not all collections).

**Mutations**: Use `useMutation` with optimistic updates. On save → update local cache immediately → write to Firestore → rollback on error.

---

## 4. Firestore Data Model

### Existing Collections (no changes)

```
bookings/       → Booking documents (existing data preserved)
therapists/     → Therapist profiles
services/       → Service definitions
```

### New Collections

```
patients/                           # Patient records
  {patientId}/
    → Patient document (demographics, clinical, notes, tags)
    behaviorEvents/                 # Subcollection
      {eventId}/
        → BehaviorEvent document

gesyImports/                        # Import batch log
  {importId}/
    → Import metadata (filename, counts, timestamp)

agentConversations/                 # Agent conversation threads (with memory)
  {conversationId}/
    → chatId, interface (telegram|admin), lastMessageAt
    messages/                       # Subcollection (last 50 kept, 7-day TTL)
      {messageId}/
        → role, content, toolCalls[], toolResults[], timestamp

reminders/                          # Clinician reminders
  {reminderId}/
    → Reminder (patientId, text, dueDate, status)
```

### Extended Fields on Existing Collections

**bookings** (new fields):
```typescript
patientId?: string;                 // FK to patients collection
paymentStatus?: 'paid' | 'unpaid';  // Default: 'unpaid' for private, 'paid' for GeSY
paymentMethod?: 'cash' | 'card' | 'transfer';
paidAt?: Timestamp;
gesyRegistered?: boolean;           // Marked in our admin (doctor still registers in GeSY portal manually)
gesyRegisteredAt?: Timestamp;
```

### Key Types

```typescript
// types/patient.ts
interface Patient {
  id: string;
  phone?: string;                   // Dedup key #1 (private patients always have this)
  gesyId?: string;                  // Dedup key #2 (GeSY patients from Excel import may only have this)
  name: string;
  nameEl?: string;
  email?: string;
  dateOfBirth?: string;
  gesyId?: string;
  patientType: 'gesy' | 'private' | 'both';
  status: 'active' | 'discharged';
  // Clinical
  chiefComplaint?: string;
  diagnosis?: string;
  affectedArea?: string;
  treatmentMethods?: string[];
  treatmentGoal?: string;
  homeProgramme?: string;
  contraindications?: string;
  allergies?: string;
  plannedSessions?: number;
  // Metadata
  notes?: string;
  tags?: string[];
  primaryTherapistId?: string;      // Main therapist for this patient
  source?: 'referral' | 'gesy' | 'walk-in' | 'social' | 'other';
  complianceRating?: number;        // 1-5, manual
  scoreOverride?: 'upgraded' | 'downgraded' | null;
  scoreOverrideNote?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// types/patient.ts
interface BehaviorEvent {
  id: string;
  type: 'no_show' | 'late_cancel' | 'late_arrival' | 'missed_payment' |
        'unreachable' | 'rude' | 'positive_feedback' | 'visit_completed';
  note?: string;
  bookingId?: string;
  autoGenerated: boolean;
  timestamp: Timestamp;
}

// PRS calculated on-read, not stored
interface PatientReliabilityScore {
  total: number;                    // 0-100
  tier: 'reliable' | 'at_risk' | 'problematic';
  breakdown: {
    attendance: number;             // 0-100
    payment: number;
    punctuality: number;
    compliance: number;
    communication: number;
  };
  eventCount: number;
  window: '180d';
}
```

---

## 5. PRS — Computed on Read

The score is **not stored** in Firestore. It's calculated from `behaviorEvents` on every patient card render, cached by React Query (5-min stale time).

**Why:** The 180-day rolling window means the score changes daily as old events age out. Storing it would require a daily recalculation job. Computing on-read is simpler and always accurate.

```typescript
// utils/prs.ts
export function calculatePRS(events: BehaviorEvent[], complianceRating?: number): PatientReliabilityScore {
  const cutoff = subDays(new Date(), 180);
  const recent = events.filter(e => e.timestamp.toDate() > cutoff);

  // New patient with no events → score 100 (benefit of doubt)
  if (recent.length === 0) {
    return { total: 100, tier: 'reliable', breakdown: { attendance: 100, payment: 100, punctuality: 100, compliance: complianceRating ? (complianceRating - 1) * 25 : 100, communication: 100 }, eventCount: 0, window: '180d' };
  }

  // Each sub-score: 0-100
  const attendance = calcAttendance(recent);     // 100 - (no_shows × 20) - (late_cancels × 10)
  const payment = calcPayment(recent);           // 100 - (missed_payments × 15)
  const punctuality = calcPunctuality(recent);   // 100 - (late_arrivals × 15)
  const compliance = complianceRating ? (complianceRating - 1) * 25 : 50; // default 50 if unrated
  const communication = calcCommunication(recent); // 100 - (unreachable × 20)

  const total = Math.round(
    attendance * 0.35 +
    payment * 0.25 +
    punctuality * 0.15 +
    compliance * 0.15 +
    communication * 0.10
  );

  const tier = total >= 71 ? 'reliable' : total >= 31 ? 'at_risk' : 'problematic';

  return { total, tier, breakdown: { attendance, payment, punctuality, compliance, communication }, eventCount: recent.length, window: '180d' };
}
```

---

## 6. AI Agent — Agentic Architecture with Tool Use

The AI assistant is not a simple chatbot — it's a **full agent** that can read data from the database, take actions (create reminders, mark GeSY visits, log events), and proactively surface insights. Built on Claude API with tool use (function calling).

### 6.1 Architecture Overview

```
┌──────────────────┐                        ┌─────────────────────────────┐
│  React Frontend   │  POST /ai-agent        │  Firebase Cloud Function    │
│                   │ ──────────────────────→ │                             │
│  AIChatWidget.tsx │  + Firebase Auth token  │  1. Verify auth token       │
│  chatStore.ts     │  + messages[]           │  2. Build system prompt     │
│  useAIAgent.ts    │  + currentPage          │  3. Call Claude API         │
│                   │  + patientId?           │     with tools definition   │
│                   │                         │  4. ← Claude requests tool  │
│                   │                         │  5. Execute tool (Firestore)│
│                   │                         │  6. Return result to Claude │
│                   │                         │  7. ← Claude requests more  │
│                   │                         │     tools or final answer   │
│                   │                         │  8. ... (agentic loop)      │
│                   │ ←────────────────────  │  9. Return final response   │
│                   │  { message, actions[] } │  10. Log conversation       │
└──────────────────┘                         └─────────────────────────────┘
```

The Cloud Function runs an **agentic loop**: Claude decides which tools to call, the function executes them against Firestore, feeds results back to Claude, and repeats until Claude produces a final answer. This is standard Claude tool_use — no framework needed.

### 6.2 Agent Tools (16 tools)

#### Read Tools (no side effects)

| Tool | Parameters | Returns | Description |
|------|------------|---------|-------------|
| `get_patient` | `patientId` | Patient record | Full patient profile with clinical data |
| `search_patients` | `query` (name/phone/gesyId) | Patient[] (max 10) | Fuzzy search across patients |
| `get_visits` | `patientId, limit?, dateFrom?` | Visit[] | Visit history for a patient |
| `get_behavior_events` | `patientId, limit?` | BehaviorEvent[] | Behavior log (180-day window) |
| `get_reliability_score` | `patientId` | PRS object | Calculated score with breakdown |
| `get_schedule` | `date, therapistId?` | Booking[] | Day's schedule, optionally filtered |
| `get_outstanding_balances` | `limit?` | {patient, amount}[] | All patients with unpaid visits |
| `get_unregistered_gesy` | `patientId?` | Visit[] | GeSY visits not yet registered. All or per-patient |
| `get_clinic_stats` | `period: '7d'\|'30d'\|'90d'` | Stats summary | Bookings, revenue, cancellation rate |

#### Write Tools (side effects — agent confirms before executing)

| Tool | Parameters | Returns | Description |
|------|------------|---------|-------------|
| `create_reminder` | `patientId?, text, dueDate` | Reminder | Create a clinician reminder |
| `mark_gesy_registered` | `visitIds: string[]` | {updated: number} | Mark visits as registered **in admin** (not in GeSY portal itself) |
| `mark_visits_paid` | `visitIds: string[], method?` | {updated: number} | Mark private visits as paid (cash/card/transfer) |
| `add_behavior_event` | `patientId, type, note?` | BehaviorEvent | Log a behavior event |
| `update_patient_notes` | `patientId, notes` | Patient | Append to patient notes |
| `update_booking_status` | `bookingId, status` | Booking | Change booking status (confirm/cancel) |
| `create_booking` | `patientId, therapistId, date, time, serviceId` | Booking | Create a new appointment |

**Important:** `mark_gesy_registered` marks visits in our admin system only — the doctor must still register the visit in the GeSY portal manually. The agent must clearly state this distinction.

### 6.3 Tool Execution Safety

Write tools are **guarded**:
- The Cloud Function returns the agent's intended action to the frontend **before executing**
- The frontend shows a confirmation: _"Agent wants to: Mark 3 GeSY visits as registered. Allow?"_
- Only after user confirms → frontend sends `POST /ai-agent/confirm` → function executes the write
- Read tools execute immediately, no confirmation needed

```typescript
// Response shape from Cloud Function
interface AgentResponse {
  message: string;                    // Agent's text response
  pendingActions?: PendingAction[];   // Write tools awaiting confirmation
  conversationId: string;
}

interface PendingAction {
  id: string;
  tool: string;                       // e.g. 'mark_gesy_registered'
  params: Record<string, any>;        // e.g. { visitIds: ['abc', 'def'] }
  description: string;                // Human-readable: "Mark 3 visits as registered"
}
```

### 6.4 System Prompt

```
You are the internal AI agent for Right Track Physiotherapy & Performance Centre
in Nicosia, Cyprus. You assist the clinician (Dr. Antonis Petri) with patient
management, scheduling, GeSY registration tracking, and clinical documentation.

## Your capabilities
You have tools to READ patient data, visits, scores, schedules, and balances.
You have tools to WRITE reminders, GeSY registration marks, behavior events,
patient notes, and booking status changes.

## Clinic context
- Therapists: Antonis Petri (GESY: A2825), Charalambos Gregoriou (GESY: A3522),
  Alice Kazanjian (GESY: A3509, Clinical Pilates only)
- Services: Physiotherapy (€35/€29 GeSY), Athlete Rehab (€45/€29),
  Clinical Pilates (€80/mo), Performance Training (€250/mo),
  Homecare (€45/€29), Sports Massage (€45)
- Working hours: Mon-Fri 08:00-20:00
- Location: Tseriou 32, Strovolos 2042, Nicosia

## Rules
1. Always use tools to get data — never guess or hallucinate patient details
2. For write actions, clearly state what you're about to do so the user can confirm
3. Respond in the same language the clinician writes in (EN, EL, or RU)
4. Be concise and actionable — this is a busy clinic
5. When reporting on a patient, always check: visits, PRS score, GeSY status, balance
6. Proactively flag issues: unregistered GeSY visits, declining PRS, overdue payments
7. For clinical suggestions (exercises, treatment plans), always note they are
   AI-generated and should be reviewed by the clinician
8. When marking GeSY visits as "registered", always clarify this is in our admin
   system — the doctor must still register in the GeSY portal manually
9. Current date: {date}
```

### 6.5 Agentic Loop (Cloud Function implementation)

```typescript
// functions/src/ai-agent.ts (simplified)
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

async function runAgent(messages: Message[], tools: Tool[]): Promise<AgentResponse> {
  const pendingActions: PendingAction[] = [];
  let continueLoop = true;

  while (continueLoop) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: TOOL_DEFINITIONS,
      messages,
    });

    // Claude can return multiple tool_use blocks in parallel — handle all of them
    const toolBlocks = response.content.filter(b => b.type === 'tool_use');

    if (toolBlocks.length > 0) {
      // Always push the full assistant response first
      messages.push({ role: 'assistant', content: response.content });

      // Execute all tool calls (read in parallel, write queued)
      const toolResults = await Promise.all(toolBlocks.map(async (block) => {
        if (isWriteTool(block.name)) {
          pendingActions.push({
            id: block.id, tool: block.name, params: block.input,
            description: describeAction(block.name, block.input),
          });
          return { type: 'tool_result', tool_use_id: block.id,
            content: 'Action queued for user confirmation.' };
        } else {
          const result = await executeTool(block.name, block.input);
          return { type: 'tool_result', tool_use_id: block.id,
            content: JSON.stringify(result) };
        }
      }));

      messages.push({ role: 'user', content: toolResults });
    }

    // If Claude's response is end_turn (no more tool calls), we're done
    if (response.stop_reason === 'end_turn') {
      continueLoop = false;
    }
  }

  // Extract final text message
  const finalMessage = messages[messages.length - 1]
    .content.filter(b => b.type === 'text')
    .map(b => b.text).join('');

  return { message: finalMessage, pendingActions, conversationId };
}
```

### 6.6 Example Interactions

**Doctor writes:** _"Что там с Яннисом?"_

Agent internally:
1. Calls `search_patients({ query: "Янnis" })` → gets patient ID
2. Calls `get_patient({ patientId: "abc123" })` → demographics, clinical
3. Calls `get_visits({ patientId: "abc123", limit: 5 })` → last 5 visits
4. Calls `get_reliability_score({ patientId: "abc123" })` → PRS 72, reliable
5. Calls `get_unregistered_gesy({ patientId: "abc123" })` → 2 visits

Agent responds:
> **Γιάννης Παπαδόπουλος** (GeSY, active)
>
> Диагноз: ACL reconstruction rehab, правое колено
> Прогресс: 8 из 10 запланированных сессий. ROM улучшилось с 15° до 40°.
> Последний визит: 17 марта (3 дня назад).
> PRS: 72/100 (Reliable) — стабильный.
>
> ⚠️ **2 визита GeSY не зарегистрированы** (16 и 18 марта, €50 total).
> Зарегистрировать?
>
> 📋 Рекомендация: осталось 2 сессии — запланировать reassessment.

_[Pending action: mark_gesy_registered for 2 visits — awaiting confirmation]_

---

**Doctor writes:** _"Кто должен деньги?"_

Agent internally:
1. Calls `get_outstanding_balances({ limit: 10 })`

Agent responds:
> 💰 Неоплаченные счета:
>
> 1. **Μαρία Κ.** — €90 (3 визита, последний 10 дней назад)
> 2. **Νίκος Α.** — €45 (1 визит, 22 дня назад)
> 3. **Ελένη Μ.** — €35 (1 визит, 5 дней назад)
>
> Итого: €170 outstanding. Мария задерживает уже третий раз — PRS Payment score: 25/100.

---

**Doctor writes:** _"Напомни мне позвонить Марии в пятницу"_

Agent internally:
1. Calls `search_patients({ query: "Μαρία Κ." })` → gets ID
2. Calls `create_reminder({ patientId: "xyz", text: "Позвонить Марии по поводу оплаты", dueDate: "2026-03-27" })`

Agent responds:
> ✅ Напоминание создано: "Позвонить Марии по поводу оплаты" — пятница, 27 марта.

_[Pending action: create_reminder — awaiting confirmation]_

---

**Doctor writes:** _"Напиши рефферал для Янниса к ортопеду"_

Agent internally:
1. Calls `get_patient({ patientId: "abc123" })`
2. Calls `get_visits({ patientId: "abc123" })`

Agent responds:
> 📄 **Referral Letter**
>
> Dear Colleague,
>
> I am referring Mr. Giannis Papadopoulos (DOB: 15/06/1992) for orthopedic
> evaluation of his right knee following ACL reconstruction rehabilitation.
>
> Mr. Papadopoulos has completed 8 physiotherapy sessions over the past
> 3 months. ROM has improved from 15° to 40° flexion. However, progress
> has plateaued in the last 2 sessions, and the patient reports persistent
> instability during lateral movements.
>
> Current treatment: Manual therapy, exercise therapy, TENS.
> Home programme compliance: Good (4/5).
>
> I would appreciate your assessment regarding the need for further
> surgical intervention or advanced imaging.
>
> Kind regards,
> Dr. Antonis Petri
> Right Track Physiotherapy & Performance Centre
> GESY: A2825 | Tel: +357 ...

### 6.7 Proactive Agent (Morning Brief)

A scheduled Cloud Function (`gesy-alerts.ts`) runs daily at 08:00 and generates a **morning brief**:

```
📋 Morning Brief — 20 March 2026

Today's schedule: 8 appointments (Antonis: 5, Alice: 3)

⚠️ Action needed:
• 4 GeSY visits not registered (€116 at risk)
• 2 patients with outstanding balance >30 days
• Γιάννης Π.: session 10 of 10 today — schedule reassessment

🎂 Birthday: Ελένη Μ. turns 34 today

💡 Tip: Μαρία Κ. has 3 late payments — consider discussing payment plan
```

Sent to Telegram + displayed as a dashboard card when admin opens.

### 6.8 Quick Commands (UI shortcuts → agent prompts)

Quick command buttons in the chat panel that pre-fill the input:

| Button | Sends to agent |
|--------|----------------|
| 📋 Summary | "Give me a full summary of this patient" |
| 📊 Score | "Show me this patient's reliability score breakdown" |
| 💰 Balance | "What's the financial status of this patient?" |
| 📝 Letter | "Write a referral letter for this patient" |
| 🏋️ Exercises | "Suggest exercises for this patient based on their diagnosis" |
| 📅 Plan | "Suggest a treatment plan update based on progress" |
| ✅ GeSY Check | "Check for unregistered GeSY visits" |
| ⏰ Remind | "What reminders should I set for this patient?" |
| 📈 Compare | "Compare this patient's current state with their first visit" |
| 🌅 Brief | "Give me today's morning brief" |

### 6.9 Proactive Agent — Scheduled Tasks

The agent doesn't just wait for questions — it **initiates** via Firebase scheduled Cloud Functions.

#### Schedule

| Time | Function | What it does | Output |
|------|----------|-------------|--------|
| **08:00 daily** | `morning-brief` | Runs agent with prompt: "Generate today's morning brief" | → Telegram message + dashboard card |
| **09:00 daily** | `gesy-alerts` | Runs agent with: "List all unregistered GeSY visits older than 3 days" | → Telegram alert if any found |
| **Mon 09:00** | `overdue-payments` | Runs agent with: "List all patients with outstanding balance >30 days" | → Telegram summary |
| **On booking status change** | `post-visit-check` | Firestore trigger: when visit completed → agent checks if GeSY registration needed | → Telegram reminder |

#### How Proactive Works

Each scheduled function uses the **same agent** (same tools, same system prompt) — just with a different initial prompt. The `proactive-runner.ts` shared module:

```typescript
// functions/src/proactive/proactive-runner.ts
export async function runProactiveAgent(prompt: string): Promise<string> {
  // 1. Build messages with proactive system prompt addition
  const messages = [{ role: 'user', content: prompt }];

  // 2. Run the same agentic loop (agent calls tools, gets data)
  const response = await runAgent(messages, ALL_TOOLS);

  // 3. For proactive runs, execute write tools immediately (no user confirm)
  //    Only safe writes: create_reminder. Not: update_booking_status
  for (const action of response.pendingActions) {
    if (SAFE_PROACTIVE_WRITES.includes(action.tool)) {
      await executeTool(action.tool, action.params);
    }
  }

  // 4. Return formatted message
  return response.message;
}
```

#### Morning Brief Example (sent to Telegram at 08:00)

```
📋 Morning Brief — 20 March 2026

📅 Today: 8 appointments
   Antonis: 5 (09:00-17:00)
   Alice: 3 (10:00-13:00)

⚠️ Action needed:
• 4 GeSY visits not registered (€116 at risk)
• Μαρία Κ.: balance €90, overdue 22 days
• Γιάννης Π.: session 10/10 today — reassessment needed

🎂 Ελένη Μ. turns 34 today

💡 Νίκος Α. missed last 2 appointments — PRS dropped to 38 (Red)
   Consider: call to discuss barriers, or require prepayment
```

### 6.10 Telegram Bot — Two-Way Agent Interface

The Telegram bot isn't just for notifications — it's a **full interface to the agent**. The doctor can chat with the agent from Telegram exactly like in the admin panel.

#### Architecture

```
┌──────────┐  webhook   ┌─────────────────────┐  same agent  ┌──────────┐
│ Telegram  │ ────────→  │ Cloud Function       │ ───────────→ │ Claude   │
│ (doctor)  │            │ telegram/bot.ts      │              │ API      │
│           │ ←────────  │                      │ ←─────────── │ + tools  │
│           │  reply     │ Format for Telegram  │   response   │          │
└──────────┘             └─────────────────────┘              └──────────┘
```

#### Telegram Bot Features

| Feature | How |
|---------|-----|
| **Chat with agent** | Doctor sends text or voice → agent processes with full tool access → replies |
| **Voice messages** | Doctor records voice in Telegram → Whisper API transcribes → agent processes as text |
| **Conversation memory** | Agent remembers last 50 messages / 24 hours. "уже сделал" → agent updates status |
| **Task execution** | "запиши Яннису ROM 45°" → agent finds patient, adds note. Full admin access from Telegram |
| **Receive proactive alerts** | Morning brief, GeSY alerts, payment reminders — sent automatically |
| **Quick buttons** | Inline keyboard buttons after alerts: "Register all GeSY" / "Snooze" / "Show details" |
| **Booking notifications** | New booking → Telegram (existing feature, preserved) |
| **Confirm agent actions** | Agent proposes a write action → Telegram inline button: "✅ Confirm / ❌ Cancel" |

#### Example Telegram Conversation

```
🤖 Bot (08:00):
  📋 Morning Brief — 20 March 2026
  Today: 8 appointments
  ⚠️ 4 GeSY visits not registered (€116)
  [Register all ✅] [Show details 📋] [Snooze 💤]

👨‍⚕️ Doctor:
  покажи детали

🤖 Bot:
  Unregistered GeSY visits:
  1. Γιάννης Π. — 16 Mar — €25
  2. Γιάννης Π. — 18 Mar — €25
  3. Μαρία Κ. — 17 Mar — €33
  4. Νίκος Α. — 15 Mar — €33
  [Register all ✅] [Register by patient 👤]

👨‍⚕️ Doctor:
  зарегистрируй все

🤖 Bot:
  ✅ 4 visits marked as registered in GeSY (€116)

👨‍⚕️ Doctor:
  что с марией

🤖 Bot:
  Μαρία Κ. (private, active)
  Last visit: 10 Mar (10 days ago)
  Balance: €90 (3 unpaid visits)
  PRS: 45/100 ⚠️ At Risk
  Issues: 3 late payments, 1 late cancel
  Next: no appointment scheduled
  📞 Suggest: call to discuss payment plan
  [Create reminder 📞] [View full card 🔗]
```

#### Implementation

```typescript
// functions/src/telegram/bot.ts
import { onRequest } from 'firebase-functions/v2/https';
import { loadConversation, appendMessage } from './conversation';
import { transcribeVoice } from './voice';

export const telegramWebhook = onRequest(async (req, res) => {
  const update = req.body;
  const chatId = update.message?.chat.id || update.callback_query?.message.chat.id;

  // Auth: only the doctor's chat
  if (chatId !== AUTHORIZED_CHAT_ID) return res.sendStatus(403);

  // 1. Handle voice messages
  if (update.message?.voice) {
    const transcription = await transcribeVoice(update.message.voice.file_id);
    await sendTelegramMessage(chatId, `🎤 _${transcription}_`, { parse_mode: 'Markdown' });
    await processAndReply(chatId, transcription);
  }

  // 2. Handle text messages
  if (update.message?.text) {
    await processAndReply(chatId, update.message.text);
  }

  // 3. Handle inline button callbacks (confirm/cancel actions)
  if (update.callback_query) {
    const [action, actionId] = update.callback_query.data.split(':');
    if (action === 'confirm') {
      await executeConfirmedAction(actionId);
      await answerCallback(update.callback_query.id, '✅ Done');
    }
  }

  res.sendStatus(200);
});

async function processAndReply(chatId: string, text: string) {
  // Load conversation history (last 50 messages or 24 hours)
  const history = await loadConversation(chatId);

  // Append user message to history
  await appendMessage(chatId, { role: 'user', content: text });

  // Run agent with full conversation context
  const response = await runAgent(
    [...history, { role: 'user', content: text }],
    ALL_TOOLS,
    { systemPromptAddition: 'Format for Telegram. Use emoji. Keep under 4000 chars.' }
  );

  // Save assistant response to conversation
  await appendMessage(chatId, {
    role: 'assistant',
    content: response.message,
    toolCalls: response.toolsUsed,
  });

  // Send reply with inline buttons for pending write actions
  await sendTelegramMessage(chatId, response.message, {
    inlineKeyboard: response.pendingActions.map(a => ([
      { text: `✅ ${a.description}`, callback_data: `confirm:${a.id}` },
      { text: '❌ Cancel', callback_data: `cancel:${a.id}` },
    ])),
  });
}
```

### 6.11 Conversation Memory — Agent Remembers and Acts

The agent maintains **persistent conversation context per chat**. When the doctor replies to a proactive alert, the agent remembers what was discussed and can act on it.

#### How It Works

Each Telegram chat and each admin panel session has a **conversation thread** stored in Firestore (`agentConversations` collection). When a new message arrives, the Cloud Function:

1. Loads the last N messages from this thread (default: 20, or last 24 hours)
2. Includes them in the `messages[]` array sent to Claude
3. Claude sees the full context of the conversation and can act accordingly
4. New messages (user + assistant) are appended to the thread

```typescript
// Firestore structure
agentConversations/{conversationId}
  chatId: string              // Telegram chat ID or admin session ID
  interface: 'telegram' | 'admin'
  lastMessageAt: Timestamp
  messages/                   // subcollection, ordered by timestamp
    {messageId}
      role: 'user' | 'assistant'
      content: string
      toolCalls?: ToolCall[]  // what tools the agent called
      toolResults?: any[]     // what it got back
      timestamp: Timestamp
```

#### Key Behavior: Reply = Action

When the agent sends a proactive alert and the doctor replies naturally, the agent **understands the context and takes action**:

```
🤖 Bot (09:00):
  ⚠️ 3 GeSY visits not registered:
  1. Γιάννης Π. — 18 Mar — €25
  2. Μαρία Κ. — 17 Mar — €33
  3. Νίκος Α. — 19 Mar — €33

👨‍⚕️ Doctor:
  Янниса и Марию уже добавил, Никоса завтра

🤖 Bot:
  ✅ Marked as registered:
  • Γιάννης Π. — 18 Mar
  • Μαρία Κ. — 17 Mar
  ⏰ Reminder created: Register Νίκος Α. GeSY visit — tomorrow (21 Mar)
```

The agent sees the conversation history, understands "уже добавил" means these are done, calls `mark_gesy_registered` for the first two, and `create_reminder` for the third.

#### More Examples

```
🤖 Bot (proactive):
  💰 Μαρία Κ. has €90 outstanding (3 visits, 22 days overdue)

👨‍⚕️ Doctor:
  она заплатила вчера за 2 визита наличными

🤖 Bot:
  ✅ Marked 2 visits as paid for Μαρία Κ.
  Remaining balance: €30 (1 visit from 5 Mar)
```

```
👨‍⚕️ Doctor:
  запиши что Никос опоздал на 20 минут сегодня и был грубым с рецепцией

🤖 Bot:
  ✅ Logged for Νίκος Α.:
  • ⏰ Late arrival (20 min) — today
  • ⚠️ Rude behavior — note: "грубое отношение к рецепции"
  PRS updated: 52 → 37 (Red zone)
  ⚠️ This is his 3rd incident this month. Consider discussing behavior policy.
```

#### Conversation Cleanup

- Messages older than 7 days are archived (moved to cold storage or deleted)
- Each conversation thread is capped at 50 messages (oldest trimmed)
- A new "thread" starts if there's been no activity for 4+ hours (fresh context)

### 6.12 Voice Messages — Speech-to-Text

The doctor can send **voice messages** in Telegram instead of typing. The agent transcribes and processes them.

#### Architecture

```
┌──────────┐  voice msg   ┌──────────────────┐  text    ┌──────────────┐
│ Telegram  │ ──────────→  │ Cloud Function    │ ──────→  │ Agent        │
│           │  .ogg file   │                   │          │ (same flow)  │
│           │              │ 1. Download file  │          │              │
│           │              │ 2. Transcribe     │          │              │
│           │              │    (Whisper API)   │          │              │
│           │ ←──────────  │ 3. Send to agent  │ ←──────  │              │
│           │  text reply  │ 4. Reply          │  result  │              │
└──────────┘               └──────────────────┘          └──────────────┘
```

#### Implementation

```typescript
// functions/src/telegram/bot.ts — voice message handling

if (update.message?.voice) {
  const chatId = update.message.chat.id;
  if (chatId !== AUTHORIZED_CHAT_ID) return res.sendStatus(403);

  // 1. Download voice file from Telegram
  const fileId = update.message.voice.file_id;
  const file = await telegram.getFile(fileId);
  const audioBuffer = await downloadFile(file.file_path);

  // 2. Transcribe with OpenAI Whisper API
  const transcription = await openai.audio.transcriptions.create({
    file: audioBuffer,
    model: 'whisper-1',
    language: 'auto',     // auto-detect: EN, EL, RU
  });

  // 3. Show transcription to doctor for transparency
  await sendTelegramMessage(chatId,
    `🎤 _${transcription.text}_`, { parse_mode: 'Markdown' });

  // 4. Process as regular text message through the agent
  const response = await processAgentMessage(chatId, transcription.text);
  await sendTelegramMessage(chatId, response.message, ...);
}
```

#### Speech-to-Text Provider

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **OpenAI Whisper API** | Best multilingual (EN/EL/RU), simple API | External service | $0.006/min |
| **Google Cloud Speech-to-Text** | Good Greek support, EU data | More complex setup | $0.006/min |
| **Whisper (self-hosted)** | Free, full control | Needs GPU server | GPU cost |

**Recommendation:** OpenAI Whisper API. At ~2 min of voice per day = $0.36/month. Excellent multilingual support (critical for EN/EL/RU mix). Trivial to integrate.

#### UX Flow

1. Doctor holds record button in Telegram, speaks naturally
2. Bot replies with transcription in italics: _"запиши что Никос опоздал на 20 минут"_
3. Agent processes the transcribed text normally
4. If transcription looks wrong, doctor can correct by typing

#### Voice Message Examples

```
👨‍⚕️ Doctor: 🎤 (voice message, 8 seconds)

🤖 Bot:
  🎤 _"проверь есть ли у Елены запись на следующей неделе и если нет напомни мне позвонить ей в понедельник"_

  Checking...

  📋 Ελένη Μ.:
  • No appointments scheduled for next week (24-28 Mar)
  • Last visit: 12 Mar (8 days ago)
  • Treatment plan: 2 sessions remaining
  ⏰ Reminder created: "Позвонить Ελένη Μ. — записать на сессию" — Monday 24 Mar
```

```
👨‍⚕️ Doctor: 🎤 (voice message, 12 seconds)

🤖 Bot:
  🎤 _"σήμερα ήρθε ο Γιάννης, κάναμε manual therapy και ασκήσεις, το ROM βελτιώθηκε στις 45 μοίρες, βάλε σημείωση"_

  ✅ Session note added for Γιάννης Π. (today's visit):
  "Manual therapy + exercises. ROM improved to 45°"
  Progress: ROM 15° → 40° → 45° over 8 sessions 📈
```

### 6.13 Task Execution via Telegram

The doctor can give the agent **any admin task** from Telegram — check data, update records, add notes. The agent has the same 16 tools as in the admin panel.

#### What the Doctor Can Do from Telegram

| Task | Example message | Agent tools used |
|------|----------------|-----------------|
| **Check patient** | "что с Яннисом" | `search_patients` → `get_patient` → `get_visits` → `get_reliability_score` |
| **Add visit note** | "запиши Яннису: ROM 45°, manual therapy" | `search_patients` → `update_patient_notes` |
| **Log behavior** | "Никос опоздал на 20 мин" | `search_patients` → `add_behavior_event` |
| **Mark GeSY** | "все визиты за вчера зарегистрированы" | `get_unregistered_gesy` → `mark_gesy_registered` |
| **Check schedule** | "что у меня завтра" | `get_schedule` |
| **Check finances** | "кто должен деньги" | `get_outstanding_balances` |
| **Set reminder** | "напомни позвонить Елене в пятницу" | `search_patients` → `create_reminder` |
| **Update status** | "Мария отменила на завтра" | `search_patients` → `get_visits` → `update_booking_status` |
| **Get summary** | "дай отчёт за неделю" | `get_clinic_stats` |
| **Write letter** | "напиши реферал для Янниса" | `get_patient` → `get_visits` → (generates text) |

The agent understands natural language in **EN, EL, and RU** — the doctor doesn't need to use commands or remember syntax. Just talk to it like a colleague.

### 6.14 Agent Interfaces Summary

The same agent brain (Claude + tools) is accessible from **three interfaces**:

```
                         ┌─────────────────────┐
                         │     Claude API       │
                         │   + 16 tools         │
                         │   + system prompt    │
                         └──────┬──────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                  │
   ┌──────────▼──────┐  ┌──────▼───────┐  ┌──────▼──────────┐
   │  Admin Panel     │  │  Telegram    │  │  Scheduled       │
   │  (React widget)  │  │  Bot         │  │  (Proactive)     │
   │                  │  │              │  │                   │
   │  Full UI         │  │  Mobile/     │  │  No user input   │
   │  Confirmations   │  │  on-the-go   │  │  Auto-reminders  │
   │  Patient context │  │  Inline btns │  │  Morning brief   │
   │  Quick commands  │  │  Alerts      │  │  GeSY alerts     │
   └──────────────────┘  └──────────────┘  └───────────────────┘
```

All three use the **same** `runAgent()` function, **same** tools, **same** system prompt. The only differences:
- Admin panel: rich UI, pending action confirmations via modal
- Telegram: text + voice + inline buttons, conversation memory, Telegram-formatted markdown
- Proactive: no user input, safe writes auto-executed, output → Telegram + dashboard

**Shared capabilities across all interfaces:**
- 16 tools (9 read + 7 write)
- Conversation memory (persistent threads)
- Natural language in EN, EL, RU
- Write action confirmation before execution

---

## 7. GeSY Excel Import Flow

```
User drops .xlsx → SheetJS parses client-side → Preview table
                                                      ↓
                                               User confirms
                                                      ↓
                                          Match patients by GeSY ID
                                          Create new patients if needed
                                          Create visit records
                                          Log import batch
```

**Column mapping** (`utils/gesyExcel.ts`):

| Excel Column (Greek) | Maps to |
|-----------------------|---------|
| Εγγραφο Ταυτοποίησης | `gesyId` on patient |
| Δικαιούχος | `name` on patient |
| Ημ. Τιμολογίου | `visitDate` on booking |
| Ημ. Υποβολής | `gesySubmissionDate` |
| Συνολικό Ποσό | `price` |
| Αμοιβή από ΓΕΣ | `gesyPayment` |
| Συμπλ. | `gesyCopay` |
| Μονάδες | `gesyUnits` |
| Status | `gesyClaimStatus` |

**Deduplication key:** `gesyId + visitDate + price` — re-uploading the same file creates no duplicates.

---

## 8. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write anything
    function isAuth() { return request.auth != null; }

    match /bookings/{bookingId} { allow read, write: if isAuth(); }
    match /patients/{patientId} {
      allow read, write: if isAuth();
      match /behaviorEvents/{eventId} { allow read, write: if isAuth(); }
    }
    match /therapists/{id} { allow read, write: if isAuth(); }
    match /services/{id} { allow read, write: if isAuth(); }
    match /gesyImports/{id} { allow read, write: if isAuth(); }
    match /reminders/{id} { allow read, write: if isAuth(); }
    match /agentConversations/{id} {
      allow read, write: if isAuth();
      match /messages/{msgId} { allow read, write: if isAuth(); }
    }
  }
}
```

Cloud Functions use Firebase Admin SDK (bypasses rules) — so agent tool execution is unaffected.

---

## 9. Deployment

### Firebase Hosting (admin panel)

```json
// firebase.json
{
  "hosting": {
    "public": "admin/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

**URL:** `admin.righttrackphysio.com.cy` (subdomain via Cloudflare DNS → Firebase Hosting)

**Main site stays on GitHub Pages** at `righttrackphysio.com.cy` — no changes.

### Deployment commands

```bash
# Build and deploy admin
cd admin && npm run build
firebase deploy --only hosting

# Deploy cloud functions
firebase deploy --only functions
```

---

## 10. Migration Plan

Old admin (`/pages/manage-rtphysio-2026/`) and new admin (`/admin/`) coexist:
- Both read/write the same Firestore collections
- No data migration needed for bookings/therapists/services
- New `patients` collection created by a one-time script that aggregates unique clients from bookings

**Migration script** (run once):
1. Query all bookings
2. Group by normalized phone number
3. Create a `patients` document for each unique phone
4. Update each booking with the new `patientId` field

**Cutover sequence:**
1. Build new admin with feature parity
2. Add new modules (Patients, PRS, AI)
3. Test side-by-side for 1-2 weeks
4. Point `admin.righttrackphysio.com.cy` to Firebase Hosting
5. Archive old admin files

---

## 11. Build Phases

### Phase 1 — Foundation
- Vite + React + TS project scaffolding
- Tailwind + shadcn/ui setup (port navy/orange palette)
- Firebase init (auth, Firestore, same project)
- AppLayout: sidebar, header, routing
- Auth flow: login screen, auth guard, logout
- Service layer + React Query hooks (bookings, therapists, services)
- Toast/notification system
- Reusable DataTable component

### Phase 2 — Feature Parity
- Bookings page (list, filters, CRUD, status changes)
- Calendar page (month view, day detail)
- Therapists page (list, CRUD)
- Services page (list, CRUD)
- Analytics page (KPIs, Recharts)
- Statistics page (reports)
- Real-time notification listener

### Phase 3 — Patients CRM
- `patients` collection + migration script
- Patient list page (search, sort, filters)
- Patient card (General / Visits / Financials tabs)
- Patient create/edit form
- Link bookings ↔ patients (by phone)
- GeSY Excel import (SheetJS + preview + confirm)

### Phase 4 — PRS + GeSY Tracking
- `behaviorEvents` subcollection
- Auto-logging from booking status changes
- Quick-mark buttons (late, no-show, etc.)
- PRS calculation (`utils/prs.ts`)
- PRS display: badge in list, donut in card, radar breakdown
- GeSY registration toggle on visit rows
- Unregistered GeSY alerts (UI + Cloud Function → Telegram)

### Phase 5 — AI Agent (Admin Panel)
- Cloud Function: agentic loop with Claude API + 16 tools
- Tool definitions + executor (Firestore read/write)
- System prompt builder with clinic context
- Chat widget UI (floating panel in React)
- Pending action confirmations (modal)
- Quick command buttons
- Reminders system (create, display, snooze/dismiss)
- Morning brief dashboard card

### Phase 6 — Telegram Bot + Proactive Agent
- Telegram bot webhook (Cloud Function)
- Two-way agent chat via Telegram (text)
- Conversation memory: persistent threads in Firestore (50 msgs / 24h window)
- Reply-to-act: doctor replies to alerts naturally, agent executes actions
- Voice messages: Whisper API transcription → agent processing
- Inline keyboard buttons for action confirmations
- Scheduled functions: morning brief (08:00), GeSY alerts (09:00), payment reminders (Mon)
- Proactive runner: same agent, auto-triggered, output → Telegram + dashboard
- Booking notification migration (existing Telegram notifs → new bot)

### Phase 7 — Deploy + Polish
- Firebase Hosting + Cloudflare subdomain
- Error boundaries, offline handling
- Lazy route loading
- Side-by-side testing → cutover

---

## 12. Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **PRS computed on-read, not stored** | 180-day window shifts daily. Storing requires daily recalc job. React Query caches the result for 5 min |
| **Zustand over Redux** | Single user, no middleware needs. 1KB, zero boilerplate |
| **shadcn/ui over MUI/Ant** | Full control, no version lock-in, Tailwind-native. Admin needs clean look, not a component framework fight |
| **TanStack Query for server state** | Firestore data is server state. TQ gives caching, staleness, optimistic updates for free |
| **Separate `/admin` directory** | Clean separation from static site. Own build, own deploy, own deps |
| **Firebase Hosting over GitHub Pages** | SPA routing support. No 404.html hacks. Same infra as Firestore |
| **Claude Sonnet for agent** | Speed > depth for agentic loop (multiple tool calls). 5x faster. Sufficient for summaries/letters |
| **Behavior events as subcollection** | Scoped to patient. No cross-patient queries needed. Simpler security rules |
| **One agent brain, three interfaces** | Admin panel, Telegram, and scheduled tasks all use same `runAgent()`. No logic duplication |
| **Telegram as full agent interface** | Doctor is mobile. Telegram = agent in pocket. Same tools, same quality, just different formatting |
| **Proactive agent via scheduled functions** | Agent initiates, not just responds. Morning brief, GeSY alerts, payment reminders — zero doctor effort |
| **Conversation memory (50 msgs / 24h)** | Doctor can reply naturally to alerts ("уже сделал") and agent acts on it. No need to repeat context |
| **Whisper API for voice** | Doctor records voice in Telegram → agent processes. $0.36/mo for ~2 min/day. EN/EL/RU auto-detect |

---

---

## 13. Business Logic Notes

### Patient Deduplication

Two dedup keys (either can match):
- **phone** — normalized (strip spaces, dashes, ensure +357 prefix). Private patients always have phone.
- **gesyId** — GeSY patients from Excel import may only have GeSY ID + name, no phone initially.

When importing GeSY Excel: match by `gesyId` first, then by name similarity. If a patient with matching `gesyId` already exists (created manually as private), merge: attach `gesyId` to existing record, add visits.

### Payment Type Mapping

Existing bookings use `paymentType: 'gesy-new' | 'gesy-old' | 'private'`. Preserve this granularity — `gesy-new` and `gesy-old` have different tariffs (€29 vs legacy rates). Map to `patientType` as:
- `gesy-new` / `gesy-old` → patient is `'gesy'` or `'both'`
- `private` → patient is `'private'` or `'both'`

### PRS Edge Cases

- **New patient (0 events):** Score = 100, tier = reliable (benefit of doubt)
- **Patient with only positive events:** Score stays near 100
- **All sub-scores clamped to 0–100:** Never negative, never over 100
- **Compliance not rated:** Default sub-score = 100 (not penalized for missing rating)

### GeSY Registration Workflow

1. Doctor treats GeSY patient → booking marked as `confirmed` in admin
2. Doctor goes to GeSY portal (external) and registers the visit there
3. Doctor returns to admin (or Telegram) and marks visit as "registered" → `gesyRegistered: true`
4. If not marked within 3 days → agent alerts via Telegram and dashboard

The admin does **not** integrate with the GeSY API (out of scope). It's a manual tracking system to prevent forgotten registrations.

### Cloud Function Timeout & Cost

- Agent loop with 3-5 tool calls: ~5-10 seconds, well within Cloud Function 60s default timeout
- Claude Sonnet: ~$3/1M input tokens. Typical agent call = ~2K tokens in, ~1K out = ~$0.01
- At 20 agent interactions/day: ~$6/month for Claude API
- Whisper: ~$0.36/month at 2 min voice/day
- Firebase Cloud Functions: free tier covers ~2M invocations/month
- **Total AI cost estimate: ~$7-10/month**

---

*This document defines the architecture for the new admin panel. Implementation specs for PRS and AI Agent are in `patient-scoring-ai-assistant-spec.md`.*
