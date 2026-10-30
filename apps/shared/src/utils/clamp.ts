/**
 * clamp.ts
 * Numeric clamping, range bounding, and linear interpolation utilities.
 */

/**
 * Clamps a number to the inclusive range [min, max].
 */
export function clamp(val: number, min: number, max: number): number {
  if (min > max) {
    throw new Error(`min (${min}) cannot be greater than max (${max})`);
  }
  return Math.min(Math.max(val, min), max);
}

/**
 * Clamps a number to the unit interval [0, 1].
 */
export function clamp01(val: number): number {
  return clamp(val, 0, 1);
}

/**
 * Checks if a value is within the inclusive bounds [min, max].
 */
export function inRange(val: number, min: number, max: number): boolean {
  return val >= min && val <= max;
}

/**
 * Linearly interpolates between a and b by ratio t (clamped to [0, 1]).
 */
export function lerp(a: number, b: number, t: number): number {
  const boundedT = clamp01(t);
  return a + (b - a) * boundedT;
}

/**
 * Normalizes a value from [min, max] into a 0.0 to 1.0 ratio.
 */
export function normalize(val: number, min: number, max: number): number {
  if (min === max) return 0;
  return clamp01((val - min) / (max - min));
}
