import React from 'react';

export interface TaxAppraisalModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  parcelId: string;
  assessedValueUsd: number;
  xlmUsdRate?: number;
  taxYear?: number;
}

export const TaxAppraisalModal: React.FC<TaxAppraisalModalProps> = ({
  isOpen,
  onClose,
  propertyTitle,
  parcelId,
  assessedValueUsd,
  xlmUsdRate = 0.12,
  taxYear = 2026,
}) => {
  if (!isOpen) return null;

  // Typical municipal tax rate: 1.25% annual
  const municipalRate = 0.0125;
  const annualTaxUsd = assessedValueUsd * municipalRate;
  const monthlyTaxUsd = annualTaxUsd / 12;
  const assessedValueXlm = assessedValueUsd / xlmUsdRate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Municipal Tax Assessment</h2>
            <p className="text-xs text-slate-400">Tax Year {taxYear} Official Cadastral Evaluation</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-5">
          <div className="text-xs text-slate-400">Assessed Property</div>
          <div className="text-sm font-semibold text-slate-200 mt-0.5">{propertyTitle}</div>
          <div className="text-[11px] font-mono text-cyan-400 mt-0.5">Cadastral ID: {parcelId}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-xs text-slate-400">Certified Valuation</div>
            <div className="text-base font-bold text-white mt-0.5">
              ${assessedValueUsd.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              ~{Math.round(assessedValueXlm).toLocaleString()} XLM
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-xs text-slate-400">Annual Tax Liability</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">
              ${annualTaxUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400">
              ~${monthlyTaxUsd.toFixed(2)}/mo escrow
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-800 pt-4 mb-6 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Municipal Assessment Ratio</span>
            <span className="font-mono">100.0% of fair market</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">County General Fund (0.65%)</span>
            <span className="font-mono">${(assessedValueUsd * 0.0065).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Local District Schools (0.45%)</span>
            <span className="font-mono">${(assessedValueUsd * 0.0045).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Smart Grid & Infrastructure (0.15%)</span>
            <span className="font-mono">${(assessedValueUsd * 0.0015).toFixed(2)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 transition-colors"
        >
          Close Assessment
        </button>
      </div>
    </div>
  );
};
