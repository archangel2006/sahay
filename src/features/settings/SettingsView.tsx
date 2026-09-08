import React from 'react';
import { Sliders, Type, Globe, Bell, LogOut, RotateCcw, Shield } from 'lucide-react';
import { SupportedLanguage, TextScale, UserRole, PortalMode } from '../../types';
import { sandboxStorage } from '../../services/sandboxStorage';

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
