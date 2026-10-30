import React from "react";

export interface AutoRefreshToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  intervalSeconds?: number;
  onManualRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AutoRefreshToggle: React.FC<AutoRefreshToggleProps> = ({
  enabled,
  onToggle,
  intervalSeconds = 10,
  onManualRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm">
      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        className="flex items-center gap-1.5 focus:outline-none"
        aria-label="Toggle auto refresh"
      >
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            enabled ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
          }`}
        />
        <span className="text-[11px] text-slate-400">
          Auto ({intervalSeconds}s)
        </span>
      </button>

      {onManualRefresh && (
        <button
          type="button"
          onClick={onManualRefresh}
          disabled={isRefreshing}
          className="text-slate-400 hover:text-white transition-colors p-0.5 rounded"
          title="Manual refresh"
          aria-label="Refresh now"
        >
          <svg
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
