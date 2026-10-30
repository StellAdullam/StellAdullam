import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export interface FullscreenCanvasToggleProps {
  className?: string;
}

export const FullscreenCanvasToggle: React.FC<FullscreenCanvasToggleProps> = ({
  className = '',
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen not supported or blocked
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
      className={`p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700/60 shadow-md transition-colors ${className}`}
    >
      {isFullscreen ? (
        <Minimize2 className="w-4 h-4 text-emerald-400" />
      ) : (
        <Maximize2 className="w-4 h-4 text-slate-400" />
      )}
    </button>
  );
};
