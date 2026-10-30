'use client';

import React from 'react';
import { Trophy, Medal, Building2, Crown, X, ArrowUpRight } from 'lucide-react';

export interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  propertiesOwned: number;
  highestTier: number;
  estimatedNetWorthLand: number;
}

export interface LeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserAddress?: string;
  entries?: LeaderboardEntry[];
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    address: 'GDZX...99QA',
    displayName: 'StellarBaron',
    propertiesOwned: 18,
    highestTier: 4,
    estimatedNetWorthLand: 45_200,
  },
  {
    rank: 2,
    address: 'GBTY...12KW',
    displayName: 'SorobanTycoon',
    propertiesOwned: 12,
    highestTier: 4,
    estimatedNetWorthLand: 31_800,
  },
  {
    rank: 3,
    address: 'GCPL...88TR',
    displayName: 'AdullamArchitect',
    propertiesOwned: 9,
    highestTier: 3,
    estimatedNetWorthLand: 22_400,
  },
  {
    rank: 4,
    address: 'GAKJ...44MP',
    displayName: 'LumensLandlord',
    propertiesOwned: 6,
    highestTier: 2,
    estimatedNetWorthLand: 14_900,
  },
  {
    rank: 5,
    address: 'GFMN...77PL',
    displayName: 'CryptoCadastre',
    propertiesOwned: 4,
    highestTier: 2,
    estimatedNetWorthLand: 8_750,
  },
];

export function LeaderboardDrawer({
  isOpen,
  onClose,
  currentUserAddress,
  entries = DEFAULT_LEADERBOARD,
}: LeaderboardDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="flex justify-between items-center pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">City Hall Leaderboard</h3>
              <p className="text-xs text-slate-400">Top property moguls across 400 tiles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rankings List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {entries.map((player) => {
            const isTop3 = player.rank <= 3;
            const rankBadgeColor =
              player.rank === 1
                ? 'bg-amber-400 text-slate-950 font-black'
                : player.rank === 2
                ? 'bg-slate-300 text-slate-950 font-bold'
                : player.rank === 3
                ? 'bg-amber-700 text-white font-bold'
                : 'bg-slate-800 text-slate-400 font-medium';

            return (
              <div
                key={player.address}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isTop3
                    ? 'bg-slate-950/80 border-slate-800 hover:border-amber-500/40'
                    : 'bg-slate-950/40 border-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 ${rankBadgeColor}`}
                  >
                    {player.rank}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {player.displayName}
                      {player.rank === 1 && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">{player.address}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-emerald-400">
                    {player.estimatedNetWorthLand.toLocaleString()} LAND
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {player.propertiesOwned} Plots &bull; Tier {player.highestTier} Max
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Rankings update every ledger block (~5 seconds)
        </div>
      </div>
    </div>
  );
}
