import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Trash2, Volume2, AlertCircle, Check } from 'lucide-react';

interface VoiceNoteRecorderProps {
  value?: string; // base64 data URI or blob URL
  onChange: (audioUrl: string | undefined) => void;
  maxDurationSeconds?: number;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  value,
  onChange,
  maxDurationSeconds = 15,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio & timers on unmount
  useEffect(() => {
    return () => {
      cleanupStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];
    setDuration(0);

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setError('Audio recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Determine supported mimeType
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        cleanupStream();
        if (audioChunksRef.current.length > 0) {
          const mime = recorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mime });

          // Convert to base64 Data URI so it persists in storage
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            onChange(base64data);
          };
          reader.readAsDataURL(audioBlob);
        }
      };

      recorder.start(200); // 200ms time slice
      setIsRecording(true);
      setIsPaused(false);

      // Start elapsed timer
      let currentSeconds = 0;
      timerIntervalRef.current = window.setInterval(() => {
        currentSeconds += 0.5;
        setDuration(Math.min(currentSeconds, maxDurationSeconds));

        if (currentSeconds >= maxDurationSeconds) {
          stopRecording();
        }
      }, 500);
    } catch (err: any) {
      cleanupStream();
      setIsRecording(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access was denied. Please allow microphone permissions in browser.');
      } else {
        setError('Could not access microphone: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      if (mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
        setIsPaused(false);

        let currentSeconds = duration;
        timerIntervalRef.current = window.setInterval(() => {
          currentSeconds += 0.5;
          setDuration(Math.min(currentSeconds, maxDurationSeconds));
          if (currentSeconds >= maxDurationSeconds) {
            stopRecording();
          }
        }, 500);
      }
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const togglePreview = () => {
    if (!value) return;

    if (isPlayingPreview && previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
      return;
    }

    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(value);
      previewAudioRef.current.onended = () => {
        setIsPlayingPreview(false);
        setPreviewProgress(0);
      };
      previewAudioRef.current.ontimeupdate = () => {
        if (previewAudioRef.current && previewAudioRef.current.duration) {
          setPreviewProgress(
            (previewAudioRef.current.currentTime / previewAudioRef.current.duration) * 100
          );
        }
      };
    } else {
      previewAudioRef.current.src = value;
    }

    previewAudioRef.current
      .play()
      .then(() => setIsPlayingPreview(true))
      .catch((err) => {
        setError('Failed to play preview: ' + err.message);
        setIsPlayingPreview(false);
      });
  };

  const handleDiscard = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
      previewAudioRef.current = null;
    }
    setDuration(0);
    setPreviewProgress(0);
    onChange(undefined);
  };

  const formatSeconds = (sec: number) => {
    const s = Math.floor(sec);
    const ms = Math.floor((sec - s) * 10);
    return `00:${s < 10 ? '0' : ''}${s}.${ms}`;
  };

  return (
    <div className="bg-[#FBF7EE] border border-[#E6DAB9] rounded-2xl p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-baloo font-bold text-[#665F51] uppercase tracking-wider flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-[#BD5B3B]" />
          <span>Real Voice Note (15s Max)</span>
        </label>
        {value && !isRecording && (
          <span className="inline-flex items-center gap-1 text-[11px] font-baloo font-bold text-[#3F7455] bg-[#E4ECE7] px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" /> Voice Saved
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STATE 1: RECORDING IN PROGRESS */}
      {isRecording ? (
        <div className="space-y-2.5 bg-white p-3 rounded-xl border border-[#BD5B3B]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full bg-[#BD5B3B] ${isPaused ? 'opacity-50' : 'animate-ping'}`} />
              <span className="font-baloo font-bold text-xs text-[#BD5B3B]">
                {isPaused ? 'Paused' : 'Recording Voice Greeting…'}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-[#221F1B]">
              {formatSeconds(duration)} / 00:{maxDurationSeconds}.0
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[#E6DAB9]/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#BD5B3B] transition-all duration-300"
              style={{ width: `${(duration / maxDurationSeconds) * 100}%` }}
            />
          </div>

          {/* Recording Control Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            {isPaused ? (
              <button
                type="button"
                onClick={resumeRecording}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Resume
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseRecording}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1E7CE] text-[#665F51] font-baloo font-bold text-xs hover:bg-[#E6DAB9] cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" /> Pause
              </button>
            )}

            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#BD5B3B] text-white font-baloo font-bold text-xs hover:bg-[#9B482E] cursor-pointer shadow-xs"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Done
            </button>
          </div>
        </div>
      ) : value ? (
        /* STATE 2: RECORDED VOICE NOTE READY FOR PREVIEW */
        <div className="bg-white p-3 rounded-xl border border-[#E6DAB9] space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={togglePreview}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#22403A] text-[#FBF7EE] font-baloo font-bold text-xs hover:bg-[#152B26] transition-colors cursor-pointer shadow-xs"
            >
              {isPlayingPreview ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Preview
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Review Voice Note
                </>
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={startRecording}
                title="Re-record"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E6DAB9] text-[#665F51] hover:text-[#221F1B] hover:bg-[#F1E7CE] font-baloo font-bold text-xs cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Re-record
              </button>

              <button
                type="button"
                onClick={handleDiscard}
                title="Remove audio"
                className="p-1.5 rounded-lg text-[#948C7A] hover:text-[#BD5B3B] hover:bg-[#FEE2E2] cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {isPlayingPreview && (
            <div className="w-full h-1 bg-[#E6DAB9]/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#22403A] transition-all duration-150"
                style={{ width: `${previewProgress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        /* STATE 3: IDLE — PROMPT TO RECORD */
        <div className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-dashed border-[#E6DAB9]">
          <p className="text-xs text-[#665F51] pl-1">
            Record your warm voice greeting for {maxDurationSeconds} seconds.
          </p>
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#BD5B3B] text-white font-baloo font-bold text-xs hover:bg-[#9B482E] transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Mic className="w-3.5 h-3.5" /> Record Hello
          </button>
        </div>
      )}
    </div>
  );
};
