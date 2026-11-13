import React, { useState } from 'react';
import {
  Award,
  Check,
  CircleDot,
  Coffee,
  Leaf,
  MapPin,
  RotateCcw,
  Sparkles,
  Umbrella,
  Waves,
} from 'lucide-react';

interface OddOneOutProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

interface GameItem {
  id: string;
  label: string;
  category: 'tea' | 'assam' | 'kitchen';
  isOdd: boolean;
  icon: React.ElementType;
  tint: string;
}

const ROUNDS: GameItem[][] = [
  [
    { id: 'tea-leaf', label: 'Tea leaf', category: 'tea', isOdd: false, icon: Leaf, tint: 'bg-[#E4ECE7] text-[#22403A]' },
    { id: 'tea-basket', label: 'Tea basket', category: 'tea', isOdd: false, icon: Waves, tint: 'bg-[#F8E6C1] text-[#8A5D18]' },
    { id: 'tea-garden', label: 'Tea garden', category: 'tea', isOdd: false, icon: Leaf, tint: 'bg-[#E5E9F1] text-[#3E4F74]' },
    { id: 'bell-cup', label: 'Bell metal cup', category: 'kitchen', isOdd: true, icon: Coffee, tint: 'bg-[#F5E1D6] text-[#BD5B3B]' },
  ],
  [
    { id: 'gamusa', label: 'Gamusa', category: 'assam', isOdd: false, icon: Waves, tint: 'bg-[#F5E1D6] text-[#BD5B3B]' },
    { id: 'jaapi', label: 'Jaapi', category: 'assam', isOdd: false, icon: Umbrella, tint: 'bg-[#F8E6C1] text-[#8A5D18]' },
    { id: 'pitha', label: 'Pitha', category: 'assam', isOdd: false, icon: CircleDot, tint: 'bg-[#E4ECE7] text-[#22403A]' },
    { id: 'tea-leaf-round-two', label: 'Tea leaf', category: 'tea', isOdd: true, icon: Leaf, tint: 'bg-[#E5E9F1] text-[#3E4F74]' },
  ],
  [
    { id: 'jaapi-round-three', label: 'Jaapi', category: 'assam', isOdd: false, icon: Umbrella, tint: 'bg-[#E4ECE7] text-[#22403A]' },
    { id: 'gamusa-round-three', label: 'Gamusa', category: 'assam', isOdd: false, icon: Waves, tint: 'bg-[#F5E1D6] text-[#BD5B3B]' },
    { id: 'pitha-round-three', label: 'Pitha', category: 'assam', isOdd: false, icon: CircleDot, tint: 'bg-[#F8E6C1] text-[#8A5D18]' },
    { id: 'bell-cup-round-three', label: 'Bell metal cup', category: 'kitchen', isOdd: true, icon: Coffee, tint: 'bg-[#E5E9F1] text-[#3E4F74]' },
  ],
];

const playSuccessChime = () => {
  if (typeof window === 'undefined' || !window.AudioContext) return;

  const context = new window.AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523.25, context.currentTime);
  oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.12);
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.35);
  oscillator.addEventListener('ended', () => void context.close());
};

export const OddOneOut: React.FC<OddOneOutProps> = ({ onSessionComplete, showToast }) => {
  const [round, setRound] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState('Three items belong together. Find the one from another group.');
  const [isComplete, setIsComplete] = useState(false);

  const restart = () => {
    setRound(0);
    setSelectedId(null);
    setMessage('Three items belong together. Find the one from another group.');
    setIsComplete(false);
  };

  const handleItemClick = (item: GameItem) => {
    if (selectedId || isComplete) return;

    setSelectedId(item.id);
    if (item.isOdd) {
      if (round === ROUNDS.length - 1) {
        setIsComplete(true);
        setMessage('Wonderful! You found every odd one out.');
        showToast('Game complete — excellent sorting!', 'check');
        playSuccessChime();
        onSessionComplete?.({ moves: ROUNDS.length, accuracy: 100 });
      } else {
        setMessage('Correct! Ready for the next group?');
        showToast('Correct — nicely spotted!', 'check');
        playSuccessChime();
        window.setTimeout(() => {
          setRound((currentRound) => currentRound + 1);
          setSelectedId(null);
          setMessage('Keep going — which item belongs to another group?');
        }, 850);
      }
    } else {
      setMessage('Not quite. Look at what the other three have in common.');
      showToast('Take another look at the categories', 'alert');
      window.setTimeout(() => setSelectedId(null), 650);
    }
  };

  return (
    <div className="max-w-[680px] mx-auto text-center">
      <div className="relative overflow-hidden rounded-3xl bg-[#22403A] px-5 py-5 mb-6 text-left shadow-md">
        <div className="absolute -right-7 -top-8 h-28 w-28 rounded-full bg-[#E2A33D]/25" />
        <div className="absolute -bottom-12 left-1/3 h-24 w-24 rounded-full bg-[#BD5B3B]/20" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#F8E6C1] font-baloo text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              North-East collection
            </div>
            <h3 className="font-fraunces text-xl text-[#FBF7EE]">Find the one that doesn’t belong</h3>
            <p className="text-xs text-[#E4ECE7] mt-1">Trust your memory and take your time.</p>
          </div>
          <div className="shrink-0 rounded-2xl bg-white/10 p-2.5 text-[#F8E6C1]">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 font-baloo text-sm font-bold text-[#665F51]">
          <Award className="w-4 h-4 text-[#E2A33D]" />
          Round {round + 1} of {ROUNDS.length}
        </span>
        <span aria-live="polite" className="font-baloo text-sm text-[#22403A] font-semibold">{message}</span>
      </div>

      <div className="flex justify-center gap-2 mb-5" aria-label={`Round ${round + 1} of ${ROUNDS.length}`}>
        {ROUNDS.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-14 rounded-full ${index <= round ? 'bg-[#E2A33D]' : 'bg-[#E6DAB9]'}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {ROUNDS[round].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedId === item.id;
          const isCorrect = isSelected && item.isOdd;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={Boolean(selectedId) || isComplete}
              aria-label={item.label}
              className={`group min-h-36 rounded-3xl border-2 border-[#E6DAB9] p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all shadow-xs ${
                isSelected && isCorrect
                    ? 'bg-[#E4ECE7] border-[#3F7455] text-[#22403A] scale-102 shadow-md'
                  : isSelected
                  ? 'bg-[#F5E1D6] border-[#BD5B3B] text-[#BD5B3B]'
                    : `${item.tint} hover:-translate-y-1 hover:border-[#22403A]/30 hover:shadow-md`
              }`}
            >
              <span className="text-[10px] font-baloo font-bold uppercase tracking-widest opacity-50">
                  Item {ROUNDS[round].indexOf(item) + 1}
              </span>
              <span className={`rounded-2xl bg-white/60 p-3 transition-transform ${!isSelected ? 'group-hover:scale-110' : ''}`}>
                  {isSelected && isCorrect ? <Check className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
              </span>
              <span className="font-baloo font-bold text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div className="mb-5 rounded-2xl border border-[#E2A33D]/50 bg-[#F8E6C1] px-4 py-3 text-[#8A5D18]">
          <p className="font-baloo font-bold">Three out of three — your sorting skills are shining!</p>
          <p className="text-xs mt-0.5">Come back tomorrow for another gentle brain boost.</p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={restart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-colors cursor-pointer"
        >
          {isComplete ? <Sparkles className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
          {isComplete ? 'Play again' : 'Restart game'}
        </button>
      </div>
    </div>
  );
};
