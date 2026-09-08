import React, { useState } from 'react';
import { Flame, Phone, Bell, Globe, X, Heart, Users, Sparkles, Lock, LogOut } from 'lucide-react';
import { SupportedLanguage, UserRole, PortalMode } from '../../types';

interface TopbarProps {
  language: SupportedLanguage;
  onToggleLanguage: () => void;
  onOpenSos: () => void;
  userRole?: UserRole;
  portalMode?: PortalMode;
  onSwitchRole?: (role: UserRole) => void;
  onLogout?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  language,
  onToggleLanguage,
  onOpenSos,
  userRole = 'companion',
  portalMode = 'demo',
  onSwitchRole,
  onLogout,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'Evening medicine reminder in 30 minutes.', time: 'Just now' },
    { id: '2', text: 'This week’s caregiver report is ready to view.', time: '2 hours ago' },
    { id: '3', text: 'New activity unlocked: Pattern Recall.', time: 'Yesterday' },
  ]);

  const dismissNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const isAssamese = language === 'Assamese';
  const isCaregiver = userRole === 'caregiver';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-white border-b border-[#E6DAB9]">
      <div className="min-w-0">
        <h1 className="font-fraunces font-medium text-lg sm:text-xl text-[#221F1B] truncate">
          {isCaregiver
            ? 'Caregiver Oversight'
            : isAssamese
            ? 'নমস্কাৰ, বিমলা আইতা'
            : 'Namaskar, Bimala aita'}
        </h1>
        <p className="text-xs text-[#665F51] font-semibold hidden sm:block">
          {isCaregiver
            ? 'Real-time elder connection, activity alerts, and safety perimeter'
            : 'Tuesday, 30 August · Let’s begin today’s activities'}
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
            title="Click to switch view"
          >
            {isCaregiver ? (
              <>
                <Users className="w-3.5 h-3.5 text-[#3E4F74]" />
                <span className="hidden sm:inline">Caregiver</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 text-[#BD5B3B]" />
                <span className="hidden sm:inline">Companion</span>
              </>
            )}
          </button>
        )}

        {/* Streak chip (Companion mode only) */}
        {!isCaregiver && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8E6C1] text-[#8A5D18] font-baloo font-bold text-xs">
            <Flame className="w-3.5 h-3.5" />
            6-day streak
          </div>
        )}

        {/* SOS button */}
        <button
          onClick={onOpenSos}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5E1D6] text-[#BD5B3B] border border-[#E7BBA5] font-baloo font-bold text-xs cursor-pointer hover:bg-[#F5E1D6]/80 relative"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#BD5B3B] animate-ping" />
          <Phone className="w-3.5 h-3.5" />
          SOS
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-xl bg-[#F1E7CE] text-[#22403A] flex items-center justify-center cursor-pointer hover:bg-[#E6DAB9] transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BD5B3B] border border-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E6DAB9] rounded-2xl shadow-xl overflow-hidden z-50 animate-rise">
              <div className="p-3.5 border-b border-[#E6DAB9] font-baloo font-bold text-xs text-[#22403A] flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-[10px] text-[#948C7A]">{notifications.length} unread</span>
              </div>
              <div className="divide-y divide-[#E6DAB9] max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-5 text-center text-xs text-[#948C7A]">
                    You’re all caught up.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 flex items-start gap-2.5 text-xs">
                      <div className="flex-1">
                        <p className="text-[#221F1B] font-medium leading-tight mb-1">{n.text}</p>
                        <span className="text-[10px] text-[#948C7A]">{n.time}</span>
                      </div>
                      <button
                        onClick={() => dismissNotif(n.id)}
                        className="text-[#948C7A] hover:text-[#221F1B] p-0.5 cursor-pointer"
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

        {/* Language Switcher */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E6DAB9] bg-white text-[#221F1B] font-baloo font-bold text-xs hover:border-[#22403A] cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isAssamese ? 'অ' : 'EN'}</span>
        </button>

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
