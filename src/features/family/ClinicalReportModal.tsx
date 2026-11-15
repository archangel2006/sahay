import React from 'react';
import {
  Printer,
  X,
  FileText,
  Activity,
  ShieldCheck,
  Pill,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  User,
  Heart,
} from 'lucide-react';
import { ZoneEventItem } from '../../types';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  elderName: string;
  elderId?: string;
  safeZoneRadius: number;
  zoneEvents: ZoneEventItem[];
  showToast: (msg: string, icon?: string) => void;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  isOpen,
  onClose,
  elderName,
  elderId = 'SHY-9021',
  safeZoneRadius,
  zoneEvents,
  showToast,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    showToast('Opening print dialog for Clinical Summary…', 'file');
    window.print();
  };

  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-rise print:p-0 print:static print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-6 border border-[#E6DAB9] print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Modal Controls - Hidden during print */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6DAB9] mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#E4ECE7] text-[#22403A] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-fraunces text-xl font-medium text-[#221F1B]">
                Doctor &amp; Clinical Summary Export
              </h3>
              <p className="text-xs text-[#665F51]">
                Longitudinal 30-day assessment for neurology and geriatric consultation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#E2A33D]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F1E7CE] text-[#665F51] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT BODY */}
        <div className="printable-report space-y-6 text-[#221F1B]">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#22403A] pb-4">
            <div>
              <div className="flex items-center gap-2 font-fraunces text-2xl font-bold text-[#22403A]">
                <span>Sahay</span>
                <span className="text-sm font-baloo font-bold uppercase tracking-wider text-[#BD5B3B] bg-[#F5E1D6] px-2.5 py-0.5 rounded-full">
                  Clinical Care Assessment
                </span>
              </div>
              <p className="text-xs text-[#665F51] mt-0.5">
                Longitudinal Cognitive, Medication Adherence &amp; Safety Baseline
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-[#665F51]">
              <p><strong className="text-[#221F1B]">Report Generated:</strong> {reportDate}</p>
              <p><strong className="text-[#221F1B]">Assessing Physician:</strong> Dr. Baruah (Neurology)</p>
            </div>
          </div>

          {/* Patient Details Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBF7EE] border border-[#E6DAB9] rounded-2xl p-4 text-xs">
            <div>
              <span className="text-[10px] font-baloo font-bold uppercase text-[#948C7A] block">Patient Name</span>
              <span className="font-semibold text-sm text-[#221F1B]">{elderName}</span>
            </div>
            <div>
              <span className="text-[10px] font-baloo font-bold uppercase text-[#948C7A] block">Patient ID</span>
              <span className="font-mono font-bold text-sm text-[#22403A]">{elderId}</span>
            </div>
            <div>
              <span className="text-[10px] font-baloo font-bold uppercase text-[#948C7A] block">Location</span>
              <span className="font-medium text-[#221F1B]">Jorhat, Assam</span>
            </div>
            <div>
              <span className="text-[10px] font-baloo font-bold uppercase text-[#948C7A] block">Primary Caregiver</span>
              <span className="font-medium text-[#221F1B]">Ranjit (Son)</span>
            </div>
          </div>

          {/* Section 1: Cognitive Performance Metrics */}
          <div>
            <h4 className="font-fraunces text-base font-semibold text-[#22403A] mb-2.5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#BD5B3B]" />
              <span>1. Longitudinal Cognitive Performance (Last 30 Days)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="border border-[#E6DAB9] rounded-xl p-3 bg-white">
                <span className="text-[11px] font-bold text-[#665F51]">Mean Recall Accuracy</span>
                <div className="font-fraunces text-2xl font-bold text-[#221F1B] mt-1">78%</div>
                <span className="text-[10px] text-[#3F7455] font-semibold">Stable over past 4 weeks</span>
              </div>
              <div className="border border-[#E6DAB9] rounded-xl p-3 bg-white">
                <span className="text-[11px] font-bold text-[#665F51]">Stimulus Response Latency</span>
                <div className="font-fraunces text-2xl font-bold text-[#221F1B] mt-1">2.4s</div>
                <span className="text-[10px] text-[#BD5B3B] font-semibold">Elevated on evening sessions</span>
              </div>
              <div className="border border-[#E6DAB9] rounded-xl p-3 bg-white">
                <span className="text-[11px] font-bold text-[#665F51]">Protocol Completion</span>
                <div className="font-fraunces text-2xl font-bold text-[#221F1B] mt-1">26 / 30 Days</div>
                <span className="text-[10px] text-[#3F7455] font-semibold">86.7% adherence</span>
              </div>
            </div>
            <p className="text-xs text-[#665F51] bg-[#FBF7EE] p-3 rounded-xl border border-[#E6DAB9] leading-relaxed">
              <strong>Clinical Observation:</strong> Elder maintains high engagement with Tea Garden Memory Match and Face-Family recognition. Mild working memory latency recorded during late evening hours; recommended to schedule cognitive exercises during morning post-breakfast peak clarity.
            </p>
          </div>

          {/* Section 2: Medication Adherence & Routine Consistency */}
          <div>
            <h4 className="font-fraunces text-base font-semibold text-[#22403A] mb-2.5 flex items-center gap-2">
              <Pill className="w-4 h-4 text-[#BD5B3B]" />
              <span>2. Medication Adherence &amp; Vital Routine</span>
            </h4>
            <div className="border border-[#E6DAB9] rounded-xl p-3.5 bg-white space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6DAB9]">
                <span className="font-semibold text-[#221F1B]">Morning Blood Pressure &amp; Nootropic</span>
                <span className="font-baloo font-bold text-[#3F7455] bg-[#E4ECE7] px-2 py-0.5 rounded-full">
                  98% On-Time (29/30)
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#E6DAB9]">
                <span className="font-semibold text-[#221F1B]">Evening Hydration &amp; Sleep Regularity</span>
                <span className="font-baloo font-bold text-[#8A5D18] bg-[#F8E6C1] px-2 py-0.5 rounded-full">
                  86% On-Time (2 missed logs)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#221F1B]">Overall Caregiver Check-In Frequency</span>
                <span className="font-medium text-[#665F51]">Daily 7:00 PM voice verification</span>
              </div>
            </div>
          </div>

          {/* Section 3: Safe-Zone Geofencing & Wandering Risk */}
          <div>
            <h4 className="font-fraunces text-base font-semibold text-[#22403A] mb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3F7455]" />
              <span>3. Geofencing &amp; Wandering Risk Stratification</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
              <div className="border border-[#E6DAB9] rounded-xl p-3 bg-white">
                <span className="font-bold text-[#665F51] block mb-1">Perimeter Configuration</span>
                <p className="text-[#221F1B]">
                  Configured safe-zone radius: <strong>{safeZoneRadius} meters</strong> around Jorhat homestead coordinates.
                </p>
              </div>
              <div className="border border-[#E6DAB9] rounded-xl p-3 bg-white">
                <span className="font-bold text-[#665F51] block mb-1">Wandering Events (Last 30 Days)</span>
                <p className="text-[#221F1B]">
                  <strong>{zoneEvents.filter((e) => e.type === 'exit').length} zone boundary excursions</strong> logged. Both returned safely with family assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Attending Physician Notes & Signature Block */}
          <div className="pt-4 border-t-2 border-[#E6DAB9] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="font-baloo font-bold text-[#665F51] uppercase text-[10px] block mb-1">
                Clinical Recommendations &amp; Prescription Adjustments
              </span>
              <div className="border border-[#E6DAB9] rounded-xl p-3 h-24 bg-[#FBF7EE] text-[#948C7A] italic">
                Physician notes and follow-up directives...
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="text-right sm:mt-auto">
                <div className="border-b border-black w-48 ml-auto mb-1.5" />
                <span className="font-baloo font-bold text-xs text-[#221F1B] block">
                  Attending Physician Signature
                </span>
                <span className="text-[11px] text-[#948C7A]">Registration No: MCI-NE-48912</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions - Hidden during print */}
        <div className="mt-6 pt-4 border-t border-[#E6DAB9] flex justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E6DAB9] font-baloo font-bold text-xs text-[#221F1B] hover:bg-[#F1E7CE] cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#E2A33D]" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
