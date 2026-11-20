import { useState, useEffect, useRef, useCallback } from 'react';
import { SupportedLanguage } from '../types';

// Web Speech API interface declarations for cross-browser safety
interface IWindowSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

export type VoiceRecognitionError = 
  | 'not-allowed'
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'not-supported'
  | 'unknown';

interface UseVoiceRecognitionOptions {
  language?: SupportedLanguage;
  onSilenceTimeout?: (finalTranscript: string) => void;
  silenceDelayMs?: number;
  autoRestartOnPause?: boolean;
}

export function mapLanguageToLocale(lang?: SupportedLanguage | string): string {
  switch (lang) {
    case 'Assamese':
      return 'as-IN';
    case 'English':
      return 'en-IN';
    case 'Hindi':
      return 'hi-IN';
    case 'Bengali':
      return 'bn-IN';
    default:
      return 'en-IN';
  }
}

export function useVoiceRecognition(options: UseVoiceRecognitionOptions = {}) {
  const {
    language = 'English',
    onSilenceTimeout,
    silenceDelayMs = 1800,
    autoRestartOnPause = true,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<VoiceRecognitionError | null>(null);
  const [isSpeakingDetected, setIsSpeakingDetected] = useState(false);
  const [audioPulseLevel, setAudioPulseLevel] = useState<number>(0);

  const recognitionRef = useRef<IWindowSpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldBeListeningRef = useRef(false);
  const latestTranscriptRef = useRef('');

  // Check if Web Speech API is supported
  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const startPulseAnimation = () => {
    if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    pulseIntervalRef.current = setInterval(() => {
      // Gentle pseudo-volume pulse for elder audio accessibility visualizer
      const randomPulse = Math.random() * 0.4 + 0.6;
      setAudioPulseLevel(parseFloat(randomPulse.toFixed(2)));
    }, 200);
  };

  const stopPulseAnimation = () => {
    if (pulseIntervalRef.current) {
      clearInterval(pulseIntervalRef.current);
      pulseIntervalRef.current = null;
    }
    setAudioPulseLevel(0);
  };

  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false;
    clearSilenceTimer();
    stopPulseAnimation();
    setIsSpeakingDetected(false);
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition might have already stopped
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('not-supported');
      return;
    }

    // Reset transcripts and error state
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    latestTranscriptRef.current = '';
    shouldBeListeningRef.current = true;

    try {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition: IWindowSpeechRecognition = new SpeechRecognitionConstructor();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = mapLanguageToLocale(language);

      recognition.onstart = () => {
        setIsListening(true);
        startPulseAnimation();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        clearSilenceTimer();
        setIsSpeakingDetected(true);

        let finalPart = '';
        let interimPart = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalPart += res[0].transcript;
          } else {
            interimPart += res[0].transcript;
          }
        }

        if (finalPart) {
          setTranscript((prev) => {
            const updated = `${prev} ${finalPart}`.trim();
            latestTranscriptRef.current = updated;
            return updated;
          });
        }

        setInterimTranscript(interimPart);
        if (interimPart) {
          latestTranscriptRef.current = `${transcript} ${interimPart}`.trim();
        }

        // Set silence timer to automatically complete query upon conversational pause
        silenceTimerRef.current = setTimeout(() => {
          setIsSpeakingDetected(false);
          const fullQuery = latestTranscriptRef.current.trim();
          if (fullQuery && onSilenceTimeout) {
            onSilenceTimeout(fullQuery);
            stopListening();
          }
        }, silenceDelayMs);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const errType = event.error;
        if (errType === 'not-allowed') {
          setError('not-allowed');
          stopListening();
        } else if (errType === 'no-speech') {
          // If no speech is caught in this window, handle gracefully without crashing
          setIsSpeakingDetected(false);
        } else if (errType === 'audio-capture') {
          setError('audio-capture');
          stopListening();
        } else if (errType === 'network') {
          setError('network');
        } else {
          setError('unknown');
        }
      };

      recognition.onend = () => {
        // Auto-restart if user intends to stay in listening mode (e.g. conversational pause)
        if (shouldBeListeningRef.current && autoRestartOnPause) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
            stopPulseAnimation();
          }
        } else {
          setIsListening(false);
          stopPulseAnimation();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setError('unknown');
      setIsListening(false);
      stopPulseAnimation();
    }
  }, [isSupported, language, onSilenceTimeout, silenceDelayMs, autoRestartOnPause, stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldBeListeningRef.current = false;
      clearSilenceTimer();
      stopPulseAnimation();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort errors on unmount
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript: `${transcript} ${interimTranscript}`.trim(),
    error,
    isSupported,
    isSpeakingDetected,
    audioPulseLevel,
    startListening,
    stopListening,
    resetTranscript: () => {
      setTranscript('');
      setInterimTranscript('');
      latestTranscriptRef.current = '';
    },
  };
}
