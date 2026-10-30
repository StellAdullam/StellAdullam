/**
 * percentage-change.ts
 * Calculation and formatting utilities for price deltas, APY fluctuations,
 * and portfolio net worth changes over time.
 */

/**
 * Calculates percentage change from oldValue to newValue. Returns 0 if oldValue is 0.
 */
export function calculatePercentChange(
  oldValue: number,
  newValue: number,
): number {
  if (oldValue === 0) {
    return newValue === 0 ? 0 : 100;
  }
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Calculates change in basis points (1% = 100 bps).
 */
export function calculateBpsChange(oldValue: number, newValue: number): number {
  return Math.round(calculatePercentChange(oldValue, newValue) * 100);
}

/**
 * Formats a percentage delta with an explicit + or - sign.
 */
export function formatPercentChange(
  delta: number,
  decimals: number = 2,
): string {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(decimals)}%`;
}
