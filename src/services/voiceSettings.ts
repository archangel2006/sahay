import { VoicePreference, SpeechRate } from '../types';

export const DEFAULT_VOICE_PREFERENCE: VoicePreference = {
  rate: 0.9,
  pitch: 1.05,
  voiceUri: undefined,
  voiceName: undefined,
};

const STORAGE_KEY = 'sahay_voice_preference';

export const voiceSettings = {
  getPreference(): VoicePreference {
    try {
      if (typeof localStorage === 'undefined') return DEFAULT_VOICE_PREFERENCE;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_VOICE_PREFERENCE;
      const parsed = JSON.parse(raw);
      return {
        rate: ([0.75, 0.9, 1.0].includes(parsed.rate) ? parsed.rate : 0.9) as SpeechRate,
        pitch: typeof parsed.pitch === 'number' ? parsed.pitch : 1.05,
        voiceUri: parsed.voiceUri || undefined,
        voiceName: parsed.voiceName || undefined,
      };
    } catch {
      return DEFAULT_VOICE_PREFERENCE;
    }
  },

  savePreference(pref: Partial<VoicePreference>): VoicePreference {
    const current = this.getPreference();
    const updated: VoicePreference = { ...current, ...pref };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // quota or private mode
    }
    return updated;
  },

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices();
  },

  getIndianAndRegionalVoices(): SpeechSynthesisVoice[] {
    const all = this.getAvailableVoices();
    if (all.length === 0) return [];

    // Filter to Indian English (en-IN), Hindi (hi-IN), Bengali/Assamese (bn/as) or India regional
    const indianVoices = all.filter((v) => {
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return (
        lang.includes('-in') ||
        lang.startsWith('hi') ||
        lang.startsWith('bn') ||
        lang.startsWith('as') ||
        name.includes('india') ||
        name.includes('hindi')
      );
    });

    if (indianVoices.length > 0) return indianVoices;

    // Fallback: return English voices
    const englishVoices = all.filter((v) => v.lang.toLowerCase().startsWith('en'));
    return englishVoices.length > 0 ? englishVoices : all;
  },

  applyPreferenceToUtterance(utterance: SpeechSynthesisUtterance, pref?: VoicePreference): void {
    const active = pref || this.getPreference();
    utterance.rate = active.rate;
    utterance.pitch = active.pitch;

    if (active.voiceUri && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find((v) => v.voiceURI === active.voiceUri);
      if (matched) {
        utterance.voice = matched;
      }
    }
  },
};
