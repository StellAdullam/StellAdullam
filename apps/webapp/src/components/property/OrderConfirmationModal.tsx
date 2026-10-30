import React from 'react';

export interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  propertyName: string;
  tokenId: string;
  orderType: 'buy' | 'sell';
  shareCount: number;
  pricePerShareXlm: number;
  protocolFeeBps?: number;
  projectedAnnualYieldPercent?: number;
  isSubmitting?: boolean;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  propertyName,
  tokenId,
  orderType,
  shareCount,
  pricePerShareXlm,
  protocolFeeBps = 100, // 1%
  projectedAnnualYieldPercent = 8.5,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const subtotal = shareCount * pricePerShareXlm;
  const protocolFee = (subtotal * protocolFeeBps) / 10000;
  const total = orderType === 'buy' ? subtotal + protocolFee : subtotal - protocolFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-2 ${
                orderType === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              Confirm {orderType} Order
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">{propertyName}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Token ID: #{tokenId}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-3 font-mono text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Share Quantity</span>
            <span className="font-semibold text-white">{shareCount.toLocaleString()} Shares</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Price / Share</span>
            <span className="font-semibold text-white">{pricePerShareXlm.toFixed(2)} XLM</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Subtotal</span>
            <span className="text-white">{subtotal.toFixed(2)} XLM</span>
          </div>
          <div className="flex justify-between text-slate-400 text-xs">
            <span>Protocol Fee ({(protocolFeeBps / 100).toFixed(1)}%)</span>
            <span>{protocolFee.toFixed(3)} XLM</span>
          </div>
          <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-base">
            <span className="font-sans font-bold text-slate-200">
              Total {orderType === 'buy' ? 'Payable' : 'Receivable'}
            </span>
            <span className="font-bold text-indigo-400 text-lg">{total.toFixed(2)} XLM</span>
          </div>
        </div>

        {orderType === 'buy' && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs">
            <span className="text-emerald-300">Est. Rental Yield APY:</span>
            <span className="font-mono font-bold text-emerald-400">+{projectedAnnualYieldPercent.toFixed(2)}% / yr</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`flex-1 px-4 py-2.5 rounded-xl font-bold transition-all text-white shadow-lg ${
              orderType === 'buy'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
            } disabled:opacity-50`}
          >
            {isSubmitting ? 'Signing on Stellar...' : `Confirm ${orderType === 'buy' ? 'Purchase' : 'Sale'}`}
          </button>
        </div>
      </div>
    </div>
  );
};
