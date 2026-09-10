import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  Heart,
  Pill,
  CheckCircle2,
  Calendar,
  Sparkles,
  Navigation,
  Info,
} from 'lucide-react';
import { ZoneEventItem, UserRole } from '../../types';
import { LinkedElder } from '../../services/sandboxStorage';

interface InsightsViewProps {
  userRole: UserRole;
  currentElder?: LinkedElder;
  safeZoneRadius: number;
  onUpdateRadius: (r: number) => void;
  zoneEvents: ZoneEventItem[];
  showToast: (msg: string, icon?: string) => void;
  onNavigateToActivities?: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  userRole,
  currentElder,
  safeZoneRadius,
  onUpdateRadius,
  zoneEvents,
  showToast,
  onNavigateToActivities,
}) => {
  const isCompanion = userRole === 'companion';
  const elderName = currentElder?.name || 'Bimala aita';

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'safety' | 'cognitive' | 'alerts'>('overview');

  const maxR = 1500;
  const svgRadius = 30 + (safeZoneRadius / maxR) * 60;

  return (
    <div className="animate-rise max-w-[1180px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 font-baloo font-bold text-xs text-[#22403A] uppercase tracking-wider mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#22403A]" />
            {isCompanion ? 'My Daily Wellness & Care Insights' : 'Caregiver & Clinical Insights'}
          </div>
          <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-[#221F1B]">
            {isCompanion ? `Wellness & Routine for ${elderName}` : `${elderName}’s Activity & Safety Health`}
          </h2>
          <p className="text-xs sm:text-sm text-[#665F51] mt-1 max-w-xl">
            {isCompanion
              ? 'A clear, reassuring look at your daily cognitive games, safe routine movements, medicine consistency, and loved ones in touch.'
              : 'Continuous ambient wellness tracking: geofencing boundaries, cognitive response latency, routine consistency, and proactive care alerts.'}
          </p>
        </div>

        {isCompanion && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-[#E4ECE7] text-[#22403A] rounded-xl border border-[#22403A]/20">
            <Heart className="w-4 h-4 text-[#BD5B3B]" />
            <span className="font-baloo font-bold text-xs">Everything is looking gentle &amp; steady today</span>
          </div>
        )}
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-[#F1E7CE] rounded-full w-fit mb-6">
        {[
          { id: 'overview', label: isCompanion ? 'Summary & Milestones' : 'Overview Dashboard' },
          { id: 'cognitive', label: isCompanion ? 'Activity History' : 'Cognitive Latency & Log' },
          { id: 'safety', label: isCompanion ? 'Safe Neighborhood Zone' : 'Geofence & Location' },
          { id: 'alerts', label: isCompanion ? 'Care Notes (2)' : 'Clinical Alerts (2)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-full font-baloo font-bold text-xs cursor-pointer transition-all ${
              activeSubTab === tab.id
                ? 'bg-[#22403A] text-[#FBF7EE]'
                : 'text-[#665F51] hover:text-[#221F1B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW SUBTAB */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-baloo font-bold text-[#665F51] uppercase">Cognitive Practice</span>
                <Sparkles className="w-4 h-4 text-[#E2A33D]" />
              </div>
              <div className="font-fraunces text-3xl font-bold text-[#221F1B] mb-1">
                6 Days
              </div>
              <div className="text-xs text-[#3F7455] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Steady daily routine active</span>
              </div>
              <p className="text-[11px] text-[#665F51] mt-2">
                {isCompanion ? 'You completed Memory Match and Pattern games this week.' : 'Average accuracy 82% with 3 min daily average duration.'}
              </p>
            </div>

            <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-baloo font-bold text-[#665F51] uppercase">Medicine Routine</span>
                <Pill className="w-4 h-4 text-[#BD5B3B]" />
              </div>
              <div className="font-fraunces text-3xl font-bold text-[#221F1B] mb-1">
                92%
              </div>
              <div className="text-xs text-[#BD5B3B] font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Evening medicine pending</span>
              </div>
              <p className="text-[11px] text-[#665F51] mt-2">
                {isCompanion ? 'Morning tablets taken on time with warm water.' : 'Sunday & Monday evening dose marked delayed by elder.'}
              </p>
            </div>

            <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-baloo font-bold text-[#665F51] uppercase">Safe Area Stay</span>
                <ShieldCheck className="w-4 h-4 text-[#22403A]" />
              </div>
              <div className="font-fraunces text-3xl font-bold text-[#221F1B] mb-1">
                {safeZoneRadius}m
              </div>
              <div className="text-xs text-[#3F7455] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Currently at home inside zone</span>
              </div>
              <p className="text-[11px] text-[#665F51] mt-2">
                {isCompanion ? 'Tea garden path and temple are within your perimeter.' : 'Last walk 9:14 AM – 9:52 AM returned safely.'}
              </p>
            </div>
          </div>

          {/* Reassuring companion guidance / caregiver advice banner */}
          <div className="p-5 rounded-2xl bg-[#FBF7EE] border border-[#E6DAB9] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#22403A] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Heart className="w-5 h-5 text-[#F8E6C1]" />
              </div>
              <div>
                <h4 className="font-fraunces text-lg text-[#221F1B]">
                  {isCompanion ? 'Gentle note for your afternoon' : 'Caregiver Recommendation'}
                </h4>
                <p className="text-xs text-[#665F51] mt-0.5 leading-relaxed">
                  {isCompanion
                    ? 'Your memory games show wonderful sharpness with colors and daily routine. Your son Ranjit will call this evening at 7 PM.'
                    : 'Response latencies on the Memory Match game have lengthened slightly (+22%). Keep hydration steady and maintain calm evening checks.'}
                </p>
              </div>
            </div>

            {isCompanion && onNavigateToActivities && (
              <button
                onClick={onNavigateToActivities}
                className="px-4 py-2.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Play Activity
              </button>
            )}
          </div>
        </div>
      )}

      {/* COGNITIVE TAB */}
      {activeSubTab === 'cognitive' && (
        <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-fraunces text-xl text-[#221F1B]">
                {isCompanion ? 'My Activity History' : 'Cognitive Latency & Session Log'}
              </h3>
              <p className="text-xs text-[#665F51]">
                {isCompanion
                  ? 'Your daily activities designed to keep focus agile and cheerful.'
                  : 'Tracked accuracy and response latencies over recent interactive sessions.'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
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
                  <td className="py-3 text-xs font-bold text-[#22403A]">Memory Match</td>
                  <td className="py-3 text-xs text-[#665F51]">3 min</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E4ECE7] text-[#22403A] text-[11px] font-bold">
                      82% accuracy
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-xs font-medium">Yesterday</td>
                  <td className="py-3 text-xs font-bold text-[#22403A]">Pattern Recall</td>
                  <td className="py-3 text-xs text-[#665F51]">4 min</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E4ECE7] text-[#22403A] text-[11px] font-bold">
                      Sequence of 5
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-xs font-medium">Sat, 27 Aug</td>
                  <td className="py-3 text-xs font-bold text-[#22403A]">Memory Match</td>
                  <td className="py-3 text-xs text-[#665F51]">5 min</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F5E1D6] text-[#BD5B3B] text-[11px] font-bold">
                      61% accuracy
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-xs font-medium">Fri, 26 Aug</td>
                  <td className="py-3 text-xs font-bold text-[#22403A]">Daily Routine Recall</td>
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
        </div>
      )}

      {/* SAFETY & GEOFENCE TAB */}
      {activeSubTab === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-[#E6DAB9] rounded-2xl p-5 shadow-xs">
              <h3 className="font-baloo font-bold text-sm text-[#22403A] mb-3">
                {isCompanion ? 'My Safe Neighborhood Boundary' : 'Live Geofence Boundary Map'}
              </h3>
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
                  Perimeter radius:
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
                  <div key={evt.id} className="flex items-center justify-between py-2.5 text-xs">
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

          {/* Navigation Card */}
          <div className="flex flex-col items-center">
            <div className="w-[240px] rounded-[32px] bg-[#152B26] p-3 shadow-xl">
              <div className="rounded-[24px] bg-[#FBF7EE] p-5 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-[#22403A] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Navigation className="w-7 h-7" />
                </div>
                <div className="font-fraunces text-lg text-[#221F1B] mb-0.5">0.4 km to go</div>
                <p className="text-[11px] text-[#665F51] mb-4 leading-tight">
                  Head straight, then turn left at the tea stall
                </p>
                <button
                  onClick={() => showToast('Family notified with live location coordinates', 'phone')}
                  className="w-full py-2.5 rounded-full bg-[#BD5B3B] text-white font-baloo font-bold text-xs cursor-pointer hover:brightness-95 shadow-xs"
                >
                  I’m lost — alert family
                </button>
              </div>
            </div>
            <p className="text-xs text-[#948C7A] font-semibold mt-3">Companion navigation display</p>
          </div>
        </div>
      )}

      {/* ALERTS SUBTAB */}
      {activeSubTab === 'alerts' && (
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
                {elderName} marked evening medicine as skipped on Sunday and Monday. Gentle voice reminder scheduled for tonight.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
