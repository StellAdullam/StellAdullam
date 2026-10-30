"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface GameErrorFallbackProps {
  error?: Error | string | null;
  reset?: () => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export function GameErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  description = "An error occurred while communicating with the Stellar network or loading game state.",
  actionText = "Try Again",
}: GameErrorFallbackProps) {
  const errorMessage =
    typeof error === "string" ? error : error?.message || null;

  return (
    <div className="min-h-[420px] w-full flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 shadow-xl shadow-rose-950/20">
        <AlertTriangle className="h-8 w-8 text-rose-400" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
        {description}
      </p>

      {errorMessage && (
        <div className="mb-6 max-w-md w-full rounded-lg bg-slate-900/90 border border-slate-800 p-3 text-left font-mono text-xs text-rose-300 break-all overflow-x-auto">
          <code>{errorMessage}</code>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 transition shadow-lg shadow-indigo-600/20"
          >
            <RefreshCw size={14} />
            {actionText}
          </button>
        )}

        <Link
          href="/map"
          className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs px-5 py-2.5 transition"
        >
          <Compass size={14} />
          Explore City Map
        </Link>
      </div>
    </div>
  );
}

interface GameEmptyStateProps {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: React.ReactNode;
}

export function GameEmptyState({
  title = "No properties owned yet",
  description = "Claim starter LAND from the testnet faucet and acquire your first sector on the city grid.",
  actionHref = "/map",
  actionLabel = "Head to City Map",
  icon,
}: GameEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center flex flex-col items-center justify-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-400">
        {icon || <Compass className="h-7 w-7 text-indigo-400" />}
      </div>
      <h4 className="text-base font-bold text-white mb-1.5">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 transition shadow-lg shadow-indigo-600/20"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

