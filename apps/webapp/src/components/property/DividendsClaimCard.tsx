"use client";

import React, { useState } from "react";
import { Coins, CheckCircle, ExternalLink, Sparkles, TrendingUp, RefreshCw } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";

export interface PropertyDividendInfo {
  propertyId: string;
  propertyName: string;
  sharesOwned: number;
  accruedUsdc: number;
  monthlyApy: number;
}

export interface DividendsClaimCardProps {
  dividends?: PropertyDividendInfo[];
  onClaim?: (propertyIds: string[]) => Promise<string | void>; // returns txHash
}

export function DividendsClaimCard({
  dividends = [
    {
      propertyId: "1",
      propertyName: "Marina Bay Horizon Penthouse",
      sharesOwned: 250,
      accruedUsdc: 48.75,
      monthlyApy: 8.4,
    },
    {
      propertyId: "2",
      propertyName: "Austin Silicon Tech Campus",
      sharesOwned: 100,
      accruedUsdc: 22.5,
      monthlyApy: 9.1,
    },
  ],
  onClaim,
}: DividendsClaimCardProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedTxHash, setClaimedTxHash] = useState<string | null>(null);

  const totalClaimable = dividends.reduce((acc, d) => acc + d.accruedUsdc, 0);

  const handleClaim = async () => {
    if (totalClaimable <= 0) return;
    setIsClaiming(true);
    try {
      const propIds = dividends.map((d) => d.propertyId);
      const tx = onClaim ? await onClaim(propIds) : "mock-tx-hash-123";
      if (typeof tx === "string") {
        setClaimedTxHash(tx);
      }
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Card className="p-6 border-slate-800 bg-slate-900/90 text-slate-100 space-y-5">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Rental Dividends
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
                USDC Streaming
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">Real estate tenant rental yields accrued on-chain</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Claimable Revenue</span>
          <p className="text-2xl font-black text-emerald-400">${totalClaimable.toFixed(2)}</p>
        </div>
      </div>

      {/* Property Breakdown Table */}
      <div className="divide-y divide-slate-800 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
        {dividends.map((item) => (
          <div key={item.propertyId} className="p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-200">{item.propertyName}</p>
              <p className="text-[11px] text-slate-400">{item.sharesOwned} Shares &bull; {item.monthlyApy}% APR</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-emerald-300 font-semibold">+${item.accruedUsdc.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Action */}
      <div className="pt-2 flex items-center justify-between">
        {claimedTxHash ? (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Dividends claimed to your Stellar wallet!</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Yields distributed automatically every 30 days</span>
          </div>
        )}

        <Button
          onClick={handleClaim}
          disabled={isClaiming || totalClaimable <= 0}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 h-9"
        >
          {isClaiming ? (
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Claiming...
            </span>
          ) : (
            `Claim $${totalClaimable.toFixed(2)} USDC`
          )}
        </Button>
      </div>
    </Card>
  );
}
