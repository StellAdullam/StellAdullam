/**
 * Clamps a percentage value strictly within the range [min, max] (default 0 to 100).
 */
export function clampPercent(value: number, min: number = 0, max: number = 100): number {
  if (isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/**
 * Converts basis points (1 bp = 0.01%) into a percentage value.
 * e.g., 250 bps -> 2.5%
 */
export function bpsToPercent(bps: number): number {
  if (isNaN(bps)) return 0;
  return Number((bps / 100).toFixed(4));
}

/**
 * Converts a percentage into basis points.
 * e.g., 2.5% -> 250 bps
 */
export function percentToBps(percent: number): number {
  if (isNaN(percent)) return 0;
  return Math.round(percent * 100);
}
