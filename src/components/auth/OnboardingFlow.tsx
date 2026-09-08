import React, { useState } from 'react';
import { Leaf, Sparkles, Lock, ArrowRight, ArrowLeft, Heart, Users } from 'lucide-react';
import { UserRole, PortalMode } from '../../types';

interface OnboardingFlowProps {
  onComplete: (mode: PortalMode, role: UserRole) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  // Step 1: Environment Selection
  // Step 2: Perspective Selection
  const [step, setStep] = useState<'env' | 'perspective'>('env');
  const [selectedEnv, setSelectedEnv] = useState<PortalMode>('demo');
  const [selectedRole, setSelectedRole] = useState<UserRole>('companion');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState(false);

  const handleEnvContinue = () => {
    if (selectedEnv === 'admin') {
      if (adminPasscode.trim().toUpperCase() === 'SAHAY-ADMIN') {
        setAdminError(false);
        setStep('perspective');
      } else {
        setAdminError(true);
      }
    } else {
      setStep('perspective');
    }
  };

  const handleFinalEnter = () => {
    onComplete(selectedEnv, selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-[#221F1B] flex flex-col justify-between items-center p-6 sm:p-10 selection:bg-[#E2A33D]/20">
      {/* Minimal Top Brand */}
      <header className="flex items-center gap-2.5 pt-2 sm:pt-4">
        <div className="w-8 h-8 rounded-xl bg-[#22403A] text-[#E2A33D] flex items-center justify-center shadow-xs">
          <Leaf className="w-4 h-4" />
        </div>
        <span className="font-fraunces text-xl font-medium tracking-tight text-[#221F1B]">
          Sahay
        </span>
      </header>

      {/* Main Flow Card */}
      <main className="w-full max-w-lg my-auto py-8">
        {step === 'env' ? (
          /* SCREEN 1: SELECT ENVIRONMENT */
          <div className="animate-rise">
            <div className="text-center mb-8">
              <h2 className="font-fraunces text-3xl sm:text-4xl font-normal text-[#221F1B] mb-2 tracking-tight">
                Select Environment
              </h2>
              <p className="font-mulish text-sm text-[#665F51]">
                Choose your workspace session
              </p>
            </div>

            <div className="space-y-3.5 mb-8">
              {/* Option 1: Demo Sandbox */}
              <button
                type="button"
                onClick={() => {
                  setSelectedEnv('demo');
                  setAdminError(false);
                }}
                className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedEnv === 'demo'
                    ? 'border-[#22403A] bg-white ring-2 ring-[#22403A]/20 shadow-sm'
                    : 'border-[#E6DAB9] bg-white/70 hover:bg-white hover:border-[#948C7A]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      selectedEnv === 'demo'
                        ? 'bg-[#22403A] text-[#F8E6C1]'
                        : 'bg-[#F1E7CE] text-[#22403A]'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-baloo font-bold text-base text-[#221F1B]">
                      Demo Sandbox
                    </h3>
                    <p className="text-xs text-[#665F51]">
                      Interactive local exploration
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedEnv === 'demo'
                      ? 'border-[#22403A] bg-[#22403A]'
                      : 'border-[#C9C0A9]'
                  }`}
                >
                  {selectedEnv === 'demo' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {/* Option 2: Production */}
              <button
                type="button"
                onClick={() => setSelectedEnv('admin')}
                className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedEnv === 'admin'
                    ? 'border-[#22403A] bg-white ring-2 ring-[#22403A]/20 shadow-sm'
                    : 'border-[#E6DAB9] bg-white/70 hover:bg-white hover:border-[#948C7A]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      selectedEnv === 'admin'
                        ? 'bg-[#22403A] text-[#F5E1D6]'
                        : 'bg-[#F1E7CE] text-[#22403A]'
                    }`}
                  >
                    <Lock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-baloo font-bold text-base text-[#221F1B]">
                      Production Portal
                    </h3>
                    <p className="text-xs text-[#665F51]">
                      Authorized operators only
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedEnv === 'admin'
                      ? 'border-[#22403A] bg-[#22403A]'
                      : 'border-[#C9C0A9]'
                  }`}
                >
                  {selectedEnv === 'admin' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {/* Passcode input if production selected */}
              {selectedEnv === 'admin' && (
                <div className="pt-2 animate-rise">
                  <input
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => {
                      setAdminPasscode(e.target.value);
                      setAdminError(false);
                    }}
                    placeholder="Enter operator passcode"
                    className="w-full px-4 py-3 rounded-xl border border-[#E6DAB9] bg-white text-sm focus:outline-2 focus:outline-[#22403A]"
                  />
                  {adminError && (
                    <p className="text-xs font-semibold text-[#BD5B3B] mt-1.5 px-1">
                      Invalid passcode. Please try again.
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleEnvContinue}
              className="w-full py-4 px-6 rounded-2xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-[0.99]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* SCREEN 2: SELECT PERSPECTIVE */
          <div className="animate-rise">
            <div className="text-center mb-8">
              <h2 className="font-fraunces text-3xl sm:text-4xl font-normal text-[#221F1B] mb-2 tracking-tight">
                Choose Perspective
              </h2>
              <p className="font-mulish text-sm text-[#665F51]">
                Select the desired view
              </p>
            </div>

            <div className="space-y-3.5 mb-8">
              {/* Perspective 1: Sahay Companion */}
              <button
                type="button"
                onClick={() => setSelectedRole('companion')}
                className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedRole === 'companion'
                    ? 'border-[#22403A] bg-white ring-2 ring-[#22403A]/20 shadow-sm'
                    : 'border-[#E6DAB9] bg-white/70 hover:bg-white hover:border-[#948C7A]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      selectedRole === 'companion'
                        ? 'bg-[#22403A] text-[#F8E6C1]'
                        : 'bg-[#F1E7CE] text-[#22403A]'
                    }`}
                  >
                    <Heart className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-baloo font-bold text-base text-[#221F1B]">
                      Sahay Companion
                    </h3>
                    <p className="text-xs text-[#665F51]">
                      For elders &amp; daily care
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === 'companion'
                      ? 'border-[#22403A] bg-[#22403A]'
                      : 'border-[#C9C0A9]'
                  }`}
                >
                  {selectedRole === 'companion' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {/* Perspective 2: Caregiver Oversight */}
              <button
                type="button"
                onClick={() => setSelectedRole('caregiver')}
                className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedRole === 'caregiver'
                    ? 'border-[#22403A] bg-white ring-2 ring-[#22403A]/20 shadow-sm'
                    : 'border-[#E6DAB9] bg-white/70 hover:bg-white hover:border-[#948C7A]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      selectedRole === 'caregiver'
                        ? 'bg-[#22403A] text-[#F8E6C1]'
                        : 'bg-[#F1E7CE] text-[#22403A]'
                    }`}
                  >
                    <Users className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-baloo font-bold text-base text-[#221F1B]">
                      Caregiver Oversight
                    </h3>
                    <p className="text-xs text-[#665F51]">
                      For family &amp; telemetry
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === 'caregiver'
                      ? 'border-[#22403A] bg-[#22403A]'
                      : 'border-[#C9C0A9]'
                  }`}
                >
                  {selectedRole === 'caregiver' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('env')}
                className="py-4 px-5 rounded-2xl border border-[#E6DAB9] text-[#221F1B] font-baloo font-bold text-sm hover:bg-white transition-all flex items-center justify-center cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleFinalEnter}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-[0.99]"
              >
                <span>Enter Sahay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="text-xs text-[#948C7A] pb-2">
        <span>Sahay Cognitive Care Platform</span>
      </footer>
    </div>
  );
};
