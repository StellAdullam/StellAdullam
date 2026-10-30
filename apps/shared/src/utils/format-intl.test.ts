import { describe, expect, it } from 'vitest';
import {
  formatBpsToPercent,
  formatCompactNumber,
  formatPercentage,
  formatUsd,
} from './format-intl';

describe('Internationalized Formatter Utilities', () => {
  it('formats compact notation for large financial figures', () => {
    expect(formatCompactNumber(1_500_000)).toBe('1.5M');
    expect(formatCompactNumber(25_400)).toBe('25.4K');
    expect(formatCompactNumber(350)).toBe('350');
  });

  it('formats percentages and basis points correctly', () => {
    expect(formatPercentage(5.25)).toBe('5.25%');
    expect(formatBpsToPercent(850)).toBe('8.50%');
    expect(formatBpsToPercent(50, 1)).toBe('0.5%');
  });

  it('formats currency in USD with symbol and separators', () => {
    expect(formatUsd(1234567.89)).toBe('$1,234,567.89');
    expect(formatUsd(0)).toBe('$0.00');
  });
});
