import React from 'react';

export interface HarvestMultiplierTagProps {
  multiplierRatio: number; // e.g. 1.5, 2.0, 3.0
  districtName?: string;
  hasActiveEvent?: boolean;
  className?: string;
}

export const HarvestMultiplierTag: React.FC<HarvestMultiplierTagProps> = ({
  multiplierRatio,
  districtName = 'Downtown',
  hasActiveEvent = false,
  className = '',
}) => {
  if (multiplierRatio <= 1.0 && !hasActiveEvent) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-mono font-bold backdrop-blur-md shadow-sm ${
        multiplierRatio >= 2.0
          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-amber-950/40 animate-pulse'
          : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
      } ${className}`}
      title={`${districtName} bonus: ${multiplierRatio.toFixed(1)}x rental harvest rate active`}
    >
      <span className="text-xs select-none">✨</span>
      <span>{multiplierRatio.toFixed(1)}x Yield</span>
      {hasActiveEvent && (
        <span className="text-[9px] bg-black/40 px-1 rounded uppercase tracking-wider text-amber-200">
          Event
        </span>
      )}
    </div>
  );
};
