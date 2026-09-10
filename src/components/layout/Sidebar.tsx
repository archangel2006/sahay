import React from 'react';
import {
  Home,
  Gamepad2,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  Settings as SettingsGear,
  Leaf,
  Phone,
  LogOut,
  Heart,
} from 'lucide-react';
import { PageId, UserRole } from '../../types';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenSos: () => void;
  onLogout?: () => void;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onOpenSos,
  onLogout,
  userRole = 'companion',
}) => {
  const isCompanion = userRole === 'companion';

  const allNavItems: { id: PageId; label: string; icon: React.ElementType; companionOnly?: boolean }[] = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'activities', label: 'Activities', icon: Gamepad2, companionOnly: true },
    { id: 'reminders', label: 'Reminders', icon: Clock },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'family', label: isCompanion ? 'Memory Book' : 'Family Dashboard', icon: isCompanion ? Heart : Users },
    { id: 'insights', label: isCompanion ? 'My Insights' : 'Care Insights', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: SettingsGear },
  ];

  const navItems = allNavItems.filter((item) => !item.companionOnly || isCompanion);

  return (
    <aside className="w-[264px] shrink-0 bg-[#22403A] text-[#FBF7EE] p-6 hidden md:flex flex-col sticky top-0 h-screen">
      {/* Brand */}
      <div className="flex items-center gap-3 px-1 pb-7">
        <div className="w-10 h-10 rounded-xl bg-[#E2A33D] text-[#152B26] flex items-center justify-center">
          <Leaf className="w-5 h-5" />
        </div>
        <div>
          <div className="font-fraunces text-xl font-semibold tracking-wide">Sahay</div>
          <small className="font-mulish text-[10px] font-bold text-[#9FB4AC] tracking-wider uppercase block">
            Cognitive Care
          </small>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1.5 mt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-baloo font-semibold text-sm transition-all cursor-pointer text-left w-full ${
                isActive
                  ? 'bg-[#E2A33D]/18 text-[#E2A33D]'
                  : 'text-[#C9D6D0] hover:bg-white/5 hover:text-[#FBF7EE]'
              }`}
            >
              <Icon className="w-4 h-4 opacity-90" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-5 border-t border-white/10">
        <button
          onClick={onOpenSos}
          className="w-full py-2.5 px-3 rounded-full bg-[#BD5B3B]/20 text-[#F0AF97] border border-[#BD5B3B]/40 font-baloo font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#BD5B3B]/30 cursor-pointer mb-3 relative overflow-hidden"
        >
          <span className="w-2 h-2 rounded-full bg-[#BD5B3B] animate-ping" />
          <Phone className="w-3.5 h-3.5" />
          Emergency SOS
        </button>

        <div className="flex items-center justify-between text-xs text-[#9FB4AC] px-3 py-2 bg-white/5 rounded-xl mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6FCF97] shrink-0" />
            <span>Synced</span>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="text-[#C9D6D0] hover:text-[#E2A33D] flex items-center gap-1.5 cursor-pointer text-[11px] font-baloo font-bold transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
