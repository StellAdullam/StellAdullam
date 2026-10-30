"use client";

import React, { useState } from "react";
import { ArrowDownLeft, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";

export interface LoanRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolId: string;
  assetSymbol?: string;
  currentDebtUsdc: number;
  accruedInterestUsdc: number;
  currentHealthFactor: number;
  userBalanceUsdc?: number;
  onRepay?: (repayAmount: number) => Promise<string | void>;
}

export function LoanRepaymentModal({
  isOpen,
  onClose,
  poolId,
  assetSymbol = "USDC",
  currentDebtUsdc = 12_500,
  accruedInterestUsdc = 85.5,
  currentHealthFactor = 1.18,
  userBalanceUsdc = 20_000,
  onRepay,
}: LoanRepaymentModalProps) {
  const totalDue = currentDebtUsdc + accruedInterestUsdc;
  const [repayAmount, setRepayAmount] = useState<number>(Math.min(totalDue, 1000));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMax = () => {
    setRepayAmount(Math.min(totalDue, userBalanceUsdc));
  };

  const remainingDebt = Math.max(0, totalDue - repayAmount);
  const newHealthFactor =
    remainingDebt === 0
      ? 999.0
      : Number(((currentHealthFactor * totalDue) / remainingDebt).toFixed(2));

  const handleSubmit = async () => {
    if (repayAmount <= 0) return;
    setIsSubmitting(true);
    try {
      const res = onRepay ? await onRepay(repayAmount) : "repay-tx-success";
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
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Repay Loan Debt</h3>
            <p className="text-xs text-slate-400">Extinguish borrow position & boost health factor</p>
          </div>
        </div>

        {txHash ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-semibold text-white">Repayment Confirmed!</h4>
            <p className="text-xs text-slate-300">
              Successfully repaid ${repayAmount.toLocaleString()} {assetSymbol}. Remaining debt: ${remainingDebt.toLocaleString()} {assetSymbol}.
            </p>
            <div className="pt-2">
              <Button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Total Debt Breakdown */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Principal Borrowed:</span>
                <span className="text-slate-200 font-mono">${currentDebtUsdc.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Accrued Interest:</span>
                <span className="text-amber-400 font-mono">+${accruedInterestUsdc.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-850 pt-1.5 font-semibold text-white">
                <span>Total Outstanding Debt:</span>
                <span className="font-mono text-emerald-400">${totalDue.toLocaleString()} {assetSymbol}</span>
              </div>
            </div>

            {/* Repay Input */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-slate-400">Repay Amount ({assetSymbol})</span>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Pay Full (${totalDue.toLocaleString()})
                </button>
              </div>
              <input
                type="number"
                min="1"
                max={totalDue}
                value={repayAmount}
                onChange={(e) => setRepayAmount(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Health Factor Boost Preview */}
            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>New Health Factor:</span>
              </div>
              <div className="font-mono font-bold text-emerald-400">
                {currentHealthFactor.toFixed(2)} &rarr; {newHealthFactor >= 99 ? "∞" : newHealthFactor.toFixed(2)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1 border-slate-700">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || repayAmount <= 0 || repayAmount > userBalanceUsdc}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                {isSubmitting ? "Submitting..." : `Repay $${repayAmount.toLocaleString()}`}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
