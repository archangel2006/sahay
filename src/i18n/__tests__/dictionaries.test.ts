import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  DICTIONARIES,
  LANGUAGE_METADATA,
  SUPPORTED_LANGUAGES_LIST,
  getDictionary,
  getLanguageMeta,
} from '../dictionaries';
import { SupportedLanguage } from '../../types';

describe('Regional Language Dictionaries (Issue #10)', () => {
  const allLanguages: SupportedLanguage[] = [
    'English',
    'Assamese',
    'Bodo',
    'Khasi',
    'Manipuri',
    'Mizo',
  ];

  it('should support all 6 required Northeast languages', () => {
    assert.strictEqual(SUPPORTED_LANGUAGES_LIST.length, 6);
    allLanguages.forEach((lang) => {
      assert.ok(DICTIONARIES[lang], `Dictionary missing for ${lang}`);
      assert.ok(LANGUAGE_METADATA[lang], `Metadata missing for ${lang}`);
    });
  });

  it('should provide full coverage of elder primary controls for all languages', () => {
    allLanguages.forEach((lang) => {
      const dict = DICTIONARIES[lang];
      assert.ok(dict.takeMedicine && dict.takeMedicine.length > 0, `takeMedicine missing in ${lang}`);
      assert.ok(dict.callFamily && dict.callFamily.length > 0, `callFamily missing in ${lang}`);
      assert.ok(dict.emergencyHelp && dict.emergencyHelp.length > 0, `emergencyHelp missing in ${lang}`);
      assert.ok(dict.home && dict.home.length > 0, `home missing in ${lang}`);
      assert.ok(dict.talkToSahay && dict.talkToSahay.length > 0, `talkToSahay missing in ${lang}`);
      assert.ok(dict.playGame && dict.playGame.length > 0, `playGame missing in ${lang}`);
      assert.ok(dict.todaysCarePlan && dict.todaysCarePlan.length > 0, `todaysCarePlan missing in ${lang}`);
    });
  });

  it('should interpolate greeting with elder name properly', () => {
    assert.strictEqual(DICTIONARIES.English.greeting('Bimala'), 'Namaskar, Bimala');
    assert.strictEqual(DICTIONARIES.Assamese.greeting('বিমলা'), 'নমস্কাৰ, বিমলা');
    assert.strictEqual(DICTIONARIES.Bodo.greeting('बिमला'), 'खुलुमबाय, बिमला');
    assert.strictEqual(DICTIONARIES.Khasi.greeting('Bimala'), 'Khublei, Bimala');
    assert.strictEqual(DICTIONARIES.Manipuri.greeting('বিমলা'), 'খোৰুমজৰি, বিমলা');
    assert.strictEqual(DICTIONARIES.Mizo.greeting('Bimala'), 'Chibai, Bimala');
  });

  it('should fall back to English gracefully for undefined or invalid languages', () => {
    // @ts-expect-error Testing invalid language fallback
    const fallback = getDictionary('NonExistentLang');
    assert.strictEqual(fallback.takeMedicine, 'Take Medicine');
    assert.strictEqual(fallback.emergencyHelp, 'Emergency Help');

    const undefFallback = getDictionary(undefined);
    assert.strictEqual(undefFallback.takeMedicine, 'Take Medicine');
  });

  it('should return valid badges and speech locales in getLanguageMeta', () => {
    assert.strictEqual(getLanguageMeta('English').badge, 'EN');
    assert.strictEqual(getLanguageMeta('Assamese').badge, 'অ');
    assert.strictEqual(getLanguageMeta('Bodo').badge, 'ब');
    assert.strictEqual(getLanguageMeta('Khasi').badge, 'KH');
    assert.strictEqual(getLanguageMeta('Manipuri').badge, 'ম');
    assert.strictEqual(getLanguageMeta('Mizo').badge, 'MZ');

    // Fallback
    // @ts-expect-error Testing fallback
    assert.strictEqual(getLanguageMeta('Unknown').badge, 'EN');
  });
});
