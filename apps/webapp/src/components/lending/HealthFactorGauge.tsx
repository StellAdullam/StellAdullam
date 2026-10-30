"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react";

interface HealthFactorGaugeProps {
  healthFactor: number; // e.g. 1.85, or Infinity if no debt
  size?: number; // size in pixels, default 140
  showLabel?: boolean;
}

export function HealthFactorGauge({
  healthFactor,
  size = 140,
  showLabel = true,
}: HealthFactorGaugeProps) {
  const isInfinity = !isFinite(healthFactor) || healthFactor >= 99;

  // Determine risk category
  let status: "safe" | "warning" | "danger" = "safe";
  let color = "#10b981"; // Emerald
  let label = "Low Risk";
  let Icon = ShieldCheck;

  if (isInfinity) {
    status = "safe";
    color = "#10b981";
    label = "No Debt";
    Icon = ShieldCheck;
  } else if (healthFactor < 1.0) {
    status = "danger";
    color = "#ef4444"; // Red
    label = "Liquidation Risk";
    Icon = AlertOctagon;
  } else if (healthFactor <= 1.3) {
    status = "warning";
    color = "#f59e0b"; // Amber
    label = "Caution";
    Icon = AlertTriangle;
  }

  // SVG Gauge calculations (semi-circle meter: 180 degrees)
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = Math.PI * radius; // half circle length

  // Clamp health factor between 0.5 and 2.5 for meter display
  const clampedHf = isInfinity
    ? 2.5
    : Math.min(Math.max(healthFactor, 0.5), 2.5);
  // percentage: 0.5 HF -> 0%, 2.5 HF -> 100%
  const progressPercent = (clampedHf - 0.5) / 2.0;
  const strokeDashoffset = circumference * (1 - progressPercent);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg
          width={size}
          height={size / 2 + strokeWidth}
          viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={`M ${strokeWidth} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${size / 2}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value arc */}
          <path
            d={`M ${strokeWidth} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease",
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black font-mono tracking-tight text-white">
            {isInfinity ? "∞" : healthFactor.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Health Factor
          </span>
        </div>
      </div>

      {showLabel && (
        <div
          className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            status === "safe"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
              : status === "warning"
                ? "bg-amber-950/40 border-amber-500/30 text-amber-400"
                : "bg-rose-950/40 border-rose-500/30 text-rose-400 animate-pulse"
          }`}
        >
          <Icon size={13} />
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
