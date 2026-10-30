/**
 * safe-math.ts
 * Safe division, basis points, and ratio calculation utilities preventing
 * divide-by-zero panics and NaN/Infinity values.
 */

/**
 * Safely divides two numbers. Returns fallback if denominator is 0, NaN, or infinite.
 */
export function safeDivide(numerator: number, denominator: number, fallback: number = 0): number {
  if (!denominator || !Number.isFinite(denominator) || denominator === 0) {
    return fallback;
  }
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : fallback;
}

/**
 * Safely divides two bigints. Returns fallback if denominator is 0n.
 */
export function safeDivideBigInt(numerator: bigint, denominator: bigint, fallback: bigint = 0n): bigint {
  if (denominator === 0n) {
    return fallback;
  }
  return numerator / denominator;
}

/**
 * Computes a percentage (0 to 100). Returns fallback if total is 0.
 */
export function safePercentage(part: number, total: number, fallback: number = 0): number {
  return safeDivide(part * 100, total, fallback);
}

/**
 * Computes basis points (1 bp = 0.01%). 10000 bps = 100%. Returns 0 if total is 0.
 */
export function safeBasisPoints(part: number, total: number): number {
  return Math.round(safeDivide(part * 10000, total, 0));
}
