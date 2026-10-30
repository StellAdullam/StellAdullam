"use client";

import React, { useState } from "react";
import { AlertCircle, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui";

export interface LendingBorrowSliderProps {
  collateralValueUsd: number;
  maxLtvPercent?: number; // e.g. 75
  liquidationThresholdPercent?: number; // e.g. 80
  initialBorrowUsd?: number;
  onBorrowChange?: (borrowAmountUsd: number) => void;
}

export function LendingBorrowSlider({
  collateralValueUsd,
  maxLtvPercent = 75,
  liquidationThresholdPercent = 80,
  initialBorrowUsd = 0,
  onBorrowChange,
}: LendingBorrowSliderProps) {
  const maxBorrow = (collateralValueUsd * maxLtvPercent) / 100;
  const safeBorrow = (collateralValueUsd * (maxLtvPercent * 0.75)) / 100;

  const [borrowAmount, setBorrowAmount] = useState<number>(
    Math.min(initialBorrowUsd, maxBorrow)
  );

  const handleSliderChange = (val: number) => {
    setBorrowAmount(val);
    if (onBorrowChange) {
      onBorrowChange(val);
    }
  };

  const handleQuickPercent = (percent: number) => {
    const val = Math.round((maxBorrow * percent) / 100);
    handleSliderChange(val);
  };

  // Calculations
  const currentLtv = collateralValueUsd > 0 ? (borrowAmount / collateralValueUsd) * 100 : 0;
  const healthFactor =
    borrowAmount > 0
      ? (collateralValueUsd * (liquidationThresholdPercent / 100)) / borrowAmount
      : 99.0;

  // Max collateral drop before liquidation
  const liquidationBuffer =
    borrowAmount > 0
      ? Math.max(0, 100 - (borrowAmount / (collateralValueUsd * (liquidationThresholdPercent / 100))) * 100)
      : 100;

  let riskColor = "text-emerald-400";
  let riskBg = "bg-emerald-500/10 border-emerald-500/30";
  let riskText = "Safe Position";
  let RiskIcon = ShieldCheck;

  if (healthFactor <= 1.1) {
    riskColor = "text-red-400";
    riskBg = "bg-red-500/10 border-red-500/30";
    riskText = "Extreme Liquidation Risk";
    RiskIcon = AlertCircle;
  } else if (healthFactor <= 1.3) {
    riskColor = "text-amber-400";
    riskBg = "bg-amber-500/10 border-amber-500/30";
    riskText = "Moderate Risk (Tight Buffer)";
    RiskIcon = AlertTriangle;
  }

  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-100 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Borrow Amount
          </span>
          <p className="text-2xl font-bold text-white mt-0.5">
            ${borrowAmount.toLocaleString()} <span className="text-sm font-normal text-slate-400">USDC</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Max Borrow Limit</span>
          <p className="text-sm font-semibold text-indigo-400">
            ${maxBorrow.toLocaleString()} ({maxLtvPercent}% LTV)
          </p>
        </div>
      </div>

      {/* Range Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={maxBorrow}
          step={Math.max(1, Math.round(maxBorrow / 100))}
          value={borrowAmount}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>$0</span>
          <span>Safe: ${Math.round(safeBorrow).toLocaleString()}</span>
          <span>Max: ${Math.round(maxBorrow).toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex gap-2">
        {[25, 50, 75, 100].map((pct) => (
          <Button
            key={pct}
            type="button"
            variant="outline"
            className="flex-1 py-1 text-xs h-7 border-slate-700 bg-slate-800/40 hover:bg-slate-700/60 text-slate-200"
            onClick={() => handleQuickPercent(pct)}
          >
            {pct === 100 ? "Max" : `${pct}%`}
          </Button>
        ))}
      </div>

      {/* Risk Metrics Card */}
      <div className={`p-3 rounded-lg border flex items-center justify-between text-xs ${riskBg}`}>
        <div className="flex items-center gap-2">
          <RiskIcon className={`w-4 h-4 ${riskColor}`} />
          <span className={`font-semibold ${riskColor}`}>{riskText}</span>
        </div>
        <div className="flex gap-4 text-slate-300">
          <div>
            <span className="text-slate-400">LTV: </span>
            <span className="font-semibold text-white">{currentLtv.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-slate-400">Health: </span>
            <span className="font-semibold text-white">
              {healthFactor >= 99 ? "∞" : healthFactor.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Price Drop Buffer: </span>
            <span className="font-semibold text-emerald-400">{liquidationBuffer.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
