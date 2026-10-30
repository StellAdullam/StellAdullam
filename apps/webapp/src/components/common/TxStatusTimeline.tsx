import React from "react";

export type TxStep =
  | "simulating"
  | "signing"
  | "broadcasting"
  | "confirmed"
  | "failed";

export interface TxStatusTimelineProps {
  currentStep: TxStep;
  errorMessage?: string;
  txHash?: string;
  className?: string;
}

export const TxStatusTimeline: React.FC<TxStatusTimelineProps> = ({
  currentStep,
  errorMessage,
  txHash,
  className = "",
}) => {
  const steps: Array<{ id: TxStep; label: string; icon: string }> = [
    { id: "simulating", label: "Simulate", icon: "⚡" },
    { id: "signing", label: "Wallet Sign", icon: "✍️" },
    { id: "broadcasting", label: "Broadcast", icon: "📡" },
    { id: "confirmed", label: "Confirmed", icon: "✅" },
  ];

  const getStepIndex = (step: TxStep): number => {
    switch (step) {
      case "simulating":
        return 0;
      case "signing":
        return 1;
      case "broadcasting":
        return 2;
      case "confirmed":
        return 3;
      case "failed":
        return -1;
    }
  };

  const activeIndex = getStepIndex(currentStep);

  return (
    <div
      className={`space-y-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 ${className}`}
    >
      <div className="flex items-center justify-between relative">
        {/* Connector Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />

        {steps.map((s, idx) => {
          const isDone = activeIndex > idx || currentStep === "confirmed";
          const isCurrent = activeIndex === idx && currentStep !== "failed";
          const isFailed = currentStep === "failed" && activeIndex === idx;

          let badgeStyle = "bg-slate-900 border-slate-800 text-slate-500";
          if (isDone)
            badgeStyle =
              "bg-emerald-950/80 border-emerald-500 text-emerald-400";
          else if (isCurrent)
            badgeStyle =
              "bg-indigo-950 border-indigo-500 text-indigo-300 animate-pulse";
          else if (isFailed)
            badgeStyle = "bg-rose-950 border-rose-500 text-rose-400";

          return (
            <div
              key={s.id}
              className="flex flex-col items-center relative z-10 space-y-1.5"
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold backdrop-blur-md transition-all ${badgeStyle}`}
              >
                {isDone ? "✓" : s.icon}
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {currentStep === "failed" && errorMessage && (
        <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 font-mono">
          <span className="font-bold">Error:</span> {errorMessage}
        </div>
      )}

      {currentStep === "confirmed" && txHash && (
        <div className="text-center text-[11px] font-mono text-emerald-400">
          Transaction confirmed in ledger! Hash: {txHash.slice(0, 8)}...
          {txHash.slice(-8)}
        </div>
      )}
    </div>
  );
};
