"use client";

import React from "react";

export interface GridCellTooltipProps {
  x: number;
  y: number;
  tileIndex: number;
  tier: number;
  owner?: string | null;
  listingPrice?: number | null;
  visible: boolean;
}

export function GridCellTooltip({
  x,
  y,
  tileIndex,
  tier,
  owner,
  listingPrice,
  visible,
}: GridCellTooltipProps) {
  if (!visible) return null;

  const tierNames = [
    "Vacant Lot",
    "Residential Villa",
    "Apartment Complex",
    "Commercial Tower",
    "Crown Skyscraper",
  ];
  const tierName = tierNames[tier] ?? "Unknown";

  const ariaDescription = `Tile at coordinates ${x}, ${y}. Level ${tier}: ${tierName}. ${
    owner ? `Owned by ${owner}.` : "Unclaimed property."
  } ${listingPrice ? `Listed for ${listingPrice} LAND.` : ""}`;

  return (
    <div
      role="tooltip"
      aria-label={ariaDescription}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-slate-950/95 border border-slate-800 text-[11px] text-slate-200 shadow-xl pointer-events-none whitespace-nowrap z-40 backdrop-blur-sm"
    >
      <div className="flex items-center gap-1.5 font-semibold text-white">
        <span>
          Plot ({x}, {y})
        </span>
        <span className="text-[10px] text-indigo-400 font-mono">
          #{tileIndex}
        </span>
      </div>
      <div className="text-[10px] text-slate-400 mt-0.5">
        <span>
          Tier {tier}: {tierName}
        </span>
      </div>
      {listingPrice && (
        <div className="text-[10px] text-amber-400 font-mono font-bold mt-0.5">
          For Sale: {listingPrice} LAND
        </div>
      )}
    </div>
  );
}
