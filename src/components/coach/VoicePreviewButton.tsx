import React, { useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';
import type { VoicePreference } from '../../types/coach';
import { getVoicePreviewUrl, coachVoiceConfig } from '../../data/loadLessons';

interface VoicePreviewButtonProps {
  voice: VoicePreference;
  label: string;
}

export const VoicePreviewButton: React.FC<VoicePreviewButtonProps> = ({ voice, label }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const url = getVoicePreviewUrl(voice);
  const script = coachVoiceConfig.previewScript;

  const play = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (url) {
      if (playing) {
        audioRef.current?.pause();
        setPlaying(false);
        return;
      }
      const el = audioRef.current;
      if (el) {
        el.currentTime = 0;
        void el.play();
        setPlaying(true);
      }
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(script);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
        />
      )}
      <button
        type="button"
        onClick={play}
        className="mt-2 text-xs text-accent-blue inline-flex items-center gap-1 hover:underline"
      >
        {playing ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        Preview {label}
      </button>
    </>
  );
};

export default VoicePreviewButton;
