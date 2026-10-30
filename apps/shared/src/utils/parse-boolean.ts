/**
 * parse-boolean.ts
 * Flexible boolean parsing utility for environment variables,
 * configuration flags, and query parameters.
 */

const TRUTHY_VALUES = new Set(['true', '1', 'yes', 'y', 'on', 'enabled']);
const FALSY_VALUES = new Set(['false', '0', 'no', 'n', 'off', 'disabled']);

/**
 * Parses an unknown value into a boolean. Returns fallback if indeterminate.
 */
export function parseBoolean(value: unknown, fallback: boolean = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;

  if (typeof value === 'string') {
    const clean = value.trim().toLowerCase();
    if (TRUTHY_VALUES.has(clean)) return true;
    if (FALSY_VALUES.has(clean)) return false;
  }

  return fallback;
}
