"use client";

import React from "react";
import { Fuel, Info } from "lucide-react";

export interface GasFeePreviewPillProps {
  feeXlm?: number; // e.g. 0.00001 for classic, 0.045 for complex Soroban
  isSoroban?: boolean;
  networkCongestion?: "low" | "standard" | "high";
  className?: string;
}

export function GasFeePreviewPill({
  feeXlm = 0.00001,
  isSoroban = true,
  networkCongestion = "standard",
  className = "",
}: GasFeePreviewPillProps) {
  const displayFee = feeXlm < 0.0001 ? "<0.0001" : feeXlm.toFixed(4);

  let congestionColor = "text-emerald-400";
  let congestionBg = "bg-emerald-500/10 border-emerald-500/20";

  if (networkCongestion === "high") {
    congestionColor = "text-amber-400";
    congestionBg = "bg-amber-500/10 border-amber-500/20";
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border bg-slate-950/80 border-slate-800 text-slate-300 ${className}`}
      title={
        isSoroban
          ? "Estimated Soroban Smart Contract Resource Fee (CPU instructions + ledger storage footprint)"
          : "Standard Stellar Base Inclusion Fee"
      }
    >
      <Fuel className="w-3 h-3 text-indigo-400" />
      <span>Fee:</span>
      <span className="font-semibold text-white">~{displayFee} XLM</span>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          networkCongestion === "high" ? "bg-amber-400" : "bg-emerald-400"
        }`}
      />
    </div>
  );
}
