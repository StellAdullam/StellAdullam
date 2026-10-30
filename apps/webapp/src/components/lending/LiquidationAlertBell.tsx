import React, { useState } from "react";

export interface LiquidationAlertItem {
  poolId: string;
  poolName: string;
  borrowedAmount: string;
  healthFactor: number;
}

export interface LiquidationAlertBellProps {
  alerts: LiquidationAlertItem[];
  onOpenRepay?: (poolId: string) => void;
  onOpenDeposit?: (poolId: string) => void;
}

export const LiquidationAlertBell: React.FC<LiquidationAlertBellProps> = ({
  alerts,
  onOpenRepay,
  onOpenDeposit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const criticalCount = alerts.filter((a) => a.healthFactor < 1.15).length;
  const warningCount = alerts.length - criticalCount;

  if (alerts.length === 0) {
    return (
      <button
        type="button"
        className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800"
        title="No active liquidation risks"
        aria-label="No liquidation warnings"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all ${
          criticalCount > 0
            ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 animate-pulse"
            : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
        }`}
        aria-label={`Liquidation Alerts: ${alerts.length}`}
        aria-expanded={isOpen}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span
          className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold rounded-full text-white ${
            criticalCount > 0 ? "bg-rose-600" : "bg-amber-600"
          }`}
        >
          {alerts.length}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Liquidation Watchlist
            </span>
            <span className="text-xs text-slate-400">
              {alerts.length} position{alerts.length > 1 ? "s" : ""} at risk
            </span>
          </div>

          <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.poolId}
                className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200">
                    {alert.poolName}
                  </span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      alert.healthFactor < 1.15
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    HF: {alert.healthFactor.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Borrowed: {alert.borrowedAmount}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {onOpenRepay && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenRepay(alert.poolId);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-xs py-1 px-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                    >
                      Repay
                    </button>
                  )}
                  {onOpenDeposit && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenDeposit(alert.poolId);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-xs py-1 px-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors"
                    >
                      Add Collateral
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
