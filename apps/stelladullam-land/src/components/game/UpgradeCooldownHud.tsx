import React, { useState, useEffect } from "react";

export interface UpgradeCooldownHudProps {
  x: number;
  y: number;
  cooldownEndsAtEpochMs: number;
  onCooldownComplete?: () => void;
  className?: string;
}

export const UpgradeCooldownHud: React.FC<UpgradeCooldownHudProps> = ({
  x,
  y,
  cooldownEndsAtEpochMs,
  onCooldownComplete,
  className = "",
}) => {
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    Math.max(0, cooldownEndsAtEpochMs - Date.now()),
  );

  useEffect(() => {
    if (remainingMs <= 0) return;

    const interval = setInterval(() => {
      const diff = Math.max(0, cooldownEndsAtEpochMs - Date.now());
      setRemainingMs(diff);
      if (diff === 0) {
        clearInterval(interval);
        onCooldownComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownEndsAtEpochMs, remainingMs, onCooldownComplete]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const isReady = remainingMs <= 0;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono backdrop-blur-md transition-all ${
        isReady
          ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50 shadow-md"
          : "bg-slate-900/80 border-slate-700/60 text-slate-300"
      } ${className}`}
      role="timer"
      aria-label={`Upgrade cooldown for parcel (${x}, ${y})`}
    >
      <span className="text-slate-400 font-sans">
        Parcel ({x}, {y}):
      </span>
      {isReady ? (
        <span className="font-bold flex items-center gap-1 text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          Ready to Upgrade!
        </span>
      ) : (
        <span className="font-bold text-amber-400 flex items-center gap-1">
          ⏳ {formatTime(remainingMs)}
        </span>
      )}
    </div>
  );
};
