import React, { useState } from 'react';

export interface HealthFactorSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  collateralValueXlm: number;
  currentDebtXlm: number;
  liquidationThresholdPct?: number; // e.g. 80%
}

export const HealthFactorSimulatorModal: React.FC<HealthFactorSimulatorModalProps> = ({
  isOpen,
  onClose,
  collateralValueXlm,
  currentDebtXlm,
  liquidationThresholdPct = 80,
}) => {
  const [priceChangePct, setPriceChangePct] = useState<number>(0);
  const [additionalBorrowXlm, setAdditionalBorrowXlm] = useState<number>(0);

  if (!isOpen) return null;

  const thresholdRatio = liquidationThresholdPct / 100;

  // Base calculations
  const baseHealthFactor =
    currentDebtXlm > 0 ? (collateralValueXlm * thresholdRatio) / currentDebtXlm : 999;

  // Simulated calculations
  const simCollateral = collateralValueXlm * (1 + priceChangePct / 100);
  const simDebt = currentDebtXlm + additionalBorrowXlm;
  const simHealthFactor = simDebt > 0 ? (simCollateral * thresholdRatio) / simDebt : 999;

  // Liquidation price drops
  const liquidationCollateralThreshold = currentDebtXlm / thresholdRatio;
  const dropToLiquidationPct =
    collateralValueXlm > 0
      ? Math.max(0, ((collateralValueXlm - liquidationCollateralThreshold) / collateralValueXlm) * 100)
      : 0;

  const getRiskStatus = (hf: number) => {
    if (hf >= 1.8) return { label: 'Safe', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/40' };
    if (hf >= 1.2) return { label: 'Moderate Risk', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/40' };
    if (hf >= 1.0) return { label: 'High Risk (Near Liquidation)', color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-500/40' };
    return { label: 'Liquidatable!', color: 'text-red-500 font-bold animate-pulse', bg: 'bg-red-950/60 border-red-500' };
  };

  const status = getRiskStatus(simHealthFactor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>⚡</span> Health Factor Stress Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Simulate asset price volatility and additional borrowing impacts
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current vs Simulated Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 font-sans block mb-1">Current Health Factor</span>
            <span className="text-2xl font-mono font-bold text-white">
              {baseHealthFactor > 10 ? '> 10.0' : baseHealthFactor.toFixed(2)}
            </span>
          </div>

          <div className={`p-4 rounded-xl border ${status.bg}`}>
            <span className="text-xs text-slate-300 font-sans block mb-1">Simulated Health Factor</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-mono font-bold ${status.color}`}>
                {simHealthFactor > 10 ? '> 10.0' : simHealthFactor.toFixed(2)}
              </span>
              <span className="text-xs font-sans text-slate-300">({status.label})</span>
            </div>
          </div>
        </div>

        {/* Price Volatility Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Collateral Market Price Shock</span>
            <span className={priceChangePct < 0 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
              {priceChangePct > 0 ? `+${priceChangePct}%` : `${priceChangePct}%`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={priceChangePct}
            onChange={(e) => setPriceChangePct(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-50% Crash</span>
            <span>0% (Current)</span>
            <span>+50% Pump</span>
          </div>
        </div>

        {/* Additional Borrow Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Additional Borrow Amount</span>
            <span className="text-indigo-400 font-bold">+{additionalBorrowXlm} XLM</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(100, Math.floor(collateralValueXlm * 0.5))}
            step="50"
            value={additionalBorrowXlm}
            onChange={(e) => setAdditionalBorrowXlm(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Safety buffer metric */}
        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 flex justify-between items-center text-xs">
          <span className="text-slate-400">Collateral price drop buffer until liquidation:</span>
          <span className="font-mono font-bold text-amber-300">-{dropToLiquidationPct.toFixed(1)}%</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setPriceChangePct(0);
            setAdditionalBorrowXlm(0);
          }}
          className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
        >
          Reset Simulation
        </button>
      </div>
    </div>
  );
};
