import React, { useState, useEffect } from 'react';
import { Sun, Droplet, Mountain, Leaf, Play, RotateCcw } from 'lucide-react';

interface PatternRecallProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

const TILES = [
  { id: 0, bg: 'bg-[#E2A33D]', activeBg: 'brightness-140 scale-105', icon: Sun },
  { id: 1, bg: 'bg-[#3E4F74]', activeBg: 'brightness-140 scale-105', icon: Droplet },
  { id: 2, bg: 'bg-[#BD5B3B]', activeBg: 'brightness-140 scale-105', icon: Mountain },
  { id: 3, bg: 'bg-[#22403A]', activeBg: 'brightness-140 scale-105', icon: Leaf },
];

export const PatternRecall: React.FC<PatternRecallProps> = ({ onSessionComplete, showToast }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState<number>(0);
  const [litTile, setLitTile] = useState<number | null>(null);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('Press Play to start the sequence.');

  const playSequence = (seq: number[]) => {
    setIsAccepting(false);
    setGameMessage('Watch closely…');
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < seq.length) {
        setLitTile(seq[idx]);
        setTimeout(() => setLitTile(null), 400);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAccepting(true);
          setUserStep(0);
          setGameMessage('Your turn — repeat the sequence.');
        }, 300);
      }
    }, 800);
  };

  const startNextRound = (currentSeq: number[]) => {
    const nextItem = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, nextItem];
    setSequence(newSeq);
    setTimeout(() => playSequence(newSeq), 600);
  };

  const startGame = () => {
    const initial = [Math.floor(Math.random() * 4)];
    setSequence(initial);
    playSequence(initial);
  };

  const handleTileClick = (tileId: number) => {
    if (!isAccepting) return;

    setLitTile(tileId);
    setTimeout(() => setLitTile(null), 200);

    if (tileId === sequence[userStep]) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep === sequence.length) {
        setIsAccepting(false);
        setGameMessage(`Correct! Sequence grows to ${sequence.length + 1}.`);
        showToast('Nicely done — sequence level up', 'check');
        if (onSessionComplete && sequence.length >= 3) {
          onSessionComplete({ moves: sequence.length, accuracy: 95 });
        }
        setTimeout(() => startNextRound(sequence), 1100);
      }
    } else {
      setIsAccepting(false);
      const newLen = Math.max(1, sequence.length - 1);
      setGameMessage(`Not quite — let's drop back to ${newLen} and try again.`);
      showToast('Adjusting to a shorter sequence', 'alert');
      setTimeout(() => {
        const resetSeq = Array.from({ length: newLen }, () => Math.floor(Math.random() * 4));
        setSequence(resetSeq);
        playSequence(resetSeq);
      }, 1400);
    }
  };

  return (
    <div className="max-w-[380px] mx-auto text-center">
      <div className="flex items-center justify-between mb-4">
        <span className="font-baloo text-sm font-bold text-[#665F51]">
          Sequence Length: {sequence.length || 1}
        </span>
        <span className="font-baloo text-sm text-[#22403A] font-semibold">{gameMessage}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 my-6">
        {TILES.map((t) => {
          const Icon = t.icon;
          const isLit = litTile === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTileClick(t.id)}
              disabled={!isAccepting && litTile !== t.id}
              className={`aspect-square rounded-3xl flex items-center justify-center cursor-pointer transition-all duration-150 shadow-md ${t.bg} ${
                isLit ? t.activeBg : ''
              }`}
            >
              <Icon className="w-9 h-9 text-white" />
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={startGame}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-colors cursor-pointer"
        >
          <Play className="w-4 h-4" />
          {sequence.length === 0 ? 'Play sequence' : 'Restart sequence'}
        </button>
      </div>
    </div>
  );
};
