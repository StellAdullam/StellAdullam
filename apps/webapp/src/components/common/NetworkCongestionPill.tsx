import React from "react";

export type CongestionLevel = "optimal" | "moderate" | "congested";

export interface NetworkCongestionPillProps {
  baseFeeStroops?: number;
  ledgerCloseTimeMs?: number;
  className?: string;
}

export const NetworkCongestionPill: React.FC<NetworkCongestionPillProps> = ({
  baseFeeStroops = 100,
  ledgerCloseTimeMs = 5000,
  className = "",
}) => {
  const getCongestionLevel = (fee: number): CongestionLevel => {
    if (fee <= 150) return "optimal";
    if (fee <= 500) return "moderate";
    return "congested";
  };

  const level = getCongestionLevel(baseFeeStroops);

  const statusConfig = {
    optimal: {
      label: "Network Optimal",
      bgColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      dotColor: "bg-emerald-400",
      description: "Ledger close ~5s • Normal base fee (100 stroops)",
    },
    moderate: {
      label: "Moderate Traffic",
      bgColor: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      dotColor: "bg-amber-400",
      description: "Minor queueing • Base fee slightly elevated",
    },
    congested: {
      label: "High Congestion",
      bgColor: "bg-rose-500/10 border-rose-500/30 text-rose-400",
      dotColor: "bg-rose-400 animate-ping",
      description: "Fee bumping recommended for instant settlement",
    },
  }[level];

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono border backdrop-blur-md transition-all ${statusConfig.bgColor} ${className}`}
      title={`${statusConfig.description} | Fee: ${baseFeeStroops} stroops (${(ledgerCloseTimeMs / 1000).toFixed(1)}s close)`}
      role="status"
      aria-label={`Stellar network status: ${statusConfig.label}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${statusConfig.dotColor}`}
        />
      </span>
      <span className="font-medium tracking-wide">{statusConfig.label}</span>
      <span className="text-[10px] opacity-75">({baseFeeStroops} stroops)</span>
    </div>
  );
};
