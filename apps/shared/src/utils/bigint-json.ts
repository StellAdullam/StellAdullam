/**
 * BigInt-safe JSON serialization and deserialization utilities.
 * Handles Soroban 128-bit numbers without throwing TypeError exceptions.
 */

export function stringifyWithBigInt(value: unknown, indent?: number): string {
  return JSON.stringify(
    value,
    (_key, val) => {
      if (typeof val === "bigint") {
        return val.toString();
      }
      return val;
    },
    indent,
  );
}

export function parseWithBigInt<T = unknown>(json: string): T {
  return JSON.parse(json, (_key, val) => {
    // If string consists only of digits and is larger than safe integer, parse as BigInt
    if (typeof val === "string" && /^-?\d+$/.test(val)) {
      const num = Number(val);
      if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
        return BigInt(val);
      }
    }
    return val;
  });
}
