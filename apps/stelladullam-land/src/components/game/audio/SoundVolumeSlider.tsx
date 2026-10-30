import React, { useEffect, useState } from 'react';
import { soundEffects } from './SoundEffects';

export interface SoundVolumeSliderProps {
  initialVolume?: number; // 0.0 to 1.0
}

export const SoundVolumeSlider: React.FC<SoundVolumeSliderProps> = ({
  initialVolume = 0.5,
}) => {
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stelladullam_sfx_volume');
      return saved ? parseFloat(saved) : initialVolume;
    }
    return initialVolume;
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stelladullam_sfx_muted') === 'true';
    }
    return false;
  });

  useEffect(() => {
    soundEffects.setMasterVolume(isMuted ? 0 : volume);
    if (typeof window !== 'undefined') {
      localStorage.setItem('stelladullam_sfx_volume', volume.toString());
      localStorage.setItem('stelladullam_sfx_muted', isMuted.toString());
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-sm text-xs">
      <button
        type="button"
        onClick={toggleMute}
        className="text-slate-400 hover:text-white transition-colors"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted || volume === 0 ? (
          <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={isMuted ? 0 : volume}
        onChange={(e) => {
          setIsMuted(false);
          setVolume(parseFloat(e.target.value));
        }}
        className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        aria-label="Audio volume"
      />
      <span className="text-[10px] text-slate-400 font-mono w-7 text-right">
        {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
      </span>
    </div>
  );
};
