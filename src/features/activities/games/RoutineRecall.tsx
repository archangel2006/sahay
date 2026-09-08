import React, { useState, useEffect } from 'react';
import { Sun, Droplet, Coffee, Pill, Activity, Shuffle, Check } from 'lucide-react';

interface RoutineRecallProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

interface RoutineStep {
  idx: number;
  label: string;
  icon: React.ElementType;
}

const ROUTINE_STEPS: RoutineStep[] = [
  { idx: 0, label: 'Wake up', icon: Sun },
  { idx: 1, label: 'Freshen up', icon: Droplet },
  { idx: 2, label: 'Morning tea', icon: Coffee },
  { idx: 3, label: 'Take medicine', icon: Pill },
  { idx: 4, label: 'Morning walk', icon: Activity },
];

export const RoutineRecall: React.FC<RoutineRecallProps> = ({ onSessionComplete, showToast }) => {
  const [shuffledSteps, setShuffledSteps] = useState<RoutineStep[]>([]);
  const [pickedSequence, setPickedSequence] = useState<number[]>([]);
  const [gameMessage, setGameMessage] = useState<string>('Start with the very first thing in the morning.');

  const initGame = () => {
    const shuffled = [...ROUTINE_STEPS].sort(() => Math.random() - 0.5);
    setShuffledSteps(shuffled);
    setPickedSequence([]);
    setGameMessage('Start with the very first thing in the morning.');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleStepClick = (stepIdx: number) => {
    if (pickedSequence.includes(stepIdx)) return;

    const expectedNext = pickedSequence.length;
    if (stepIdx === expectedNext) {
      const newPicked = [...pickedSequence, stepIdx];
      setPickedSequence(newPicked);

      if (newPicked.length === ROUTINE_STEPS.length) {
        setGameMessage('Perfect — that is the full morning routine!');
        showToast('Routine complete — great sequencing!', 'check');
        if (onSessionComplete) {
          onSessionComplete({ moves: ROUTINE_STEPS.length, accuracy: 100 });
        }
      } else {
        setGameMessage('Good — now the next step.');
      }
    } else {
      setGameMessage('Not quite that one — think about what comes next.');
      showToast('Try again from where you left off', 'alert');
    }
  };

  return (
    <div className="max-w-[480px] mx-auto text-center">
      <div className="flex items-center justify-between mb-4">
        <span className="font-baloo text-sm font-bold text-[#665F51]">
          Progress: {pickedSequence.length} of {ROUTINE_STEPS.length}
        </span>
        <span className="font-baloo text-sm text-[#22403A] font-semibold">{gameMessage}</span>
      </div>

      <div className="flex flex-wrap gap-3 justify-center my-6">
        {shuffledSteps.map((step) => {
          const Icon = step.icon;
          const isPicked = pickedSequence.includes(step.idx);
          const pickPosition = pickedSequence.indexOf(step.idx) + 1;

          return (
            <button
              key={step.idx}
              onClick={() => handleStepClick(step.idx)}
              className={`w-24 p-3 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 relative ${
                isPicked
                  ? 'border-[#3F7455] bg-[#E4ECE7] text-[#22403A]'
                  : 'border-[#E6DAB9] bg-white text-[#221F1B] hover:border-[#22403A] hover:scale-102'
              }`}
            >
              {isPicked && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#3F7455] text-white text-xs font-bold flex items-center justify-center">
                  {pickPosition}
                </div>
              )}
              <Icon className="w-6 h-6 text-[#22403A]" />
              <span className="text-xs font-baloo font-bold">{step.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={initGame}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-colors cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle again
        </button>
      </div>
    </div>
  );
};
