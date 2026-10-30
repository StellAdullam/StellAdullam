import React from 'react';
import { Crosshair } from 'lucide-react';

export interface GridCoordinatesLabelProps {
  x: number;
  y: number;
  isOccupied?: boolean;
  className?: string;
}

export const GridCoordinatesLabel: React.FC<GridCoordinatesLabelProps> = ({
  x,
  y,
  isOccupied = false,
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 text-xs font-mono shadow-md ${className}`}
    >
      <Crosshair className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-slate-300">
        X:{x} Y:{y}
      </span>
      <span className="text-slate-600">|</span>
      <span
        className={`text-[11px] font-sans ${
          isOccupied ? 'text-emerald-400 font-medium' : 'text-slate-400'
        }`}
      >
        {isOccupied ? 'Developed' : 'Vacant'}
      </span>
    </div>
  );
};
