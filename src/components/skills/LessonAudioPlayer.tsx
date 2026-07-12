import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import type { VoicePreference } from '../../types/coach';
import { getLessonAudioUrl, getLessonTranscript } from '../../data/loadLessons';

interface LessonAudioPlayerProps {
  leafId: string;
  title: string;
  voicePreference: VoicePreference;
  onListenComplete?: () => void;
  compact?: boolean;
}

const LessonAudioPlayer: React.FC<LessonAudioPlayerProps> = ({
  leafId,
  title,
  voicePreference,
  onListenComplete,
  compact,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const src = getLessonAudioUrl(leafId, voicePreference);
  const transcript = getLessonTranscript(leafId);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setAudioError(false);
  }, [leafId, voicePreference, src]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = () => {
    if (!src || audioError) {
      if (transcript && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(transcript.slice(0, 500));
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
        onListenComplete?.();
      }
      return;
    }
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play();
      setPlaying(true);
    }
  };

  return (
    <div className={`rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] ${compact ? 'p-3' : 'p-4'}`}>
      {src && !audioError && (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onTimeUpdate={() => {
            const el = audioRef.current;
            if (el?.duration) setProgress((el.currentTime / el.duration) * 100);
          }}
          onEnded={() => {
            setPlaying(false);
            onListenComplete?.();
          }}
          onError={() => setAudioError(true)}
        />
      )}

      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={toggle}
          className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue hover:bg-accent-blue/30 transition-colors shrink-0"
          aria-label={playing ? 'Pause lesson' : 'Play lesson'}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary truncate">{title}</p>
          <p className="text-xs text-text-secondary flex items-center gap-1">
            <Volume2 className="w-3 h-3" />
            {src && !audioError
              ? `Coach · ${voicePreference === 'male' ? 'Friendly guy' : 'Friendly girl'}`
              : 'Read aloud (audio generating)'}
          </p>
        </div>
      </div>

      {src && !audioError && (
        <div className="h-1 rounded-full bg-[var(--bg-secondary)] mb-3 overflow-hidden">
          <div className="h-full bg-accent-blue transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {!compact && transcript && (
        <details className="text-sm text-text-secondary">
          <summary className="cursor-pointer text-accent-blue text-xs font-medium mb-2">Transcript</summary>
          <p className="leading-relaxed whitespace-pre-wrap">{transcript}</p>
        </details>
      )}
    </div>
  );
};

export default LessonAudioPlayer;
