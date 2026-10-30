import React from 'react';
import { Building2, TrendingUp, Sparkles } from 'lucide-react';

export interface DistrictStatsOverlayProps {
  districtName: string;
  developmentPercentage: number;
  yieldMultiplier: number;
  averageTierName?: string;
  className?: string;
}

export const DistrictStatsOverlay: React.FC<DistrictStatsOverlayProps> = ({
  districtName,
  developmentPercentage,
  yieldMultiplier,
  averageTierName = 'Commercial',
  className = '',
}) => {
  return (
    <div
      className={`px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs shadow-lg flex items-center gap-3 ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <Building2 className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold text-slate-200">{districtName}</span>
      </div>

      <span className="text-slate-600">•</span>

      <span className="text-slate-400">
        Dev: <span className="font-mono text-slate-200 font-medium">{developmentPercentage}%</span>
      </span>

      <span className="text-slate-600">•</span>

      <div className="flex items-center gap-1 text-emerald-400 font-mono font-medium">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>{yieldMultiplier}x Boost</span>
      </div>
    </div>
  );
};
