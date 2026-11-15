import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Delete, Check, ArrowRight, Brain, RefreshCw } from 'lucide-react';

interface DigitSpanProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const DigitSpan: React.FC<DigitSpanProps> = ({ onSessionComplete, showToast }) => {
  const [level, setLevel] = useState<number>(1); // 1 to 6 (1-3 forward, 4-6 reverse)
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentDisplayDigit, setCurrentDisplayDigit] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [isAcceptingInput, setIsAcceptingInput] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('Press Play to watch the numbers.');
  const [moves, setMoves] = useState<number>(0);
  const [successfulRounds, setSuccessfulRounds] = useState<number>(0);
  const [isSessionDone, setIsSessionDone] = useState<boolean>(false);

  const isReverse = level >= 4;
  const digitCount = level <= 3 ? level + 2 : (level - 3) + 2; // L1: 3, L2: 4, L3: 5, L4: 3 (rev), L5: 4 (rev), L6: 5 (rev)

  const generateSequence = (count: number) => {
    const seq: number[] = [];
    for (let i = 0; i < count; i++) {
      seq.push(Math.floor(Math.random() * 9) + 1); // 1-9
    }
    return seq;
  };

  const playSequence = (seq: number[]) => {
    setIsAcceptingInput(false);
    setUserInput('');
    setIsFlashing(true);
    setGameMessage(isReverse ? 'Watch closely… (You will enter them in REVERSE)' : 'Watch closely…');

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < seq.length) {
        setCurrentDisplayDigit(seq[idx]);
        setTimeout(() => setCurrentDisplayDigit(null), 500);
        idx++;
      } else {
        clearInterval(interval);
        setIsFlashing(false);
        setTimeout(() => {
          setIsAcceptingInput(true);
          setGameMessage(
            isReverse
              ? 'Key in the numbers in REVERSE order.'
              : 'Key in the numbers in the order you saw them.'
          );
        }, 400);
      }
    }, 950);
  };

  const handleStartRound = () => {
    const newSeq = generateSequence(digitCount);
    setSequence(newSeq);
    playSequence(newSeq);
  };

  const handleKeypadPress = (digit: number) => {
    if (!isAcceptingInput || userInput.length >= sequence.length) return;
    setUserInput((prev) => prev + digit);
  };

  const handleClear = () => {
    if (!isAcceptingInput) return;
    setUserInput('');
  };

  const handleDelete = () => {
    if (!isAcceptingInput) return;
    setUserInput((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!isAcceptingInput || userInput.length === 0) return;

    setMoves((prev) => prev + 1);
    const expected = isReverse
      ? [...sequence].reverse().join('')
      : sequence.join('');

    if (userInput === expected) {
      const nextSuccesses = successfulRounds + 1;
      setSuccessfulRounds(nextSuccesses);
      showToast('Correct recall! Wonderful focus.', 'check');

      if (level < 6) {
        setGameMessage(`Well done! Moving to Level ${level + 1}.`);
        setTimeout(() => {
          setLevel((prev) => prev + 1);
          const nextDigits = (level + 1) <= 3 ? (level + 1) + 2 : (level + 1 - 3) + 2;
          const nextSeq = generateSequence(nextDigits);
          setSequence(nextSeq);
          playSequence(nextSeq);
        }, 1200);
      } else {
        setIsSessionDone(true);
        setIsAcceptingInput(false);
        showToast('All 6 levels of Number Recall complete!', 'check');
        if (onSessionComplete) {
          onSessionComplete({ moves: moves + 1, accuracy: 100 });
        }
      }
    } else {
      showToast('Not quite — take a gentle breath and try again.', 'alert');
      setGameMessage('Let’s watch the sequence one more time.');
      setTimeout(() => {
        playSequence(sequence);
      }, 1300);
    }
  };

  const handleRestart = () => {
    setLevel(1);
    setSequence([]);
    setCurrentDisplayDigit(null);
    setIsFlashing(false);
    setUserInput('');
    setIsAcceptingInput(false);
    setGameMessage('Press Play to watch the numbers.');
    setMoves(0);
    setSuccessfulRounds(0);
    setIsSessionDone(false);
  };

  if (isSessionDone) {
    return (
      <div className="max-w-[480px] mx-auto text-center py-6 animate-rise">
        <div className="w-16 h-16 rounded-2xl bg-[#E4ECE7] text-[#3F7455] flex items-center justify-center mx-auto mb-4 border border-[#3F7455]/20 shadow-xs">
          <Brain className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8E6C1] text-[#8A5D18] text-xs font-baloo font-bold uppercase tracking-wider mb-3">
          Session Complete
        </div>

        <h3 className="font-fraunces text-2xl sm:text-3xl font-medium text-[#221F1B] mb-2">
          Outstanding Working Memory!
        </h3>
        <p className="text-sm text-[#665F51] mb-6 max-w-[420px] mx-auto leading-relaxed">
          You recalled forward and reverse digit sequences up to 5 digits with calmness and concentration.
        </p>

        <button
          type="button"
          onClick={handleRestart}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-sm hover:bg-[#152B26] transition-colors cursor-pointer mx-auto shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Play Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[400px] mx-auto text-center">
      {/* Header Level & Mode */}
      <div className="flex items-center justify-between mb-4 text-xs font-baloo font-bold text-[#665F51]">
        <span>Level {level} of 6</span>
        <span
          className={`px-2.5 py-0.5 rounded-full ${
            isReverse ? 'bg-[#F5E1D6] text-[#BD5B3B]' : 'bg-[#E4ECE7] text-[#22403A]'
          }`}
        >
          {isReverse ? 'Reverse Span' : 'Forward Span'} · {digitCount} Digits
        </span>
      </div>

      <div className="bg-[#FBF7EE] border border-[#E6DAB9] rounded-2xl p-3 mb-5">
        <p className="font-baloo font-bold text-sm text-[#22403A]">{gameMessage}</p>
      </div>

      {/* Flashing Number Display Box */}
      <div className="w-full h-32 rounded-3xl bg-[#152B26] border-2 border-[#E2A33D]/30 flex items-center justify-center shadow-md mb-6 relative overflow-hidden">
        {isFlashing ? (
          <span className="font-fraunces text-6xl font-bold text-[#E2A33D] transition-transform duration-150 scale-110">
            {currentDisplayDigit ?? ' '}
          </span>
        ) : isAcceptingInput ? (
          <div className="flex items-center gap-2 tracking-widest font-fraunces text-4xl text-white">
            {Array.from({ length: sequence.length }).map((_, i) => (
              <span
                key={i}
                className={`w-9 h-12 rounded-xl flex items-center justify-center border ${
                  userInput[i]
                    ? 'border-[#E2A33D] text-[#E2A33D] bg-white/10'
                    : 'border-white/20 text-white/30'
                }`}
              >
                {userInput[i] || '—'}
              </span>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleStartRound}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E2A33D] text-[#152B26] font-baloo font-bold text-sm hover:brightness-105 cursor-pointer shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Sequence</span>
          </button>
        )}
      </div>

      {/* Telephone-Style Oversized Numeric Keypad */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={!isAcceptingInput}
            onClick={() => handleKeypadPress(digit)}
            className="h-14 rounded-2xl bg-white border border-[#E6DAB9] text-[#221F1B] font-fraunces font-bold text-2xl hover:border-[#22403A] hover:bg-[#FBF7EE] active:scale-95 transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          disabled={!isAcceptingInput}
          onClick={handleDelete}
          className="h-14 rounded-2xl bg-[#F5E1D6]/60 border border-[#BD5B3B]/30 text-[#BD5B3B] font-baloo font-bold text-xs flex items-center justify-center hover:bg-[#F5E1D6] active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
        >
          <Delete className="w-5 h-5" />
        </button>

        <button
          type="button"
          disabled={!isAcceptingInput}
          onClick={() => handleKeypadPress(0)}
          className="h-14 rounded-2xl bg-white border border-[#E6DAB9] text-[#221F1B] font-fraunces font-bold text-2xl hover:border-[#22403A] hover:bg-[#FBF7EE] active:scale-95 transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
        >
          0
        </button>

        <button
          type="button"
          disabled={!isAcceptingInput || userInput.length !== sequence.length}
          onClick={handleSubmit}
          className="h-14 rounded-2xl bg-[#3F7455] border border-[#3F7455] text-white font-baloo font-bold text-sm flex items-center justify-center gap-1 hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer shadow-xs"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>OK</span>
        </button>
      </div>

      <div className="flex justify-between items-center text-xs">
        <button
          type="button"
          onClick={handleClear}
          disabled={!isAcceptingInput || userInput.length === 0}
          className="font-baloo font-semibold text-[#665F51] hover:text-[#221F1B] disabled:opacity-30 cursor-pointer"
        >
          Clear numbers
        </button>

        <button
          type="button"
          onClick={() => playSequence(sequence)}
          disabled={!isAcceptingInput || sequence.length === 0}
          className="font-baloo font-semibold text-[#22403A] hover:text-[#152B26] disabled:opacity-30 cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Repeat flash</span>
        </button>
      </div>
    </div>
  );
};