import React, { useState } from "react";

export interface ClaimAllDividendsButtonProps {
  totalUnharvestedLand: number;
  ownedPropertiesCount: number;
  onClaimAll: () => Promise<void>;
}

export const ClaimAllDividendsButton: React.FC<
  ClaimAllDividendsButtonProps
> = ({ totalUnharvestedLand, ownedPropertiesCount, onClaimAll }) => {
  const [claiming, setClaiming] = useState(false);

  if (ownedPropertiesCount === 0 || totalUnharvestedLand <= 0) {
    return null;
  }

  const handleClaim = async () => {
    if (claiming) return;
    try {
      setClaiming(true);
      await onClaimAll();
    } finally {
      setClaiming(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClaim}
      disabled={claiming}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
      aria-label="Harvest all rental income"
    >
      <span className="text-sm">🌾</span>
      <span>
        {claiming
          ? "Harvesting..."
          : `Claim ${Math.floor(totalUnharvestedLand)} LAND (${ownedPropertiesCount} Plots)`}
      </span>
    </button>
  );
};
