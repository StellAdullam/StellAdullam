import React from "react";

export interface UnclaimedDividendsIndicatorProps {
  unclaimedAmountLand: number;
  onClaim?: () => void;
  className?: string;
}

export const UnclaimedDividendsIndicator: React.FC<
  UnclaimedDividendsIndicatorProps
> = ({ unclaimedAmountLand, onClaim, className = "" }) => {
  if (unclaimedAmountLand <= 0) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/40 backdrop-blur-md text-xs font-mono text-amber-300 shadow-amber-950/40 shadow-lg ${className}`}
      role="alert"
      aria-label={`${unclaimedAmountLand} LAND available to harvest`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>

      <span className="font-bold">
        {unclaimedAmountLand.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}{" "}
        LAND Unclaimed
      </span>

      {onClaim && (
        <button
          type="button"
          onClick={onClaim}
          className="ml-1 px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider transition-colors"
        >
          Harvest
        </button>
      )}
    </div>
  );
};
