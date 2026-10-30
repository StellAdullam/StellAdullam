import React, { useState, useEffect } from "react";
import { soundEffects } from "./SoundEffects";

export interface SoundMuteToggleProps {
  onMuteToggle?: (isMuted: boolean) => void;
  className?: string;
}

export const SoundMuteToggle: React.FC<SoundMuteToggleProps> = ({
  onMuteToggle,
  className = "",
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("stelladullam_sound_muted") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    soundEffects.setMuted(isMuted);
  }, [isMuted]);

  const handleToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEffects.setMuted(next);
    try {
      localStorage.setItem("stelladullam_sound_muted", String(next));
    } catch {
      // Ignore
    }
    onMuteToggle?.(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono backdrop-blur-md transition-all ${
        isMuted
          ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
          : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800"
      } ${className}`}
      title={
        isMuted
          ? "Unmute game audio effects (M)"
          : "Mute game audio effects (M)"
      }
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      <span className="text-sm select-none">{isMuted ? "🔇" : "🔊"}</span>
      <span className="hidden sm:inline font-sans">
        {isMuted ? "Muted" : "Sound ON"}
      </span>
    </button>
  );
};
