import React from 'react';

export interface ParcelLevelBadgeProps {
  level: number;
  showLabel?: boolean;
  className?: string;
}

export const ParcelLevelBadge: React.FC<ParcelLevelBadgeProps> = ({
  level,
  showLabel = true,
  className = '',
}) => {
  const getTierConfig = (lvl: number) => {
    switch (lvl) {
      case 3:
        return {
          name: 'Skyscraper',
          icon: '🏙️',
          style: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
        };
      case 2:
        return {
          name: 'Commercial',
          icon: '🏢',
          style: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
        };
      case 1:
        return {
          name: 'Residential',
          icon: '🏡',
          style: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
        };
      default:
        return {
          name: 'Vacant Lot',
          icon: '🌱',
          style: 'bg-slate-800 border-slate-700 text-slate-400',
        };
    }
  };

  const config = getTierConfig(level);

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-mono backdrop-blur-sm ${config.style} ${className}`}
      title={`Tier ${level}: ${config.name}`}
    >
      <span className="text-sm select-none">{config.icon}</span>
      <span className="font-bold">Lv.{level}</span>
      {showLabel && (
        <span className="text-[10px] opacity-75 font-sans hidden sm:inline">• {config.name}</span>
      )}
    </div>
  );
};
