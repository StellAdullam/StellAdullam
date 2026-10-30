'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export interface BuildingUpgradeParticlesProps {
  active: boolean;
  onComplete?: () => void;
}

export function BuildingUpgradeParticles({
  active,
  onComplete,
}: BuildingUpgradeParticlesProps) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; delay: number; color: string }[]
  >([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#38bdf8'];
    const generated = Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      const dist = 40 + Math.random() * 50;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: 4 + Math.random() * 4,
        delay: Math.random() * 0.2,
        color: colors[i % colors.length],
      };
    });

    setParticles(generated);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-30">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-ping"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            transform: `translate(${p.x}px, ${p.y}px)`,
            animationDuration: '1.0s',
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}
      <div className="animate-bounce text-amber-400">
        <Sparkles className="w-8 h-8 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
      </div>
    </div>
  );
}
