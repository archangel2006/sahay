
import React, { useState } from 'react';
import {
  Users,
  Plus,
  Check,
  MapPin,
  X,
  UserRound,
  Loader2,
} from 'lucide-react';
import { LinkedElder } from '../../services/sandboxStorage';

interface ElderSwitcherProps {
  linkedElders: LinkedElder[];
  currentElderId: string;
  onSelectElder: (id: string) => void;
  onLinkNewElder: (
    id: string,
    name: string,
    location: string,
    relationTag: string
  ) => void | Promise<void>;
  showToast: (message: string, icon?: string) => void;
}

const ElderSwitcher: React.FC<ElderSwitcherProps> = ({
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
  const [error, setError] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  const currentElder =
    linkedElders.find((elder) => elder.id === currentElderId) ||
    linkedElders[0];

  const resetForm = () => {
    setElderCode('');
    setElderName('');
    setElderLoc('');
    setElderRel('');
    setError('');
  };

  const handleLinkSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError('');

    const formattedCode = elderCode.trim().toUpperCase();
    const formattedName = elderName.trim();

    if (!formattedCode || !formattedName) {
      setError('Please enter the elder code and full name.');
      return;
    }

    if (!/^SHY-\d{4}$/.test(formattedCode)) {
      setError('Invalid code format. Example: SHY-4482');
      return;
    }

    const alreadyLinked = linkedElders.some(
      (elder) => elder.id.toUpperCase() === formattedCode
    );

    if (alreadyLinked) {
      setError('This elder is already linked to your account.');
      return;
    }

    try {
      setIsLinking(true);

      await onLinkNewElder(
        formattedCode,
        formattedName,
        elderLoc.trim() || 'Assam',
        elderRel.trim() || 'Family Member'
      );

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Could not link elder. Please try again.'
      );
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {currentElder && (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: currentElder.avatarColor }}
          >
            <UserRound size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500">
              Currently viewing
            </p>
            <h3 className="truncate font-semibold text-gray-900">
              {currentElder.name}
            </h3>
            <p className="flex items-center gap-1 truncate text-xs text-gray-500">
              <MapPin size={12} />
              {currentElder.location}
            </p>
          </div>

          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            Active
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">
              Family profiles
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setError('');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-full bg-[#22403A] px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            <Plus size={15} />
            Link elder
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {linkedElders.map((elder) => {
            const isSelected = elder.id === currentElderId;

            return (
              <button
                key={elder.id}
                type="button"
                onClick={() => onSelectElder(elder.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                  isSelected
                    ? 'border-[#22403A] bg-[#22403A] text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: elder.avatarColor }}
                />
                <span>{elder.name}</span>
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>

        {linkedElders.length === 0 && (
          <p className="text-sm text-gray-500">
            No elder profiles linked yet.
          </p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Link another elder
                </h2>
                <p className="text-sm text-gray-500">
                  Add a family member using their Sahay code.
                </p>
              </div>

              <button
                type="button"
                disabled={isLinking}
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Elder's unique code *
                </label>
                <input
                  value={elderCode}
                  onChange={(e) =>
                    setElderCode(e.target.value.toUpperCase())
                  }
                  placeholder="SHY-4482"
                  maxLength={8}
                  disabled={isLinking}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#22403A] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Elder's full name *
                </label>
                <input
                  value={elderName}
                  onChange={(e) => setElderName(e.target.value)}
                  placeholder="Enter full name"
                  disabled={isLinking}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#22403A] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  value={elderLoc}
                  onChange={(e) => setElderLoc(e.target.value)}
                  placeholder="e.g. Jorhat, Assam"
                  disabled={isLinking}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#22403A] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <input
                  value={elderRel}
                  onChange={(e) => setElderRel(e.target.value)}
                  placeholder="e.g. Father, Mother"
                  disabled={isLinking}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#22403A] disabled:bg-gray-100"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLinking}
                className="w-full rounded-xl bg-[#22403A] py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLinking ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Linking...
                  </span>
                ) : (
                  'Link elder'
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                Demo mode: code format and duplicate checks are performed
                locally. Server verification is not configured.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElderSwitcher;
