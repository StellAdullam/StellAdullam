import React, { useState } from 'react';

export interface GridDensityHeatmapProps {
  totalParcels: number;
  developedParcels: number;
  activeHotspotCount?: number;
  onToggleHeatmap?: (isActive: boolean) => void;
  className?: string;
}

export const GridDensityHeatmap: React.FC<GridDensityHeatmapProps> = ({
  totalParcels = 400, // 20x20
  developedParcels,
  activeHotspotCount = 0,
  onToggleHeatmap,
  className = '',
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const occupancyRate = (developedParcels / Math.max(1, totalParcels)) * 100;

  const handleToggle = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    onToggleHeatmap?.(nextState);
  };

  const getDensityStatus = (rate: number) => {
    if (rate >= 75) return { label: 'High Density Mega-Hub', color: 'text-purple-400', border: 'border-purple-500/40' };
    if (rate >= 40) return { label: 'Metropolitan Core', color: 'text-indigo-400', border: 'border-indigo-500/40' };
    if (rate >= 15) return { label: 'Developing District', color: 'text-cyan-400', border: 'border-cyan-500/40' };
    return { label: 'Frontier Pioneer Zone', color: 'text-emerald-400', border: 'border-emerald-500/40' };
  };

  const status = getDensityStatus(occupancyRate);

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-mono backdrop-blur-md transition-all ${
        isActive
          ? 'bg-indigo-950/70 border-indigo-500/60 shadow-lg shadow-indigo-950/40'
          : 'bg-slate-900/80 border-slate-700/60'
      } ${className}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
        title="Toggle spatial density heatmap overlay"
      >
        <span className="text-sm">🔥</span>
        <span className="font-semibold">{isActive ? 'Heatmap ON' : 'Heatmap'}</span>
      </button>

      <span className="text-slate-600">|</span>

      <span className={status.color} title={`${developedParcels} / ${totalParcels} claimed`}>
        {occupancyRate.toFixed(1)}% Claimed
      </span>

      {activeHotspotCount > 0 && (
        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
          {activeHotspotCount} Hotspots
        </span>
      )}
    </div>
  );
};
