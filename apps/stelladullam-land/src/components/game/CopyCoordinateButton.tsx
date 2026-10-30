import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export interface CopyCoordinateButtonProps {
  x: number;
  y: number;
  parcelId?: number | string;
  className?: string;
}

export const CopyCoordinateButton: React.FC<CopyCoordinateButtonProps> = ({
  x,
  y,
  parcelId,
  className = "",
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy =
      parcelId !== undefined
        ? `Parcel #${parcelId} (X: ${x}, Y: ${y})`
        : `Coordinates: (${x}, ${y})`;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy coordinates to clipboard"
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700/60 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300 font-mono text-[11px]">
            Copied!
          </span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-[11px]">
            X:{x} Y:{y}
          </span>
        </>
      )}
    </button>
  );
};
