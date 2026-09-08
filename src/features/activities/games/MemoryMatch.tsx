import React, { useState, useEffect } from 'react';
import { Leaf, Sun, Mountain, Droplet, Eye, Check, RefreshCw } from 'lucide-react';

interface MemoryMatchProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

interface CardItem {
  id: number;
  iconName: string;
  isMatched: boolean;
  isFlipped: boolean;
}

const CARD_ICONS = ['leaf', 'sun', 'mountain', 'droplet', 'leaf-alt', 'flower', 'tree', 'bird'];

export const MemoryMatch: React.FC<MemoryMatchProps> = ({ onSessionComplete, showToast }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('Tap two tiles to find a pair.');

  const initGame = () => {
    const deckIcons = [...CARD_ICONS, ...CARD_ICONS];
    const shuffled = deckIcons
      .sort(() => Math.random() - 0.5)
      .map((iconName, index) => ({
        id: index,
        iconName,
        isMatched: false,
        isFlipped: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsLocked(false);
    setGameMessage('Tap two tiles to find a pair.');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.iconName === secondCard.iconName) {
        // Matched!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setGameMessage('Pair found! Keep going.');

          // Check if all matched
          const allMatched = newCards.every((c, idx) =>
            idx === firstIdx || idx === secondIdx ? true : c.isMatched
          );
          if (allMatched) {
            setGameMessage(`Well done! All pairs found in ${moves + 1} moves.`);
            showToast('Activity complete — great focus today!', 'check');
            if (onSessionComplete) {
              const accuracy = Math.max(50, Math.round((8 / (moves + 1)) * 100));
              onSessionComplete({ moves: moves + 1, accuracy });
            }
          }
        }, 300);
      } else {
        // Not matched
        setIsLocked(true);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 700);
      }
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'leaf':
      case 'leaf-alt':
        return <Leaf className="w-6 h-6 text-white" />;
      case 'sun':
        return <Sun className="w-6 h-6 text-white" />;
      case 'mountain':
        return <Mountain className="w-6 h-6 text-white" />;
      case 'droplet':
        return <Droplet className="w-6 h-6 text-white" />;
      case 'flower':
        return <Eye className="w-6 h-6 text-white" />;
      default:
        return <Leaf className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-baloo text-sm font-bold text-[#665F51]">Moves: {moves}</span>
        <span className="font-baloo text-sm text-[#22403A] font-semibold">{gameMessage}</span>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-[440px] mx-auto mb-6">
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm border ${
                card.isMatched
                  ? 'bg-[#E4ECE7] border-[#22403A]/20 text-[#22403A]'
                  : isRevealed
                  ? 'bg-[#E2A33D] border-[#E2A33D] text-white'
                  : 'bg-[#22403A] border-[#152B26] text-[#FBF7EE] hover:scale-102'
              }`}
            >
              {isRevealed ? (
                card.isMatched ? (
                  <Check className="w-6 h-6 text-[#22403A]" />
                ) : (
                  renderIcon(card.iconName)
                )
              ) : (
                <Leaf className="w-5 h-5 opacity-60 text-[#FBF7EE]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={initGame}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Shuffle again
        </button>
      </div>
    </div>
  );
};
