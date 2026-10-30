import React from 'react';

export type KycTier = 'none' | 'retail' | 'institutional';

export interface KycVerificationBadgeProps {
  kycTier?: KycTier;
  onVerifyClick?: () => void;
  className?: string;
}

export const KycVerificationBadge: React.FC<KycVerificationBadgeProps> = ({
  kycTier = 'none',
  onVerifyClick,
  className = '',
}) => {
  const configs = {
    institutional: {
      label: 'Institutional Accredited',
      icon: '🛡️',
      style: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
      tooltip: 'Full institutional KYC compliance verified on Stellar',
    },
    retail: {
      label: 'KYC Verified',
      icon: '✅',
      style: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300',
      tooltip: 'Standard retail investor verification complete',
    },
    none: {
      label: 'Unverified KYC',
      icon: '⚠️',
      style: 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200',
      tooltip: 'Click to complete KYC verification for higher lending limits',
    },
  }[kycTier];

  return (
    <button
      type="button"
      onClick={kycTier === 'none' ? onVerifyClick : undefined}
      disabled={kycTier !== 'none'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono backdrop-blur-sm transition-all ${configs.style} ${className}`}
      title={configs.tooltip}
      aria-label={`KYC status: ${configs.label}`}
    >
      <span className="text-sm select-none">{configs.icon}</span>
      <span className="font-semibold">{configs.label}</span>
      {kycTier === 'none' && (
        <span className="text-[10px] text-indigo-400 font-sans font-bold underline ml-0.5">
          Verify
        </span>
      )}
    </button>
  );
};
