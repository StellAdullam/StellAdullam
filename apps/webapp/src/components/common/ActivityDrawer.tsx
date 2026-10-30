import React from "react";

export interface ActivityEvent {
  id: string;
  type: "deposit" | "borrow" | "repay" | "harvest" | "trade";
  title: string;
  description: string;
  timestamp: string;
  amount?: string;
  txHash?: string;
}

export interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityEvent[];
}

export const ActivityDrawer: React.FC<ActivityDrawerProps> = ({
  isOpen,
  onClose,
  activities,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Protocol Activity Feed
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time ledger audit log
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close activity feed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Activity List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No recent protocol transactions found.
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-start gap-3 text-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    {act.type === "deposit" && "📥"}
                    {act.type === "borrow" && "💳"}
                    {act.type === "repay" && "🔄"}
                    {act.type === "harvest" && "🌾"}
                    {act.type === "trade" && "🤝"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-slate-200 truncate">
                        {act.title}
                      </span>
                      {act.amount && (
                        <span className="font-mono text-cyan-400 text-[11px] shrink-0 font-medium">
                          {act.amount}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-700/40 text-[10px] text-slate-500">
                      <span>
                        {new Date(act.timestamp).toLocaleTimeString()}
                      </span>
                      {act.txHash && (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${act.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 font-mono underline"
                        >
                          {act.txHash.substring(0, 8)}...
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
