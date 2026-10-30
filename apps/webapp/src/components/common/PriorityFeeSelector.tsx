import React, { useState } from 'react';

export type PrioritySpeed = 'normal' | 'fast' | 'turbo';

export interface PriorityFeeOption {
  speed: PrioritySpeed;
  label: string;
  feeStroops: number;
  estSeconds: number;
  icon: string;
}

export const DEFAULT_PRIORITY_FEES: Record<PrioritySpeed, PriorityFeeOption> = {
  normal: { speed: 'normal', label: 'Standard', feeStroops: 100, estSeconds: 5, icon: '🐢' },
  fast: { speed: 'fast', label: 'Fast', feeStroops: 500, estSeconds: 3, icon: '⚡' },
  turbo: { speed: 'turbo', label: 'Turbo Priority', feeStroops: 1000, estSeconds: 2, icon: '🚀' },
};

export interface PriorityFeeSelectorProps {
  selectedSpeed?: PrioritySpeed;
  onChange?: (speed: PrioritySpeed, feeStroops: number) => void;
  className?: string;
}

export const PriorityFeeSelector: React.FC<PriorityFeeSelectorProps> = ({
  selectedSpeed = 'normal',
  onChange,
  className = '',
}) => {
  const [currentSpeed, setCurrentSpeed] = useState<PrioritySpeed>(selectedSpeed);

  const handleSelect = (speed: PrioritySpeed) => {
    setCurrentSpeed(speed);
    const option = DEFAULT_PRIORITY_FEES[speed];
    onChange?.(speed, option.feeStroops);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-xs font-mono text-slate-400">
        <span>Transaction Speed & Priority Fee</span>
        <span className="text-indigo-400">{DEFAULT_PRIORITY_FEES[currentSpeed].feeStroops} stroops</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(DEFAULT_PRIORITY_FEES) as PrioritySpeed[]).map((speed) => {
          const opt = DEFAULT_PRIORITY_FEES[speed];
          const isSelected = currentSpeed === speed;

          return (
            <button
              key={speed}
              type="button"
              onClick={() => handleSelect(speed)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md shadow-indigo-950/40 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">{opt.icon}</span>
                <span className="text-[10px] font-mono opacity-80">~{opt.estSeconds}s</span>
              </div>
              <div className="text-xs font-bold leading-tight">{opt.label}</div>
              <div className="text-[10px] font-mono opacity-70 mt-0.5">{opt.feeStroops} stroops</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
