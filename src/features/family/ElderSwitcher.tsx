import React, { useState } from 'react';
import { Users, Plus, Check, MapPin, X, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { LinkedElder } from '../../services/sandboxStorage';

interface ElderSwitcherProps {
  linkedElders: LinkedElder[];
  currentElderId: string;
  onSelectElder: (elderId: string) => void;
  onLinkNewElder: (id: string, name: string, location: string, relationTag: string, pin?: string) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const ElderSwitcher: React.FC<ElderSwitcherProps> = ({
  linkedElders,
  currentElderId,
  onSelectElder,
  onLinkNewElder,
  showToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elderCode, setElderCode] = useState('');
  const [elderName, setElderName] = useState('');
  const [elderLoc, setElderLoc] = useState('');
  const [elderRel, setElderRel] = useState('');
  const [elderPin, setElderPin] = useState('');

  // PIN Verification State
  const [pendingElder, setPendingElder] = useState<LinkedElder | null>(null);
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState(false);

  const currentElder = linkedElders.find((e) => e.id === currentElderId) || linkedElders[0];

  const handleInitiateSwitch = (elder: LinkedElder) => {
    if (elder.id === currentElderId) return;
    if (elder.pin) {
      setPendingElder(elder);
      setPinAttempt('');
      setPinError(false);
    } else {
      onSelectElder(elder.id);
      showToast(`Switched view to ${elder.name}`, 'check');
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingElder) return;

    if (pinAttempt === pendingElder.pin || pinAttempt === '1234') {
      onSelectElder(pendingElder.id);
      showToast(`Caregiver view switched to ${pendingElder.name}`, 'check');
      setPendingElder(null);
      setPinAttempt('');
      setPinError(false);
    } else {
      setPinError(true);
      showToast('Incorrect PIN code. Default is 1234.', 'alert');
    }
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!elderCode.trim() || !elderName.trim()) {
      showToast('Enter Elder ID and Name', 'alert');
      return;
    }
    const formattedCode = elderCode.trim().toUpperCase();
    onLinkNewElder(
      formattedCode,
      elderName.trim(),
      elderLoc.trim() || 'Assam',
      elderRel.trim() || 'Family Member',
      elderPin.trim() || '1234'
    );
    setElderCode('');
    setElderName('');
    setElderLoc('');
    setElderRel('');
    setElderPin('');
    setIsModalOpen(false);
    showToast(`Linked ${elderName} (${formattedCode}) with security PIN successfully!`, 'check');
  };

  return (
    <div className="bg-white border border-[#E6DAB9] rounded-2xl p-4 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Active Elder Summary */}
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: currentElder?.avatarColor || '#22403A' }}
            className="w-11 h-11 rounded-xl text-white flex items-center justify-center font-baloo font-bold text-sm shadow-xs"
          >
            {currentElder?.name?.slice(0, 2).toUpperCase() || 'BA'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-fraunces text-base sm:text-lg font-semibold text-[#221F1B]">
                {currentElder?.name}
              </h3>
              <span className="font-baloo text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E4ECE7] text-[#22403A]">
                {currentElder?.id}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#665F51] mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#BD5B3B]" />
              <span>{currentElder?.location}</span>
              <span className="text-[#948C7A]">· {currentElder?.relationTag}</span>
            </div>
          </div>
        </div>

        {/* Quick Switch Pills */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          {linkedElders.map((elder) => {
            const isSelected = elder.id === currentElderId;
            return (
              <button
                key={elder.id}
                type="button"
                onClick={() => handleInitiateSwitch(elder)}
                className={`px-3 py-1.5 rounded-xl font-baloo font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#22403A] text-[#FBF7EE] shadow-xs'
                    : 'bg-[#FBF7EE] text-[#665F51] border border-[#E6DAB9] hover:border-[#22403A]'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3 h-3 text-[#E2A33D]" />
                ) : elder.pin ? (
                  <Lock className="w-2.5 h-2.5 opacity-60 text-[#948C7A]" />
                ) : null}
                <span>{elder.name}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl font-baloo font-bold text-xs bg-[#F8E6C1] text-[#8A5D18] hover:bg-[#f1dbae] transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Link Elder</span>
          </button>
        </div>
      </div>

      {/* Modal for Linking an Elder by ID */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-rise">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#E6DAB9]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F1E7CE] text-[#948C7A] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#E4ECE7] text-[#22403A] flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>

            <h3 className="font-fraunces text-2xl font-medium text-[#221F1B] mb-1">
              Link Elder Profile
            </h3>
            <p className="text-xs text-[#665F51] mb-5 leading-relaxed">
              Enter the unique Elder ID shown on the elder’s Sahay Companion screen to connect oversight.
            </p>

            <form onSubmit={handleLinkSubmit} className="space-y-3.5">
              <div>
                <label className="block font-baloo font-bold text-xs text-[#22403A] mb-1">
                  Elder ID (Required)
                </label>
                <input
                  type="text"
                  required
                  value={elderCode}
                  onChange={(e) => setElderCode(e.target.value)}
                  placeholder="e.g. SHY-4412"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] text-sm uppercase bg-[#FBF7EE] focus:outline-2 focus:outline-[#22403A]"
                />
              </div>

              <div>
                <label className="block font-baloo font-bold text-xs text-[#22403A] mb-1">
                  Full Name (Required)
                </label>
                <input
                  type="text"
                  required
                  value={elderName}
                  onChange={(e) => setElderName(e.target.value)}
                  placeholder="e.g. Dimbeswar koka"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] text-sm bg-[#FBF7EE] focus:outline-2 focus:outline-[#22403A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-baloo font-bold text-xs text-[#22403A] mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={elderRel}
                    onChange={(e) => setElderRel(e.target.value)}
                    placeholder="e.g. Father, Aunt"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] text-sm bg-[#FBF7EE] focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
                <div>
                  <label className="block font-baloo font-bold text-xs text-[#22403A] mb-1">
                    Town / Location
                  </label>
                  <input
                    type="text"
                    value={elderLoc}
                    onChange={(e) => setElderLoc(e.target.value)}
                    placeholder="e.g. Guwahati"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] text-sm bg-[#FBF7EE] focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-baloo font-bold text-xs text-[#22403A] mb-1">
                  4-Digit Security PIN (Optional, default 1234)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={elderPin}
                  onChange={(e) => setElderPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] text-sm bg-[#FBF7EE] focus:outline-2 focus:outline-[#22403A]"
                />
                <span className="text-[10px] text-[#948C7A] mt-1 block">
                  Protects profile switching and confirms caregiver authorization.
                </span>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E6DAB9] font-baloo font-bold text-sm text-[#221F1B] hover:bg-[#F1E7CE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#22403A] text-white font-baloo font-bold text-sm hover:bg-[#152B26] cursor-pointer"
                >
                  Link Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for PIN Verification during Profile Switching */}
      {pendingElder && (
        <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-rise">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-[#E6DAB9]">
            <button
              onClick={() => {
                setPendingElder(null);
                setPinAttempt('');
                setPinError(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F1E7CE] text-[#948C7A] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#F8E6C1] text-[#8A5D18] flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="font-fraunces text-xl font-medium text-[#221F1B] mb-1">
              Confirm Elder Access
            </h3>
            <p className="text-xs text-[#665F51] mb-4 leading-relaxed">
              Enter 4-digit security PIN for <strong className="text-[#221F1B]">{pendingElder.name}</strong> ({pendingElder.id}) to switch active care perspective.
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  required
                  maxLength={4}
                  value={pinAttempt}
                  onChange={(e) => {
                    setPinAttempt(e.target.value.replace(/\D/g, ''));
                    setPinError(false);
                  }}
                  placeholder="••••"
                  className={`w-full py-3 px-4 text-center font-mono text-2xl tracking-[0.5em] rounded-xl border ${
                    pinError
                      ? 'border-[#BD5B3B] bg-[#F5E1D6]/40 text-[#BD5B3B]'
                      : 'border-[#E6DAB9] bg-[#FBF7EE] text-[#221F1B] focus:outline-2 focus:outline-[#22403A]'
                  }`}
                />
                {pinError && (
                  <p className="text-[11px] text-[#BD5B3B] mt-1.5 text-center font-medium">
                    Incorrect PIN. Try 1234 or verify on elder's device.
                  </p>
                )}
                <div className="mt-2 text-center">
                  <span className="text-[10px] text-[#948C7A] bg-[#FBF7EE] px-2.5 py-1 rounded-full border border-[#E6DAB9]">
                    Sandbox PIN hint: 1234
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPendingElder(null);
                    setPinAttempt('');
                    setPinError(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-[#E6DAB9] font-baloo font-bold text-sm text-[#221F1B] hover:bg-[#F1E7CE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pinAttempt.length !== 4}
                  className="flex-1 py-2.5 rounded-xl bg-[#22403A] text-white font-baloo font-bold text-sm hover:bg-[#152B26] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  Verify &amp; Switch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
