import React from 'react';

export type ActivityTier = 'pioneer' | 'governor' | 'genesis';

export interface AccountTierBadgeProps {
  accountAgeDays?: number;
  totalTransactions?: number;
  className?: string;
}

export const AccountTierBadge: React.FC<AccountTierBadgeProps> = ({
  accountAgeDays = 45,
  totalTransactions = 12,
  className = '',
}) => {
  const getTier = (days: number, txCount: number) => {
    if (days >= 180 || txCount >= 100) {
      return {
        tier: 'genesis',
        label: 'Genesis Whale',
        icon: '👑',
        style: 'bg-amber-500/10 border-amber-500/40 text-amber-300',
      };
    }
    if (days >= 30 || txCount >= 20) {
      return {
        tier: 'governor',
        label: 'Protocol Governor',
        icon: '🛡️',
        style: 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300',
      };
    }
    return {
      tier: 'pioneer',
      label: 'Early Pioneer',
      icon: '🌱',
      style: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
    };
  };

  const config = getTier(accountAgeDays, totalTransactions);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono backdrop-blur-sm ${config.style} ${className}`}
      title={`Account tier: ${config.label} (${accountAgeDays} days active, ${totalTransactions} txs)`}
    >
      <span className="text-sm select-none">{config.icon}</span>
      <span className="font-semibold">{config.label}</span>
      <span className="text-[10px] opacity-75 font-sans hidden sm:inline">({accountAgeDays}d)</span>
    </div>
  );
};
