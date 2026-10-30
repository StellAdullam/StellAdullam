"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  Globe,
  ShieldAlert,
  X,
} from "lucide-react";
import { Button, Card } from "@/components/ui";

export interface NetworkGuardModalProps {
  currentNetwork: string; // e.g. "PUBLIC" | "MAINNET" | "TESTNET"
  expectedNetwork?: string; // defaults to "TESTNET"
  onSwitchNetwork?: () => void;
  onDismiss?: () => void;
}

export function NetworkGuardModal({
  currentNetwork,
  expectedNetwork = "TESTNET",
  onSwitchNetwork,
  onDismiss,
}: NetworkGuardModalProps) {
  const [isOpen, setIsOpen] = useState(
    currentNetwork.toUpperCase() !== expectedNetwork.toUpperCase(),
  );

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="max-w-md w-full p-6 border-amber-500/30 bg-slate-900 text-slate-100 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Network Mismatch</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              Connected: {currentNetwork.toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          StellAdullam is currently operating on the{" "}
          <strong>Stellar {expectedNetwork}</strong>. Your connected wallet is
          set to{" "}
          <span className="text-red-400 font-semibold">
            {currentNetwork.toUpperCase()}
          </span>
          . To interact with smart contracts and prevent real funds from being
          used, please switch your wallet network.
        </p>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 mb-5">
          <p className="font-semibold text-slate-300">
            How to switch in Freighter / xBull:
          </p>
          <p>1. Open your browser wallet extension</p>
          <p>2. Click Settings &rarr; Network</p>
          <p>
            3. Select <strong>Stellar Testnet</strong>
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 text-xs border-slate-700 hover:bg-slate-800"
          >
            Acknowledge & Continue
          </Button>
          {onSwitchNetwork && (
            <Button
              onClick={onSwitchNetwork}
              className="flex-1 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium"
            >
              Switch to Testnet
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
