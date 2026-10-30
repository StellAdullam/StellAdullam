'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Volume2, VolumeX, Compass } from 'lucide-react';
import { soundEffects } from './audio/SoundEffects';

export interface MapZoomControlsProps {
  zoom: number; // e.g. 1.0
  onZoomChange: (newZoom: number) => void;
  selectedCoord?: { x: number; y: number } | null;
  onResetView?: () => void;
}

export function MapZoomControls({
  zoom,
  onZoomChange,
  selectedCoord,
  onResetView,
}: MapZoomControlsProps) {
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted());

  const handleZoomIn = () => {
    const next = Math.min(2.0, zoom + 0.15);
    onZoomChange(next);
    soundEffects.playTileSelect();
  };

  const handleZoomOut = () => {
    const next = Math.max(0.6, zoom - 0.15);
    onZoomChange(next);
    soundEffects.playTileSelect();
  };

  const handleReset = () => {
    onZoomChange(1.0);
    if (onResetView) onResetView();
    soundEffects.playTileSelect();
  };

  const handleToggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="flex flex-col gap-2 items-end">
      {/* 20x20 Minimap Radar */}
      <div className="w-24 h-24 bg-slate-950/90 border border-slate-800 rounded-lg p-1.5 shadow-xl backdrop-blur-sm relative">
        <div className="w-full h-full border border-dashed border-slate-800 rounded relative">
          <span className="absolute top-0.5 left-1 text-[8px] font-mono text-slate-500 flex items-center gap-0.5">
            <Compass className="w-2 h-2" /> 20x20
          </span>
          {selectedCoord && (
            <div
              className="absolute w-2 h-2 bg-indigo-500 rounded-full animate-ping"
              style={{
                left: `${(selectedCoord.x / 20) * 100}%`,
                top: `${(selectedCoord.y / 20) * 100}%`,
              }}
            />
          )}
          {selectedCoord && (
            <div
              className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full border border-white"
              style={{
                left: `${(selectedCoord.x / 20) * 100}%`,
                top: `${(selectedCoord.y / 20) * 100}%`,
              }}
            />
          )}
        </div>
      </div>

      {/* Floating Buttons Bar */}
      <div className="flex flex-col gap-1 bg-slate-950/90 border border-slate-800 rounded-lg p-1 shadow-xl backdrop-blur-sm">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 2.0}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors disabled:opacity-40"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleReset}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors text-[10px] font-mono"
          title="Reset Zoom (100%)"
          aria-label="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.6}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors disabled:opacity-40"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="h-px bg-slate-800 my-0.5" />

        <button
          onClick={handleToggleMute}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>
    </div>
  );
}
