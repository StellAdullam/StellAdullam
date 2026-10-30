/**
 * FixedPointMath utility for high-precision Stellar & Soroban token calculations.
 * Avoids IEEE-754 floating point rounding errors in financial transactions.
 */

export const STELLAR_DECIMALS = 7;
export const STROOP_SCALE = 10_000_000n; // 10^7
export const E18_SCALE = 1_000_000_000_000_000_000n; // 10^18

export class FixedPointMath {
  /**
   * Convert display units (e.g. 1.5 XLM / LAND) to integer Stroops (15,000,000).
   */
  static toStroops(amount: number | string): bigint {
    const str = typeof amount === "number" ? amount.toFixed(7) : amount.trim();
    const [whole, fraction = ""] = str.split(".");
    const paddedFraction = fraction.padEnd(7, "0").slice(0, 7);
    return BigInt(whole) * STROOP_SCALE + BigInt(paddedFraction);
  }

  /**
   * Convert raw Stroops back to human-readable float.
   */
  static fromStroops(stroops: bigint | number | string): number {
    const b = BigInt(stroops);
    const whole = b / STROOP_SCALE;
    const remainder = b % STROOP_SCALE;
    return Number(whole) + Number(remainder) / 1e7;
  }

  /**
   * Convert standard 18-decimal RWA share tokens to integer base units.
   */
  static toPrecision18(amount: number | string): bigint {
    const str = typeof amount === "number" ? amount.toString() : amount.trim();
    const [whole, fraction = ""] = str.split(".");
    const paddedFraction = fraction.padEnd(18, "0").slice(0, 18);
    return BigInt(whole) * E18_SCALE + BigInt(paddedFraction);
  }

  /**
   * Multiplies two big integers and divides by a denominator without precision loss.
   */
  static mulDiv(a: bigint, b: bigint, denominator: bigint): bigint {
    if (denominator === 0n) {
      throw new Error("Division by zero in FixedPointMath.mulDiv");
    }
    return (a * b) / denominator;
  }
}
