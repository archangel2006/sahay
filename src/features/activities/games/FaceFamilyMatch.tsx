import React, { useState, useEffect } from 'react';
import { Heart, Check, RefreshCw, Sparkles, Smile, ArrowRight } from 'lucide-react';
import { sandboxStorage } from '../../../services/sandboxStorage';
import { FamilyMemberItem } from '../../../types';

interface FaceFamilyMatchProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

interface RoundData {
  member: FamilyMemberItem;
  question: string;
  options: string[];
}

export const FaceFamilyMatch: React.FC<FaceFamilyMatchProps> = ({ onSessionComplete, showToast }) => {
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [correctFirstTaps, setCorrectFirstTaps] = useState(0);
  const [attemptedThisRound, setAttemptedThisRound] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const initGame = () => {
    const family = sandboxStorage.getFamily().filter((f) => f.imageUrl);
    const activeFamily = family.length >= 3 ? family : sandboxStorage.getFamily();

    // Pick 3 unique family members for the 3 rounds
    const shuffledMembers = [...activeFamily].sort(() => Math.random() - 0.5).slice(0, 3);

    const generatedRounds: RoundData[] = shuffledMembers.map((member) => {
      // Pick 2 random distractors from other family members
      const otherNames = activeFamily
        .filter((m) => m.name !== member.name)
        .map((m) => m.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      const options = [member.name, ...otherNames].sort(() => Math.random() - 0.5);

      // Question variations for elder warmth
      const questionPrompts = [
        `Who is your ${member.rel.toLowerCase()}?`,
        `"${member.fact}" — Who is this?`,
        `Tap on your beloved ${member.rel.toLowerCase()}`,
      ];
      const question = questionPrompts[Math.floor(Math.random() * questionPrompts.length)];

      return {
        member,
        question,
        options,
      };
    });

    setRounds(generatedRounds);
    setCurrentRoundIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsShaking(false);
    setMoves(0);
    setCorrectFirstTaps(0);
    setAttemptedThisRound(false);
    setIsGameFinished(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleOptionClick = (option: string) => {
    if (isAnswered || isGameFinished) return;

    setMoves((prev) => prev + 1);
    setSelectedOption(option);

    const currentRound = rounds[currentRoundIdx];
    const isCorrect = option === currentRound.member.name;

    if (isCorrect) {
      if (!attemptedThisRound) {
        setCorrectFirstTaps((prev) => prev + 1);
      }
      setIsAnswered(true);
      showToast(`Yes! That's ${currentRound.member.name}.`, 'check');

      setTimeout(() => {
        if (currentRoundIdx + 1 < rounds.length) {
          setCurrentRoundIdx((prev) => prev + 1);
          setSelectedOption(null);
          setIsAnswered(false);
          setAttemptedThisRound(false);
        } else {
          // Game Completed
          setIsGameFinished(true);
          const totalFirstTries = (!attemptedThisRound ? correctFirstTaps + 1 : correctFirstTaps);
          const calculatedAccuracy = Math.round((totalFirstTries / 3) * 100);
          showToast('Wonderful! You remembered everyone today.', 'check');
          if (onSessionComplete) {
            onSessionComplete({
              moves: moves + 1,
              accuracy: Math.max(60, calculatedAccuracy),
            });
          }
        }
      }, 1000);
    } else {
      setAttemptedThisRound(true);
      setIsShaking(true);
      showToast('Not quite, give it another try!', 'alert');
      setTimeout(() => {
        setIsShaking(false);
        setSelectedOption(null);
      }, 700);
    }
  };

  if (rounds.length === 0) {
    return null;
  }

  if (isGameFinished) {
    return (
      <div className="max-w-[480px] mx-auto text-center py-6 animate-rise">
        <div className="w-16 h-16 rounded-2xl bg-[#E4ECE7] text-[#3F7455] flex items-center justify-center mx-auto mb-4 border border-[#3F7455]/20 shadow-xs">
          <Smile className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8E6C1] text-[#8A5D18] text-xs font-baloo font-bold uppercase tracking-wider mb-3">
          Session Complete
        </div>

        <h3 className="font-fraunces text-2xl sm:text-3xl font-medium text-[#221F1B] mb-2">
          Wonderful Memory!
        </h3>
        <p className="text-sm text-[#665F51] mb-6 max-w-[400px] mx-auto leading-relaxed">
          You remembered everyone with warmth and focus today. Every session strengthens your connection to loved ones.
        </p>

        <div className="bg-[#FBF7EE] border border-[#E6DAB9] rounded-2xl p-4 mb-6 text-xs text-[#665F51] flex items-center justify-around">
          <div>
            <span className="font-bold text-[#948C7A] block">ROUNDS</span>
            <span className="font-fraunces text-lg text-[#221F1B]">3 of 3</span>
          </div>
          <div className="w-[1px] h-8 bg-[#E6DAB9]" />
          <div>
            <span className="font-bold text-[#948C7A] block">TOTAL TAPS</span>
            <span className="font-fraunces text-lg text-[#221F1B]">{moves}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={initGame}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-colors cursor-pointer mx-auto shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Play Again</span>
        </button>
      </div>
    );
  }

  const currentRound = rounds[currentRoundIdx];

  return (
    <div className="max-w-[460px] mx-auto text-center">
      {/* Top Progress & Clue */}
      <div className="flex items-center justify-between mb-3 text-xs font-baloo font-bold text-[#665F51]">
        <span>Round {currentRoundIdx + 1} of 3</span>
        <span className="text-[#3F7455] flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-[#BD5B3B]" />
          Family Focus
        </span>
      </div>

      <div className="bg-[#FBF7EE] border border-[#E6DAB9] rounded-2xl p-4 mb-5">
        <p className="font-baloo font-bold text-base text-[#22403A] leading-tight">
          {currentRound.question}
        </p>
      </div>

      {/* Portrait Photo Center */}
      <div
        className={`relative w-48 h-48 mx-auto rounded-3xl overflow-hidden shadow-md border-2 mb-6 transition-transform ${
          isShaking ? 'animate-bounce border-[#BD5B3B]' : 'border-[#E6DAB9]'
        }`}
      >
        {currentRound.member.imageUrl ? (
          <img
            src={currentRound.member.imageUrl}
            alt="Family member"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            style={{ backgroundColor: currentRound.member.color }}
            className="w-full h-full flex flex-col items-center justify-center text-white"
          >
            <span className="font-fraunces text-5xl font-bold">
              {currentRound.member.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        <span className="absolute bottom-2 left-3 right-3 text-[11px] font-baloo font-bold text-white bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {currentRound.member.rel}
        </span>
      </div>

      {/* Choice Buttons */}
      <div className="space-y-3 mb-6">
        {currentRound.options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrect = isSelected && isAnswered;

          return (
            <button
              key={option}
              type="button"
              disabled={isAnswered}
              onClick={() => handleOptionClick(option)}
              className={`w-full py-4 px-5 rounded-2xl border-2 font-baloo font-bold text-base transition-all duration-200 cursor-pointer flex items-center justify-between shadow-xs min-h-[56px] ${
                isCorrect
                  ? 'bg-[#E4ECE7] border-[#3F7455] text-[#22403A] scale-[1.02]'
                  : isSelected && isShaking
                  ? 'bg-[#F5E1D6] border-[#BD5B3B] text-[#BD5B3B]'
                  : 'bg-white border-[#E6DAB9] text-[#221F1B] hover:border-[#22403A] hover:bg-[#FBF7EE]'
              }`}
            >
              <span className="pl-1">{option}</span>
              {isCorrect && (
                <div className="w-6 h-6 rounded-full bg-[#3F7455] text-white flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};