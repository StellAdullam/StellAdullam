import React from "react";
import { Activity, TrendingUp, BarChart2 } from "lucide-react";

export interface TradeVolumeBadgeProps {
  volume24hUsd: number;
  trades24hCount: number;
  className?: string;
}

export const TradeVolumeBadge: React.FC<TradeVolumeBadgeProps> = ({
  volume24hUsd,
  trades24hCount,
  className = "",
}) => {
  const isHighVelocity = trades24hCount >= 10;
  const isModerateVelocity = trades24hCount >= 3 && trades24hCount < 10;

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
        isHighVelocity
          ? "bg-purple-950/40 text-purple-300 border-purple-800/60"
          : isModerateVelocity
            ? "bg-blue-950/40 text-blue-300 border-blue-800/60"
            : "bg-slate-900/60 text-slate-400 border-slate-800"
      } ${className}`}
    >
      <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
      <span className="font-mono">
        $
        {volume24hUsd.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </span>
      <span className="text-slate-500">•</span>
      <span className="flex items-center gap-1 text-[11px]">
        {trades24hCount} trades/24h
        {isHighVelocity && <TrendingUp className="w-3 h-3 text-emerald-400" />}
      </span>
    </div>
  );
};
