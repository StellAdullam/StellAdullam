import React from 'react';

export interface TaxAppraisalTooltipProps {
  parcelId: number;
  valuationXlm: number;
  taxRatePercent?: number;
  districtMultiplier?: number;
  annualDividendXlm: number;
  className?: string;
}

export const TaxAppraisalTooltip: React.FC<TaxAppraisalTooltipProps> = ({
  parcelId,
  valuationXlm,
  taxRatePercent = 1.5,
  districtMultiplier = 1.0,
  annualDividendXlm,
  className = '',
}) => {
  const annualTaxXlm = (valuationXlm * (taxRatePercent / 100)) * districtMultiplier;
  const netAnnualDividend = Math.max(0, annualDividendXlm - annualTaxXlm);

  return (
    <div
      className={`bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs font-mono space-y-2 max-w-xs ${className}`}
      role="tooltip"
    >
      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
        <span className="font-bold text-white font-sans">Municipal Tax # {parcelId}</span>
        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
          {taxRatePercent}% Base
        </span>
      </div>

      <div className="space-y-1 text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-400">Assessed Valuation:</span>
          <span className="text-white">{valuationXlm.toLocaleString()} XLM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">District Multiplier:</span>
          <span className="text-indigo-400">{districtMultiplier.toFixed(2)}x</span>
        </div>
        <div className="flex justify-between text-rose-400">
          <span>Est. Annual Tax:</span>
          <span>-{annualTaxXlm.toFixed(1)} XLM</span>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-1.5 flex justify-between items-center text-emerald-400 font-bold">
        <span className="font-sans text-[11px]">Net Annual Dividend:</span>
        <span>+{netAnnualDividend.toFixed(1)} XLM</span>
      </div>
    </div>
  );
};
