import React from 'react';
import { X, Wrench, Clock, AlertCircle } from 'lucide-react';

export interface MaintenanceNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maintenanceWindow?: string;
  affectedServices?: string[];
  description?: string;
}

export const MaintenanceNoticeModal: React.FC<MaintenanceNoticeModalProps> = ({
  isOpen,
  onClose,
  title = 'Scheduled Network Maintenance',
  maintenanceWindow = 'Sunday, 02:00 - 04:00 UTC',
  affectedServices = ['Soroban Smart Contract State Transitions', 'Automated Liquidation Sweeps'],
  description = 'StellAdullam will undergo scheduled protocol maintenance to apply Soroban node upgrades. Read-only portfolio browsing remains accessible.',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="maintenance-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 id="maintenance-modal-title" className="font-semibold text-base">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{description}</p>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">Window: {maintenanceWindow}</span>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-400 mb-2">Affected Services</span>
          <ul className="space-y-1.5">
            {affectedServices.map((svc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{svc}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors mt-2"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};
