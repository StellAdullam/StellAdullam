import React, { useState } from 'react';

export interface ParcelQuickSearchInputProps {
  onSearch: (x: number, y: number) => void;
  gridSize?: number;
  className?: string;
}

export const ParcelQuickSearchInput: React.FC<ParcelQuickSearchInputProps> = ({
  onSearch,
  gridSize = 20,
  className = '',
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Pattern 1: Coordinate format "x, y" or "x,y"
    const coordMatch = trimmed.match(/^(\d{1,2})\s*,\s*(\d{1,2})$/);
    if (coordMatch) {
      const x = parseInt(coordMatch[1], 10);
      const y = parseInt(coordMatch[2], 10);
      if (x < gridSize && y < gridSize) {
        onSearch(x, y);
        setQuery('');
        return;
      }
    }

    // Pattern 2: Parcel ID number "#145" or "145"
    const idMatch = trimmed.replace(/^#/, '').match(/^(\d+)$/);
    if (idMatch) {
      const id = parseInt(idMatch[1], 10);
      if (id < gridSize * gridSize) {
        const x = id % gridSize;
        const y = Math.floor(id / gridSize);
        onSearch(x, y);
        setQuery('');
        return;
      }
    }

    alert(`Invalid search. Enter coordinates (0-${gridSize - 1}, 0-${gridSize - 1}) or parcel ID (#0-${gridSize * gridSize - 1}).`);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <span className="absolute left-2.5 text-xs text-slate-400 select-none">🔍</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search (e.g. 10,12 or #45)..."
        className="w-48 pl-7 pr-12 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/80 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 backdrop-blur-md"
      />
      {query && (
        <button
          type="submit"
          className="absolute right-1.5 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold font-mono transition-colors"
        >
          Go
        </button>
      )}
    </form>
  );
};
