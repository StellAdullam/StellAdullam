import React, { useState } from "react";

export type TimeOfDay = "day" | "sunset" | "night";

export interface DayNightToggleProps {
  initialTime?: TimeOfDay;
  onTimeChange?: (time: TimeOfDay) => void;
  className?: string;
}

export const DayNightToggle: React.FC<DayNightToggleProps> = ({
  initialTime = "day",
  onTimeChange,
  className = "",
}) => {
  const [time, setTime] = useState<TimeOfDay>(initialTime);

  const times: Array<{ id: TimeOfDay; icon: string; label: string }> = [
    { id: "day", icon: "☀️", label: "Daylight" },
    { id: "sunset", icon: "🌅", label: "Sunset" },
    { id: "night", icon: "🌙", label: "Neon Night" },
  ];

  const handleCycle = () => {
    const currentIndex = times.findIndex((t) => t.id === time);
    const nextIndex = (currentIndex + 1) % times.length;
    const nextTime = times[nextIndex].id;
    setTime(nextTime);
    onTimeChange?.(nextTime);
  };

  const currentConfig = times.find((t) => t.id === time)!;

  return (
    <button
      type="button"
      onClick={handleCycle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 backdrop-blur-md transition-all shadow-md ${className}`}
      title="Click to cycle atmospheric lighting (Day, Sunset, Night)"
      aria-label={`Current atmospheric lighting: ${currentConfig.label}`}
    >
      <span className="text-sm select-none">{currentConfig.icon}</span>
      <span className="font-sans font-medium">{currentConfig.label}</span>
    </button>
  );
};
