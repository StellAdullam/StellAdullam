import React from "react";

export interface ApyRankBadgeProps {
  apyPercent: number;
  showDetails?: boolean;
  className?: string;
}

export type YieldTier = "S" | "A" | "B" | "C";

export const ApyRankBadge: React.FC<ApyRankBadgeProps> = ({
  apyPercent,
  showDetails = true,
  className = "",
}) => {
  const getTier = (
    apy: number,
  ): {
    tier: YieldTier;
    label: string;
    badgeStyle: string;
    textColor: string;
  } => {
    if (apy >= 15.0) {
      return {
        tier: "S",
        label: "Prime High-Yield",
        badgeStyle: "bg-amber-500/20 border-amber-500/40 text-amber-300",
        textColor: "text-amber-400",
      };
    }
    if (apy >= 10.0) {
      return {
        tier: "A",
        label: "Above Average",
        badgeStyle: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
        textColor: "text-emerald-400",
      };
    }
    if (apy >= 6.0) {
      return {
        tier: "B",
        label: "Stable Dividend",
        badgeStyle: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
        textColor: "text-cyan-400",
      };
    }
    return {
      tier: "C",
      label: "Conservative",
      badgeStyle: "bg-slate-700/40 border-slate-600/40 text-slate-300",
      textColor: "text-slate-400",
    };
  };

  const config = getTier(apyPercent);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium backdrop-blur-sm ${config.badgeStyle} ${className}`}
      title={`Yield Tier ${config.tier}: ${config.label} (${apyPercent.toFixed(2)}% APY)`}
    >
      <span className="font-bold px-1.5 py-0.5 rounded bg-black/40 text-[10px]">
        Tier {config.tier}
      </span>
      <span className={`font-semibold ${config.textColor}`}>
        {apyPercent.toFixed(1)}% APY
      </span>
      {showDetails && (
        <span className="text-[10px] opacity-75 font-sans hidden sm:inline">
          • {config.label}
        </span>
      )}
    </div>
  );
};
