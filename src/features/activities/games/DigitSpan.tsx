import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowRight, CheckCircle2, Volume2, Sparkles, Delete, HelpCircle } from 'lucide-react';

interface DigitSpanProps {
  onSessionComplete?: (stats: { moves: number; accuracy: number }) => void;
  showToast: (msg: string, icon?: string) => void;
}

type GamePhase = 'intro' | 'showing' | 'input' | 'feedback' | 'complete';

export const DigitSpan: React.FC<DigitSpanProps> = ({ onSessionComplete, showToast }) => {
  const [level, setLevel] = useState<number>(1);
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentDigitIndex, setCurrentDigitIndex] = useState<number>(-1);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);

  // Audio Context for gentle elder-friendly chime
  const audioCtxRef = useRef<AudioContext | null>(null);

  const isReverseMode = level >= 4;
  const sequenceLength = isReverseMode ? level - 1 : level + 2; // Level 1: 3, Level 2: 4, Level 3: 5, Level 4: 3 reverse, etc.

  const playTone = (freq = 440) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio not supported or blocked
    }
  };

  const generateSequence = (len: number): number[] => {
    const digits: number[] = [];
    for (let i = 0; i < len; i++) {
      let d = Math.floor(Math.random() * 9) + 1; // 1 to 9
      while (i > 0 && d === digits[i - 1]) {
        d = Math.floor(Math.random() * 9) + 1;
      }
      digits.push(d);
    }
    return digits;
  };

  const startRound = (targetLevel?: number) => {
    const activeLevel = targetLevel ?? level;
    const isRev = activeLevel >= 4;
    const len = isRev ? activeLevel - 1 : activeLevel + 2;
    const newSeq = generateSequence(len);
    setSequence(newSeq);
    setUserInput([]);
    setIsCorrect(null);
    setCurrentDigitIndex(0);
    setPhase('showing');
  };

  const retryRound = () => {
    setUserInput([]);
    setIsCorrect(null);
    setCurrentDigitIndex(0);
    setPhase('showing');
  };

  // Showing numbers one by one
  useEffect(() => {
    if (phase !== 'showing') return;

    if (currentDigitIndex < sequence.length) {
      playTone(400 + sequence[currentDigitIndex] * 40);
      const timer = setTimeout(() => {
        setCurrentDigitIndex((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      // Done showing, transition to input
      const timer = setTimeout(() => {
        setPhase('input');
        setCurrentDigitIndex(-1);
        playTone(600);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, currentDigitIndex, sequence]);

  const handleKeyPress = (digit: number) => {
    if (phase !== 'input') return;
    if (userInput.length >= sequence.length) return;

    playTone(350 + digit * 30);
    const updated = [...userInput, digit];
    setUserInput(updated);
  };

  const handleBackspace = () => {
    if (phase !== 'input' || userInput.length === 0) return;
    setUserInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (phase !== 'input') return;
    setUserInput([]);
  };

  const handleSubmit = () => {
    if (phase !== 'input') return;
    if (userInput.length !== sequence.length) {
      showToast(`Please enter all ${sequence.length} numbers`, 'alert');
      return;
    }

    const expected = isReverseMode ? [...sequence].reverse() : sequence;
    const correct = userInput.every((val, idx) => val === expected[idx]);

    setIsCorrect(correct);
    setPhase('feedback');
    setRoundsPlayed((prev) => prev + 1);

    if (correct) {
      playTone(660);
      setScore((prev) => prev + 1);
      showToast('Wonderful memory! Correct sequence.', 'check');
    } else {
      playTone(280);
      showToast('Gentle try! Memory takes steady practice.', 'info');
    }
  };

  const handleNextRound = () => {
    if (!isCorrect) return;

    if (level < 6) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      startRound(nextLevel);
    } else {
      // Complete full 6-level session
      finishSession();
    }
  };

  const finishSession = () => {
    setPhase('complete');
    const accuracy = Math.round(((score + (isCorrect ? 1 : 0)) / Math.max(1, roundsPlayed + 1)) * 100);
    if (onSessionComplete) {
      onSessionComplete({ moves: roundsPlayed + 1, accuracy });
    }
    showToast(`Session completed! ${accuracy}% memory retention.`, 'check');
  };

  return (
    <div className="max-w-[460px] mx-auto text-center animate-rise">
      {/* Intro Phase */}
      {phase === 'intro' && (
        <div className="py-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#E4ECE7] text-[#22403A] flex items-center justify-center mx-auto border border-[#E6DAB9]">
            <Sparkles className="w-8 h-8 text-[#22403A]" />
          </div>

          <h3 className="font-fraunces text-2xl text-[#221F1B]">Number Recall (Digit Span)</h3>
          <p className="text-xs text-[#575246] leading-relaxed max-w-sm mx-auto">
            Gentle working-memory stimulation used in geriatric cognitive care. Watch the numbers flash one-by-one, remember their order, and tap them on the pad.
          </p>

          <div className="bg-[#FBF7EE] p-4 rounded-2xl border border-[#E6DAB9] text-left text-xs space-y-2">
            <div className="flex items-center gap-2 font-baloo font-bold text-[#22403A]">
              <HelpCircle className="w-4 h-4 text-[#E2A33D]" />
              <span>How it works:</span>
            </div>
            <p className="text-[#575246]">
              • <strong>Levels 1–3 (Forward Span)</strong>: Recall numbers in the exact order shown.
            </p>
            <p className="text-[#575246]">
              • <strong>Levels 4–6 (Reverse Span)</strong>: Recall numbers in reverse (backwards) order.
            </p>
            <p className="text-[#575246]">• Take all the time you need. No stressful countdown timers.</p>
          </div>

          <button
            onClick={() => startRound(1)}
            className="w-full py-3.5 rounded-2xl bg-[#22403A] text-white font-baloo font-bold text-sm hover:brightness-110 cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            <span>Begin Exercise · Level 1</span>
          </button>
        </div>
      )}

      {/* Showing Numbers Phase */}
      {phase === 'showing' && (
        <div className="py-10 space-y-4">
          <div className="text-xs font-baloo font-bold text-[#665F51] uppercase tracking-wider">
            {isReverseMode ? 'Reverse Span (Remember Backwards)' : 'Forward Span'} · Level {level}
          </div>

          <div className="h-32 flex items-center justify-center">
            {currentDigitIndex < sequence.length ? (
              <div
                key={currentDigitIndex}
                className="w-28 h-28 rounded-3xl bg-[#FBF7EE] border-2 border-[#E2A33D] text-[#22403A] font-fraunces font-bold text-6xl flex items-center justify-center shadow-lg animate-rise"
              >
                {sequence[currentDigitIndex]}
              </div>
            ) : (
              <div className="text-sm font-baloo font-bold text-[#22403A]">Get ready to enter sequence…</div>
            )}
          </div>

          <p className="text-xs text-[#575246]">
            Showing digit {currentDigitIndex + 1} of {sequence.length}
          </p>
        </div>
      )}

      {/* Input Phase */}
      {phase === 'input' && (
        <div className="py-4 space-y-4">
          <div className="text-xs font-baloo font-bold text-[#22403A]">
            {isReverseMode ? 'Enter the numbers in REVERSE order:' : 'Enter the numbers in FORWARD order:'}
          </div>

          {/* User Input Slots */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {Array.from({ length: sequence.length }).map((_, i) => (
              <div
                key={i}
                className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center font-fraunces font-bold text-2xl transition-all ${
                  userInput[i] !== undefined
                    ? 'border-[#22403A] bg-white text-[#221F1B] shadow-xs'
                    : i === userInput.length
                    ? 'border-[#E2A33D] bg-[#FBF7EE] animate-pulse'
                    : 'border-[#E6DAB9] bg-[#FBF7EE]/60 text-transparent'
                }`}
              >
                {userInput[i] !== undefined ? userInput[i] : '•'}
              </div>
            ))}
          </div>

          {/* Large Telephone-Style Numeric Pad (Elder Friendly) */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="h-14 rounded-2xl bg-white border border-[#E6DAB9] text-[#221F1B] font-fraunces font-bold text-2xl hover:bg-[#F1E7CE] hover:border-[#22403A] active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-14 rounded-2xl bg-[#FBF7EE] border border-[#E6DAB9] text-[#575246] font-baloo font-bold text-xs hover:bg-[#F1E7CE] cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress(0)}
              className="h-14 rounded-2xl bg-white border border-[#E6DAB9] text-[#221F1B] font-fraunces font-bold text-2xl hover:bg-[#F1E7CE] hover:border-[#22403A] active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              aria-label="Backspace"
              className="h-14 rounded-2xl bg-[#FBF7EE] border border-[#E6DAB9] text-[#575246] hover:bg-[#F1E7CE] flex items-center justify-center cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={userInput.length !== sequence.length}
              className={`w-full max-w-[280px] mx-auto py-3 rounded-xl font-baloo font-bold text-sm shadow-sm transition-all cursor-pointer ${
                userInput.length === sequence.length
                  ? 'bg-[#22403A] text-white hover:brightness-110'
                  : 'bg-[#E6DAB9] text-[#948C7A] cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          </div>
        </div>
      )}

      {/* Feedback Phase */}
      {phase === 'feedback' && (
        <div className="py-6 space-y-4 animate-rise">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border ${
              isCorrect ? 'bg-[#E4ECE7] text-[#22403A] border-[#6FCF97]' : 'bg-[#F8E6C1] text-[#8A5D18] border-[#E2A33D]'
            }`}
          >
            {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
          </div>

          <h3 className="font-fraunces text-2xl text-[#221F1B]">
            {isCorrect ? 'Splendid Recall!' : 'Good Effort!'}
          </h3>

          <p className="text-xs text-[#575246] max-w-sm mx-auto">
            {isCorrect
              ? `You correctly recalled the sequence of ${sequence.length} digits ${isReverseMode ? 'in reverse order' : ''}.`
              : `The sequence was ${sequence.join(' – ')} ${isReverseMode ? `(Reverse: ${[...sequence].reverse().join(' – ')})` : ''}. Every practice round stimulates neuroplasticity.`}
          </p>

          <div className="flex gap-2 max-w-[280px] mx-auto">
            {!isCorrect ? (
              <button
                type="button"
                onClick={retryRound}
                className="w-full py-2.5 rounded-xl bg-[#22403A] text-white font-baloo font-bold text-xs hover:brightness-110 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={retryRound}
                  className="flex-1 py-2.5 rounded-xl border border-[#E6DAB9] font-baloo font-bold text-xs text-[#221F1B] hover:bg-[#F1E7CE] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextRound}
                  className="flex-1 py-2.5 rounded-xl bg-[#22403A] text-white font-baloo font-bold text-xs hover:brightness-110 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>{level < 6 ? 'Next Level' : 'Finish Session'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Complete Phase */}
      {phase === 'complete' && (
        <div className="py-6 space-y-4 animate-rise">
          <div className="w-16 h-16 rounded-full bg-[#E4ECE7] text-[#22403A] flex items-center justify-center mx-auto border border-[#6FCF97]">
            <CheckCircle2 className="w-8 h-8 text-[#22403A]" />
          </div>

          <h3 className="font-fraunces text-2xl text-[#221F1B]">Exercise Complete!</h3>
          <p className="text-xs text-[#575246] max-w-sm mx-auto leading-relaxed">
            Excellent working-memory stimulation session. Daily digit span exercise strengthens executive attention and verbal working memory.
          </p>

          <div className="bg-[#FBF7EE] p-4 rounded-2xl border border-[#E6DAB9] text-xs max-w-xs mx-auto space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#665F51]">Completed Levels:</span>
              <span className="font-bold text-[#221F1B]">1 through {level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#665F51]">Total Rounds:</span>
              <span className="font-bold text-[#221F1B]">{roundsPlayed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#665F51]">Memory Score:</span>
              <span className="font-bold text-[#22403A]">{score} correct</span>
            </div>
          </div>

          <button
            onClick={() => {
              setLevel(1);
              setScore(0);
              setRoundsPlayed(0);
              setPhase('intro');
            }}
            className="px-6 py-2.5 rounded-xl bg-[#22403A] text-white font-baloo font-bold text-xs hover:brightness-110 cursor-pointer"
          >
            Play Another Session
          </button>
        </div>
      )}
    </div>
  );
};
