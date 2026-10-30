import React, { useState } from 'react';

export interface CollateralLockupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  propertyName: string;
  sharesAmount: number;
  valuationUsd: number;
  maxBorrowPowerUsd: number;
  liquidationThresholdPercent?: number;
}

export const CollateralLockupModal: React.FC<CollateralLockupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  propertyName,
  sharesAmount,
  valuationUsd,
  maxBorrowPowerUsd,
  liquidationThresholdPercent = 80,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!agreed || loading) return;
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Collateral Escrow Lockup</h2>
            <p className="text-xs text-slate-400">Lock RWA Property Shares</p>
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Asset Title</span>
            <span className="font-semibold text-slate-200">{propertyName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Lockup Volume</span>
            <span className="font-mono text-cyan-400 font-semibold">{sharesAmount.toLocaleString()} Shares</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Collateral Valuation</span>
            <span className="font-semibold text-white">${valuationUsd.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Max Borrow Capacity</span>
            <span className="font-semibold text-emerald-400">${maxBorrowPowerUsd.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-700/40">
            <span className="text-slate-400">Liquidation Threshold</span>
            <span className="font-mono text-rose-400 font-bold">{liquidationThresholdPercent}%</span>
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-slate-400 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
          />
          <span>
            I acknowledge that escrowed shares may be liquidated by automated protocol bots if loan health factor drops below 1.0.
          </span>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!agreed || loading}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white transition-colors"
          >
            {loading ? 'Locking in Escrow...' : 'Confirm Escrow Lockup'}
          </button>
        </div>
      </div>
    </div>
  );
};
