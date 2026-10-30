import React from "react";

export interface RentalYieldBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  baseAprPercent?: number;
  districtSynergyPercent?: number;
  buildingTierBonusPercent?: number;
  municipalTaxDeductionPercent?: number;
  className?: string;
}

export const RentalYieldBreakdownModal: React.FC<
  RentalYieldBreakdownModalProps
> = ({
  isOpen,
  onClose,
  propertyName,
  baseAprPercent = 6.0,
  districtSynergyPercent = 1.5,
  buildingTierBonusPercent = 2.0,
  municipalTaxDeductionPercent = 0.8,
}) => {
  if (!isOpen) return null;

  const netApr =
    baseAprPercent +
    districtSynergyPercent +
    buildingTierBonusPercent -
    municipalTaxDeductionPercent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Yield Breakdown
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              {propertyName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-sm">
          <div className="flex justify-between text-slate-300">
            <span className="font-sans">Base Residential Lease Rate</span>
            <span className="font-semibold text-white">
              +{baseAprPercent.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between text-emerald-400">
            <span className="font-sans">District Commercial Synergy</span>
            <span className="font-semibold">
              +{districtSynergyPercent.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between text-cyan-400">
            <span className="font-sans">Building Tier Enhancement</span>
            <span className="font-semibold">
              +{buildingTierBonusPercent.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between text-rose-400 text-xs">
            <span className="font-sans">Municipal Cadastre Tax</span>
            <span>-{municipalTaxDeductionPercent.toFixed(2)}%</span>
          </div>

          <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-base">
            <span className="font-sans font-bold text-slate-200">
              Net Estimated APY
            </span>
            <span className="font-bold text-emerald-400 text-lg">
              +{netApr.toFixed(2)}% / yr
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
