# Domain 02: AI Voice Companion ("Talk to Sahay")

This reference document outlines issues and enhancements for the multilingual conversational voice assistant tailored for elders.

---

## 📋 Architectural Overview
- **Backend Route:** `/api/assistant/chat` (Express server in `server.ts`)
- **UI Host:** `src/components/modals/VoiceAssistantModal.tsx`
- **Model:** Gemini 2.5 Flash with culturally grounded, compassionate elder-care system instructions.

---

## 🎯 Targeted Issues for Contributors

### Issue B1: Native Web Speech API / Voice Input (STT)
- **Goal:** Replace simulated voice listening with browser-native `webkitSpeechRecognition` / `SpeechRecognition` API.
- **Requirements:**
  1. Detect browser support for SpeechRecognition.
  2. Map selected language:
     - Assamese: `as-IN` (with fallback to `hi-IN` / `en-IN` where OS speech recognition models vary)
     - English: `en-IN`
  3. Stream recognized transcripts into prompt input dynamically with an animated listening wave.

### Issue B2: Text-to-Speech (TTS) Voice Playback
- **Goal:** Enable Sahay to read aloud replies in a calm, elderly-friendly cadence.
- **Requirements:**
  1. Use `window.speechSynthesis` with `rate: 0.85` (slower, gentle cadence).
  2. Select warm regional voices when available.
  3. Add a mute/unmute audio toggle in the assistant modal.

### Issue B3: Context-Aware Daily Schedule Injection
- **Goal:** Inject the elder's today schedule (medicines, appointments, safe zone radius) directly into the Gemini prompt context.
- **Requirements:**
  1. When elder asks: *"Did I take my afternoon pill?"*, Sahay inspects the live reminder state and responds accurately in their chosen dialect.
