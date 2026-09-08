import React from 'react';
import {
  Sun,
  ChevronRight,
  Flame,
  Activity,
  Pill,
  Droplet,
  Layers,
  Mic,
  BarChart3,
  Phone,
  Check,
  Leaf,
} from 'lucide-react';
import { ReminderItem } from '../../types';

interface HomeViewProps {
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  onNavigate: (page: string) => void;
  onStartGame: (gameId: string) => void;
  onOpenVoice: () => void;
  showToast: (msg: string, icon?: string) => void;
  elderId?: string;
  elderName?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  reminders,
  onToggleReminder,
  onNavigate,
  onStartGame,
  onOpenVoice,
  showToast,
  elderId = 'SHY-9021',
  elderName = 'Bimala aita',
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'pill':
        return <Pill className="w-4 h-4" />;
      case 'droplet':
        return <Droplet className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTintClass = (tint: string) => {
    switch (tint) {
      case 'ic-clay':
        return 'bg-[#F5E1D6] text-[#BD5B3B]';
      case 'ic-indigo':
        return 'bg-[#E5E9F1] text-[#3E4F74]';
      case 'ic-forest':
        return 'bg-[#E4ECE7] text-[#22403A]';
      case 'ic-marigold':
        return 'bg-[#F8E6C1] text-[#8A5D18]';
      default:
        return 'bg-[#E4ECE7] text-[#22403A]';
    }
  };

