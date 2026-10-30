import React from 'react';

export interface CompassNavHudProps {
  onPan?: (dx: number, dy: number) => void;
  className?: string;
}

export const CompassNavHud: React.FC<CompassNavHudProps> = ({
  onPan,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center bg-slate-900/80 border border-slate-700/60 rounded-xl p-1.5 backdrop-blur-md shadow-lg ${className}`}
      title="Directional Navigation Compass"
      role="navigation"
      aria-label="Map directional panning controls"
    >
      <button
        type="button"
        onClick={() => onPan?.(0, -1)}
        className="w-6 h-6 flex items-center justify-center text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
        title="Pan North"
      >
        ▲
      </button>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPan?.(-1, 0)}
          className="w-6 h-6 flex items-center justify-center text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Pan West"
        >
          ◀
        </button>
        <span className="text-[10px] font-mono font-bold text-indigo-400 select-none px-0.5">
          🧭
        </span>
        <button
          type="button"
          onClick={() => onPan?.(1, 0)}
          className="w-6 h-6 flex items-center justify-center text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Pan East"
        >
          ▶
        </button>
      </div>

      <button
        type="button"
        onClick={() => onPan?.(0, 1)}
        className="w-6 h-6 flex items-center justify-center text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
        title="Pan South"
      >
        ▼
      </button>
    </div>
  );
};
