import React, { useState } from 'react';
import { X, ExternalLink, ArrowRight, DollarSign, ShieldCheck } from 'lucide-react';

export interface SupportedAnchorOption {
  code: string;
  currency: string;
  feeBps: number;
  sep24Url: string;
}

const DEFAULT_ANCHORS: SupportedAnchorOption[] = [
  { code: 'USDC', currency: 'US Dollar (USD)', feeBps: 20, sep24Url: 'https://anchor.stelladullam.io/sep24/deposit' },
  { code: 'EURC', currency: 'Euro (EUR)', feeBps: 25, sep24Url: 'https://anchor.stelladullam.io/sep24/deposit/eur' },
  { code: 'NGNT', currency: 'Nigerian Naira (NGN)', feeBps: 50, sep24Url: 'https://anchor.stelladullam.io/sep24/deposit/ngn' },
];

export interface FiatOnrampModalProps {
  isOpen: boolean;
  onClose: () => void;
  stellarAddress?: string;
}

export const FiatOnrampModal: React.FC<FiatOnrampModalProps> = ({
  isOpen,
  onClose,
  stellarAddress,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<string>('USDC');
  const [depositAmount, setDepositAmount] = useState<number>(100);

  if (!isOpen) return null;

  const currentAnchor = DEFAULT_ANCHORS.find((a) => a.code === selectedAsset) || DEFAULT_ANCHORS[0];
  const feeAmount = (depositAmount * currentAnchor.feeBps) / 10000;
  const netReceived = Math.max(0, depositAmount - feeAmount);

  const handleLaunchSep24 = () => {
    const targetUrl = new URL(currentAnchor.sep24Url);
    if (stellarAddress) {
      targetUrl.searchParams.set('account', stellarAddress);
    }
    targetUrl.searchParams.set('amount', depositAmount.toString());
    window.open(targetUrl.toString(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fiat-onramp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-slate-100 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 id="fiat-onramp-modal-title" className="font-semibold text-base">
              Fiat On-Ramp (SEP-24)
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Select Anchor Asset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DEFAULT_ANCHORS.map((anchor) => (
                <button
                  key={anchor.code}
                  type="button"
                  onClick={() => setSelectedAsset(anchor.code)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    selectedAsset === anchor.code
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {anchor.code}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Deposit Amount (USD)
            </label>
            <input
              type="number"
              min="10"
              max="50000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Anchor Est. Fee ({(currentAnchor.feeBps / 100).toFixed(2)}%)</span>
              <span className="font-mono text-slate-200">${feeAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-slate-200 border-t border-slate-800 pt-2">
              <span>Estimated Net Received</span>
              <span className="font-mono text-emerald-400 font-semibold">
                ${netReceived.toFixed(2)} {currentAnchor.code}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Regulated Stellar SEP-24 Anchor integration with direct bank transfer.</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLaunchSep24}
            className="flex-1 py-2 px-3 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-950"
          >
            <span>Proceed to Anchor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
