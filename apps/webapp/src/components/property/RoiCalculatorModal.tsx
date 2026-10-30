import React, { useState } from "react";
import { X, Calculator, TrendingUp, DollarSign, Calendar } from "lucide-react";

export interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  sharePriceUsd: number;
  baseApyPercent: number;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  isOpen,
  onClose,
  propertyName,
  sharePriceUsd,
  baseApyPercent,
}) => {
  const [initialInvestmentUsd, setInitialInvestmentUsd] =
    useState<number>(1000);
  const [holdingYears, setHoldingYears] = useState<number>(3);
  const [projectedAppreciationBps, setProjectedAppreciationBps] =
    useState<number>(400); // 4%
  const [reinvestDividends, setReinvestDividends] = useState<boolean>(true);

  if (!isOpen) return null;

  const sharesCount = Math.floor(initialInvestmentUsd / sharePriceUsd);
  const annualApyRate = baseApyPercent / 100;
  const annualAppreciationRate = projectedAppreciationBps / 10000;

  // Compound or simple interest estimation
  let projectedEndValue = initialInvestmentUsd;
  if (reinvestDividends) {
    const combinedRate = annualApyRate + annualAppreciationRate;
    projectedEndValue =
      initialInvestmentUsd * Math.pow(1 + combinedRate, holdingYears);
  } else {
    const totalDividends = initialInvestmentUsd * annualApyRate * holdingYears;
    const propertyAppreciation =
      initialInvestmentUsd *
        Math.pow(1 + annualAppreciationRate, holdingYears) -
      initialInvestmentUsd;
    projectedEndValue =
      initialInvestmentUsd + totalDividends + propertyAppreciation;
  }

  const netGainUsd = projectedEndValue - initialInvestmentUsd;
  const totalReturnPercent = (netGainUsd / initialInvestmentUsd) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="roi-calculator-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 text-slate-100 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="roi-calculator-modal-title"
                className="font-semibold text-base"
              >
                Investor ROI Simulator
              </h3>
              <p className="text-xs text-slate-400">{propertyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Investment (USD)
              </label>
              <input
                type="number"
                min="50"
                max="500000"
                step="50"
                value={initialInvestmentUsd}
                onChange={(e) =>
                  setInitialInvestmentUsd(Math.max(10, Number(e.target.value)))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                ≈ {sharesCount} share{sharesCount === 1 ? "" : "s"} ($
                {sharePriceUsd}/share)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Holding Period: {holdingYears} Years
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={holdingYears}
                onChange={(e) => setHoldingYears(Number(e.target.value))}
                className="w-full accent-emerald-500 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 yr</span>
                <span>5 yrs</span>
                <span>10 yrs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-medium text-slate-200 block">
                Reinvest Dividends
              </span>
              <span className="text-[11px] text-slate-400">
                Compound monthly cash flow distributions
              </span>
            </div>
            <input
              type="checkbox"
              checked={reinvestDividends}
              onChange={(e) => setReinvestDividends(e.target.checked)}
              className="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Results Box */}
          <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-300">Base Rental APY</span>
              <span className="font-mono font-semibold text-emerald-400">
                +{baseApyPercent.toFixed(2)}% / yr
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-300">
                Projected Capital Appreciation
              </span>
              <span className="font-mono font-semibold text-emerald-400">
                +{(projectedAppreciationBps / 100).toFixed(2)}% / yr
              </span>
            </div>
            <div className="border-t border-emerald-800/40 pt-2 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block">
                  Projected Portfolio Value
                </span>
                <span className="text-lg font-bold font-mono text-emerald-300">
                  $
                  {projectedEndValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">
                  Cumulative Return
                </span>
                <span className="text-sm font-semibold font-mono text-emerald-400">
                  +{totalReturnPercent.toFixed(1)}% (+${netGainUsd.toFixed(2)})
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
        >
          Close Simulator
        </button>
      </div>
    </div>
  );
};
