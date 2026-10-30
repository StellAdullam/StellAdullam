/**
 * round.ts
 * High-precision rounding, ceiling, and flooring utilities mitigating
 * IEEE-754 floating point representation artifacts.
 */

/**
 * Rounds a number to a fixed number of decimal places.
 */
export function roundTo(num: number, decimals: number = 2): number {
  if (!Number.isFinite(num)) return num;
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Floors a number to a fixed number of decimal places.
 */
export function floorTo(num: number, decimals: number = 2): number {
  if (!Number.isFinite(num)) return num;
  const factor = Math.pow(10, decimals);
  return Math.floor((num + Number.EPSILON) * factor) / factor;
}

/**
 * Ceils a number to a fixed number of decimal places.
 */
export function ceilTo(num: number, decimals: number = 2): number {
  if (!Number.isFinite(num)) return num;
  const factor = Math.pow(10, decimals);
  return Math.ceil((num - Number.EPSILON) * factor) / factor;
}
