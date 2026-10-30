import React, { useState } from "react";

export interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  actionTitle: string;
  amount?: string;
  ledgerSequence?: number;
  feeStroops?: number;
  network?: "testnet" | "public";
}

export const TransactionReceiptModal: React.FC<
  TransactionReceiptModalProps
> = ({
  isOpen,
  onClose,
  txHash,
  actionTitle,
  amount,
  ledgerSequence,
  feeStroops = 100,
  network = "testnet",
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const explorerUrl = `https://stellar.expert/explorer/${network}/tx/${txHash}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            Transaction Confirmed
          </h2>
          <p className="text-xs text-slate-400 mt-1">{actionTitle}</p>
        </div>

        <div className="space-y-3 rounded-xl bg-slate-800/60 border border-slate-700/50 p-4 mb-6 text-xs">
          {amount && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Transferred</span>
              <span className="font-semibold text-emerald-400 text-sm">
                {amount}
              </span>
            </div>
          )}

          {ledgerSequence && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Ledger Sequence</span>
              <span className="font-mono text-slate-200">
                #{ledgerSequence.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Network Fee</span>
            <span className="font-mono text-slate-200">
              {feeStroops} Stroops ({(feeStroops / 10_000_000).toFixed(7)} XLM)
            </span>
          </div>

          <div className="pt-2 border-t border-slate-700/40">
            <span className="text-slate-400 block mb-1.5">
              Transaction Hash
            </span>
            <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono text-[11px] text-slate-300">
              <span className="truncate">{txHash}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 font-sans font-medium text-xs shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-medium text-sm text-white transition-colors flex items-center justify-center gap-2"
          >
            <span>View on Stellar Expert</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-sm text-slate-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
