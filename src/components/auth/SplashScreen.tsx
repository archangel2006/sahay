import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadeState, setFadeState] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setFadeState('exit');
    }, 1800);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2300);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#152B26] text-[#FBF7EE] transition-opacity duration-700 select-none ${
        fadeState === 'enter' ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center text-center px-6">
        {/* Emblem with subtle glowing pulse */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-[#22403A] border border-[#E2A33D]/20 shadow-2xl flex items-center justify-center animate-pulse">
            <Leaf className="w-10 h-10 text-[#E2A33D]" />
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-[#E2A33D]/10 blur-xl -z-10" />
        </div>

        {/* Wordmark */}
        <h1 className="font-fraunces text-4xl sm:text-5xl font-medium tracking-tight text-[#FBF7EE] mb-2">
          Sahay
        </h1>

        <p className="font-mulish text-xs tracking-widest uppercase text-[#9FB4AC] mb-8 font-bold">
          Cognitive Care
        </p>

        {/* Minimalist Breathing Loader Line */}
        <div className="w-36 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#E2A33D] rounded-full animate-[shimmer_1.8s_infinite] origin-left" />
        </div>
      </div>
    </div>
  );
};
