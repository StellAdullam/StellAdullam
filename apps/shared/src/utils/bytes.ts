/**
 * bytes.ts
 * Binary byte size formatting and parsing utilities for IPFS metadata,
 * WASM contract blobs, and transaction envelope payloads.
 */

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

/**
 * Formats a byte number into human-readable string (e.g., 1048576 -> "1.00 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const unitIndex = Math.min(i, UNITS.length - 1);
  const value = bytes / Math.pow(1024, unitIndex);

  return `${value.toFixed(decimals)} ${UNITS[unitIndex]}`;
}

/**
 * Parses a human-readable byte string into raw bytes (e.g., "1.5 MB" -> 1572864)
 */
export function parseBytes(formatted: string): number {
  const match = formatted.trim().match(/^([\d.]+)\s*([a-zA-Z]+)?$/);
  if (!match) {
    throw new Error(`Invalid byte size format: ${formatted}`);
  }

  const num = parseFloat(match[1]);
  const unit = (match[2] || 'B').toUpperCase();

  const unitIndex = UNITS.indexOf(unit);
  if (unitIndex === -1) {
    throw new Error(`Unsupported byte unit: ${unit}`);
  }

  return Math.round(num * Math.pow(1024, unitIndex));
}
