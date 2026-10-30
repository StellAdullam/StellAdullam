import React, { useMemo, useState } from "react";

export interface ApyForecastCalculatorProps {
  baseAprPercent?: number; // default 2%
  optimalUtilizationPercent?: number; // default 80%
  slope1Percent?: number; // default 4%
  slope2Percent?: number; // default 30%
  reserveFactorPercent?: number; // default 10%
  initialUtilization?: number;
}

export const ApyForecastCalculator: React.FC<ApyForecastCalculatorProps> = ({
  baseAprPercent = 2.0,
  optimalUtilizationPercent = 80,
  slope1Percent = 4.0,
  slope2Percent = 30.0,
  reserveFactorPercent = 10.0,
  initialUtilization = 65,
}) => {
  const [utilization, setUtilization] = useState<number>(initialUtilization);

  const { borrowApr, supplyApr } = useMemo(() => {
    const u = utilization / 100;
    const opt = optimalUtilizationPercent / 100;

    let bApr = 0;
    if (u <= opt) {
      bApr = baseAprPercent + (u / opt) * slope1Percent;
    } else {
      const excess = (u - opt) / (1 - opt);
      bApr = baseAprPercent + slope1Percent + excess * slope2Percent;
    }

    const sApr = bApr * u * (1 - reserveFactorPercent / 100);

    return {
      borrowApr: Number(bApr.toFixed(2)),
      supplyApr: Number(sApr.toFixed(2)),
    };
  }, [
    utilization,
    baseAprPercent,
    optimalUtilizationPercent,
    slope1Percent,
    slope2Percent,
    reserveFactorPercent,
  ]);

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl max-w-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          Interactive APY Forecaster
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 font-medium">
          Soroban Model
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="text-xs text-slate-400 mb-1">
            Projected Supply APY
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {supplyApr.toFixed(2)}%
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="text-xs text-slate-400 mb-1">
            Projected Borrow APR
          </div>
          <div className="text-2xl font-bold text-indigo-400">
            {borrowApr.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Simulated Pool Utilization</span>
          <span className="font-bold text-cyan-400">{utilization}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={utilization}
          onChange={(e) => setUtilization(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        <div className="flex justify-between text-[10px] text-slate-400 px-0.5">
          <span>0%</span>
          <span className="text-amber-400/80 font-medium">
            Kink Point ({optimalUtilizationPercent}%)
          </span>
          <span>100%</span>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
        Rates dynamically adjust according to pool liquidity utilization.
        Exceeding the {optimalUtilizationPercent}% kink point accelerates borrow
        rates to protect reserve solvency.
      </p>
    </div>
  );
};
