"use client";

import React, { useState } from "react";
import { QrCode, Copy, Check, ExternalLink, X, Smartphone } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";

export interface StellarQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationAddress: string;
  amount?: number | string;
  assetCode?: string;
  memo?: string;
}

export function StellarQrModal({
  isOpen,
  onClose,
  destinationAddress,
  amount = 100,
  assetCode = "USDC",
  memo,
}: StellarQrModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // SEP-0007 compliant web+stellar pay URI
  const params = new URLSearchParams();
  params.set("destination", destinationAddress);
  if (amount) params.set("amount", String(amount));
  if (assetCode && assetCode !== "XLM") params.set("asset_code", assetCode);
  if (memo) params.set("memo", memo);

  const sep7Uri = `web+stellar:pay?${params.toString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sep7Uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="max-w-sm w-full p-6 border-slate-800 bg-slate-900 text-slate-100 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white">Stellar QR Payment</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Scan with Lobstr, Vibrant, or any SEP-0007 mobile wallet
        </p>

        {/* QR Code Container */}
        <div className="my-5 p-4 bg-white rounded-xl mx-auto w-48 h-48 flex items-center justify-center shadow-inner relative">
          {/* SVG QR Code Pattern Mock */}
          <div className="w-full h-full border-4 border-slate-900 rounded p-2 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-8 h-8 bg-slate-900 rounded-sm" />
              <div className="w-8 h-8 bg-slate-900 rounded-sm" />
            </div>
            <div className="text-center font-mono text-[9px] text-slate-800 font-bold uppercase tracking-widest">
              {assetCode} &bull; {amount}
            </div>
            <div className="flex justify-between items-end">
              <div className="w-8 h-8 bg-slate-900 rounded-sm" />
              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                ★
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-left space-y-1 mb-4">
          <div className="flex justify-between">
            <span className="text-slate-400">Amount:</span>
            <span className="font-semibold text-white">{amount} {assetCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Destination:</span>
            <span className="font-mono text-indigo-300 text-[11px] truncate max-w-[170px]">
              {destinationAddress}
            </span>
          </div>
        </div>

        {/* Copy & Deep Link */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex-1 text-xs border-slate-700 hover:bg-slate-800"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" /> Copy URI
              </span>
            )}
          </Button>
          <a
            href={sep7Uri}
            className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" /> Open Wallet
          </a>
        </div>
      </Card>
    </div>
  );
}
