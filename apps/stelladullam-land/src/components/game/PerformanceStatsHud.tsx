import React, { useEffect, useState } from 'react';

export interface PerformanceStatsHudProps {
  totalEntities?: number;
  drawCalls?: number;
  initialVisible?: boolean;
}

export const PerformanceStatsHud: React.FC<PerformanceStatsHudProps> = ({
  totalEntities = 400,
  drawCalls = 1,
  initialVisible = false,
}) => {
  const [fps, setFps] = useState<number>(60);
  const [isVisible, setIsVisible] = useState<boolean>(initialVisible);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (currentTime: number) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-3 right-3 z-30 p-1.5 px-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[10px] text-slate-400 font-mono hover:text-white backdrop-blur-sm"
        title="Show Performance HUD"
      >
        {fps} FPS
      </button>
    );
  }

  const fpsColor =
    fps >= 55 ? 'text-emerald-400' : fps >= 30 ? 'text-amber-400' : 'text-rose-400 animate-pulse';

  return (
    <div className="fixed bottom-3 right-3 z-30 p-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md text-[11px] font-mono text-slate-300 w-48 select-none">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800 text-xs font-sans">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Engine Diagnostics
        </span>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white p-0.5"
          aria-label="Close HUD"
        >
          ✕
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-400">Frame Rate:</span>
          <span className={`font-bold ${fpsColor}`}>{fps} FPS</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Grid Entities:</span>
          <span className="text-slate-200">{totalEntities} parcels</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Batched Draws:</span>
          <span className="text-slate-200">{drawCalls} pass</span>
        </div>
      </div>
    </div>
  );
};
