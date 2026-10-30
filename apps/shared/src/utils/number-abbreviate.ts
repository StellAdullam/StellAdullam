/**
 * Formats large financial or token quantities into compact SI-suffixed strings (K, M, B, T).
 */
export function abbreviateNumber(num: number, decimals: number = 2): string {
  if (isNaN(num)) return '0';
  if (Math.abs(num) < 1000) return num.toString();

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const tiers = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
  ];

  for (const { suffix, threshold } of tiers) {
    if (absNum >= threshold) {
      const formatted = (absNum / threshold).toFixed(decimals).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
      return `${isNegative ? '-' : ''}${formatted}${suffix}`;
    }
  }

  return num.toString();
}
