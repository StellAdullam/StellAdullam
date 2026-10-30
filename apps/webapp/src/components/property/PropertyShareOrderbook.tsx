"use client";

import React, { useState } from "react";
import { ArrowDownRight, ArrowUpRight, BarChart2 } from "lucide-react";
import { Card, Badge } from "@/components/ui";

export interface OrderbookEntry {
  priceUsd: number;
  shares: number;
  totalUsd: number;
}

export interface PropertyShareOrderbookProps {
  bids?: OrderbookEntry[];
  asks?: OrderbookEntry[];
  onSelectPrice?: (price: number) => void;
}

const DEFAULT_ASKS: OrderbookEntry[] = [
  { priceUsd: 50.45, shares: 120, totalUsd: 6054 },
  { priceUsd: 50.3, shares: 350, totalUsd: 17605 },
  { priceUsd: 50.15, shares: 80, totalUsd: 4012 },
];

const DEFAULT_BIDS: OrderbookEntry[] = [
  { priceUsd: 50.0, shares: 200, totalUsd: 10000 },
  { priceUsd: 49.85, shares: 450, totalUsd: 22432 },
  { priceUsd: 49.7, shares: 600, totalUsd: 29820 },
];

export function PropertyShareOrderbook({
  bids = DEFAULT_BIDS,
  asks = DEFAULT_ASKS,
  onSelectPrice,
}: PropertyShareOrderbookProps) {
  const bestBid = bids[0]?.priceUsd ?? 50.0;
  const bestAsk = asks[asks.length - 1]?.priceUsd ?? 50.15;
  const spread = Math.abs(bestAsk - bestBid);

  return (
    <Card className="p-4 border-slate-800 bg-slate-900/90 text-slate-100 space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          Share Orderbook
        </h4>
        <Badge
          variant="outline"
          className="text-[10px] border-slate-700 text-slate-400 font-mono"
        >
          Spread: ${spread.toFixed(2)}
        </Badge>
      </div>

      {/* Asks (Sell Orders - Red) */}
      <div className="space-y-1 font-mono text-xs">
        {asks.map((ask, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrice && onSelectPrice(ask.priceUsd)}
            className="flex justify-between py-1 px-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-[11px]"
          >
            <span className="text-red-400 font-semibold">
              ${ask.priceUsd.toFixed(2)}
            </span>
            <span className="text-slate-300">{ask.shares} sh</span>
            <span className="text-slate-500">
              ${ask.totalUsd.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Mid Market Price Divider */}
      <div className="py-1 px-2 rounded bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-bold">
        <span className="text-slate-400">Mid Market:</span>
        <span className="text-white font-mono">
          ${((bestBid + bestAsk) / 2).toFixed(2)} USD
        </span>
      </div>

      {/* Bids (Buy Orders - Green) */}
      <div className="space-y-1 font-mono text-xs">
        {bids.map((bid, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrice && onSelectPrice(bid.priceUsd)}
            className="flex justify-between py-1 px-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-[11px]"
          >
            <span className="text-emerald-400 font-semibold">
              ${bid.priceUsd.toFixed(2)}
            </span>
            <span className="text-slate-300">{bid.shares} sh</span>
            <span className="text-slate-500">
              ${bid.totalUsd.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
