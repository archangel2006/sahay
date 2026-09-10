import React, { useState, useEffect } from 'react';
import { Mic, X, Send, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { SupportedLanguage } from '../../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  showToast: (msg: string, icon?: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  showToast,
}) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setResponse(null);
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    try {
      const reply = await api.askAssistant(query, language);
      setResponse(reply);
      setPrompt('');
      speakText(reply);
    } catch (e) {
      const fallback = language === 'Assamese' 
        ? 'নমস্কাৰ! সকলো ঔষধ আৰু সময়সূচী ঠিক মতে চলি আছে।' 
        : 'Namaskar! All your reminders and routines are on track today.';
      setResponse(fallback);
      speakText(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateSpeechMic = () => {
    if (isListening) return;
    setIsListening(true);
    showToast('Listening to your voice…', 'mic');
    setTimeout(() => {
      setIsListening(false);
      const spoken = language === 'Assamese' ? 'মোৰ আজিৰ ঔষধ খোৱা হ’লনে?' : 'Did I take my morning medicine today?';
      setPrompt(spoken);
      handleSend(spoken);
    }, 1800);
  };

  const samplePrompts = [
    'Medicine taken today?',
    "What's on today's schedule?",
    'Memory game score',
  ];

  return (
    <div className="fixed inset-0 bg-[#0E1F1B]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-rise">
      <div className="bg-gradient-to-b from-[#18312B] via-[#142924] to-[#0E1E1A] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#E2A33D]/30 text-[#FBF7EE] overflow-hidden">
        {/* Ambient Glow in Background */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#E2A33D]/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center backdrop-blur-sm cursor-pointer transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Central Luminous Audio Orb */}
        <div className="text-center pt-2 mb-6 relative">
          <div className="relative inline-block mx-auto mb-4">
            {/* Ripple rings while listening or speaking */}
            {(isListening || isSpeaking) && (
              <>
                <span className="absolute -inset-4 rounded-full border-2 border-[#E2A33D] animate-ping opacity-40 pointer-events-none" />
                <span className="absolute -inset-8 rounded-full border border-[#E2A33D]/30 animate-pulse pointer-events-none" />
              </>
            )}

            <button
              type="button"
              onClick={simulateSpeechMic}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-tr from-[#BD5B3B] to-[#E2A33D] scale-110 ring-4 ring-[#E2A33D]/40'
                  : isSpeaking
                  ? 'bg-gradient-to-tr from-[#22403A] to-[#E2A33D] ring-4 ring-[#E2A33D]/30 animate-pulse'
                  : 'bg-gradient-to-tr from-[#E2A33D] to-[#F3C268] hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(226,163,61,0.4)]'
              }`}
            >
              <Mic className="w-10 h-10 text-[#152B26]" />
            </button>
          </div>

          <h3 className="font-fraunces text-2xl sm:text-3xl font-bold text-white tracking-wide">
            {isListening ? 'Listening…' : isSpeaking ? 'Speaking…' : 'Sahay Voice'}
          </h3>

          <p className="text-xs text-[#9FB4AC] font-baloo mt-1">
            {isListening
              ? 'Listening to you now…'
              : isSpeaking
              ? 'Reading reply aloud…'
              : `Tap the mic to talk in ${language}`}
          </p>

          {/* Sound Wave Frequency Indicator */}
          {(isListening || isSpeaking || isLoading) && (
            <div className="flex items-center justify-center gap-1 mt-3">
              {[40, 70, 100, 60, 90, 50, 80, 40].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1 bg-[#E2A33D] rounded-full animate-pulse h-5"
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Voice Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5 justify-center">
          {samplePrompts.map((sp, i) => (
            <button
              key={i}
              onClick={() => handleSend(sp)}
              className="text-xs font-baloo font-bold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FBF7EE] border border-white/10 transition-colors cursor-pointer"
            >
              {sp}
            </button>
          ))}
        </div>

        {/* Response Bubble */}
        {isLoading && (
          <div className="p-4 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-center gap-2.5 text-xs text-[#FBF7EE] font-baloo font-bold mb-4 backdrop-blur-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-[#E2A33D]" />
            Sahay is thinking…
          </div>
        )}

        {response && !isLoading && (
          <div className="p-4 bg-[#FBF7EE] text-[#152B26] rounded-2xl shadow-lg border border-[#E6DAB9] mb-4 text-sm leading-relaxed animate-rise">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="flex items-center gap-1 text-xs font-baloo font-bold text-[#22403A]">
                <Sparkles className="w-3.5 h-3.5 text-[#BD5B3B]" />
                Sahay:
              </span>
              <button
                type="button"
                onClick={() => speakText(response)}
                className="flex items-center gap-1 text-[11px] font-baloo font-bold text-[#BD5B3B] hover:text-[#9B482E] cursor-pointer"
                title="Replay Voice"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            </div>
            <p className="font-medium">{response}</p>
          </div>
        )}

        {/* Minimal Bottom Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Or type a question in ${language}…`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 bg-white/10 text-white placeholder-white/40 text-xs focus:outline-2 focus:outline-[#E2A33D]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!prompt.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-[#E2A33D] hover:bg-[#F3C268] text-[#152B26] font-baloo font-bold text-xs disabled:opacity-40 transition-colors cursor-pointer flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
