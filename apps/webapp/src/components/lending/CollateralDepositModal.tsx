"use client";

import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Lock,
  ShieldCheck,
  ArrowRight,
  X,
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";

export interface PropertyShareCollateralOption {
  propertyId: string;
  name: string;
  sharesOwned: number;
  sharePriceUsd: number;
  collateralFactorPercent: number; // e.g. 75%
}

export interface CollateralDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProperties?: PropertyShareCollateralOption[];
  onDeposit?: (propertyId: string, shares: number) => Promise<string | void>;
}

export function CollateralDepositModal({
  isOpen,
  onClose,
  availableProperties = [
    {
      propertyId: "1",
      name: "Marina Bay Horizon Penthouse",
      sharesOwned: 500,
      sharePriceUsd: 50,
      collateralFactorPercent: 75,
    },
    {
      propertyId: "2",
      name: "Austin Silicon Tech Campus",
      sharesOwned: 200,
      sharePriceUsd: 120,
      collateralFactorPercent: 70,
    },
  ],
  onDeposit,
}: CollateralDepositModalProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    availableProperties[0]?.propertyId ?? "1",
  );
  const [sharesToDeposit, setSharesToDeposit] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedProp =
    availableProperties.find((p) => p.propertyId === selectedPropertyId) ??
    availableProperties[0];

  const totalCollateralValueUsd =
    (sharesToDeposit || 0) * (selectedProp?.sharePriceUsd ?? 0);
  const borrowingPowerUnlockedUsd =
    totalCollateralValueUsd *
    ((selectedProp?.collateralFactorPercent ?? 75) / 100);

  const handleMax = () => {
    if (selectedProp) {
      setSharesToDeposit(selectedProp.sharesOwned);
    }
  };

  const handleSubmit = async () => {
    if (sharesToDeposit <= 0 || !selectedProp) return;
    setIsSubmitting(true);
    try {
      const res = onDeposit
        ? await onDeposit(selectedProp.propertyId, sharesToDeposit)
        : "mock-deposit-tx-hash";
      if (typeof res === "string") {
        setTxHash(res);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="max-w-md w-full p-6 border-slate-800 bg-slate-900 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Deposit RWA Collateral
            </h3>
            <p className="text-xs text-slate-400">
              Lock real estate shares into Soroban lending pool
            </p>
          </div>
        </div>

        {txHash ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-semibold text-white">
              Collateral Deposited!
            </h4>
            <p className="text-xs text-slate-300">
              {sharesToDeposit} shares of &ldquo;{selectedProp?.name}&rdquo;
              successfully locked as collateral.
            </p>
            <div className="pt-2">
              <Button
                onClick={onClose}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Property Selector */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Select Property Shares
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => {
                  setSelectedPropertyId(e.target.value);
                  setSharesToDeposit(10);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {availableProperties.map((p) => (
                  <option key={p.propertyId} value={p.propertyId}>
                    {p.name} ({p.sharesOwned} shares available)
                  </option>
                ))}
              </select>
            </div>

            {/* Shares Input */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-slate-400">Shares to Lock</span>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Max: {selectedProp?.sharesOwned}
                </button>
              </div>
              <input
                type="number"
                min="1"
                max={selectedProp?.sharesOwned ?? 1}
                value={sharesToDeposit}
                onChange={(e) =>
                  setSharesToDeposit(Number(e.target.value) || 0)
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Calculations Breakdown */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Appraised Value Locked:</span>
                <span className="font-semibold text-white">
                  ${totalCollateralValueUsd.toLocaleString()} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Collateral Factor:</span>
                <span className="font-semibold text-indigo-400">
                  {selectedProp?.collateralFactorPercent}%
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-850 pt-1.5">
                <span className="text-slate-300 font-medium">
                  New Borrowing Power:
                </span>
                <span className="font-bold text-emerald-400">
                  +${borrowingPowerUnlockedUsd.toLocaleString()} USDC
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  sharesToDeposit <= 0 ||
                  (selectedProp && sharesToDeposit > selectedProp.sharesOwned)
                }
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
              >
                {isSubmitting ? "Locking Shares..." : "Confirm Deposit"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
