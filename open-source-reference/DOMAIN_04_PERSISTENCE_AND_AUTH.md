# Domain 04: Persistence, Multi-User Auth & Database Adapters

This reference document outlines issues for connecting real cloud databases (Firebase / Supabase / PostgreSQL) while keeping the open-source demo sandbox immune to spam.

---

## 📋 Architectural Overview
- **Service Layer:** `src/services/api.ts` and `src/services/storageAdapter.ts`
- **Core Design:** Storage Abstraction Pattern.
  - In **Demo Mode**, the app uses the `LocalStorageAdapter` seeded with authentic Bimala aita defaults.
  - In **Production Mode**, the app switches to the `CloudStorageAdapter` (Firebase Firestore / Cloud SQL).
- **Benefit:** All UI components, games, and forms invoke the unified `api` methods, meaning any contribution in Demo Mode works in Production automatically.

---

## 🎯 Targeted Issues for Contributors

### Issue D1: Firebase Firestore Storage Adapter
- **Goal:** Implement Firestore persistence for real deployments.
- **Requirements:**
  1. Create `src/services/firebaseAdapter.ts` implementing the `StorageAdapter` interface.
  2. Implement document paths:
     - `/elders/{elderId}/reminders`
     - `/elders/{elderId}/appointments`
     - `/elders/{elderId}/family`
     - `/elders/{elderId}/activity_logs`
  3. Write robust security rules in `firestore.rules` preventing cross-user data leakage.

### Issue D2: Multi-Role Authentication (Elder PIN vs. Caregiver Email/Password)
- **Goal:** Support low-friction 4-digit PIN authentication for elders and secure Email/OAuth for caregivers.
- **Requirements:**
  1. Elder login: 4 large digits or single-tap biometrics.
  2. Caregiver login: Email + password or Google sign-in.
  3. Linking protocol: Caregiver enters elder's 6-character Elder ID (`SHY-XXXX`) + 4-digit security PIN to establish authorized connection.
