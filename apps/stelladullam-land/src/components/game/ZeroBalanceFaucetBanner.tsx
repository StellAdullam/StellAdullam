"use client";

import React from "react";
import Link from "next/link";
import { Gift, ArrowRight, Coins } from "lucide-react";

export interface ZeroBalanceFaucetBannerProps {
  landBalance: number;
  onClaimFaucet?: () => void;
}

export function ZeroBalanceFaucetBanner({
  landBalance,
  onClaimFaucet,
}: ZeroBalanceFaucetBannerProps) {
  if (landBalance > 0) return null;

  return (
    <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-100 flex items-center justify-between shadow-lg backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Gift className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Need In-Game Currency?
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Your LAND balance is 0. Claim 1,000 free testnet LAND tokens from
            the faucet to buy plots and upgrade buildings!
          </p>
        </div>
      </div>

      <div>
        {onClaimFaucet ? (
          <button
            onClick={onClaimFaucet}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Claim 1,000 LAND</span>
          </button>
        ) : (
          <Link
            href="/onboarding"
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <span>Visit Faucet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
