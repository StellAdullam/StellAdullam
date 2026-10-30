import React from 'react';

export interface DistrictLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DistrictLegendModal: React.FC<DistrictLegendModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const districts = [
    {
      name: 'Financial Core',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      coords: 'X: 0-9, Y: 0-9',
      bonus: '+15% Commercial Yield',
      desc: 'High-density commercial hubs and algorithmic trading houses.',
    },
    {
      name: 'Tech Corridor',
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      coords: 'X: 10-19, Y: 0-9',
      bonus: '+10% Innovation APY',
      desc: 'Research laboratories and Soroban validator computing clusters.',
    },
    {
      name: 'Waterfront Residences',
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      coords: 'X: 0-9, Y: 10-19',
      bonus: '+20% Residential Rental Cap',
      desc: 'Scenic shoreline apartments with elevated baseline lease stability.',
    },
    {
      name: 'Arts & Cultural Quarter',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      coords: 'X: 10-19, Y: 10-19',
      bonus: '5% Protocol Fee Discount',
      desc: 'Vibrant civic squares, public art galleries, and governance forums.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close district guide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span>🗺️</span>
          Municipal District Synergy Guide
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Properties within coordinated districts receive cooperative yield synergy bonuses.
        </p>

        <div className="space-y-3 mb-6">
          {districts.map((d) => (
            <div
              key={d.name}
              className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col gap-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{d.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${d.color}`}>
                  {d.bonus}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{d.desc}</p>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">{d.coords}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium text-sm text-white transition-colors"
        >
          Explore Map
        </button>
      </div>
    </div>
  );
};
