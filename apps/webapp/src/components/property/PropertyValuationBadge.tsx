"use client";

import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  ExternalLink,
} from "lucide-react";

interface PropertyValuationBadgeProps {
  isVerified: boolean;
  appraisedValueUsd: number;
  valuationDate?: string;
  deedIpfsHash?: string;
  verifierName?: string;
}

export function PropertyValuationBadge({
  isVerified,
  appraisedValueUsd,
  valuationDate,
  deedIpfsHash,
  verifierName = "StellAdullam Legal Custody",
}: PropertyValuationBadgeProps) {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(appraisedValueUsd);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isVerified ? (
            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
              <ShieldCheck size={18} />
            </div>
          ) : (
            <div className="p-1 rounded-full bg-amber-500/10 text-amber-400">
              <FileText size={18} />
            </div>
          )}
          <span className="text-xs font-bold text-white tracking-wide">
            {isVerified ? "Audited Real Estate Asset" : "Pending Title Audit"}
          </span>
        </div>

        <span
          className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            isVerified
              ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-400"
              : "bg-amber-950/60 border-amber-500/30 text-amber-400"
          }`}
        >
          {isVerified ? "Verified Deed" : "Under Review"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">
            Appraised Valuation
          </span>
          <span className="font-extrabold text-white text-sm font-mono">
            {formattedValue}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">
            Valuation Entity
          </span>
          <span className="font-medium text-slate-200 text-xs truncate block">
            {verifierName}
          </span>
        </div>
      </div>

      {deedIpfsHash && (
        <a
          href={`https://ipfs.io/ipfs/${deedIpfsHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition pt-1"
        >
          <FileText size={12} />
          <span>View Title Registry Deed Document</span>
          <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}
