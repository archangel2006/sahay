# Contributing to Sahay — Cognitive Care Platform for Elders

Thank you for your interest in contributing to **Sahay**! Our mission is to build a culturally grounded, compassionate, and accessible cognitive care platform for elders across North-East India and beyond.

---

## 🌟 The "Golden Skeleton" Philosophy

Sahay is architected with a **golden baseline**:
1. **Fully Functional Reference Modules**:
   - The entire app shell (Desktop Sidebar, Responsive Mobile Nav, Topbar, Settings, Accessibility zoom).
   - **4 Flagship Cognitive Games**: Memory Match, Pattern Recall, Routine Recall, and Spot the Difference.
   - **Care Schedule Engine**: Reminders with interactive check-offs, search, and additions.
   - **Appointments System**: Upcoming clinical sessions with simulated direction/video triggers.
   - **Family & Caregiver Oversight**: Memory book with voice playback, live geofence map with radius slider, and alert feed.
   - **AI Voice Companion ("Talk to Sahay")**: Backed by Gemini server-side API with regional language awareness.
2. **Scaffolded Contributor Slots**:
   - Open slots for additional cognitive exercises (`Face & Family Match`, `Odd One Out`, `Number Recall`).
   - Localization dictionaries (Assamese, Bodo, Khasi, Manipuri, Mizo).
   - Hardware sensor or real GPS integration.

---

## 🧩 How to Add a New Cognitive Game (3 Steps)

Follow this recipe to implement one of the open activities (such as `faces`, `odd`, or `numbers`):

### Step 1: Create your game component
In `src/features/activities/games/YourGameName.tsx`:

```tsx
import React, { useState } from 'react';

interface YourGameProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const YourGameName: React.FC<YourGameProps> = ({ onSessionComplete, showToast }) => {
  // 1. Maintain local game state
  // 2. Render cards/tiles with 44px+ touch targets
  // 3. Call onSessionComplete({ moves, accuracy }) when finished
  return (
    <div className="max-w-[440px] mx-auto text-center">
      {/* Game board */}
    </div>
  );
};
```

### Step 2: Register in `src/features/activities/activityRegistry.ts`
Update the status of your activity from `'contribute'` to `'active'`:

```ts
{
  id: 'faces',
  title: 'Face & Family Match',
  description: '...',
  category: 'Memory',
  level: 1,
  maxLevel: 3,
  status: 'active', // <--- Change to 'active'
  iconName: 'user',
}
```

### Step 3: Wire into `src/features/activities/ActivityHost.tsx`
Import your component and return it in `renderGameContent()`:

```tsx
case 'faces':
  return <FaceFamilyMatch onSessionComplete={onSessionComplete} showToast={showToast} />;
```

---

## 🎨 Elder-Friendly Design System Rules

Please respect these principles when designing or contributing UI:

1. **Warm Palette**:
   - Background: `#FBF7EE` (Warm Paper)
   - Accent / Cards: `#FFFFFF` (Surface) with `#E6DAB9` (Muted Line borders)
   - Deep Forest: `#22403A` for headers and primary controls
   - Marigold: `#E2A33D` for milestones and active cards
2. **Typography**:
   - Headings: `font-fraunces` (Fraunces serif)
   - Controls & Badges: `font-baloo` (Baloo 2)
   - Body copy: `font-mulish` (Mulish sans-serif)
3. **Accessibility**:
   - Minimum touch target: 44px by 44px.
   - Text size responds to the user’s font scaler (`Normal`, `Large`, `Extra Large`).
   - High contrast (passes WCAG AA).
4. **Positive Framing**:
   - Never show "Game Over" or punitive red failure banners. Frame misses gently: *"Let's take a breath and try a shorter sequence."*

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start Express + Vite full-stack server
npm run dev

# Run TypeScript build check
npm run build
```

The app runs on port 3000 at `http://localhost:3000`.

---

## 📋 Good First Issues

1. **Regional Localization**: Adding localized greeting phrases and reminder presets for Khasi, Bodo, and Mizo.
2. **Sound Effects**: Integrating gentle chime sounds using Web Audio API on card matches.
3. **Memory Book Audio Recording**: Hooking up browser MediaRecorder API to record custom family messages directly in the browser.
