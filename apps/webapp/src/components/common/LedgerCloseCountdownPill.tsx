import React, { useState, useEffect } from "react";

export interface LedgerCloseCountdownPillProps {
  currentLedgerSequence?: number;
  expectedCloseSeconds?: number;
  onLedgerClose?: () => void;
  className?: string;
}

export const LedgerCloseCountdownPill: React.FC<
  LedgerCloseCountdownPillProps
> = ({
  currentLedgerSequence = 1052840,
  expectedCloseSeconds = 5,
  onLedgerClose,
  className = "",
}) => {
  const [remainingSec, setRemainingSec] =
    useState<number>(expectedCloseSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          onLedgerClose?.();
          return expectedCloseSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expectedCloseSeconds, onLedgerClose]);

  const progressPercent =
    ((expectedCloseSeconds - remainingSec) / expectedCloseSeconds) * 100;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700/60 bg-slate-900/80 text-xs font-mono backdrop-blur-md transition-all shadow-sm ${className}`}
      title={`Stellar consensus ledger close cycle: ~${expectedCloseSeconds}s per block`}
      role="status"
      aria-live="polite"
    >
      <span className="flex items-center gap-1.5 text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-slate-400">Ledger</span>
        <span className="font-bold text-white">
          #{currentLedgerSequence.toLocaleString()}
        </span>
      </span>

      <span className="text-slate-600">|</span>

      <div className="flex items-center gap-1 text-[11px] text-cyan-400">
        <span>⏱️</span>
        <span>{remainingSec}s</span>
      </div>

      <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-400 transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
