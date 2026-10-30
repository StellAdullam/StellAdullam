import React from 'react';

export interface ParcelMilestoneBarProps {
  currentLevel: number; // 0=Vacant, 1=Residential, 2=Commercial, 3=Skyscraper
  currentBalanceLand: number;
  accruedRentLand: number;
}

const LEVEL_NAMES = ['Vacant Lot', 'Residential', 'Commercial', 'Skyscraper'];
const UPGRADE_COSTS = [200, 600, 1800, 0]; // LAND required to advance to next level

export const ParcelMilestoneBar: React.FC<ParcelMilestoneBarProps> = ({
  currentLevel,
  currentBalanceLand,
  accruedRentLand,
}) => {
  const isMax = currentLevel >= 3;
  const nextCost = UPGRADE_COSTS[currentLevel] || 0;
  const totalAvailable = currentBalanceLand + accruedRentLand;
  const progressPercent = isMax
    ? 100
    : Math.min(100, Math.round((totalAvailable / nextCost) * 100));

  return (
    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-semibold text-slate-100">
          Tier: {LEVEL_NAMES[currentLevel]}
        </span>
        <span className="text-[11px] text-slate-400">
          {isMax ? 'Maximum Tier Reached' : `Next: ${LEVEL_NAMES[currentLevel + 1]}`}
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isMax
              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
              : progressPercent >= 100
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Progress: {progressPercent}%</span>
        {!isMax && (
          <span>
            {Math.floor(totalAvailable)} / {nextCost} LAND needed
          </span>
        )}
      </div>
    </div>
  );
};
