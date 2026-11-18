import React, { useState } from 'react';
import { Users, Plus, Check, MapPin, X, Lock, Eye, EyeOff, Trash2, ShieldCheck } from 'lucide-react';
import { LinkedElder } from '../../services/sandboxStorage';

interface ElderSwitcherProps {
  linkedElders: LinkedElder[];
  currentElderId: string;
  onSelectElder: (elderId: string) => void;
  onLinkNewElder: (
    id: string,
    name: string,
    location: string,
    relationTag: string,
    pin: string
  ) => Promise<void> | void;
  onUnlinkElder?: (elderId: string) => Promise<void> | void;
  showToast: (msg: string, icon?: string) => void;
}

export const ElderSwitcher: React.FC<ElderSwitcherProps> = ({
  linkedElders,
  currentElderId,
  onSelectElder,
  onLinkNewElder,
  onUnlinkElder,
  showToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elderCode, setElderCode] = useState('');
  const [elderName, setElderName] = useState('');
  const [elderLoc, setElderLoc] = useState('');
  const [elderRel, setElderRel] = useState('');
  const [elderPin, setElderPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentElder = linkedElders.find((e) => e.id === currentElderId) || linkedElders[0];

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (!elderCode.trim() || !elderName.trim()) {
      showToast('Enter Elder ID and Name', 'alert');
      return;
    }

    const cleanPin = elderPin.trim();
    if (!cleanPin || cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      setPinError('Security PIN must be exactly 4 numeric digits.');
      showToast('4-digit PIN required', 'alert');
      return;
    }

    const formattedCode = elderCode.trim().toUpperCase();

    // Check if elder is already linked
    if (linkedElders.some((e) => e.id.toUpperCase() === formattedCode)) {
      setPinError(`Elder ${formattedCode} is already connected to your session.`);
      showToast(`Elder ${formattedCode} already linked`, 'alert');
      return;
    }

    try {
      setIsSubmitting(true);
      await onLinkNewElder(
        formattedCode,
        elderName.trim(),
        elderLoc.trim() || 'Assam',
        elderRel.trim() || 'Family Member',
        cleanPin
      );

      setElderCode('');
      setElderName('');
      setElderLoc('');
      setElderRel('');
      setElderPin('');
      setIsModalOpen(false);
      showToast(`Linked ${elderName} (${formattedCode}) with PIN verification!`, 'check');
    } catch (err: any) {
      setPinError(err?.message || 'Failed to link elder profile.');
      showToast(err?.message || 'Failed to link elder', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnlink = async (elderId: string, name: string) => {
    if (linkedElders.length <= 1) {
      showToast('Cannot remove the only linked elder profile', 'alert');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to unlink ${name} (${elderId})?`);
    if (!confirmed) return;

    try {
      if (onUnlinkElder) {
        await onUnlinkElder(elderId);
        showToast(`Unlinked ${name}`, 'check');
      }
    } catch (e: any) {
      showToast(e?.message || 'Could not unlink elder', 'alert');
    }
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
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-baloo font-bold px-2 py-0.5 rounded-full bg-[#FBF7EE] border border-[#E6DAB9] text-[#665F51]">
                <ShieldCheck className="w-3 h-3 text-[#3F7455]" />
                PIN Verified
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#665F51] mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#BD5B3B]" />
              <span>{currentElder?.location}</span>
              <span className="text-[#948C7A]">· {currentElder?.relationTag}</span>
            </div>
          </div>
        </div>

        {/* Quick Switch Pills (Issue #9) */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          {linkedElders.map((elder) => {
            const isSelected = elder.id === currentElderId;
            return (
              <div key={elder.id} className="relative group flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    onSelectElder(elder.id);
                    showToast(`Switched view to ${elder.name}`, 'check');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-baloo font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#22403A] text-[#FBF7EE] shadow-xs'
                      : 'bg-[#FBF7EE] text-[#665F51] border border-[#E6DAB9] hover:border-[#22403A]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-[#E2A33D]" />}
                  <span>{elder.name}</span>
                </button>

                {onUnlinkElder && linkedElders.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnlink(elder.id, elder.name);
                    }}
                    title={`Unlink ${elder.name}`}
                    className="ml-1 p-1 text-[#948C7A] hover:text-[#BD5B3B] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setPinError('');
              setIsModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl font-baloo font-bold text-xs bg-[#F8E6C1] text-[#8A5D18] hover:bg-[#f1dbae] transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Link Elder</span>
          </button>
        </div>
      </div>

      {/* Modal for Linking an Elder by ID and Security PIN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-rise">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#E6DAB9]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F1E7CE] text-[#948C7A] cursor-pointer"
              aria-label="Close modal"
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
              Enter the unique Elder ID and the companion security PIN displayed on their Sahay screen to connect caregiver oversight.
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
                  placeholder="e.g. SHY-4482"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] text-sm uppercase font-mono bg-[#FBF7EE] focus:outline-2 focus:outline-[#22403A]"
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

              {/* 4-Digit Security PIN Code Field (Issue #9 requirement) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-baloo font-bold text-xs text-[#22403A] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#BD5B3B]" />
                    Companion Security PIN (4 Digits)
                  </label>
                  <span className="text-[10px] text-[#665F51]">e.g. 4482 / 9021</span>
                </div>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    value={elderPin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setElderPin(val);
                      if (val.length === 4) setPinError('');
                    }}
                    placeholder="••••"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#E6DAB9] text-sm font-mono tracking-widest bg-[#FBF7EE] focus:outline-2 focus:outline-[#22403A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#948C7A] hover:text-[#221F1B] p-1 cursor-pointer"
                    aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pinError && (
                  <p className="text-[11px] text-[#BD5B3B] font-bold mt-1 animate-pulse">
                    {pinError}
                  </p>
                )}
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
                    placeholder="e.g. Father, Mother"
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
                    placeholder="e.g. Guwahati, Assam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DAB9] text-sm bg-[#FBF7EE] focus:outline-2 focus:outline-[#22403A]"
                  />
                </div>
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
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#22403A] text-white font-baloo font-bold text-sm hover:bg-[#152B26] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Linking...' : 'Verify & Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
