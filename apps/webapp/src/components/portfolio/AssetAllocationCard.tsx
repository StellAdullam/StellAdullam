import React from "react";

export interface AllocationSegment {
  category: string;
  label: string;
  valueUsd: number;
  percentage: number;
  color: string;
}

export interface AssetAllocationCardProps {
  totalValueUsd: number;
  allocations: AllocationSegment[];
  diversificationScore?: number;
  className?: string;
}

export const AssetAllocationCard: React.FC<AssetAllocationCardProps> = ({
  totalValueUsd,
  allocations,
  diversificationScore = 78,
  className = "",
}) => {
  const getDiversificationBadge = (score: number) => {
    if (score >= 80)
      return {
        label: "Well Balanced",
        color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/40",
      };
    if (score >= 50)
      return {
        label: "Moderate Distribution",
        color: "text-cyan-400 bg-cyan-950/40 border-cyan-500/40",
      };
    return {
      label: "Concentrated",
      color: "text-amber-400 bg-amber-950/40 border-amber-500/40",
    };
  };

  const badge = getDiversificationBadge(diversificationScore);

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Portfolio Distribution
          </span>
          <h3 className="text-2xl font-bold text-white font-mono mt-0.5">
            $
            {totalValueUsd.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>

        <div
          className={`px-2.5 py-1 rounded-lg border text-xs font-mono ${badge.color}`}
        >
          <span className="font-bold">{diversificationScore}/100</span>
          <span className="opacity-80 font-sans ml-1">• {badge.label}</span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="h-3 w-full bg-slate-950 rounded-full flex overflow-hidden border border-slate-800">
        {allocations.map((item) => (
          <div
            key={item.category}
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }}
            title={`${item.label}: ${item.percentage.toFixed(1)}%`}
            className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      {/* Categories Breakdown Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {allocations.map((item) => (
          <div
            key={item.category}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-300 font-sans truncate">
                {item.label}
              </span>
            </div>
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-sm font-bold text-white">
                $
                {item.valueUsd.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
