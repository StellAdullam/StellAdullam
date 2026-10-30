"use client";

import React, { useState } from "react";
import {
  ArrowUpCircle,
  Sparkles,
  Building,
  Coins,
  CheckCircle2,
  X,
} from "lucide-react";
import { soundEffects } from "./audio/SoundEffects";

export interface PropertyUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tileIndex: number;
  currentTier: number; // 0 to 4
  propertyName: string;
  landBalance: number;
  onUpgrade?: (tileIndex: number, targetTier: number) => Promise<string | void>;
}

const TIER_DATA = [
  { tier: 0, name: "Vacant Lot", costLand: 0, rentPerHour: 1.0 },
  { tier: 1, name: "Residential Villa", costLand: 100, rentPerHour: 2.5 },
  { tier: 2, name: "Apartment Complex", costLand: 250, rentPerHour: 6.0 },
  { tier: 3, name: "Commercial Tower", costLand: 500, rentPerHour: 15.0 },
  { tier: 4, name: "Crown Skyscraper", costLand: 1000, rentPerHour: 35.0 },
];

export function PropertyUpgradeModal({
  isOpen,
  onClose,
  tileIndex,
  currentTier,
  propertyName,
  landBalance,
  onUpgrade,
}: PropertyUpgradeModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const nextTier = Math.min(4, currentTier + 1);
  const isMaxTier = currentTier >= 4;
  const currentConfig = TIER_DATA[currentTier] ?? TIER_DATA[0];
  const nextConfig = TIER_DATA[nextTier];
  const upgradeCost = nextConfig?.costLand ?? 0;
  const hasEnoughLand = landBalance >= upgradeCost;

  const handleUpgrade = async () => {
    if (isMaxTier || !hasEnoughLand) return;
    setIsUpgrading(true);
    try {
      const res = onUpgrade
        ? await onUpgrade(tileIndex, nextTier)
        : "upgrade-tx-success";
      soundEffects.playUpgrade();
      if (typeof res === "string") {
        setTxHash(res);
      }
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-md w-full p-6 rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ArrowUpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Upgrade Property Tier
            </h3>
            <p className="text-xs text-slate-400">
              Tile #{tileIndex} &bull; {propertyName}
            </p>
          </div>
        </div>

        {txHash ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">
              Upgrade Successful!
            </h4>
            <p className="text-xs text-slate-300">
              Upgraded to{" "}
              <strong>
                Tier {nextTier}: {nextConfig.name}
              </strong>
              . Rental yield generation increased to {nextConfig.rentPerHour}{" "}
              LAND/hour.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Visual Transition Card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-center">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Current
                </span>
                <p className="font-bold text-slate-200 mt-0.5">
                  Tier {currentTier}
                </p>
                <p className="text-[11px] text-slate-400">
                  {currentConfig.name}
                </p>
                <span className="inline-block mt-2 font-mono text-emerald-400 font-semibold">
                  {currentConfig.rentPerHour} LAND/hr
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30">
                <span className="text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">
                  Next
                </span>
                <p className="font-bold text-indigo-200 mt-0.5">
                  Tier {nextTier}
                </p>
                <p className="text-[11px] text-indigo-300">{nextConfig.name}</p>
                <span className="inline-block mt-2 font-mono text-emerald-300 font-bold">
                  {nextConfig.rentPerHour} LAND/hr
                </span>
              </div>
            </div>

            {/* Burn Cost Notice */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">Upgrade Cost (Burned):</span>
              </div>
              <span className="font-mono font-bold text-amber-300">
                {upgradeCost} LAND
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 px-1">
              <span>Your LAND Balance:</span>
              <span
                className={
                  hasEnoughLand
                    ? "text-slate-200"
                    : "text-red-400 font-semibold"
                }
              >
                {landBalance.toLocaleString()} LAND
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={isUpgrading || isMaxTier || !hasEnoughLand}
                className="flex-1 py-2 text-xs rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                {isUpgrading ? (
                  "Burning LAND..."
                ) : isMaxTier ? (
                  "Max Tier Reached"
                ) : !hasEnoughLand ? (
                  "Insufficient LAND"
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Burn & Upgrade
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
