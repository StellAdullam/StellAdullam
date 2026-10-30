import React from 'react';
import { Percent, DollarSign } from 'lucide-react';

export interface ShareFractionSliderProps {
  totalShares: number;
  sharePriceUsd: number;
  selectedShares: number;
  onSharesChange: (shares: number) => void;
  maxAvailableShares?: number;
  className?: string;
}

export const ShareFractionSlider: React.FC<ShareFractionSliderProps> = ({
  totalShares,
  sharePriceUsd,
  selectedShares,
  onSharesChange,
  maxAvailableShares = totalShares,
  className = '',
}) => {
  const percentageOfTotal = ((selectedShares / totalShares) * 100).toFixed(2);
  const totalCostUsd = (selectedShares * sharePriceUsd).toFixed(2);

  const setByPercentage = (pct: number) => {
    const calculated = Math.max(1, Math.min(maxAvailableShares, Math.round((pct / 100) * totalShares)));
    onSharesChange(calculated);
  };

  return (
    <div className={`p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 ${className}`}>
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">Fractional Investment Quantity</span>
        <span className="font-mono text-emerald-400 font-semibold">
          {percentageOfTotal}% of Asset
        </span>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min="1"
          max={maxAvailableShares}
          value={selectedShares}
          onChange={(e) => onSharesChange(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <span className="text-sm font-mono font-bold text-slate-100 min-w-[50px] text-right">
          {selectedShares}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {[1, 5, 10].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setByPercentage(pct)}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
            >
              {pct}%
            </button>
          ))}
          <button
            type="button"
            onClick={() => onSharesChange(maxAvailableShares)}
            className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700/60"
          >
            Max
          </button>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Total: </span>
          <span className="font-mono text-sm font-bold text-emerald-300">${totalCostUsd}</span>
        </div>
      </div>
    </div>
  );
};
