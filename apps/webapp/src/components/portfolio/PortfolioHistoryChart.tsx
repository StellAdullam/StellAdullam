"use client";

import React, { useState } from "react";
import { TrendingUp, ArrowUpRight, DollarSign } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

export interface HistoricalPoint {
  date: string;
  equityUsd: number;
  debtUsd: number;
  netWorthUsd: number;
}

export interface PortfolioHistoryChartProps {
  currentNetWorth?: number;
  history?: HistoricalPoint[];
}

export function PortfolioHistoryChart({
  currentNetWorth = 245_800,
  history,
}: PortfolioHistoryChartProps) {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D">("30D");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate deterministic points if history not passed
  const points: HistoricalPoint[] =
    history ??
    Array.from({ length: 30 }, (_, i) => {
      const day = 29 - i;
      const date = new Date(Date.now() - day * 86400000).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        },
      );
      const base = currentNetWorth * 0.88;
      const progress = (i / 29) * (currentNetWorth - base);
      const wave = Math.sin(i * 0.6) * 4500;
      const net = Math.round(base + progress + wave);
      const debt = Math.round(net * 0.28);
      const equity = net + debt;
      return { date, equityUsd: equity, debtUsd: debt, netWorthUsd: net };
    });

  const activePoint =
    hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  // SVG dimensions
  const width = 600;
  const height = 180;
  const padding = 20;

  const minVal = Math.min(...points.map((p) => p.netWorthUsd)) * 0.95;
  const maxVal = Math.max(...points.map((p) => p.netWorthUsd)) * 1.05;

  const getX = (idx: number) =>
    padding + (idx / (points.length - 1)) * (width - padding * 2);
  const getY = (val: number) =>
    height -
    padding -
    ((val - minVal) / (maxVal - minVal || 1)) * (height - padding * 2);

  // Path generation
  const linePath = points
    .map(
      (p, idx) =>
        `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(p.netWorthUsd)}`,
    )
    .join(" ");

  const areaPath = `${linePath} L ${getX(points.length - 1)} ${height} L ${getX(0)} ${height} Z`;

  return (
    <Card className="p-6 border-slate-800 bg-slate-900/90 text-slate-100 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Total Net Worth
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <h3 className="text-2xl font-black text-white">
              ${activePoint.netWorthUsd.toLocaleString()}
            </h3>
            <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +13.6%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {activePoint.date} &bull; Collateral: $
            {activePoint.equityUsd.toLocaleString()} &bull; Debt: $
            {activePoint.debtUsd.toLocaleString()}
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(["7D", "30D", "90D"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                timeframe === tf
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full h-44 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="networthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <path d={areaPath} fill="url(#networthGradient)" />

          {/* Line curve */}
          <path d={linePath} fill="none" stroke="#818cf8" strokeWidth="2.5" />

          {/* Interactive hover circle */}
          {hoveredIndex !== null && (
            <circle
              cx={getX(hoveredIndex)}
              cy={getY(points[hoveredIndex].netWorthUsd)}
              r="5"
              fill="#c7d2fe"
              stroke="#4338ca"
              strokeWidth="2.5"
            />
          )}

          {/* Transparent hit boxes */}
          {points.map((_, idx) => (
            <rect
              key={idx}
              x={getX(idx) - width / points.length / 2}
              y={0}
              width={width / points.length}
              height={height}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>
      </div>
    </Card>
  );
}
