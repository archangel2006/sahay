# Domain 01: Cognitive Activities & Stimulation Games

This reference is for opening GitHub issues and guiding contributors on building and enhancing cognitive stimulation activities for elders in Sahay.

---

## 📋 Architectural Overview
All cognitive activities live under `src/features/activities/games/` and are declared in `src/features/activities/activityRegistry.ts`.

### Standard Activity Contract
```tsx
import React from 'react';

interface ActivityProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const YourGame: React.FC<ActivityProps> = ({ onSessionComplete, showToast }) => {
  // Logic
};
```

---

## 🎯 Targeted Issues for Contributors

### Issue A1: Implement Face & Family Match (`faces`)
- **Cognitive Domain:** Autobiographical & Facial Memory
- **Goal:** Present photos or names of family members (e.g. from the caregiver Memory Book) and ask the elder to match who is who (e.g. "Who loves listening to Bihu songs with you?" or "Which one is Ranjit?").
- **Requirements:**
  1. Create `src/features/activities/games/FaceFamilyMatch.tsx`.
  2. Implement with minimum 44px touch targets and gentle transitions.
  3. Wire into `src/features/activities/ActivityHost.tsx` and mark status as `active` in `activityRegistry.ts`.
  4. Call `onSessionComplete({ moves, accuracy })` upon game conclusion.

### Issue A2: Implement Odd One Out (`odd`)
- **Cognitive Domain:** Executive Function & Categorical Classification
- **Goal:** Present 4 items (3 related, 1 belonging to a different category, such as 3 winter fruits and 1 tea cup).
- **Requirements:**
  1. Create `src/features/activities/games/OddOneOut.tsx`.
  2. Use culturally rooted North-Eastern objects (Tea leaves, Gamusa, Jaapi, Pitha, Bell metal cup).
  3. Include 3 difficulty levels with soothing feedback sounds.

### Issue A3: Implement Number Recall / Digit Span (`numbers`)
- **Cognitive Domain:** Working Memory & Attention Span
- **Goal:** Display 3 to 7 digits sequentially with large typography, pause, and prompt the elder to tap the digits in order.
- **Requirements:**
  1. Create `src/features/activities/games/DigitSpan.tsx`.
  2. Forward span (recall in same order) and reverse span (recall backwards).
  3. Add gentle timers without stressful ticking countdowns.

---

## 💡 Elder UX Guidelines
- **No Negative Penalties:** Never show red "Failure" banners. Frame misses encouragingly (e.g. *"Let's take a deep breath and try that again"*).
- **High Contrast & Touch Area:** All interactive buttons must be at least 44x44px.
