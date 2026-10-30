import React from 'react';

export interface SponsorshipStatusPillProps {
  isSponsored?: boolean;
  remainingDailyQuota?: number;
  maxDailyQuota?: number;
  className?: string;
}

export const SponsorshipStatusPill: React.FC<SponsorshipStatusPillProps> = ({
  isSponsored = true,
  remainingDailyQuota = 8,
  maxDailyQuota = 10,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border backdrop-blur-md transition-all ${
        isSponsored
          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
          : 'bg-slate-800/80 border-slate-700/80 text-slate-400'
      } ${className}`}
      title={
        isSponsored
          ? `Protocol sponsors your transaction gas! (${remainingDailyQuota}/${maxDailyQuota} daily free transactions remaining)`
          : 'Standard Stellar network fee applied (approx 100 stroops)'
      }
    >
      <span className="text-xs select-none">{isSponsored ? '🎁' : '⛽'}</span>
      <span className="font-semibold">{isSponsored ? 'Gas Free' : 'Self-Funded'}</span>
      {isSponsored && (
        <span className="text-[10px] opacity-75 font-sans">
          ({remainingDailyQuota}/{maxDailyQuota})
        </span>
      )}
    </div>
  );
};
