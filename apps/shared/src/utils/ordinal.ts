/**
 * ordinal.ts
 * Number ordinal formatting utilities for leaderboard rankings,
 * parcel improvement milestones, and dividend payout cycles.
 */

/**
 * Returns the ordinal suffix for an integer ('st', 'nd', 'rd', or 'th').
 */
export function getOrdinalSuffix(num: number): string {
  const abs = Math.abs(Math.trunc(num));
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return 'th';
  }

  const mod10 = abs % 10;
  switch (mod10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/**
 * Formats a number with its ordinal suffix (e.g., 1 -> "1st", 22 -> "22nd").
 */
export function toOrdinal(num: number): string {
  return `${num}${getOrdinalSuffix(num)}`;
}
