import test from 'node:test';
import assert from 'node:assert/strict';
import { voiceSettings, DEFAULT_VOICE_PREFERENCE } from '../../../services/voiceSettings';
import { SpeechRate } from '../../../types';

// Polyfill in-memory localStorage for Node test runner
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => store.set(key, String(val)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

test('Speech Synthesis Speed, Pitch & Accent Preferences', async (t) => {
  t.beforeEach(() => {
    localStorage.clear();
  });

  await t.test('returns default calm voice settings when none are stored', () => {
    const pref = voiceSettings.getPreference();
    assert.equal(pref.rate, 0.9, 'Default rate should be 0.9x gentle pace');
    assert.equal(pref.pitch, 1.05, 'Default pitch should be 1.05 warm tone');
    assert.equal(pref.voiceUri, undefined);
  });

  await t.test('updates and persists speaking rates (0.75x, 0.9x, 1.0x)', () => {
    const rates: SpeechRate[] = [0.75, 0.9, 1.0];

    for (const rate of rates) {
      const saved = voiceSettings.savePreference({ rate });
      assert.equal(saved.rate, rate);

      const retrieved = voiceSettings.getPreference();
      assert.equal(retrieved.rate, rate, `Retrieved rate must match ${rate}`);
    }
  });

  await t.test('updates pitch and voice selection', () => {
    const updated = voiceSettings.savePreference({
      pitch: 0.95,
      voiceUri: 'com.apple.speech.synthesis.voice.veena',
      voiceName: 'Veena (en-IN)',
    });

    assert.equal(updated.pitch, 0.95);
    assert.equal(updated.voiceUri, 'com.apple.speech.synthesis.voice.veena');
    assert.equal(updated.voiceName, 'Veena (en-IN)');

    const retrieved = voiceSettings.getPreference();
    assert.equal(retrieved.pitch, 0.95);
    assert.equal(retrieved.voiceUri, 'com.apple.speech.synthesis.voice.veena');
    assert.equal(retrieved.voiceName, 'Veena (en-IN)');
  });

  await t.test('correctly configures SpeechSynthesisUtterance with stored preferences', () => {
    voiceSettings.savePreference({ rate: 0.75, pitch: 1.15 });

    const mockUtterance: any = {
      text: 'Hello world',
      rate: 1,
      pitch: 1,
      voice: null,
    };

    voiceSettings.applyPreferenceToUtterance(mockUtterance);
    assert.equal(mockUtterance.rate, 0.75, 'Utterance rate should be customized to 0.75');
    assert.equal(mockUtterance.pitch, 1.15, 'Utterance pitch should be customized to 1.15');
  });

  await t.test('sanitizes corrupt or out-of-range rates to safe defaults', () => {
    localStorage.setItem('sahay_voice_preference', JSON.stringify({ rate: 99.5, pitch: 'invalid' }));
    const pref = voiceSettings.getPreference();
    assert.equal(pref.rate, 0.9, 'Out of range rate must fallback to safe 0.9');
    assert.equal(pref.pitch, 1.05, 'Invalid pitch must fallback to safe 1.05');
  });
});
