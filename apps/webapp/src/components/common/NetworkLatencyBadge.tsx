import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export interface NetworkLatencyBadgeProps {
  latencyMs: number;
  rpcProvider?: string;
  isOnline?: boolean;
  className?: string;
}

export const NetworkLatencyBadge: React.FC<NetworkLatencyBadgeProps> = ({
  latencyMs,
  rpcProvider = 'Stellar Testnet RPC',
  isOnline = true,
  className = '',
}) => {
  if (!isOnline) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-950/40 text-red-400 border border-red-800/60 ${className}`}
      >
        <WifiOff className="w-3.5 h-3.5" />
        <span>RPC Offline</span>
      </div>
    );
  }

  const isFast = latencyMs < 120;
  const isModerate = latencyMs >= 120 && latencyMs < 300;

  return (
    <div
      title={`Connected to ${rpcProvider} (${latencyMs}ms)`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        isFast
          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
          : isModerate
          ? 'bg-amber-950/40 text-amber-300 border-amber-800/60'
          : 'bg-red-950/40 text-red-300 border-red-800/60'
      } ${className}`}
    >
      <Wifi className={`w-3.5 h-3.5 ${isFast ? 'text-emerald-400' : isModerate ? 'text-amber-400' : 'text-red-400'}`} />
      <span className="font-mono">{latencyMs} ms</span>
      <span className="text-slate-500">•</span>
      <span className="text-slate-400 text-[11px] truncate max-w-[100px]">{rpcProvider}</span>
    </div>
  );
};
