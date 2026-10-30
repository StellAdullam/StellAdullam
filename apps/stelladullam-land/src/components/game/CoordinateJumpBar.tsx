import React, { useState } from 'react';

export interface CoordinateJumpBarProps {
  onJumpToCoordinate: (x: number, y: number) => void;
  maxCoordinate?: number; // 20x20 grid -> 0 to 19
}

export const CoordinateJumpBar: React.FC<CoordinateJumpBarProps> = ({
  onJumpToCoordinate,
  maxCoordinate = 19,
}) => {
  const [xInput, setXInput] = useState<string>('');
  const [yInput, setYInput] = useState<string>('');
  const [idInput, setIdInput] = useState<string>('');
  const [mode, setMode] = useState<'coord' | 'id'>('coord');
  const [error, setError] = useState<string | null>(null);

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'coord') {
      const x = parseInt(xInput, 10);
      const y = parseInt(yInput, 10);

      if (isNaN(x) || isNaN(y) || x < 0 || x > maxCoordinate || y < 0 || y > maxCoordinate) {
        setError(`Coordinates must be between 0 and ${maxCoordinate}`);
        return;
      }

      onJumpToCoordinate(x, y);
    } else {
      const id = parseInt(idInput, 10);
      const maxId = (maxCoordinate + 1) * (maxCoordinate + 1) - 1;

      if (isNaN(id) || id < 0 || id > maxId) {
        setError(`Property ID must be between 0 and ${maxId}`);
        return;
      }

      const x = id % (maxCoordinate + 1);
      const y = Math.floor(id / (maxCoordinate + 1));
      onJumpToCoordinate(x, y);
    }
  };

  const handlePreset = (x: number, y: number) => {
    setError(null);
    setXInput(x.toString());
    setYInput(y.toString());
    onJumpToCoordinate(x, y);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg text-xs">
      <form onSubmit={handleJump} className="flex items-center gap-1.5">
        <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
          <button
            type="button"
            onClick={() => setMode('coord')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              mode === 'coord' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            (X, Y)
          </button>
          <button
            type="button"
            onClick={() => setMode('id')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              mode === 'id' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Parcel #
          </button>
        </div>

        {mode === 'coord' ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="X"
              min={0}
              max={maxCoordinate}
              value={xInput}
              onChange={(e) => setXInput(e.target.value)}
              className="w-12 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-500">:</span>
            <input
              type="number"
              placeholder="Y"
              min={0}
              max={maxCoordinate}
              value={yInput}
              onChange={(e) => setYInput(e.target.value)}
              className="w-12 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        ) : (
          <input
            type="number"
            placeholder="ID (0-399)"
            min={0}
            max={(maxCoordinate + 1) * (maxCoordinate + 1) - 1}
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            className="w-24 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        )}

        <button
          type="submit"
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded transition-colors"
        >
          Jump
        </button>
      </form>

      <div className="h-4 w-px bg-slate-700 hidden sm:block" />

      <div className="flex items-center gap-1 text-[11px] text-slate-400">
        <span>Hotspots:</span>
        <button
          type="button"
          onClick={() => handlePreset(10, 10)}
          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Center (10,10)
        </button>
        <button
          type="button"
          onClick={() => handlePreset(2, 2)}
          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Financial (2,2)
        </button>
      </div>

      {error && <span className="text-rose-400 text-[11px] ml-1">{error}</span>}
    </div>
  );
};
