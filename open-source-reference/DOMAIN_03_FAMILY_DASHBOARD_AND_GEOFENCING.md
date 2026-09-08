# Domain 03: Family Dashboard, Geofencing & Memory Book

This reference document outlines issues and features for family oversight, caregiver telemetry, and wander-prevention geofencing.

---

## 📋 Architectural Overview
- **UI Host:** `src/features/family/FamilyView.tsx`
- **Submodules:**
  - `Overview`: 7-day adherence bar chart & caregiver notifications.
  - `Memory Book`: Photo album of children and grandchildren with audio greetings.
  - `Safety & Geofencing`: Interactive perimeter map, radius adjustment slider, and zone breach log.
  - `Elder Switcher`: Ability to link multiple elders by Elder Code (`SHY-XXXX`).

---

## 🎯 Targeted Issues for Contributors

### Issue C1: Browser Voice Note Recorder for Memory Book
- **Goal:** Allow family members to record 15-second voice notes directly in the browser via `navigator.mediaDevices.getUserMedia`.
- **Requirements:**
  1. Add record/stop/playback controls to the "Add Family Member" modal.
  2. Encode audio blob as base64 or object URL for local playback.
  3. Allow the elder to replay familiar voices with high-contrast audio wave visualizers.

### Issue C2: OpenStreetMap / Leaflet Interactive Live Map
- **Goal:** Upgrade the current SVG map preview to a real interactive Leaflet/OpenStreetMap canvas.
- **Requirements:**
  1. Render elder's last recorded coordinates (e.g. Jorhat, Assam).
  2. Draw dynamic circle radius matching `safeZoneRadius` (200m - 1500m).
  3. Include landmark pins (Home, Local Pharmacy, Community Namghar / Temple, Tea Garden walking trail).

### Issue C3: Multi-Elder Caregiver Switcher
- **Goal:** Allow a caregiver managing multiple aging parents/relatives to link and toggle between them using unique Elder Codes.
- **Requirements:**
  1. Implement input field to link elder by ID (e.g. `SHY-9021`).
  2. Store linked profiles in caregiver's session storage.
  3. Provide quick switcher pill at the top of the Family Dashboard.
