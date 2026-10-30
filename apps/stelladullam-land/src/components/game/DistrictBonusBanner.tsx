"use client";

import React from "react";
import { Sparkles, MapPin, TrendingUp, X } from "lucide-react";

export interface DistrictBonusBannerProps {
  clusterBonus: number; // e.g. 1.15 for +15%
  contiguousPlotsCount: number;
  onDismiss?: () => void;
}

export function DistrictBonusBanner({
  clusterBonus,
  contiguousPlotsCount,
  onDismiss,
}: DistrictBonusBannerProps) {
  if (clusterBonus <= 1.0) return null;

  const bonusPercent = Math.round((clusterBonus - 1.0) * 100);

  return (
    <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-100 flex items-center justify-between shadow-lg backdrop-blur-sm animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              District Territory Active
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
              +{bonusPercent}% Yield
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Your {contiguousPlotsCount} contiguous land plots form a recognized
            district, boosting hourly rental generation!
          </p>
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
