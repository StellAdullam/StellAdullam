/**
 * Color interpolation helper for dynamic health factor gauges and risk heatmaps.
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RgbColor {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function interpolateColor(
  colorA: string,
  colorB: string,
  t: number, // 0.0 to 1.0
): string {
  const factor = Math.min(1, Math.max(0, t));
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);

  const r = a.r + (b.r - a.r) * factor;
  const g = a.g + (b.g - a.g) * factor;
  const bVal = a.b + (b.b - a.b) * factor;

  return rgbToHex(r, g, bVal);
}
