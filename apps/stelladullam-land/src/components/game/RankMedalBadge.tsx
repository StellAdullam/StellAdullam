import React from "react";

export interface RankMedalBadgeProps {
  rank: number; // 1, 2, 3, etc.
}

export const RankMedalBadge: React.FC<RankMedalBadgeProps> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-900 font-extrabold text-xs shadow-md shadow-amber-500/30 border border-yellow-200"
        title="1st Place (Gold)"
      >
        1
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-extrabold text-xs shadow-md shadow-slate-400/30 border border-slate-100"
        title="2nd Place (Silver)"
      >
        2
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-slate-100 font-extrabold text-xs shadow-md shadow-amber-700/30 border border-amber-400"
        title="3rd Place (Bronze)"
      >
        3
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-semibold text-xs border border-slate-700"
      title={`Rank #${rank}`}
    >
      {rank}
    </div>
  );
};