  return (
    <div className="animate-rise max-w-[1180px]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#22403A] to-[#152B26] rounded-3xl text-[#FBF7EE] p-6 sm:p-9 mb-7 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-md">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-baloo font-bold text-xs text-[#E2A33D] uppercase tracking-wider">
              <Sun className="w-4 h-4" />
              Today’s Focus
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#FBF7EE] text-[11px] font-baloo font-bold tracking-wide">
              Companion ID: {elderId}
            </div>
          </div>
          <h2 className="font-fraunces text-2xl sm:text-3xl font-medium mb-2.5 max-w-lg leading-tight">
            A gentle memory match with the tea garden, whenever you’re ready.
          </h2>
          <p className="text-xs sm:text-sm text-[#CBD9D2] max-w-md leading-relaxed mb-5">
            Two minutes a day helps keep the mind active. Sahay adjusts every activity to how you’re doing — no pressure, no scores that matter but your own.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onStartGame('memory')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E2A33D] text-[#152B26] font-baloo font-bold text-sm hover:brightness-95 transition-all cursor-pointer shadow-sm"
            >
              Start today’s activity
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('family')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-[#FBF7EE] border border-white/30 font-baloo font-bold text-sm hover:bg-white/20 transition-all cursor-pointer"
            >
              View progress
            </button>
          </div>
        </div>

        {/* Decorative Tea Garden SVG */}
        <div className="hidden md:flex justify-end opacity-95">
          <svg width="220" height="150" viewBox="0 0 220 150" fill="none">
            <circle cx="176" cy="34" r="18" fill="#E2A33D" opacity="0.9" />
            <path d="M0 120 Q40 90 80 112 T160 108 T220 116 V150 H0 Z" fill="#2E5148" />
            <path d="M0 132 Q50 108 100 128 T220 126 V150 H0 Z" fill="#1B342E" />
            <g opacity="0.6">
              <circle cx="40" cy="118" r="9" fill="#3E6C5F" />
              <circle cx="55" cy="114" r="11" fill="#3E6C5F" />
              <circle cx="70" cy="119" r="8" fill="#3E6C5F" />
            </g>
          </svg>
        </div>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#665F51]">Weekly streak</span>
            <div className="w-9 h-9 rounded-xl bg-[#F8E6C1] text-[#8A5D18] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="font-fraunces text-2xl font-normal text-[#221F1B]">6 days</div>
        </div>

        <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#665F51]">Avg. accuracy</span>
            <div className="w-9 h-9 rounded-xl bg-[#E4ECE7] text-[#22403A] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="font-fraunces text-2xl font-normal text-[#221F1B]">78%</div>
        </div>

        <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#665F51]">Next reminder</span>
            <div className="w-9 h-9 rounded-xl bg-[#F5E1D6] text-[#BD5B3B] flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="font-fraunces text-2xl font-normal text-[#221F1B]">11:00 AM</div>
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Today's Care Plan */}
        <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DAB9]/60 mb-2">
            <h3 className="font-baloo font-bold text-sm text-[#22403A]">
              Today’s Care Plan
            </h3>
            <button
              onClick={() => onNavigate('reminders')}
              className="px-3 py-1 rounded-full border border-[#E6DAB9] font-baloo font-bold text-xs text-[#221F1B] hover:border-[#22403A] cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-[#E6DAB9]">
            {reminders.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${getTintClass(
                    r.tint
                  )}`}
                >
                  {getIcon(r.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-bold text-[#221F1B] ${
                      r.done ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {r.txt}
                  </div>
                  <div className="text-[11px] text-[#665F51]">{r.time}</div>
                </div>
                <button
                  onClick={() => onToggleReminder(r.id)}
                  className={`w-7 h-7 rounded-full border-2 border-[#3F7455] flex items-center justify-center cursor-pointer transition-all ${
                    r.done ? 'bg-[#3F7455] text-white' : 'bg-transparent text-transparent hover:bg-[#E4ECE7]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Engagement */}
        <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-[#E6DAB9]/60 mb-3">
            <h3 className="font-baloo font-bold text-sm text-[#22403A]">
              Continue Engagement
            </h3>
          </div>

          <div
            onClick={() => onStartGame('memory')}
            className="flex items-center gap-4 p-4 rounded-2xl border border-[#E6DAB9] bg-[#FBF7EE] hover:border-[#22403A] transition-all cursor-pointer shadow-xs"
          >
            <div className="w-13 h-13 rounded-2xl bg-[#F8E6C1] text-[#8A5D18] flex items-center justify-center shrink-0">
              <Leaf className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-baloo font-bold text-base text-[#221F1B] mb-0.5">
                Memory Match — Tea Garden
              </h4>
              <p className="text-xs text-[#665F51] mb-2">Object recognition &amp; recall · 2 min</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E4ECE7] text-[#22403A] text-[11px] font-baloo font-bold">
                <Activity className="w-3 h-3" />
                Level 2 of 5
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#948C7A] mt-3">
            Sahay automatically adjusts card counts based on recent recall confidence.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="font-fraunces text-xl font-medium text-[#221F1B] mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => onNavigate('activities')}
          className="bg-white border border-[#E6DAB9] rounded-2xl p-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F8E6C1] text-[#8A5D18] flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-baloo font-bold text-sm text-[#221F1B] mb-0.5">Play a game</h4>
          <p className="text-[11px] text-[#665F51]">Today: Memory Match</p>
        </div>

        <div
          onClick={onOpenVoice}
          className="bg-white border border-[#E6DAB9] rounded-2xl p-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E5E9F1] text-[#3E4F74] flex items-center justify-center mb-3">
            <Mic className="w-5 h-5" />
          </div>
          <h4 className="font-baloo font-bold text-sm text-[#221F1B] mb-0.5">Talk to Sahay</h4>
          <p className="text-[11px] text-[#665F51]">Voice-guided help</p>
        </div>

        <div
          onClick={() => onNavigate('insights')}
          className="bg-white border border-[#E6DAB9] rounded-2xl p-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E4ECE7] text-[#22403A] flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h4 className="font-baloo font-bold text-sm text-[#221F1B] mb-0.5">My insights</h4>
          <p className="text-[11px] text-[#665F51]">Daily care &amp; routine</p>
        </div>

        <div
          onClick={() => showToast('Calling Ranjit (son) with direct one-tap link…', 'phone')}
          className="bg-white border border-[#E6DAB9] rounded-2xl p-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F5E1D6] text-[#BD5B3B] flex items-center justify-center mb-3">
            <Phone className="w-5 h-5" />
          </div>
          <h4 className="font-baloo font-bold text-sm text-[#221F1B] mb-0.5">Call family</h4>
          <p className="text-[11px] text-[#665F51]">Ranjit (son) — one tap</p>
        </div>
      </div>
    </div>
  );
};
