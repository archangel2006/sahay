import test from 'node:test';
import assert from 'node:assert/strict';
import { sandboxStorage } from '../../../services/sandboxStorage';
import { api } from '../../../services/api';

// Polyfill in-memory localStorage for node test runner
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

test('Elder Profile & Companion PIN Management', async (t) => {
  t.beforeEach(() => {
    localStorage.clear();
    sandboxStorage.resetAll();
  });

  await t.test('default linked elders should include predefined profiles with valid 4-digit PINs', async () => {
    const elders = await api.getLinkedElders();
    assert.ok(elders.length >= 2, 'Should have at least 2 default linked elders');
    
    const primary = elders.find((e) => e.id === 'SHY-9021');
    assert.ok(primary, 'Primary elder SHY-9021 must exist');
    assert.equal(primary.name, 'Bimala aita');
    assert.equal(primary.pin, '9021', 'Primary elder should have pairing PIN');
    assert.match(primary.pin!, /^\d{4}$/, 'PIN must be 4 digits');
  });

  await t.test('PIN validation: rejects empty, invalid length, or non-numeric PIN codes', async () => {
    // Empty PIN
    await assert.rejects(
      () => api.linkElder('SHY-7777', 'Test Elder', 'Guwahati', 'Aunt', ''),
      /valid 4-digit companion pairing PIN/
    );

    // 3 digits
    await assert.rejects(
      () => api.linkElder('SHY-7777', 'Test Elder', 'Guwahati', 'Aunt', '123'),
      /valid 4-digit companion pairing PIN/
    );

    // 5 digits
    await assert.rejects(
      () => api.linkElder('SHY-7777', 'Test Elder', 'Guwahati', 'Aunt', '12345'),
      /valid 4-digit companion pairing PIN/
    );

    // Non-numeric
    await assert.rejects(
      () => api.linkElder('SHY-7777', 'Test Elder', 'Guwahati', 'Aunt', '12a4'),
      /valid 4-digit companion pairing PIN/
    );
  });

  await t.test('duplicate elder ID validation: prevents linking already registered profiles', async () => {
    // Attempt to re-register SHY-9021 (case insensitive)
    await assert.rejects(
      () => api.linkElder('shy-9021', 'Duplicate Bimala', 'Jorhat', 'Grandmother', '9999'),
      /already linked/
    );
  });

  await t.test('successful linking: normalizes ID, assigns palette avatar, and persists profile', async () => {
    const created = await api.linkElder(
      'shy-5522',
      'Hemanta Bora',
      'Tezpur',
      'Uncle',
      '4321'
    );

    assert.equal(created.id, 'SHY-5522', 'ID should be normalized to uppercase');
    assert.equal(created.name, 'Hemanta Bora');
    assert.equal(created.location, 'Tezpur');
    assert.equal(created.relationTag, 'Uncle');
    assert.equal(created.pin, '4321');
    assert.ok(created.avatarColor, 'Must assign an avatar color');

    // Verify persisted in storage
    const stored = sandboxStorage.getLinkedElders();
    const found = stored.find((e) => e.id === 'SHY-5522');
    assert.ok(found, 'Newly linked elder must persist in sandbox storage');
    assert.equal(found.pin, '4321');
  });

  await t.test('unlinking: removes elder profile while preserving remaining companions', async () => {
    // First link a temporary elder
    await api.linkElder('SHY-9999', 'Temporary Elder', 'Silchar', 'Cousin', '8888');
    let current = sandboxStorage.getLinkedElders();
    assert.ok(current.some((e) => e.id === 'SHY-9999'));

    // Unlink
    await api.unlinkElder('SHY-9999');
    current = sandboxStorage.getLinkedElders();
    assert.ok(!current.some((e) => e.id === 'SHY-9999'), 'Elder must be removed');
    assert.ok(current.some((e) => e.id === 'SHY-9021'), 'Other elders must remain intact');
  });
});
