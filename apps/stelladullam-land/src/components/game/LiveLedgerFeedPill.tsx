import React from 'react';
import { Radio, CheckCircle } from 'lucide-react';

export interface LiveLedgerFeedPillProps {
  currentLedgerSequence: number;
  recentTransactionsCount?: number;
  isSyncing?: boolean;
  className?: string;
}

export const LiveLedgerFeedPill: React.FC<LiveLedgerFeedPillProps> = ({
  currentLedgerSequence,
  recentTransactionsCount = 0,
  isSyncing = false,
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs shadow-md ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <Radio
          className={`w-3.5 h-3.5 ${
            isSyncing ? 'text-amber-400 animate-spin' : 'text-emerald-400 animate-pulse'
          }`}
        />
        <span className="text-slate-400 font-medium">Stellar Ledger</span>
      </div>

      <span className="font-mono text-slate-200 font-semibold">
        #{currentLedgerSequence.toLocaleString()}
      </span>

      {recentTransactionsCount > 0 && (
        <>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-emerald-400 font-medium">
            {recentTransactionsCount} txs
          </span>
        </>
      )}
    </div>
  );
};
