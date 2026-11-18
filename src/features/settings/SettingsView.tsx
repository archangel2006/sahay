import React, { useState, useEffect } from 'react';
import { Sliders, Type, Globe, Bell, LogOut, RotateCcw, Shield, Volume2, Play, Sparkles } from 'lucide-react';
import { SupportedLanguage, TextScale, UserRole, PortalMode, SpeechRate, VoicePreference } from '../../types';
import { sandboxStorage } from '../../services/sandboxStorage';
import { voiceSettings } from '../../services/voiceSettings';

interface SettingsViewProps {
  fontSize: TextScale;
  onChangeFontSize: (scale: TextScale) => void;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  showToast: (msg: string, icon?: string) => void;
  userRole?: UserRole;
  onSwitchRole?: (newRole: UserRole) => void;
  portalMode?: PortalMode;
  onResetApp?: () => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  fontSize,
  onChangeFontSize,
  language,
  onChangeLanguage,
  showToast,
  userRole = 'companion',
  onSwitchRole,
  portalMode = 'demo',
  onResetApp,
  onLogout,
}) => {
  const languages: { name: SupportedLanguage; label: string }[] = [
    { name: 'English', label: 'English' },
    { name: 'Assamese', label: 'অসমীয়া' },
    { name: 'Bodo', label: 'Bodo' },
    { name: 'Khasi', label: 'Khasi' },
    { name: 'Manipuri', label: 'Manipuri' },
    { name: 'Mizo', label: 'Mizo' },
  ];

  const [voicePref, setVoicePref] = useState<VoicePreference>(() => voiceSettings.getPreference());
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      const voices = voiceSettings.getIndianAndRegionalVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleRateChange = (rate: SpeechRate) => {
    const updated = voiceSettings.savePreference({ rate });
    setVoicePref(updated);
    showToast(`Speaking rate set to ${rate}x`, 'check');
  };

  const handlePitchChange = (pitch: number) => {
    const updated = voiceSettings.savePreference({ pitch });
    setVoicePref(updated);
  };

  const handleVoiceChange = (voiceUri: string) => {
    const chosenVoice = availableVoices.find((v) => v.voiceURI === voiceUri);
    const updated = voiceSettings.savePreference({
      voiceUri: voiceUri || undefined,
      voiceName: chosenVoice?.name || undefined,
    });
    setVoicePref(updated);
    showToast(chosenVoice ? `Voice set to ${chosenVoice.name}` : 'Default voice selected', 'check');
  };

  const handlePreviewVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Speech synthesis not available in this browser', 'alert');
      return;
    }

    window.speechSynthesis.cancel();
    const phrase =
      language === 'Assamese'
        ? 'নমস্কাৰ! মই সহায়, আপোনাৰ লগত আছোঁ।'
        : 'Namaskar! I am Sahay, your gentle daily companion.';
    const utterance = new SpeechSynthesisUtterance(phrase);
    voiceSettings.applyPreferenceToUtterance(utterance, voicePref);

    setIsPreviewingVoice(true);
    utterance.onend = () => setIsPreviewingVoice(false);
    utterance.onerror = () => setIsPreviewingVoice(false);
    window.speechSynthesis.speak(utterance);
    showToast('Playing voice sample…', 'play');
  };

  return (
    <div className="animate-rise max-w-[1180px]">
      <div className="flex items-center gap-2 font-baloo font-bold text-xs text-[#22403A] uppercase tracking-wider mb-2">
        <Sliders className="w-3.5 h-3.5" />
        Preferences
      </div>

      <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-[#221F1B] mb-6">
        Accessibility &amp; Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Text Size */}
          <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
            <h3 className="font-baloo font-bold text-sm text-[#22403A] mb-3 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Text Size
            </h3>
            <div className="flex gap-3">
              {[
                { scale: 'normal', label: 'A', desc: 'Standard' },
                { scale: 'large', label: 'A', desc: 'Large (+12%)' },
                { scale: 'xlarge', label: 'A', desc: 'Extra Large (+24%)' },
              ].map((item) => (
                <button
                  key={item.scale}
                  onClick={() => onChangeFontSize(item.scale as TextScale)}
                  className={`flex-1 py-3 px-2 rounded-xl border flex flex-col items-center justify-center font-baloo font-bold cursor-pointer transition-all ${
                    fontSize === item.scale
                      ? 'bg-[#22403A] text-[#FBF7EE] border-[#22403A]'
                      : 'bg-white text-[#221F1B] border-[#E6DAB9] hover:border-[#22403A]'
                  }`}
                >
                  <span
                    className={`${
                      item.scale === 'normal'
                        ? 'text-base'
                        : item.scale === 'large'
                        ? 'text-xl'
                        : 'text-2xl'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[10px] opacity-80 mt-1">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
            <h3 className="font-baloo font-bold text-sm text-[#22403A] mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              App &amp; Voice Language
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {languages.map((lang) => (
                <button
                  key={lang.name}
                  onClick={() => onChangeLanguage(lang.name)}
                  className={`p-3 rounded-xl border font-baloo font-bold text-xs cursor-pointer transition-all ${
                    language === lang.name
                      ? 'bg-[#E4ECE7] border-[#22403A] text-[#22403A]'
                      : 'bg-white border-[#E6DAB9] text-[#221F1B] hover:border-[#22403A]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speech Synthesis Speed, Pitch & Accent Preferences (Issue #6) */}
          <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-baloo font-bold text-sm text-[#22403A] flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Assistant Voice &amp; Speech Customization
              </h3>
              <span className="text-[10px] font-baloo font-bold text-[#3F7455] bg-[#E4ECE7] px-2 py-0.5 rounded-full">
                Personalized
              </span>
            </div>

            {/* Speaking Rate (0.75x Slow, 0.9x Gentle, 1.0x Standard) */}
            <div>
              <label className="block text-xs font-baloo font-bold text-[#665F51] mb-2">
                Speaking Pace (Rate)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { rate: 0.75 as SpeechRate, label: '0.75x', desc: 'Slow' },
                  { rate: 0.9 as SpeechRate, label: '0.9x', desc: 'Gentle (Default)' },
                  { rate: 1.0 as SpeechRate, label: '1.0x', desc: 'Standard' },
                ].map((item) => (
                  <button
                    key={item.rate}
                    type="button"
                    onClick={() => handleRateChange(item.rate)}
                    className={`p-2.5 rounded-xl border font-baloo font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                      voicePref.rate === item.rate
                        ? 'bg-[#22403A] text-[#FBF7EE] border-[#22403A] shadow-xs'
                        : 'bg-white text-[#221F1B] border-[#E6DAB9] hover:border-[#22403A]'
                    }`}
                  >
                    <span className="text-sm">{item.label}</span>
                    <span className="text-[10px] opacity-75 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Pitch */}
            <div>
              <label className="block text-xs font-baloo font-bold text-[#665F51] mb-2">
                Tone &amp; Pitch Warmth
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { pitch: 0.95, label: 'Deep', desc: 'Calm & grounding' },
                  { pitch: 1.05, label: 'Warm', desc: 'Gentle & soothing' },
                  { pitch: 1.15, label: 'Bright', desc: 'Cheerful & clear' },
                ].map((item) => (
                  <button
                    key={item.pitch}
                    type="button"
                    onClick={() => handlePitchChange(item.pitch)}
                    className={`p-2 rounded-xl border font-baloo font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                      Math.abs(voicePref.pitch - item.pitch) < 0.04
                        ? 'bg-[#E4ECE7] text-[#22403A] border-[#22403A]'
                        : 'bg-white text-[#665F51] border-[#E6DAB9] hover:border-[#22403A]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] opacity-75">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Selection (Filtered to Indian English / Regional voices) */}
            <div>
              <label className="block text-xs font-baloo font-bold text-[#665F51] mb-1.5">
                Voice Accent (Indian English &amp; Regional)
              </label>
              <select
                value={voicePref.voiceUri || ''}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6DAB9] bg-white text-xs font-medium focus:outline-2 focus:outline-[#22403A]"
              >
                <option value="">Default System Natural Voice</option>
                {availableVoices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[#948C7A] mt-1 block">
                {availableVoices.length > 0
                  ? `${availableVoices.length} Indian / regional voice models detected on device`
                  : 'System speech synthesis voices will load automatically'}
              </span>
            </div>

            {/* Preview Voice Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handlePreviewVoice}
                disabled={isPreviewingVoice}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#FBF7EE] border border-[#E6DAB9] hover:border-[#22403A] hover:bg-[#F1E7CE] text-[#22403A] font-baloo font-bold text-xs transition-colors cursor-pointer"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPreviewingVoice ? 'animate-bounce text-[#BD5B3B]' : ''}`} />
                <span>{isPreviewingVoice ? 'Speaking Sample…' : 'Preview Voice Sample'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
            <h3 className="font-baloo font-bold text-sm text-[#22403A] mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notification Preferences
            </h3>

            <div className="divide-y divide-[#E6DAB9]">
              {[
                { title: 'Medicine reminders', sub: 'Alerts for scheduled doses' },
                { title: 'Activity reminders', sub: 'Nudges for games and walks' },
                { title: 'Weekly caregiver report', sub: 'Summary sent to family' },
                { title: 'Offline sync', sub: 'Save activity locally without internet' },
                { title: 'Voice guidance sound', sub: 'Spoken prompts during activities' },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between py-3.5">
                  <div>
                    <b className="font-baloo font-bold text-xs text-[#221F1B] block">{pref.title}</b>
                    <span className="text-[11px] text-[#665F51]">{pref.sub}</span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    onChange={(e) =>
                      showToast(
                        `${pref.title} ${e.target.checked ? 'turned on' : 'turned off'}`,
                        'check'
                      )
                    }
                    className="w-5 h-5 accent-[#3F7455] rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Session & Perspective Control */}
          <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
            <h3 className="font-baloo font-bold text-sm text-[#22403A] mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Perspective &amp; Sandbox
            </h3>
            <p className="text-xs text-[#665F51] mb-4 leading-relaxed">
              Currently in <strong className="text-[#221F1B]">{portalMode === 'demo' ? 'Interactive Sandbox' : 'Production Portal'}</strong> mode.
            </p>

            {onSwitchRole && (
              <div className="mb-4">
                <span className="text-xs font-baloo font-bold text-[#665F51] block mb-2">Active View</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchRole('companion');
                      showToast('Switched to Sahay Companion view', 'check');
                    }}
                    className={`py-2 px-3 rounded-xl font-baloo font-bold text-xs transition-all cursor-pointer ${
                      userRole === 'companion'
                        ? 'bg-[#22403A] text-white'
                        : 'bg-[#FBF7EE] border border-[#E6DAB9] text-[#221F1B]'
                    }`}
                  >
                    Companion
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchRole('caregiver');
                      showToast('Switched to Caregiver Oversight view', 'check');
                    }}
                    className={`py-2 px-3 rounded-xl font-baloo font-bold text-xs transition-all cursor-pointer ${
                      userRole === 'caregiver'
                        ? 'bg-[#22403A] text-white'
                        : 'bg-[#FBF7EE] border border-[#E6DAB9] text-[#221F1B]'
                    }`}
                  >
                    Caregiver
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {onResetApp && (
                <button
                  type="button"
                  onClick={() => {
                    sandboxStorage.resetAll();
                    onResetApp();
                    showToast('Sandbox reset to pristine defaults', 'check');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#BD5B3B]/40 bg-[#F5E1D6]/40 text-[#BD5B3B] font-baloo font-bold text-xs hover:bg-[#F5E1D6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Sandbox to Defaults</span>
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#E6DAB9] bg-white text-[#665F51] hover:text-[#BD5B3B] hover:border-[#BD5B3B]/40 font-baloo font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
