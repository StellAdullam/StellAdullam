import React, { useState, useEffect } from "react";

export interface HighContrastToggleProps {
  onToggle?: (isHighContrast: boolean) => void;
  className?: string;
}

export const HighContrastToggle: React.FC<HighContrastToggleProps> = ({
  onToggle,
  className = "",
}) => {
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem("stelladullam_high_contrast") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isHighContrast]);

  const handleToggle = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    try {
      localStorage.setItem("stelladullam_high_contrast", String(next));
    } catch {
      // Ignore
    }
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
        isHighContrast
          ? "bg-yellow-400 border-yellow-300 text-black font-bold shadow-md"
          : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800"
      } ${className}`}
      title={
        isHighContrast
          ? "Disable high contrast mode"
          : "Enable high contrast accessibility mode"
      }
      aria-label="Toggle high contrast accessibility mode"
    >
      <span className="text-sm select-none">🔲</span>
      <span className="hidden sm:inline font-sans font-medium">
        {isHighContrast ? "High Contrast ON" : "High Contrast"}
      </span>
    </button>
  );
};
