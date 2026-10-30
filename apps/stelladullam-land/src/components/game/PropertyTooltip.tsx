"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameProperty } from "../../types/game.types";
import { addressToHSL } from "../../lib/colorHash";
import {
  BUILDING_NAMES,
  abbreviateAddress,
  getGridCoords,
} from "../../lib/mockProperties";

export interface TooltipPosition {
  x: number;
  y: number;
}

interface PropertyTooltipProps {
  property: GameProperty | null;
  position: TooltipPosition | null;
  visible: boolean;
}

export function PropertyTooltip({
  property,
  position,
  visible,
}: PropertyTooltipProps) {
  if (!property || !position || !visible) return null;

  const { row, col } = getGridCoords(property.id);
  const isTreasury = !property.owner || property.owner === "GBTREASURY";
  const isUnowned = !property.owner;
  const ownerLabel = isUnowned
    ? "Vacant / Unclaimed"
    : isTreasury
      ? "City Treasury"
      : abbreviateAddress(property.owner);
  const swatchColor = addressToHSL(property.owner);

  // Viewport bounds clamping
  const clampedX =
    typeof window !== "undefined"
      ? Math.min(Math.max(position.x + 14, 12), window.innerWidth - 220)
      : position.x + 14;
  const clampedY =
    typeof window !== "undefined"
      ? Math.max(position.y - 110, 12)
      : position.y - 110;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 4 }}
        transition={{ duration: 0.15 }}
        style={{
          left: clampedX,
          top: clampedY,
        }}
        className="fixed z-50 pointer-events-none min-w-[190px] rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/70 p-3 shadow-2xl text-left font-sans text-xs"
        role="tooltip"
        aria-live="polite"
      >
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
          <span className="font-bold text-white tracking-wide">
            {property.name || `Sector (${row}, ${col})`}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            [{row},{col}]
          </span>
        </div>

        <div className="space-y-1.5 text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Owner:</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: swatchColor }}
              />
              <span className="text-white">{ownerLabel}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Building:</span>
            <span className="font-medium text-slate-200">
              {BUILDING_NAMES[property.buildingLevel]}
            </span>
          </div>

          {property.isListed && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-amber-400 font-semibold">
              <span>Price:</span>
              <span>{property.pricePerShare} LAND</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
