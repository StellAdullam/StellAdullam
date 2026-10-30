import React, { useState, useEffect } from 'react';

export interface BalancePrivacyToggleProps {
  onToggle?: (isPrivate: boolean) => void;
  storageKey?: string;
  className?: string;
}

export const BalancePrivacyToggle: React.FC<BalancePrivacyToggleProps> = ({
  onToggle,
  storageKey = 'stelladullam_privacy_mask',
  className = '',
}) => {
  const [isMasked, setIsMasked] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        const masked = stored === 'true';
        setIsMasked(masked);
        onToggle?.(masked);
      }
    } catch {
      // Ignore localStorage exceptions in restricted environments
    }
  }, [storageKey, onToggle]);

  const handleToggle = () => {
    const nextState = !isMasked;
    setIsMasked(nextState);
    try {
      localStorage.setItem(storageKey, String(nextState));
    } catch {
      // Ignore
    }
    onToggle?.(nextState);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
        isMasked
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
      } ${className}`}
      aria-label={isMasked ? 'Reveal balances' : 'Mask balances'}
      title={isMasked ? 'Click to show financial balances' : 'Click to hide sensitive financial balances'}
    >
      <span className="text-sm select-none">{isMasked ? '🙈' : '👁️'}</span>
      <span className="hidden sm:inline">{isMasked ? 'Balances Hidden' : 'Hide Balances'}</span>
    </button>
  );
};
