import React, { useState } from "react";

export interface SessionDisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisconnect: (purgeLocalData: boolean) => void;
  stellarAddress: string;
}

export const SessionDisconnectModal: React.FC<SessionDisconnectModalProps> = ({
  isOpen,
  onClose,
  onDisconnect,
  stellarAddress,
}) => {
  const [purgeLocalData, setPurgeLocalData] = useState(false);

  if (!isOpen) return null;

  const truncated = `${stellarAddress.slice(0, 4)}...${stellarAddress.slice(-4)}`;

  const handleConfirm = () => {
    onDisconnect(purgeLocalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
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

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Disconnect Wallet
            </h2>
            <p className="text-xs font-mono text-slate-400">{truncated}</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Are you sure you want to disconnect? You will need to sign back in
          with your Stellar wallet to submit transactions.
        </p>

        <label className="flex items-start gap-2 text-xs text-slate-300 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={purgeLocalData}
            onChange={(e) => setPurgeLocalData(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 text-rose-600 focus:ring-rose-500 bg-slate-800"
          />
          <span className="text-slate-400">
            Clear cached session tokens and local portfolio history from this
            device
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
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};
