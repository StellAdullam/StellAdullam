import React from "react";

export interface RentalSaturationBadgeProps {
  elapsedLedgers: number;
  maxClaimIntervalLedgers?: number; // 172,800 (~10 days)
  onHarvestClick?: () => void;
  className?: string;
}

export const RentalSaturationBadge: React.FC<RentalSaturationBadgeProps> = ({
  elapsedLedgers,
  maxClaimIntervalLedgers = 172_800,
  onHarvestClick,
  className = "",
}) => {
  const ratio = Math.min(1.0, elapsedLedgers / maxClaimIntervalLedgers);
  const percentage = ratio * 100;

  const getStatus = (pct: number) => {
    if (pct >= 90) {
      return {
        label: "Saturated (Yield Paused)",
        style: "bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse",
        showAction: true,
      };
    }
    if (pct >= 70) {
      return {
        label: "Near Saturation",
        style: "bg-amber-500/20 border-amber-500/50 text-amber-300",
        showAction: true,
      };
    }
    return {
      label: "Accumulating Yield",
      style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      showAction: false,
    };
  };

  const status = getStatus(percentage);

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-mono backdrop-blur-sm transition-all ${status.style} ${className}`}
      title={`${elapsedLedgers.toLocaleString()} / ${maxClaimIntervalLedgers.toLocaleString()} ledgers accumulated before saturation`}
    >
      <span className="text-[10px] select-none">⏳</span>
      <span>{status.label}</span>
      <span className="text-[10px] opacity-75 font-sans">
        ({percentage.toFixed(0)}%)
      </span>
      {status.showAction && onHarvestClick && (
        <button
          type="button"
          onClick={onHarvestClick}
          className="ml-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[9px] uppercase hover:bg-amber-400"
        >
          Harvest
        </button>
      )}
    </div>
  );
};
