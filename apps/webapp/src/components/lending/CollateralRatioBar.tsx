import React from 'react';

export interface CollateralRatioBarProps {
  currentLtvPercent: number; // e.g. 55%
  liquidationThresholdPercent?: number; // e.g. 80%
  maxBorrowLtvPercent?: number; // e.g. 70%
}

export const CollateralRatioBar: React.FC<CollateralRatioBarProps> = ({
  currentLtvPercent,
  liquidationThresholdPercent = 80,
  maxBorrowLtvPercent = 70,
}) => {
  const ltvClamped = Math.min(100, Math.max(0, currentLtvPercent));

  // Determine safety tier
  let statusColor = 'text-emerald-400';
  let barGradient = 'from-emerald-500 to-teal-400';
  let statusText = 'Healthy';

  if (currentLtvPercent >= liquidationThresholdPercent) {
    statusColor = 'text-rose-500';
    barGradient = 'from-rose-600 to-red-500';
    statusText = 'Liquidation Imminent';
  } else if (currentLtvPercent >= maxBorrowLtvPercent) {
    statusColor = 'text-amber-400';
    barGradient = 'from-amber-500 to-rose-400';
    statusText = 'High Risk';
  } else if (currentLtvPercent > 50) {
    statusColor = 'text-cyan-400';
    barGradient = 'from-cyan-500 to-teal-400';
    statusText = 'Moderate';
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400">Loan-To-Value (LTV)</span>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sm text-white">{currentLtvPercent.toFixed(1)}%</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>

      <div className="relative w-full h-2.5 rounded-full bg-slate-800 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-300`}
          style={{ width: `${ltvClamped}%` }}
        />
        {/* Maximum borrow marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10"
          style={{ left: `${maxBorrowLtvPercent}%` }}
          title={`Max Borrow LTV: ${maxBorrowLtvPercent}%`}
        />
        {/* Liquidation threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
          style={{ left: `${liquidationThresholdPercent}%` }}
          title={`Liquidation Threshold: ${liquidationThresholdPercent}%`}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 px-0.5">
        <span>0%</span>
        <span className="text-amber-400/80">Max Borrow ({maxBorrowLtvPercent}%)</span>
        <span className="text-rose-400/80">Liquidation ({liquidationThresholdPercent}%)</span>
      </div>
    </div>
  );
};
