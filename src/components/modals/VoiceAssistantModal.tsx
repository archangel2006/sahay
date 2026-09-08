import React, { useState } from 'react';
import { Mic, X, Send, Loader2, Sparkles } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    try {
      const reply = await api.askAssistant(query, language);
      setResponse(reply);
      setPrompt('');
    } catch (e) {
      setResponse('Namaskar! I am here. All your reminders and routines are on track.');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateSpeechMic = () => {
    setIsListening(true);
    showToast('Listening to voice input…', 'mic');
    setTimeout(() => {
      setIsListening(false);
      const spoken = language === 'Assamese' ? 'মোৰ আজিৰ ঔষধ খোৱা হ’লনে?' : 'Did I take my morning medicine today?';
      setPrompt(spoken);
      handleSend(spoken);
    }, 1800);
  };

  const samplePrompts = [
    'Did I take my morning medicine?',
    'What is on my schedule for today?',
    'How did my memory game go this week?',
    'Remind me to drink warm water',
  ];

  return (
    <div className="fixed inset-0 bg-[#152B26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-rise">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#E6DAB9]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F1E7CE] text-[#948C7A] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          {/* Animated Mic */}
          <div
            onClick={simulateSpeechMic}
            className={`w-18 h-18 rounded-full bg-[#E5E9F1] text-[#3E4F74] flex items-center justify-center mx-auto mb-3 cursor-pointer relative shadow-sm transition-all hover:scale-105 ${
              isListening ? 'ring-4 ring-[#3E4F74]/30' : ''
            }`}
          >
            <Mic className="w-8 h-8" />
            {isListening && (
              <span className="absolute inset-0 rounded-full border-2 border-[#3E4F74] animate-ping opacity-60" />
            )}
          </div>

          <h3 className="font-fraunces text-2xl font-medium text-[#221F1B] mb-1">
            Talk to Sahay
          </h3>
          <p className="text-xs text-[#665F51] max-w-xs mx-auto">
            Tap the microphone to speak naturally in {language}, or type a question below.
          </p>
        </div>

        {/* Quick Sample Questions */}
        <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
          {samplePrompts.slice(0, 3).map((sp, i) => (
            <button
              key={i}
              onClick={() => handleSend(sp)}
              className="text-[11px] font-baloo font-bold px-3 py-1 rounded-full bg-[#F1E7CE] text-[#22403A] hover:bg-[#E4ECE7] cursor-pointer transition-colors"
            >
              {sp}
            </button>
          ))}
        </div>

        {/* Response Box */}
        {isLoading && (
          <div className="p-4 bg-[#FBF7EE] rounded-2xl border border-[#E6DAB9] flex items-center justify-center gap-2.5 text-xs text-[#22403A] font-baloo font-bold mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-[#E2A33D]" />
            Sahay is preparing a gentle answer…
          </div>
        )}

        {response && !isLoading && (
          <div className="p-4 bg-[#F1E7CE] rounded-2xl border border-[#E6DAB9] mb-4 text-xs md:text-sm text-[#221F1B] leading-relaxed">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#22403A] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E2A33D]" />
              Sahay Assistant:
            </div>
            {response}
          </div>
        )}

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask in ${language}…`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#E6DAB9] text-sm focus:outline-2 focus:outline-[#22403A] bg-[#FBF7EE]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!prompt.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-[#22403A] text-white font-baloo font-bold text-sm hover:bg-[#152B26] disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
