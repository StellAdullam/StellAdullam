import React from "react";

export interface CoordinateDistanceWidgetProps {
  fromCoords: [number, number];
  toCoords: [number, number];
  className?: string;
}

export const CoordinateDistanceWidget: React.FC<
  CoordinateDistanceWidgetProps
> = ({ fromCoords, toCoords, className = "" }) => {
  const [x1, y1] = fromCoords;
  const [x2, y2] = toCoords;

  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);

  const manhattanDistance = dx + dy;
  const euclideanDistance = Math.sqrt(dx * dx + dy * dy);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/80 backdrop-blur-md text-xs font-mono shadow-md ${className}`}
      title={`Distance between (${x1}, ${y1}) and (${x2}, ${y2})`}
    >
      <span className="text-slate-400">📏</span>
      <div className="flex items-center gap-1.5 text-slate-300">
        <span>Dist:</span>
        <span className="font-bold text-white">
          {euclideanDistance.toFixed(1)} blocks
        </span>
        <span className="text-[10px] text-slate-500">
          ({manhattanDistance} grid steps)
        </span>
      </div>
    </div>
  );
};
