import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, RotateCcw, AlertCircle, Volume2 } from 'lucide-react';

interface VoiceNoteRecorderProps {
  initialAudioUrl?: string;
  onAudioChange: (audioUrl?: string) => void;
  maxDurationSeconds?: number;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  initialAudioUrl,
  onAudioChange,
  maxDurationSeconds = 15,
}) => {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [audioUrl, setAudioUrl] = useState<string | undefined>(initialAudioUrl);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setAudioUrl(initialAudioUrl);
    if (initialAudioUrl) {
      setStatus('recorded');
    } else {
      setStatus('idle');
    }
  }, [initialAudioUrl]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('In-browser microphone recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Determine supported mimeType
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
      let selectedMimeType = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMimeType = mime;
          break;
        }
      }

      const recorder = selectedMimeType
        ? new MediaRecorder(stream, { mimeType: selectedMimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }

        const blob = new Blob(audioChunksRef.current, {
          type: selectedMimeType || 'audio/webm',
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setAudioUrl(base64Data);
          setStatus('recorded');
          onAudioChange(base64Data);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start(200);
      setStatus('recording');
      setRecordingSeconds(0);

      // Start elapsed timer
      let elapsed = 0;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        elapsed += 1;
        setRecordingSeconds(elapsed);
        if (elapsed >= maxDurationSeconds) {
          stopRecording();
        }
      }, 1000);
    } catch (err: unknown) {
      console.error('Microphone error:', err);
      setErrorMsg('Microphone access was denied or is unavailable. Please check permissions.');
      setStatus('idle');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePreview = () => {
    if (!audioUrl) return;

    if (isPlayingPreview) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      setIsPlayingPreview(false);
    } else {
      const audio = new Audio(audioUrl);
      previewAudioRef.current = audio;
      setIsPlayingPreview(true);
      audio.onended = () => {
        setIsPlayingPreview(false);
        previewAudioRef.current = null;
      };
      audio.onerror = () => {
        setIsPlayingPreview(false);
        previewAudioRef.current = null;
      };
      audio.play().catch(() => setIsPlayingPreview(false));
    }
  };

  const deleteRecording = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
    setAudioUrl(undefined);
    setStatus('idle');
    setRecordingSeconds(0);
    onAudioChange(undefined);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#FBF7EE] border border-[#E6DAB9] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-baloo font-bold text-[#665F51] flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-[#22403A]" />
          In-Browser Voice Note (Max {maxDurationSeconds}s)
        </label>
        {status === 'recording' && (
          <span className="flex items-center gap-1.5 text-xs font-baloo font-bold text-[#BD5B3B]">
            <span className="w-2 h-2 rounded-full bg-[#BD5B3B] animate-ping" />
            Recording: {formatTime(recordingSeconds)} / {formatTime(maxDurationSeconds)}
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="mb-3 p-2.5 rounded-xl bg-[#F5E1D6] border border-[#BD5B3B]/30 text-xs text-[#BD5B3B] flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {status === 'idle' && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#665F51]">
            Record a personal warm greeting that will play when elder taps their card.
          </p>
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Mic className="w-3.5 h-3.5 text-[#E2A33D]" />
            <span>Record Voice Note</span>
          </button>
        </div>
      )}

      {status === 'recording' && (
        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#BD5B3B]/40">
          <div className="flex items-center gap-2 text-xs font-bold text-[#BD5B3B]">
            <span className="w-3 h-3 rounded-full bg-[#BD5B3B] animate-pulse" />
            <span>Speak now… Audio is being captured</span>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#BD5B3B] text-white font-baloo font-bold text-xs hover:bg-[#9B482E] transition-colors cursor-pointer shrink-0"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Finish Recording</span>
          </button>
        </div>
      )}

      {status === 'recorded' && (
        <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-xl border border-[#E6DAB9]">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={togglePreview}
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                isPlayingPreview
                  ? 'bg-[#E2A33D] text-[#152B26]'
                  : 'bg-[#22403A] text-white hover:bg-[#152B26]'
              }`}
              title={isPlayingPreview ? 'Pause Preview' : 'Play Preview'}
            >
              {isPlayingPreview ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-baloo font-bold text-[#22403A]">
                <Volume2 className="w-3.5 h-3.5 text-[#6FCF97]" />
                <span>Voice Note Ready</span>
              </div>
              <p className="text-[11px] text-[#948C7A]">Recorded audio saved with profile</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-1 p-2 rounded-lg text-xs font-baloo font-bold text-[#665F51] hover:bg-[#FBF7EE] transition-colors cursor-pointer"
              title="Re-record"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Re-record</span>
            </button>
            <button
              type="button"
              onClick={deleteRecording}
              className="p-2 rounded-lg text-[#BD5B3B] hover:bg-[#F5E1D6] transition-colors cursor-pointer"
              title="Delete audio"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
