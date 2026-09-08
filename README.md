# Sahay (সহায়) — Cognitive Care Platform for Elders

> An open-source, full-stack cognitive stimulation and remote caregiver oversight platform designed with and for elders in North-East India.

---

## 🍃 Overview

**Sahay** bridges generational distance by blending culturally rooted, gentle cognitive exercises with real-time family peace-of-mind tools. It was created to support elders experiencing mild cognitive impairment or seeking daily mental sharpness in low-stress, familiar settings.

### Key Capabilities

1. **Elder-Friendly Cognitive Suite**:
   - **Memory Match**: Tea garden and nature object matching.
   - **Pattern Recall**: 4-quadrant gentle sequencing with adaptive difficulty.
   - **Daily Routine Recall**: Morning routine ordering (tea, medicine, walk).
   - **Spot the Difference**: Subtle visual contrast focus training.
   - **Open Contribution Games**: Face & Family match, Odd One Out, Digit span.
2. **Medication & Daily Care Engine**:
   - Interactive daily schedule with dose check-offs and caregiver synchronization.
   - Searchable reminders and custom addition modal.
3. **Medical Appointments**:
   - Tracking follow-ups, physiotherapy, and routine assessments with direction & video triggers.
4. **Family & Caregiver Oversight**:
   - **Weekly Engagement Chart**: 7-day bar chart showing activity adherence.
   - **Memory Book**: Personal photo-and-audio album with simulated voice greetings ("Play hello").
   - **Geofencing & Safety**: Interactive live location map, safe-zone radius slider (200m–1500m), zone event log, and elder navigation preview.
   - **Care Alerts**: Automated notifications for missed medicine or slower response latencies.
5. **Multilingual AI Voice Companion ("Talk to Sahay")**:
   - Server-side Gemini API integration tuned for elderly empathy, patience, and North-East regional languages (Assamese, Bodo, Khasi, Manipuri, Mizo, and English).
6. **Emergency SOS & Accessibility**:
   - One-touch emergency trigger with live location dispatch simulation.
   - High-contrast warm paper theme, WCAG AA compliance, and 3-step text scaling.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Sahay Frontend                        │
│            React 19 + Tailwind CSS + Lucide Icons           │
│  (Desktop Sticky Sidebar + Mobile Header/Drawer/BottomBar)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                    Express Backend API                      │
│   • /api/assistant/chat  (Gemini 2.5 Flash Integration)     │
│   • /api/reminders       (Schedule & Check-offs)            │
│   • /api/appointments    (Clinical visits)                  │
│   • /api/family          (Memory Book)                      │
│   • /api/activities/log  (Cognitive Telemetry)              │
│   • /api/safety          (Geofence perimeter & alerts)      │
│   • /api/emergency/sos   (Dispatch alerts)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run in development
npm run dev

# 3. Compile for production
npm run build

# 4. Run production server
npm start
```

---

## 🤝 Contributing

We welcome open-source contributions! Check out [`CONTRIBUTING.md`](./CONTRIBUTING.md) to learn how to add new cognitive games, voice features, or language translations.
