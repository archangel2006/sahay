import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Phone,
  Bell,
  Globe,
  X,
  Heart,
  Users,
  Sparkles,
  Lock,
  LogOut,
  ChevronDown,
  Check,
} from 'lucide-react';
import { SupportedLanguage, UserRole, PortalMode } from '../../types';
import {
  getDictionary,
  getLanguageMeta,
  SUPPORTED_LANGUAGES_LIST,
} from '../../i18n/dictionaries';

interface TopbarProps {
  language: SupportedLanguage;
  onToggleLanguage: () => void;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
  onOpenSos: () => void;
  userRole?: UserRole;
  portalMode?: PortalMode;
  onSwitchRole?: (role: UserRole) => void;
  onLogout?: () => void;
  elderName?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  language,
  onToggleLanguage,
  onSelectLanguage,
  onOpenSos,
  userRole = 'companion',
  portalMode = 'demo',
  onSwitchRole,
  onLogout,
  elderName = 'Bimala aita',
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const dict = getDictionary(language);
  const currentLangMeta = getLanguageMeta(language);

  const [notifications, setNotifications] = useState([
    { id: '1', text: 'Evening medicine reminder in 30 minutes.', time: 'Just now' },
    { id: '2', text: 'This week’s caregiver report is ready to view.', time: '2 hours ago' },
    { id: '3', text: 'New activity unlocked: Pattern Recall.', time: 'Yesterday' },
  ]);

  const dismissNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const isCaregiver = userRole === 'caregiver';

  // Close menus on outside click or Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNotifOpen(false);
        setIsLangMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (langRef.current && !langRef.current.contains(target)) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-white border-b border-[#E6DAB9]">
      <div className="min-w-0">
        <h1 className="font-fraunces font-medium text-lg sm:text-xl text-[#221F1B] truncate">
          {isCaregiver
            ? dict.caregiverOversight
            : dict.greeting(elderName)}
        </h1>
        <p className="text-xs text-[#665F51] font-semibold hidden sm:block">
          {isCaregiver
            ? dict.subGreetingCaregiver
            : `Tuesday, 30 August · ${dict.subGreetingCompanion}`}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Environment badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBF7EE] border border-[#E6DAB9] text-[#665F51] font-baloo font-bold text-[11px]">
          {portalMode === 'demo' ? (
            <>
              <Sparkles className="w-3 h-3 text-[#E2A33D]" />
              <span>Sandbox</span>
            </>
          ) : (
            <>
              <Lock className="w-3 h-3 text-[#BD5B3B]" />
              <span>Production</span>
            </>
          )}
        </div>

        {/* Perspective Switcher Chip */}
        {onSwitchRole && (
          <button
            type="button"
            onClick={() => onSwitchRole(isCaregiver ? 'companion' : 'caregiver')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E6DAB9] bg-white text-[#221F1B] font-baloo font-bold text-xs hover:border-[#22403A] cursor-pointer transition-colors"
          >
            {isCaregiver ? (
              <>
                <Users className="w-3.5 h-3.5 text-[#3E4F74]" />
                <span className="hidden sm:inline">{dict.caregiverOversight}</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 text-[#BD5B3B]" />
                <span className="hidden sm:inline">{dict.companionMode}</span>
              </>
            )}
          </button>
        )}

        {/* Streak chip (Companion mode only) */}
        {!isCaregiver && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8E6C1] text-[#8A5D18] font-baloo font-bold text-xs">
            <Flame className="w-3.5 h-3.5" />
            <span>{dict.streakDays(6)}</span>
          </div>
        )}

        {/* SOS button */}
        <button
          onClick={onOpenSos}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5E1D6] text-[#BD5B3B] border border-[#E7BBA5] font-baloo font-bold text-xs cursor-pointer hover:bg-[#F5E1D6]/80 relative"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#BD5B3B] animate-ping" />
          <Phone className="w-3.5 h-3.5" />
          <span>{dict.sos}</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-xl bg-[#F1E7CE] text-[#22403A] flex items-center justify-center cursor-pointer hover:bg-[#E6DAB9] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BD5B3B] border border-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E6DAB9] rounded-2xl shadow-xl overflow-hidden z-50 animate-rise">
              <div className="p-3.5 border-b border-[#E6DAB9] font-baloo font-bold text-xs text-[#22403A] flex items-center justify-between">
                <span>{dict.notifications}</span>
                <span className="text-[10px] text-[#665F51]">{dict.unreadCount(notifications.length)}</span>
              </div>
              <div className="divide-y divide-[#E6DAB9] max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-5 text-center text-xs text-[#665F51]">
                    {dict.allCaughtUp}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 flex items-start gap-2.5 text-xs">
                      <div className="flex-1">
                        <p className="text-[#221F1B] font-medium leading-tight mb-1">{n.text}</p>
                        <span className="text-[10px] text-[#665F51]">{n.time}</span>
                      </div>
                      <button
                        onClick={() => dismissNotif(n.id)}
                        className="text-[#665F51] hover:text-[#221F1B] p-0.5 cursor-pointer"
                        aria-label="Dismiss notification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Multi-Language Dropdown Switcher (Issue #10) */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            aria-label={`Language selector: currently ${currentLangMeta.nativeName}`}
            aria-expanded={isLangMenuOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E6DAB9] bg-white text-[#221F1B] font-baloo font-bold text-xs hover:border-[#22403A] cursor-pointer transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#22403A]" />
            <span className="min-w-[18px] text-center">{currentLangMeta.badge}</span>
            <ChevronDown className="w-3 h-3 text-[#665F51]" />
          </button>

          {isLangMenuOpen && (
            <div
              role="menu"
              className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#E6DAB9] rounded-2xl shadow-xl overflow-hidden z-50 animate-rise p-1.5"
            >
              <div className="px-3 py-2 text-[10px] font-baloo font-bold uppercase tracking-wider text-[#665F51] border-b border-[#E6DAB9]/40 mb-1">
                {dict.appAndVoiceLanguage}
              </div>
              <div className="space-y-0.5">
                {SUPPORTED_LANGUAGES_LIST.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        if (onSelectLanguage) {
                          onSelectLanguage(lang.code);
                        } else {
                          onToggleLanguage();
                        }
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-baloo font-bold cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#E4ECE7] text-[#22403A]'
                          : 'text-[#221F1B] hover:bg-[#FBF7EE]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-md text-[10px] font-extrabold flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#22403A] text-white'
                              : 'bg-[#F1E7CE] text-[#22403A]'
                          }`}
                        >
                          {lang.badge}
                        </span>
                        <span>{lang.nativeName}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#22403A]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#22403A] text-[#FBF7EE] flex items-center justify-center font-baloo font-bold text-xs">
          {isCaregiver ? 'CG' : 'BA'}
        </div>

        {/* Logout button */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            className="w-9 h-9 rounded-full border border-[#E6DAB9] bg-white text-[#665F51] hover:text-[#BD5B3B] hover:border-[#BD5B3B]/40 flex items-center justify-center cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
