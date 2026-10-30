import { describe, expect, it } from 'vitest';
import { formatCurrencyAmount, convertUsdToCurrency } from './currency';

describe('Currency Formatting Utilities', () => {
  it('formats USD and native XLM currency strings correctly', () => {
    expect(formatCurrencyAmount(500000, 'USD')).toBe('$500,000');
    expect(formatCurrencyAmount(1250.5, 'XLM')).toBe('1,250.50 XLM');
  });

  it('converts USD to target currencies using reference FX rates', () => {
    // $120 USD / 0.12 = 1000 XLM
    expect(convertUsdToCurrency(120, 'XLM')).toBe(1000);
    expect(convertUsdToCurrency(100, 'USD')).toBe(100);
  });
});
