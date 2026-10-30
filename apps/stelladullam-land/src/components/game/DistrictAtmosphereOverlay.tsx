import React, { useMemo } from 'react';

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export interface DistrictAtmosphereOverlayProps {
  timeOfDay?: TimeOfDay;
  weather?: 'clear' | 'fog' | 'rain' | 'aurora';
}

export const DistrictAtmosphereOverlay: React.FC<DistrictAtmosphereOverlayProps> = ({
  timeOfDay = 'day',
  weather = 'clear',
}) => {
  const overlayStyle = useMemo(() => {
    let background = 'transparent';

    switch (timeOfDay) {
      case 'dawn':
        background =
          'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(244, 63, 94, 0.05) 50%, rgba(30, 27, 75, 0.15) 100%)';
        break;
      case 'dusk':
        background =
          'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(139, 92, 246, 0.1) 60%, rgba(15, 23, 42, 0.25) 100%)';
        break;
      case 'night':
        background =
          'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(2, 6, 23, 0.5) 100%)';
        break;
      case 'day':
      default:
        background = 'radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.04) 0%, transparent 70%)';
        break;
    }

    return {
      background,
      pointerEvents: 'none' as const,
    };
  }, [timeOfDay]);

  return (
    <div
      className="absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out pointer-events-none"
      style={overlayStyle}
      aria-hidden="true"
    >
      {weather === 'fog' && (
        <div className="absolute inset-0 bg-slate-400/10 backdrop-blur-[0.5px] transition-all" />
      )}
      {weather === 'aurora' && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 animate-pulse" />
      )}
    </div>
  );
};
