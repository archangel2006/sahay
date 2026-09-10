# Sahay — Open-Source GitHub Issue Catalog & Roadmap

This document serves as the ready-to-use catalog of GitHub Issues for the **Sahay** open-source repository. Each issue is pre-labeled with functional tags (`frontend`, `backend`, `api`, `database`, `ai`, `accessibility`), difficulty ratings (`good first issue`, `easy`, `medium`, `hard`), and lists the exact pages and files to modify.

---

## 📑 Issue Index

| # | Issue Title | Primary Domain | Difficulty | Tags / Labels |
|---|-------------|----------------|------------|---------------|
| **#1** | [Feature] Implement "Face & Family Match" Cognitive Activity | Activities / Games | `Medium` | `frontend`, `games`, `help wanted` |
| **#2** | [Feature] Implement "Odd One Out" Categorical Classification Game | Activities / Games | `Easy` | `frontend`, `games`, `good first issue` |
| **#3** | [Feature] Implement "Number Recall" (Digit Span) Working Memory Exercise | Activities / Games | `Medium` | `frontend`, `games` |
| **#4** | [Feature] Browser-Native Speech Recognition (STT) for Voice Assistant | AI Companion | `Medium` | `frontend`, `ai`, `speech` |
| **#5** | [API] Context-Aware Daily Schedule Injection into Gemini Voice Assistant | Backend / AI | `Hard` | `backend`, `api`, `ai` |
| **#6** | [Enhancement] Speech Synthesis Speed, Pitch & Accent Customization | Accessibility / Voice | `Easy` | `frontend`, `accessibility`, `good first issue` |
| **#7** | [Feature] In-Browser Voice Note Audio Recorder for Memory Book | Family / Multimedia | `Medium` | `frontend`, `multimedia`, `help wanted` |
| **#8** | [Feature] Interactive OpenStreetMap / Leaflet Canvas for Safe-Zone Geofencing | Family / Maps | `Hard` | `frontend`, `maps` |
| **#9** | [Feature] Multi-Elder Profile Switcher with PIN Code Linking | Family / Caregiver | `Easy` | `frontend`, `state`, `good first issue` |
| **#10** | [Architecture] Cloud Database Persistence Adapter (Firestore / SQL) | Backend / Storage | `Hard` | `backend`, `database`, `architecture` |
| **#11** | [Auth] Dual-Role Authentication (Elder 4-Digit PIN vs. Caregiver Account) | Auth / Full-stack | `Hard` | `backend`, `frontend`, `auth` |
| **#12** | [i18n] Expand Regional Language Dictionaries (Bodo, Khasi, Manipuri, Mizo) | Localization / i18n | `Easy` | `frontend`, `i18n`, `good first issue` |
| **#13** | [Feature] Printable Clinical Summary & PDF Care Assessment Export | Insights / Clinical | `Medium` | `frontend`, `export`, `telemetry` |

---

## 🧩 Detailed Issue Specifications

### Issue #1: Implement "Face & Family Match" Cognitive Activity
- **Category:** `frontend`, `games`, `accessibility`
- **Difficulty:** `medium`
- **Labels:** `feature`, `help wanted`
- **Relevant View / Route:** Activities View (`currentPage === 'activities'`)
- **Files to Modify / Create:**
  - Create: `src/features/activities/games/FaceFamilyMatch.tsx`
  - Modify: `src/features/activities/activityRegistry.ts`
  - Modify: `src/features/activities/ActivityHost.tsx`
- **Functionality:**
  - Presents portrait photos and names of family members (retrieved from the Memory Book).
  - Prompts the elder with warm contextual questions (e.g., *"Who visits on Sundays with warm pitha?"* or *"Tap on your daughter Meera"*).
  - Minimum 44px touch targets, gentle transitions, and zero punitive failure banners.
  - Updates activity status from `'contribute'` to `'active'` in `activityRegistry.ts` and returns session stats via `onSessionComplete({ moves, accuracy })`.

---

### Issue #2: Implement "Odd One Out" Categorical Classification Game
- **Category:** `frontend`, `games`
- **Difficulty:** `easy`
- **Labels:** `good first issue`, `feature`
- **Relevant View / Route:** Activities View (`ActivityHost.tsx`)
- **Files to Modify / Create:**
  - Create: `src/features/activities/games/OddOneOut.tsx`
  - Modify: `src/features/activities/activityRegistry.ts`
  - Modify: `src/features/activities/ActivityHost.tsx`
- **Functionality:**
  - Displays 4 items on screen (3 belonging to one category, 1 belonging to another, e.g., 3 tea harvesting tools vs. 1 kitchen utensil, or 3 winter fruits vs. 1 flower).
  - Uses culturally rooted North-Eastern iconography (Tea leaves, Gamusa, Jaapi, Pitha, Bell metal cup).
  - 3 progressive rounds with encouraging chime feedback.
  - Ideal starting point for first-time open-source contributors.

