import React from "react";
import { Play, Square } from "lucide-react";

export interface AutoTourToggleProps {
  isTouring: boolean;
  onToggle: (touring: boolean) => void;
  className?: string;
}

export const AutoTourToggle: React.FC<AutoTourToggleProps> = ({
  isTouring,
  onToggle,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(!isTouring)}
      title={
        isTouring ? "Stop automated city tour" : "Start automated city tour"
      }
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-sm ${
        isTouring
          ? "bg-amber-950/60 border-amber-600/70 text-amber-300 hover:bg-amber-900/60"
          : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800"
      } ${className}`}
    >
      {isTouring ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>Stop Tour</span>
        </>
      ) : (
        <>
          <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
          <span>City Tour</span>
        </>
      )}
    </button>
  );
};
