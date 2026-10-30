import React, { useState } from "react";

export interface GridBoundaryToggleProps {
  initialVisible?: boolean;
  onToggle?: (visible: boolean) => void;
  className?: string;
}

export const GridBoundaryToggle: React.FC<GridBoundaryToggleProps> = ({
  initialVisible = true,
  onToggle,
  className = "",
}) => {
  const [visible, setVisible] = useState(initialVisible);

  const handleToggle = () => {
    const next = !visible;
    setVisible(next);
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono backdrop-blur-md transition-all shadow-sm ${
        visible
          ? "bg-indigo-950/60 border-indigo-500/50 text-indigo-300"
          : "bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200"
      } ${className}`}
      title={
        visible ? "Hide parcel boundary lines" : "Show parcel boundary lines"
      }
      aria-label="Toggle parcel boundary grid lines"
    >
      <span className="text-sm select-none">📐</span>
      <span className="font-sans font-medium">
        {visible ? "Grid Lines ON" : "Grid Lines"}
      </span>
    </button>
  );
};
