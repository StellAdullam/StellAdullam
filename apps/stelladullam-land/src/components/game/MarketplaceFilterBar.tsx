'use client';

import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export interface MarketplaceFilterState {
  searchQuery: string;
  selectedTier: number | 'all';
  sortBy: 'price_asc' | 'price_desc' | 'newest';
}

export interface MarketplaceFilterBarProps {
  filters: MarketplaceFilterState;
  onChange: (filters: MarketplaceFilterState) => void;
  onReset: () => void;
}

export function MarketplaceFilterBar({
  filters,
  onChange,
  onReset,
}: MarketplaceFilterBarProps) {
  const tiers: { label: string; value: number | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Lots (T0)', value: 0 },
    { label: 'Villas (T1)', value: 1 },
    { label: 'Apartments (T2)', value: 2 },
    { label: 'Commercial (T3)', value: 3 },
    { label: 'Skyscrapers (T4)', value: 4 },
  ];

  return (
    <div className="space-y-3 p-4 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 shadow-md">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tile or district..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Sort selector & reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value as 'price_asc' | 'price_desc' | 'newest',
              })
            }
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Recently Listed</option>
          </select>

          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reset Filters"
            aria-label="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tier Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tiers.map((t) => (
          <button
            key={String(t.value)}
            onClick={() => onChange({ ...filters, selectedTier: t.value })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              filters.selectedTier === t.value
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
