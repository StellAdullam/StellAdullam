import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export interface EmergencyPauseBannerProps {
  isPaused: boolean;
  pausedContractName?: string;
  reason?: string;
  allowWithdrawals?: boolean;
}

export const EmergencyPauseBanner: React.FC<EmergencyPauseBannerProps> = ({
  isPaused,
  pausedContractName = "DeFi Lending Pool",
  reason = "Circuit breaker triggered pending smart contract state verification.",
  allowWithdrawals = true,
}) => {
  if (!isPaused) return null;

  return (
    <div
      role="alert"
      className="w-full bg-red-950/80 border-b border-red-500/50 px-4 py-3 text-red-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-900/60 rounded-full text-red-400">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-red-200">
              EMERGENCY PROTOCOL PAUSE ACTIVE
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-900/80 text-red-300 font-mono">
              {pausedContractName}
            </span>
          </div>
          <p className="text-xs text-red-300/90 mt-0.5">{reason}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {allowWithdrawals ? (
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded">
            Withdrawals Allowed
          </span>
        ) : (
          <span className="bg-red-900/80 text-red-300 border border-red-700/60 px-2.5 py-1 rounded">
            All State Transitions Frozen
          </span>
        )}
      </div>
    </div>
  );
};
