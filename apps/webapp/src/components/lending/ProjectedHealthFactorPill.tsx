import React from "react";

export interface ProjectedHealthFactorPillProps {
  currentHf: number;
  projectedHf: number;
}

export const ProjectedHealthFactorPill: React.FC<
  ProjectedHealthFactorPillProps
> = ({ currentHf, projectedHf }) => {
  const isImprovement = projectedHf > currentHf;
  const isDangerous = projectedHf < 1.15;

  const getPillColor = (hf: number) => {
    if (hf >= 1.5)
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (hf >= 1.25) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    if (hf >= 1.15) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse";
  };

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs shadow-sm">
      <span className="text-slate-400 text-[11px]">Health Factor:</span>
      <span className="font-mono text-slate-300 font-medium">
        {currentHf === Infinity ? "∞" : currentHf.toFixed(2)}
      </span>
      <span className="text-slate-500">➔</span>
      <span
        className={`font-mono font-bold px-1.5 py-0.5 rounded border text-[11px] ${getPillColor(projectedHf)}`}
      >
        {projectedHf === Infinity ? "∞" : projectedHf.toFixed(2)}
        {isImprovement ? " ↑" : " ↓"}
      </span>
      {isDangerous && (
        <span className="text-[10px] text-rose-400 font-semibold ml-0.5">
          ⚠️ Risk
        </span>
      )}
    </div>
  );
};
