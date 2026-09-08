import React, { useState } from 'react';
import {
  Users,
  Flame,
  Activity,
  Clock,
  Play,
  Plus,
  MapPin,
  Navigation,
  AlertTriangle,
  Pill,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { FamilyMemberItem, ZoneEventItem, UserRole } from '../../types';
import { ElderSwitcher } from './ElderSwitcher';
import { MemoryBookView } from './MemoryBookView';
import { LinkedElder, sandboxStorage } from '../../services/sandboxStorage';

interface FamilyViewProps {
  familyMembers: FamilyMemberItem[];
  onAddFamilyMember: (item: Omit<FamilyMemberItem, 'id'>) => void;
  safeZoneRadius: number;
  onUpdateRadius: (r: number) => void;
  zoneEvents: ZoneEventItem[];
  showToast: (msg: string, icon?: string) => void;
  userRole?: UserRole;
  onNavigateToInsights?: () => void;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  familyMembers,
  onAddFamilyMember,
  safeZoneRadius,
  onUpdateRadius,
  zoneEvents,
  showToast,
  userRole = 'companion',
  onNavigateToInsights,
}) => {
  const isCompanion = userRole === 'companion';

  // Default to 'memorybook' for companion so elder sees their warm memory book first
  const [activeTab, setActiveTab] = useState<'overview' | 'memorybook' | 'safety' | 'log' | 'alerts'>(
    isCompanion ? 'memorybook' : 'overview'
  );

  // Linked elders state
  const [linkedElders, setLinkedElders] = useState<LinkedElder[]>(() => sandboxStorage.getLinkedElders());
  const [currentElderId, setCurrentElderId] = useState<string>('SHY-9021');

  const currentElder = linkedElders.find((e) => e.id === currentElderId) || linkedElders[0];

  const handleLinkNewElder = (id: string, name: string, location: string, relationTag: string) => {
    const newElder: LinkedElder = {
      id,
      name,
      location,
      relationTag,
      avatarColor: '#3E4F74',
    };
    const updated = [...linkedElders, newElder];
    setLinkedElders(updated);
    sandboxStorage.saveLinkedElders(updated);
    setCurrentElderId(id);
  };

  const maxR = 1500;
  const svgRadius = 30 + (safeZoneRadius / maxR) * 60;

  return (
    <div className="animate-rise max-w-[1180px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 font-baloo font-bold text-xs text-[#22403A] uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          {isCompanion ? 'My Family & Memory Album' : 'Caregiver Oversight'}
        </div>

        {onNavigateToInsights && (
          <button
            onClick={onNavigateToInsights}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1E7CE] text-[#22403A] hover:bg-[#E6DAB9] font-baloo font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Open {isCompanion ? 'My Insights' : 'Care Insights'} Page &rarr;</span>
          </button>
        )}
      </div>

      <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-[#221F1B] mb-5">
        {isCompanion ? `${currentElder?.name}’s Family & Memory Book` : `${currentElder?.name}’s Care & Safety`}
      </h2>

      {/* Linked Elder Switcher */}
      <ElderSwitcher
        linkedElders={linkedElders}
        currentElderId={currentElderId}
        onSelectElder={setCurrentElderId}
        onLinkNewElder={handleLinkNewElder}
        showToast={showToast}
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-[#F1E7CE] rounded-full w-fit mb-6">
        {[
          { id: 'memorybook', label: 'Memory Book' },
          { id: 'overview', label: 'Care Overview' },
          { id: 'safety', label: 'Safe Area & GPS' },
          { id: 'log', label: 'Activity Log' },
          { id: 'alerts', label: 'Care Alerts (2)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full font-baloo font-bold text-xs cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-[#22403A] text-[#FBF7EE]'
                : 'text-[#665F51] hover:text-[#221F1B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MEMORY BOOK TAB (Full rich MemoryBookView component with image, address, phone, and voice notes) */}
      {activeTab === 'memorybook' && (
        <MemoryBookView
          familyMembers={familyMembers}
          onAddFamilyMember={onAddFamilyMember}
          showToast={showToast}
          elderName={currentElder?.name}
          onNavigateToInsights={onNavigateToInsights}
        />
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Status strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-baloo font-bold text-[#665F51] uppercase">Status</span>
              <div className="flex items-center gap-2 mt-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3F7455] animate-pulse" />
                <span className="font-baloo font-bold text-base text-[#221F1B]">At Home</span>
              </div>
              <p className="text-xs text-[#665F51]">Safe zone active (500m)</p>
            </div>

            <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-baloo font-bold text-[#665F51] uppercase">Cognitive Practice</span>
              <div className="flex items-center gap-2 mt-1.5 mb-1">
                <Flame className="w-5 h-5 text-[#E2A33D]" />
                <span className="font-baloo font-bold text-base text-[#221F1B]">6-Day Streak</span>
              </div>
              <p className="text-xs text-[#665F51]">Last played: Memory Match</p>
            </div>

            <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-baloo font-bold text-[#665F51] uppercase">Next Check-In</span>
              <div className="flex items-center gap-2 mt-1.5 mb-1">
                <Clock className="w-5 h-5 text-[#BD5B3B]" />
                <span className="font-baloo font-bold text-base text-[#221F1B]">Evening Meds</span>
              </div>
              <p className="text-xs text-[#665F51]">In 45 minutes · 8:00 PM</p>
            </div>
          </div>

          {/* Quick family contacts strip */}
          <div className="bg-[#FBF7EE] border border-[#E6DAB9] rounded-2xl p-5">
            <h3 className="font-baloo font-bold text-sm text-[#22403A] mb-3">Family Network At-a-Glance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {familyMembers.slice(0, 4).map((member) => (
                <div key={member.id} className="bg-white p-3 rounded-xl border border-[#E6DAB9] text-center">
                  <div
                    style={{ backgroundColor: member.color }}
                    className="w-10 h-10 rounded-xl text-white font-baloo font-bold text-sm flex items-center justify-center mx-auto mb-1.5"
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div className="font-baloo font-bold text-xs text-[#221F1B] truncate">{member.name}</div>
                  <div className="text-[10px] text-[#BD5B3B] font-semibold truncate">{member.rel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SAFETY & GEOFENCE TAB */}
      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
              <h3 className="font-baloo font-bold text-sm text-[#22403A] mb-3">Live Geofence Map</h3>
              <div className="rounded-xl overflow-hidden bg-[#E4ECE7] border border-[#E6DAB9]">
                <svg viewBox="0 0 300 200" className="w-full h-52 block">
                  <rect width="300" height="200" fill="#E4ECE7" />
                  <path d="M0 40 H300 M0 90 H300 M0 140 H300" stroke="#FBF7EE" strokeWidth="2" opacity="0.6" />
                  <path d="M40 0 V200 M100 0 V200 M160 0 V200 M220 0 V200" stroke="#FBF7EE" strokeWidth="2" opacity="0.6" />
                  {/* Safe zone boundary */}
                  <circle cx="150" cy="100" r={svgRadius} fill="rgba(63,116,85,0.12)" stroke="#3F7455" strokeWidth="2" strokeDasharray="6 4" />
                  {/* Home anchor */}
                  <circle cx="150" cy="100" r={6} fill="#22403A" stroke="white" strokeWidth="2" />
                  <text x="150" y="120" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#22403A" fontFamily="Baloo 2">
                    HOME
                  </text>
                  {/* Elder pin */}
                  <line x1="150" y1="100" x2="190" y2="75" stroke="#BD5B3B" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="190" cy="75" r={6} fill="#BD5B3B" stroke="white" strokeWidth="2" />
                  <circle cx="190" cy="75" r={11} fill="none" stroke="#BD5B3B" strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>

              <div className="flex items-center gap-3 mt-4 p-3 bg-[#F1E7CE] rounded-xl">
                <label className="text-xs font-baloo font-bold text-[#665F51] shrink-0">
                  Safe zone radius:
                </label>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="100"
                  value={safeZoneRadius}
                  onChange={(e) => onUpdateRadius(Number(e.target.value))}
                  className="flex-1 accent-[#22403A]"
                />
                <span className="font-baloo font-bold text-sm text-[#22403A] w-14 text-right">
                  {safeZoneRadius} m
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
              <h3 className="font-baloo font-bold text-sm text-[#22403A] mb-3">Zone Activity Log</h3>
              <div className="divide-y divide-[#E6DAB9]">
                {zoneEvents.map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          evt.type === 'exit' ? 'bg-[#BD5B3B]' : 'bg-[#3F7455]'
                        }`}
                      />
                      <span className="font-medium text-[#221F1B]">{evt.label}</span>
                    </div>
                    <span className="text-[#948C7A]">{evt.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Elder Device Simulation */}
          <div className="flex flex-col items-center">
            <div className="w-[230px] rounded-[32px] bg-[#152B26] p-2.5 shadow-xl">
              <div className="rounded-[24px] bg-[#FBF7EE] p-5 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-[#22403A] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Navigation className="w-7 h-7" />
                </div>
                <div className="font-fraunces text-lg text-[#221F1B] mb-0.5">0.4 km to go</div>
                <p className="text-[11px] text-[#665F51] mb-4 leading-tight">
                  Head straight, then turn left at the tea stall
                </p>
                <button
                  onClick={() => showToast('Family has been alerted with live GPS coordinates', 'phone')}
                  className="w-full py-2.5 rounded-full bg-[#BD5B3B] text-white font-baloo font-bold text-xs cursor-pointer hover:brightness-95 shadow-xs"
                >
                  I’m lost — alert family
                </button>
              </div>
            </div>
            <p className="text-xs text-[#948C7A] font-semibold mt-3">What Bimala aita sees on her screen</p>
          </div>
        </div>
      )}

      {/* ACTIVITY LOG TAB */}
      {activeTab === 'log' && (
        <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs overflow-x-auto">
          <h3 className="font-baloo font-bold text-base text-[#22403A] mb-4">Recent Sessions</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E6DAB9] text-xs font-baloo font-bold text-[#948C7A] uppercase">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Activity</th>
                <th className="py-2.5">Duration</th>
                <th className="py-2.5">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DAB9]">
              <tr>
                <td className="py-3 text-xs font-medium">Today</td>
                <td className="py-3 text-xs font-bold">Memory Match</td>
                <td className="py-3 text-xs text-[#665F51]">3 min</td>
                <td className="py-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E4ECE7] text-[#22403A] text-[11px] font-bold">
                    82% accuracy
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-xs font-medium">Yesterday</td>
                <td className="py-3 text-xs font-bold">Pattern Recall</td>
                <td className="py-3 text-xs text-[#665F51]">4 min</td>
                <td className="py-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E4ECE7] text-[#22403A] text-[11px] font-bold">
                    Sequence of 5
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-xs font-medium">Sat, 27 Aug</td>
                <td className="py-3 text-xs font-bold">Memory Match</td>
                <td className="py-3 text-xs text-[#665F51]">5 min</td>
                <td className="py-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5E1D6] text-[#BD5B3B] text-[11px] font-bold">
                    61% accuracy
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-xs font-medium">Fri, 26 Aug</td>
                <td className="py-3 text-xs font-bold">Daily Routine Recall</td>
                <td className="py-3 text-xs text-[#665F51]">2 min</td>
                <td className="py-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E4ECE7] text-[#22403A] text-[11px] font-bold">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F5E1D6] border border-[#E7BBA5]">
            <div className="w-10 h-10 rounded-xl bg-[#BD5B3B]/20 text-[#BD5B3B] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <b className="font-baloo text-sm text-[#BD5B3B] block mb-1">
                Slower response times detected
              </b>
              <p className="text-xs text-[#665F51] leading-relaxed">
                Memory Match response latency increased 22% over 5 days. Consider scheduling a clinic check-in or gentle hydration reminder.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F5E1D6] border border-[#E7BBA5]">
            <div className="w-10 h-10 rounded-xl bg-[#BD5B3B]/20 text-[#BD5B3B] flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <b className="font-baloo text-sm text-[#BD5B3B] block mb-1">
                Missed evening medicine — 2 days
              </b>
              <p className="text-xs text-[#665F51] leading-relaxed">
                Bimala aita marked evening medicine as skipped on Sunday and Monday.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
