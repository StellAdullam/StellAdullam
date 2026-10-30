import React, { useState, useEffect } from "react";

export type DisplayUnit = "XLM" | "USD";

export interface DisplayCurrencySwitchProps {
  initialUnit?: DisplayUnit;
  onChange?: (unit: DisplayUnit) => void;
  className?: string;
}

export const DisplayCurrencySwitch: React.FC<DisplayCurrencySwitchProps> = ({
  initialUnit = "XLM",
  onChange,
  className = "",
}) => {
  const [unit, setUnit] = useState<DisplayUnit>(() => {
    try {
      const stored = localStorage.getItem("stelladullam_display_unit");
      return stored === "USD" ? "USD" : initialUnit;
    } catch {
      return initialUnit;
    }
  });

  const handleSelect = (newUnit: DisplayUnit) => {
    setUnit(newUnit);
    try {
      localStorage.setItem("stelladullam_display_unit", newUnit);
    } catch {
      // Ignore
    }
    onChange?.(newUnit);
  };

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg border border-slate-700/60 bg-slate-950/60 backdrop-blur-md text-xs font-mono ${className}`}
      role="group"
      aria-label="Display currency selector"
    >
      <button
        type="button"
        onClick={() => handleSelect("XLM")}
        className={`px-2 py-1 rounded-md font-bold transition-all ${
          unit === "XLM"
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        XLM
      </button>
      <button
        type="button"
        onClick={() => handleSelect("USD")}
        className={`px-2 py-1 rounded-md font-bold transition-all ${
          unit === "USD"
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        USD ($)
      </button>
    </div>
  );
};