---

### Issue #3: Implement "Number Recall" (Digit Span) Working Memory Exercise
- **Category:** `frontend`, `games`
- **Difficulty:** `medium`
- **Labels:** `feature`
- **Relevant View / Route:** Activities View (`ActivityHost.tsx`)
- **Files to Modify / Create:**
  - Create: `src/features/activities/games/DigitSpan.tsx`
  - Modify: `src/features/activities/activityRegistry.ts`
  - Modify: `src/features/activities/ActivityHost.tsx`
- **Functionality:**
  - Flashes a sequence of numbers (3 to 6 digits) one-by-one with large high-contrast typography and gentle chime intervals.
  - Elder keys in the sequence using an oversized telephone-style numeric pad.
  - Supports Forward Span (Level 1–3) and Reverse Span (Level 4–6).
  - Respects elder pacing with no aggressive ticking countdowns.

---

### Issue #4: Browser-Native Speech Recognition (STT) for Voice Assistant
- **Category:** `frontend`, `ai`, `speech`
- **Difficulty:** `medium`
- **Labels:** `enhancement`, `help wanted`
- **Relevant View / Component:** Voice Assistant Modal (`VoiceAssistantModal.tsx`)
- **Files to Modify:**
  - Modify: `src/components/modals/VoiceAssistantModal.tsx`
- **Functionality:**
  - Replaces simulated timer mic listening with real browser `webkitSpeechRecognition` / `SpeechRecognition` API.
  - Sets language code dynamically based on current user language (`as-IN` for Assamese with fallback to `hi-IN` / `en-IN` where OS speech engines differ, `en-IN` for English).
  - Displays live speech-to-text transcript while user is speaking, then auto-submits to the assistant upon silence pause.

---

### Issue #5: Context-Aware Daily Schedule Injection into Gemini Voice Assistant
- **Category:** `backend`, `api`, `ai`
- **Difficulty:** `hard`
- **Labels:** `backend`, `api`, `enhancement`
- **Relevant View / Endpoints:** Express Server Route (`/api/assistant/chat`) & Assistant Modal
- **Files to Modify:**
  - Modify: `server.ts`
  - Modify: `src/components/modals/VoiceAssistantModal.tsx`
  - Modify: `src/services/api.ts`
- **Functionality:**
  - Currently the assistant answers general queries. This issue enriches the `/api/assistant/chat` POST payload with live snapshot telemetry:
    - Reminders list + checked status (e.g., *"Morning Blood Pressure pill: Completed at 8:30 AM"*).
    - Next appointment details (e.g., *"Dr. Barua at 4:30 PM today"*).
    - Safe zone perimeter status.
  - Injects this data into the Gemini system instructions so if an elder asks *"Did I take my afternoon pill?"* or *"Where is my doctor appointment?"*, Gemini provides an accurate, reassuring answer in their chosen language.

---

### Issue #6: Speech Synthesis Speed, Pitch & Accent Customization
- **Category:** `frontend`, `accessibility`
- **Difficulty:** `easy`
- **Labels:** `good first issue`, `accessibility`
- **Relevant View / Component:** Settings View (`SettingsView.tsx`) & Assistant Modal (`VoiceAssistantModal.tsx`)
- **Files to Modify:**
  - Modify: `src/features/settings/SettingsView.tsx`
  - Modify: `src/components/modals/VoiceAssistantModal.tsx`
  - Modify: `src/types/index.ts`
- **Functionality:**
  - Adds voice playback preferences in Settings: Speaking Rate (`0.75x Slow`, `0.9x Gentle`, `1.0x Standard`) and Voice selection dropdown filtered to Indian English / regional voices.
  - Persists preference in `localStorage` and applies settings during speech synthesis in `VoiceAssistantModal.tsx` and Memory Book voice playback.

---

### Issue #7: In-Browser Voice Note Audio Recorder for Memory Book
- **Category:** `frontend`, `multimedia`
- **Difficulty:** `medium`
- **Labels:** `feature`, `help wanted`
- **Relevant View / Component:** Memory Book View (`MemoryBookView.tsx` / `FamilyView.tsx`)
- **Files to Modify:**
  - Modify: `src/features/family/MemoryBookView.tsx`
  - Modify: `src/services/api.ts`
- **Functionality:**
  - When a caregiver adds or edits a family member card, provides a 15-second audio recorder using `navigator.mediaDevices.getUserMedia`.
  - Includes record, pause, and review playback preview.
  - Converts recorded audio to a base64 data URI or Object URL stored in the contact record so elders can tap "Play Hello" to hear their child's or grandchild's real voice.

---

### Issue #8: Interactive OpenStreetMap / Leaflet Canvas for Safe-Zone Geofencing
- **Category:** `frontend`, `maps`
- **Difficulty:** `hard`
- **Labels:** `feature`, `enhancement`
- **Relevant View / Component:** Family Safety Tab (`FamilyView.tsx`)
- **Files to Modify:**
  - Modify: `src/features/family/FamilyView.tsx`
  - Modify: `package.json` (install `leaflet` / `react-leaflet`)
