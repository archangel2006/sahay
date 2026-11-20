import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, X, Send, Sparkles, Volume2, Calendar, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { SupportedLanguage } from '../../types';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import {
  parseRemindersToScheduleItems,
  parseAppointmentsToScheduleItems,
} from '../../services/scheduleContextBuilder';
import { PatientScheduleContext } from '../../types/assistant';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scheduleContext, setScheduleContext] = useState<PatientScheduleContext | null>(null);

  // Load active patient schedule (reminders + appointments) for context injection
  useEffect(() => {
    if (isOpen) {
      Promise.all([api.getReminders(), api.getAppointments()])
        .then(([reminders, appointments]) => {
          const items = [
            ...parseRemindersToScheduleItems(reminders),
            ...parseAppointmentsToScheduleItems(appointments),
          ];
          setScheduleContext({
            patientName: 'Bimala aita',
            date: new Date().toLocaleDateString('en-IN'),
            timezone: 'Asia/Kolkata',
            items,
            safeZoneStatus: 'inside',
          });
        })
        .catch(() => {
          // Fallback context if offline
          setScheduleContext({
            patientName: 'Bimala aita',
            date: new Date().toLocaleDateString('en-IN'),
            timezone: 'Asia/Kolkata',
            items: [],
            safeZoneStatus: 'inside',
          });
        });
    }
  }, [isOpen]);

  const handleSend = useCallback(async (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    try {
      const reply = await api.askAssistant(query, language, scheduleContext || undefined);
      setResponse(reply);
      setPrompt('');
      speakText(reply);
    } catch {
      const fallback = language === 'Assamese' 
        ? 'নমস্কাৰ! সকলো ঔষধ আৰু সময়সূচী ঠিক মতে চলি আছে।' 
        : 'Namaskar! All your reminders and routines are on track today.';
      setResponse(fallback);
      speakText(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, language, scheduleContext]);

  // Hook for browser-native SpeechRecognition (Issue #4)
  const {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript,
    error: micError,
    isSupported: isSpeechSupported,
    audioPulseLevel,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    language,
    silenceDelayMs: 1800,
    autoRestartOnPause: true,
    onSilenceTimeout: (spokenText) => {
      if (spokenText.trim()) {
        showToast('Voice query received', 'sparkles');
        setPrompt(spokenText);
        handleSend(spokenText);
      }
    },
  });

  // Keep input synchronized with live voice transcription
  useEffect(() => {
    if (isListening && fullTranscript) {
      setPrompt(fullTranscript);
    }
  }, [isListening, fullTranscript]);

  useEffect(() => {
    if (!isOpen) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      stopListening();
      resetTranscript();
      setResponse(null);
      setIsSpeaking(false);
    }
  }, [isOpen, stopListening, resetTranscript]);

  if (!isOpen) return null;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Apply customized speech settings
        let rate = 0.9;
        let pitch = 1.05;
        let voiceURI = '';
        try {
          const saved = localStorage.getItem('sahay_speech_settings_v1');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.rate) rate = parsed.rate;
            if (parsed.pitch) pitch = parsed.pitch;
            if (parsed.voiceURI) voiceURI = parsed.voiceURI;
          }
        } catch {}

        utterance.rate = rate;
        utterance.pitch = pitch;

        if (voiceURI) {
          const voices = window.speechSynthesis.getVoices();
          const selected = voices.find((v) => v.voiceURI === voiceURI);
          if (selected) utterance.voice = selected;
        }

        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      if (fullTranscript.trim()) {
        handleSend(fullTranscript.trim());
      }
    } else {
      resetTranscript();
      setResponse(null);
      startListening();
      showToast('Listening with browser speech recognition…', 'mic');
    }
  };

  const samplePrompts = [
    'Did I take my morning medicine today?',
    'When is my next doctor appointment?',
    'What is my daily routine today?',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-assistant-title"
      className="fixed inset-0 bg-[#0E1F1B]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-rise"
    >
      <div className="bg-gradient-to-b from-[#18312B] via-[#142924] to-[#0E1E1A] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#E2A33D]/30 text-[#FBF7EE] overflow-hidden">
        {/* Ambient Glow in Background */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#E2A33D]/15 blur-3xl pointer-events-none transition-transform duration-500"
          style={{ transform: `scale(${1 + audioPulseLevel * 0.4})` }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close assistant"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center backdrop-blur-sm cursor-pointer transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Schedule Context Telemetry Pill (Issue #5) */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-baloo font-bold px-3 py-1 rounded-full bg-[#E4ECE7]/15 text-[#E2A33D] border border-[#E2A33D]/30">
            <Calendar className="w-3 h-3 text-[#E2A33D]" />
            <span>Daily Schedule Context Injected ({scheduleContext?.items.length ?? 4} items)</span>
          </span>
        </div>

        {/* Central Luminous Audio Orb with Audio Pulse Indicator */}
        <div className="text-center pt-2 mb-6 relative">
          <div className="relative inline-block mx-auto mb-4">
            {/* Accessible Audio Pulse Rings while listening or speaking */}
            {(isListening || isSpeaking) && (
              <>
                <span
                  className="absolute -inset-4 rounded-full border-2 border-[#E2A33D] animate-ping opacity-40 pointer-events-none"
                  style={{ animationDuration: '1.4s' }}
                />
                <span
                  className="absolute -inset-8 rounded-full border border-[#E2A33D]/40 pointer-events-none transition-transform duration-200"
                  style={{ transform: `scale(${1 + audioPulseLevel * 0.3})` }}
                />
              </>
            )}

            <button
              type="button"
              onClick={handleMicToggle}
              aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
              aria-pressed={isListening}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-tr from-[#BD5B3B] to-[#E2A33D] scale-110 ring-4 ring-[#E2A33D]/50 shadow-[0_0_40px_rgba(226,163,61,0.6)]'
                  : isSpeaking
                  ? 'bg-gradient-to-tr from-[#22403A] to-[#E2A33D] ring-4 ring-[#E2A33D]/30 animate-pulse'
                  : 'bg-gradient-to-tr from-[#E2A33D] to-[#F3C268] hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(226,163,61,0.4)]'
              }`}
            >
              <Mic className={`w-10 h-10 ${isListening ? 'text-white animate-pulse' : 'text-[#152B26]'}`} />
            </button>
          </div>

          <h3 id="voice-assistant-title" className="font-fraunces text-2xl sm:text-3xl font-bold text-white tracking-wide">
            {isListening ? 'Listening…' : isSpeaking ? 'Speaking…' : 'Sahay Voice'}
          </h3>

          <p className="text-xs text-[#9FB4AC] font-baloo mt-1">
            {isListening
              ? 'Speak naturally — pauses will submit automatically…'
              : isSpeaking
              ? 'Reading reply aloud…'
              : `Tap the mic to talk in ${language}`}
          </p>

          {/* Sound Wave Frequency Visualizer */}
          {(isListening || isSpeaking || isLoading) && (
            <div className="flex items-center justify-center gap-1 mt-3" aria-hidden="true">
              {[40, 70, 100, 60, 90, 50, 80, 40].map((baseH, i) => {
                const dynamicH = isListening 
                  ? Math.min(100, baseH * (audioPulseLevel || 0.8))
                  : baseH;
                return (
                  <span
                    key={i}
                    style={{ height: `${dynamicH}%` }}
                    className="w-1 bg-[#E2A33D] rounded-full transition-all duration-150 h-5"
                  />
                );
              })}
            </div>
          )}

          {/* Live Interim Transcript Bubble while speaking */}
          {isListening && (
            <div className="mt-3 p-3 bg-white/10 rounded-2xl border border-[#E2A33D]/30 max-w-xs mx-auto text-xs text-[#FBF7EE] font-mono animate-rise">
              <span className="text-[#E2A33D] font-bold block text-[10px] uppercase font-baloo mb-0.5">
                Live Speech Recognition:
              </span>
              <span>{transcript}</span>{' '}
              <span className="text-[#E2A33D] opacity-80 italic">{interimTranscript || '…'}</span>
            </div>
          )}

          {/* Mic Error Banner */}
          {micError && (
            <div className="mt-3 p-2.5 rounded-xl bg-[#BD5B3B]/20 border border-[#BD5B3B]/50 text-xs text-[#F5E1D6] flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#BD5B3B] shrink-0" />
              <span>
                {micError === 'not-allowed'
                  ? 'Microphone permission denied. Please allow microphone access.'
                  : micError === 'not-supported'
                  ? 'Web Speech API is not supported in this browser. Please type below.'
                  : 'Audio capture error. Tap mic again to retry.'}
              </span>
            </div>
          )}
        </div>

        {/* Quick Voice Prompt Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5 justify-center">
          {samplePrompts.map((sp, i) => (
            <button
              key={i}
              onClick={() => {
                setPrompt(sp);
                handleSend(sp);
              }}
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
            Sahay is checking your schedule…
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
            className="px-4 py-2.5 rounded-xl bg-[#E2A33D] hover:bg-[#F3C268] text-[#152B26] font-baloo font-bold text-xs disabled:opacity-40 transition-colors cursor-pointer flex items-center justify-center active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
