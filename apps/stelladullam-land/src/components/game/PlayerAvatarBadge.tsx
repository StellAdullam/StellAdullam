'use client';

import React from 'react';
import { colorHash } from '@/lib/colorHash';

export interface PlayerAvatarBadgeProps {
  address: string;
  size?: number; // size in px, default 36
  showStatus?: boolean;
  className?: string;
}

export function PlayerAvatarBadge({
  address,
  size = 36,
  showStatus = false,
  className = '',
}: PlayerAvatarBadgeProps) {
  const color = colorHash(address);
  const initial = address ? address.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-bold select-none text-white shadow-inner ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: Math.round(size * 0.45),
        boxShadow: `0 0 8px ${color}55`,
      }}
      title={`Player Avatar: ${address}`}
    >
      <span>{initial}</span>

      {showStatus && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-slate-900 bg-emerald-400"
          style={{
            width: Math.max(8, Math.round(size * 0.3)),
            height: Math.max(8, Math.round(size * 0.3)),
          }}
        />
      )}
    </div>
  );
}
