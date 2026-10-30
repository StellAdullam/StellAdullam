import React, { useState } from 'react';

export interface RandomVacantJumpButtonProps {
  gridSize?: number;
  occupiedCoordinates?: Set<string> | string[];
  onJumpTo: (x: number, y: number) => void;
  className?: string;
}

export const RandomVacantJumpButton: React.FC<RandomVacantJumpButtonProps> = ({
  gridSize = 20,
  occupiedCoordinates = new Set<string>(),
  onJumpTo,
  className = '',
}) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleJump = () => {
    setIsSearching(true);

    const occupiedSet =
      occupiedCoordinates instanceof Set
        ? occupiedCoordinates
        : new Set(occupiedCoordinates);

    const vacant: Array<[number, number]> = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const key = `${x},${y}`;
        if (!occupiedSet.has(key)) {
          vacant.push([x, y]);
        }
      }
    }

    if (vacant.length === 0) {
      alert('All parcels in this district are currently claimed!');
      setIsSearching(false);
      return;
    }

    const randomIndex = Math.floor(Math.random() * vacant.length);
    const [targetX, targetY] = vacant[randomIndex];

    setTimeout(() => {
      onJumpTo(targetX, targetY);
      setIsSearching(false);
    }, 200);
  };

  return (
    <button
      type="button"
      onClick={handleJump}
      disabled={isSearching}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 font-mono text-xs font-semibold backdrop-blur-md transition-all shadow-cyan-950/30 shadow disabled:opacity-50 ${className}`}
      title="Jump camera to a random vacant parcel available to claim"
    >
      <span className="text-sm">🎲</span>
      <span>{isSearching ? 'Scanning Grid...' : 'Find Vacant Land'}</span>
    </button>
  );
};
