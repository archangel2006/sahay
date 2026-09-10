import React from 'react';
import {
  Menu,
  X,
  Leaf,
  Home,
  Gamepad2,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Settings as SettingsGear,
  Calendar,
  Phone,
  MoreHorizontal,
  LogOut,
} from 'lucide-react';
import { PageId, UserRole } from '../../types';

interface MobileNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isDrawerOpen: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  onOpenSos: () => void;
  onLogout?: () => void;
  userRole?: UserRole;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  isDrawerOpen,
  onOpenDrawer,
  onCloseDrawer,
  onOpenSos,
  onLogout,
  userRole = 'companion',
}) => {
  const isCompanion = userRole === 'companion';

  const navItems: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'activities', label: 'Activities', icon: Gamepad2 },
    { id: 'reminders', label: 'Reminders', icon: Clock },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'family', label: isCompanion ? 'Memory Book' : 'Family Dashboard', icon: isCompanion ? Heart : Users },
    { id: 'insights', label: isCompanion ? 'My Insights' : 'Care Insights', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: SettingsGear },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#22403A] text-[#FBF7EE] sticky top-0 z-40">
        <div className="flex items-center gap-2 font-fraunces text-lg font-semibold">
          <div className="w-8 h-8 rounded-lg bg-[#E2A33D] text-[#152B26] flex items-center justify-center">
            <Leaf className="w-4 h-4" />
          </div>
          Sahay
        </div>
        <button
          onClick={onOpenDrawer}
          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={onCloseDrawer}
          className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 md:hidden"
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[75%] max-w-[280px] bg-[#22403A] text-[#FBF7EE] z-50 p-6 flex flex-col transition-transform duration-300 md:hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5 font-fraunces text-xl font-semibold">
            <div className="w-9 h-9 rounded-xl bg-[#E2A33D] text-[#152B26] flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            Sahay
          </div>
          <button onClick={onCloseDrawer} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseDrawer();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-baloo font-semibold text-sm transition-all cursor-pointer text-left ${
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

        <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
          {onLogout && (
            <button
              onClick={() => {
                onCloseDrawer();
                onLogout();
              }}
              className="w-full py-2 px-3 rounded-xl bg-white/5 text-[#C9D6D0] hover:text-white font-baloo font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}

          <button
            onClick={() => {
              onCloseDrawer();
              onOpenSos();
            }}
            className="w-full py-2.5 px-3 rounded-full bg-[#BD5B3B]/20 text-[#F0AF97] border border-[#BD5B3B]/40 font-baloo font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            Emergency SOS
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6DAB9] px-2 py-2 flex items-center justify-around z-30 shadow-lg">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'activities', label: 'Activities', icon: Gamepad2 },
          { id: 'reminders', label: 'Reminders', icon: Clock },
          { id: 'family', label: isCompanion ? 'Memory Book' : 'Family', icon: isCompanion ? Heart : Users },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as PageId)}
              className={`flex flex-col items-center gap-1 py-1 px-2 font-baloo font-bold text-[10px] cursor-pointer ${
                isActive ? 'text-[#22403A]' : 'text-[#948C7A]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center gap-1 py-1 px-2 font-baloo font-bold text-[10px] text-[#948C7A] cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
          More
        </button>
      </div>
    </>
  );
};
