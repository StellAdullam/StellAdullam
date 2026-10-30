/**
 * Standardized internationalized formatting utilities for numbers, currencies, and percentages.
 */

export function formatCompactNumber(value: number, locale = 'en-US'): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercentage(
  percentValue: number,
  decimals = 2,
  locale = 'en-US',
): string {
  if (isNaN(percentValue)) return '0.00%';
  return `${percentValue.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

export function formatBpsToPercent(
  bps: number,
  decimals = 2,
  locale = 'en-US',
): string {
  if (isNaN(bps)) return '0.00%';
  const percent = bps / 100;
  return formatPercentage(percent, decimals, locale);
}

export function formatUsd(
  amount: number,
  maximumFractionDigits = 2,
  locale = 'en-US',
): string {
  if (isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(amount);
}
