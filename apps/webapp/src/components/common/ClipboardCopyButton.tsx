"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export interface ClipboardCopyButtonProps {
  text: string;
  label?: string;
  truncate?: boolean;
  className?: string;
}

export function ClipboardCopyButton({
  text,
  label,
  truncate = false,
  className = "",
}: ClipboardCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayText =
    truncate && text.length > 12
      ? `${text.slice(0, 6)}...${text.slice(-4)}`
      : (label ?? text);

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono border transition-all ${
        copied
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
      } ${className}`}
      title={`Copy to clipboard: ${text}`}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      )}
      <span>{copied ? "Copied!" : displayText}</span>
    </button>
  );
}
