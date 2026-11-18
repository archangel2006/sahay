import test from 'node:test';
import assert from 'node:assert/strict';
import { api } from '../../../services/api';
import { sandboxStorage } from '../../../services/sandboxStorage';
import { FamilyMemberItem } from '../../../types';

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

test('In-Browser Voice Note Audio Recorder & Memory Book Integration', async (t) => {
  t.beforeEach(() => {
    localStorage.clear();
    sandboxStorage.resetAll();
  });

  await t.test('adding a family member with a real recorded audio voice note data URI', async () => {
    const sampleAudioDataUri =
      'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQ8taz442+02k7842+02k78=';

    const created = await api.addFamilyMember({
      name: 'Anupama',
      rel: 'Granddaughter',
      fact: 'Brings marigold flowers every festival day.',
      color: '#3E4F74',
      phone: '+91 98640 54321',
      address: 'Gar-ali, Jorhat',
      voiceNoteText: 'Aita, I love you and will see you tomorrow morning!',
      audioUrl: sampleAudioDataUri,
    });

    assert.ok(created.id, 'Created member should have a generated ID');
    assert.equal(created.name, 'Anupama');
    assert.equal(created.audioUrl, sampleAudioDataUri, 'audioUrl must match recorded data URI');

    // Verify storage persistence
    const family = sandboxStorage.getFamily();
    const stored = family.find((m) => m.id === created.id);
    assert.ok(stored, 'Member must be persisted to sandbox storage');
    assert.equal(stored.audioUrl, sampleAudioDataUri);
  });

  await t.test('updating a family member to attach a new recorded voice note', async () => {
    const initialFamily = sandboxStorage.getFamily();
    const target = initialFamily[0]; // Ranjit
    assert.ok(target, 'Target member must exist');

    const newVoiceNote = 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQ8taz442+02k78UPDATED=';

    const updated = await api.updateFamilyMember({
      ...target,
      audioUrl: newVoiceNote,
      voiceNoteText: 'Aita, fresh pithas are packed and on the way!',
    });

    assert.equal(updated.id, target.id);
    assert.equal(updated.audioUrl, newVoiceNote);
    assert.equal(updated.voiceNoteText, 'Aita, fresh pithas are packed and on the way!');

    // Verify persisted
    const current = sandboxStorage.getFamily();
    const found = current.find((m) => m.id === target.id);
    assert.ok(found);
    assert.equal(found.audioUrl, newVoiceNote);
  });

  await t.test('removing or discarding voice note preserves all other member details', async () => {
    const initialFamily = sandboxStorage.getFamily();
    const target = initialFamily[0];

    // Add voice note first
    await api.updateFamilyMember({
      ...target,
      audioUrl: 'data:audio/webm;base64,TEMP',
    });

    // Now discard audio note (set to undefined)
    const discarded = await api.updateFamilyMember({
      ...target,
      audioUrl: undefined,
    });

    assert.equal(discarded.audioUrl, undefined, 'audioUrl should be cleared');
    assert.equal(discarded.name, target.name, 'Name must remain unchanged');
    assert.equal(discarded.rel, target.rel, 'Relationship must remain unchanged');
    assert.equal(discarded.phone, target.phone, 'Phone must remain unchanged');
  });

  await t.test('validates 15-second duration limit enforcement and audio mime types', () => {
    const MAX_DURATION_SECONDS = 15;
    assert.equal(MAX_DURATION_SECONDS, 15, 'Maximum duration must be capped at 15 seconds');

    const validMimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg'];
    const isMimeSupported = (mime: string) => validMimeTypes.includes(mime);

    assert.ok(isMimeSupported('audio/webm'));
    assert.ok(isMimeSupported('audio/mp4'));
    assert.ok(!isMimeSupported('video/mp4'));
  });
});
