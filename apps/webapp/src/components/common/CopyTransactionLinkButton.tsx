import React, { useState } from "react";

export interface CopyTransactionLinkButtonProps {
  txHash: string;
  network?: "testnet" | "public";
  className?: string;
}

export const CopyTransactionLinkButton: React.FC<
  CopyTransactionLinkButtonProps
> = ({ txHash, network = "testnet", className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `https://stellar.expert/explorer/${network}/tx/${txHash}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
        copied
          ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
          : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
      } ${className}`}
      title="Copy Stellar Expert explorer link to clipboard"
      aria-label="Copy transaction link"
    >
      <span className="text-xs select-none">{copied ? "✅" : "🔗"}</span>
      <span className="font-sans">{copied ? "Link Copied!" : "Copy Link"}</span>
    </button>
  );
};
