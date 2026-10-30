"use client";

import React from "react";
import { Layers, Sparkles, Shield } from "lucide-react";
import { calculateClusterBonus } from "@stelladullam/shared";

export interface DistrictTerritoryOverlayProps {
  ownedTileIndices: number[];
  isActive: boolean;
  onToggle: () => void;
}

export function DistrictTerritoryOverlay({
  ownedTileIndices,
  isActive,
  onToggle,
}: DistrictTerritoryOverlayProps) {
  const clusterBonus = calculateClusterBonus(ownedTileIndices);
  const bonusPercentage = Math.round((clusterBonus - 1.0) * 100);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all shadow-md ${
          isActive
            ? "bg-indigo-600/90 border-indigo-400 text-white shadow-indigo-500/20"
            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white"
        }`}
        title="Toggle District Territorial Control Overlay"
      >
        <Layers className="w-3.5 h-3.5" />
        <span>District Turf</span>
      </button>

      {isActive && bonusPercentage > 0 && (
        <div className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 animate-in fade-in duration-200">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>+{bonusPercentage}% District Cluster Bonus</span>
        </div>
      )}
    </div>
  );
}
