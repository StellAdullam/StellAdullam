import React from 'react';

export interface GasEstimateBadgeProps {
  feeStroops?: number;
  surgeMultiplier?: number;
  xlmUsdPrice?: number;
}

export const GasEstimateBadge: React.FC<GasEstimateBadgeProps> = ({
  feeStroops = 100,
  surgeMultiplier = 1.0,
  xlmUsdPrice = 0.12,
}) => {
  const effectiveStroops = Math.round(feeStroops * surgeMultiplier);
  const feeXlm = effectiveStroops / 10_000_000;
  const feeUsd = feeXlm * xlmUsdPrice;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 font-mono shadow-sm"
      title={`Network fee: ${effectiveStroops} Stroops (${feeXlm.toFixed(7)} XLM)`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      <span className="text-slate-400 font-sans text-[11px]">Est. Fee:</span>
      <span className="text-white font-semibold">{effectiveStroops} Stroops</span>
      <span className="text-slate-500 font-sans text-[10px]">(&lt;${feeUsd < 0.0001 ? '0.0001' : feeUsd.toFixed(4)})</span>
    </div>
  );
};