- **Functionality:**
  - Upgrades the current SVG perimeter preview to an interactive OpenStreetMap canvas.
  - Displays elder pin with animated pulse ring, home marker, and local landmark pins (Dispur/Jorhat Namghar, local dispensary, walking park).
  - Dynamically updates green boundary circle as the caregiver drags the Safe-Zone Radius slider (200m to 1500m).
  - Supports dark/warm map tile layers.

---

### Issue #9: Multi-Elder Profile Switcher with PIN Code Linking
- **Category:** `frontend`, `state`
- **Difficulty:** `easy`
- **Labels:** `good first issue`, `enhancement`
- **Relevant View / Component:** Elder Switcher & Family Overview (`ElderSwitcher.tsx`, `FamilyView.tsx`)
- **Files to Modify:**
  - Modify: `src/features/family/ElderSwitcher.tsx`
  - Modify: `src/features/family/FamilyView.tsx`
  - Modify: `src/services/api.ts`
- **Functionality:**
  - Allows caregivers caring for both parents or multiple relatives to link an additional elder via their unique code (e.g. `SHY-4482`).
  - Stores array of linked elder IDs in local state / caregiver session.
  - Provides a 1-tap switcher pill in the top header or family view to toggle between elder profiles.

---

### Issue #10: Production Cloud Database Persistence Adapter (Firestore / SQL)
- **Category:** `backend`, `database`
- **Difficulty:** `hard`
- **Labels:** `backend`, `database`, `architecture`
- **Relevant Layer:** Storage Adapters (`src/services/`) & Express API (`server.ts`)
- **Files to Modify / Create:**
  - Create: `src/services/storageAdapter.ts` (Interface)
  - Create: `src/services/cloudAdapter.ts`
  - Modify: `src/services/sandboxStorage.ts`
  - Modify: `src/services/api.ts`
  - Modify: `server.ts`
- **Functionality:**
  - Implements the Storage Adapter Pattern so the application can run against either local sandbox storage (default demo mode) or persistent cloud databases (Firestore / PostgreSQL).
  - Implements CRUD methods for `/elders/{elderId}/reminders`, `/appointments`, `/family`, and `/activity_logs`.

---

### Issue #11: Dual-Role Authentication (Elder 4-Digit PIN vs. Caregiver Account)
- **Category:** `backend`, `frontend`, `auth`
- **Difficulty:** `hard`
- **Labels:** `auth`, `backend`, `security`
- **Relevant View / Component:** Splash / Login Screens & Server Middleware
- **Files to Modify:**
  - Modify: `src/components/auth/SplashScreen.tsx`
  - Modify: `src/components/auth/OnboardingFlow.tsx`
  - Modify: `server.ts`
  - Modify: `src/types/index.ts`
- **Functionality:**
  - Replaces single-click role toggle with:
    - **Elder Mode:** 4-digit large keypad PIN login (accessible for elders without email accounts).
    - **Caregiver Mode:** Email + password authentication with authorized Elder Code linking.
  - Generates session tokens and guards caregiver-only routes.

---

### Issue #12: Expand Regional Language Dictionaries (Bodo, Khasi, Manipuri, Mizo)
- **Category:** `frontend`, `i18n`
- **Difficulty:** `easy`
- **Labels:** `good first issue`, `localization`, `documentation`
- **Relevant View / Component:** Language Selector & Localization Layer
- **Files to Modify:**
  - Create: `src/i18n/dictionaries.ts`
  - Modify: `src/types/index.ts`
  - Modify: `src/features/settings/SettingsView.tsx`
  - Modify: `src/components/layout/Topbar.tsx`
- **Functionality:**
  - Extends UI string dictionary beyond English and Assamese to include common elder phrases in Bodo (बड़ो), Khasi, Manipuri (মৈতৈলোন্), and Mizo.
  - Translates primary controls ("Take Medicine", "Call Family", "Emergency Help", "Home").

---

### Issue #13: Printable Clinical Summary & PDF Care Assessment Export
- **Category:** `frontend`, `export`, `telemetry`
- **Difficulty:** `medium`
- **Labels:** `enhancement`, `help wanted`
- **Relevant View / Component:** Insights & Family View (`InsightsView.tsx`, `AppointmentsView.tsx`)
- **Files to Modify:**
  - Modify: `src/features/family/InsightsView.tsx`
  - Modify: `src/features/appointments/AppointmentsView.tsx`
- **Functionality:**
  - Provides a "Export Doctor Report (PDF / Print)" button.
  - Formats 30-day cognitive performance graphs, medicine adherence rates, geofence event logs, and physician notes into a clean, printable medical report layout for geriatric consultations.
