import React, { useState, useEffect } from 'react';
import { Leaf, Shuffle, Check } from 'lucide-react';

interface SpotDifferenceProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const SpotDifference: React.FC<SpotDifferenceProps> = ({ onSessionComplete, showToast }) => {
  const [round, setRound] = useState<number>(1);
  const [oddIndex, setOddIndex] = useState<number>(0);
  const [flashTile, setFlashTile] = useState<{ id: number; type: 'correct' | 'wrong' } | null>(null);
  const [gameMessage, setGameMessage] = useState<string>('Take your time and look closely.');

  const generateRound = (nextRoundNum: number) => {
    const randomIndex = Math.floor(Math.random() * 9);
    setOddIndex(randomIndex);
    setRound(nextRoundNum);
    setFlashTile(null);
    setGameMessage('One tile is a little different than the rest. Can you find it?');
  };

  useEffect(() => {
    generateRound(1);
  }, []);

  const handleTileClick = (index: number) => {
    if (index === oddIndex) {
      setFlashTile({ id: index, type: 'correct' });
      setGameMessage('Found it! Well spotted.');
      showToast('Correct — sharp eyes today!', 'check');
      if (onSessionComplete && round >= 3) {
        onSessionComplete({ moves: round, accuracy: 100 });
      }
      setTimeout(() => generateRound(round + 1), 900);
    } else {
      setFlashTile({ id: index, type: 'wrong' });
      setGameMessage('Keep looking — check the shading closely.');
      setTimeout(() => setFlashTile(null), 400);
    }
  };

  return (
    <div className="max-w-[340px] mx-auto text-center">
      <div className="flex items-center justify-between mb-4">
        <span className="font-baloo text-sm font-bold text-[#665F51]">Round {round}</span>
        <span className="font-baloo text-sm text-[#22403A] font-semibold">{gameMessage}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 my-6">
        {Array.from({ length: 9 }).map((_, i) => {
          const isOdd = i === oddIndex;
          const isFlashing = flashTile?.id === i;

          return (
            <button
              key={i}
              onClick={() => handleTileClick(i)}
              className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-150 border border-[#22403A]/10 shadow-xs ${
                isFlashing && flashTile?.type === 'correct'
                  ? 'bg-[#3F7455] text-white scale-102'
                  : isFlashing && flashTile?.type === 'wrong'
                  ? 'bg-[#F5E1D6] text-[#BD5B3B]'
                  : isOdd
                  ? 'bg-[#E4ECE7] text-[#152B26] brightness-80' // Slightly darker shade
                  : 'bg-[#E4ECE7] text-[#22403A]'
              }`}
            >
              <Leaf className="w-7 h-7" />
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => generateRound(1)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-colors cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          New round
        </button>
      </div>
    </div>
  );
};
