/**
 * roman.ts
 * Roman numeral conversion utilities for parcel building tiers and governance stages.
 */

const ROMAN_MAP: Array<[number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/**
 * Converts a positive integer into a Roman numeral string.
 */
export function toRoman(num: number): string {
  if (num <= 0 || !Number.isInteger(num)) {
    return String(num);
  }

  let result = '';
  let remaining = num;

  for (const [val, str] of ROMAN_MAP) {
    while (remaining >= val) {
      result += str;
      remaining -= val;
    }
  }

  return result;
}

/**
 * Converts a Roman numeral string back into an integer.
 */
export function fromRoman(roman: string): number {
  const clean = roman.trim().toUpperCase();
  if (!clean) return 0;

  const charValues: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const current = charValues[clean[i]] || 0;
    const next = charValues[clean[i + 1]] || 0;

    if (next > current) {
      total += next - current;
      i++;
    } else {
      total += current;
    }
  }

  return total;
}
