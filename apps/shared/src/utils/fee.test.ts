import { describe, expect, it } from 'vitest';
import {
  stroopsToXlm,
  xlmToStroops,
  calculateRecommendedFee,
  estimateSorobanResourceFee,
} from './fee';

describe('Fee and Stroop Utilities', () => {
  it('converts bidirectionally between Stroops and XLM', () => {
    expect(stroopsToXlm(100)).toBe('0.00001');
    expect(stroopsToXlm(10_000_000n)).toBe('1');
    expect(stroopsToXlm(25_500_000n)).toBe('2.55');

    expect(xlmToStroops('1')).toBe(10_000_000n);
    expect(xlmToStroops('0.00001')).toBe(100n);
    expect(xlmToStroops(2.55)).toBe(25_500_000n);
  });

  it('calculates recommended fees with surge multipliers', () => {
    expect(calculateRecommendedFee(1, 1.0)).toBe(100);
    expect(calculateRecommendedFee(3, 1.5)).toBe(450); // 3 * 100 * 1.5 = 450
  });

  it('estimates Soroban resource fees', () => {
    const fee = estimateSorobanResourceFee(50_000, 10_000);
    expect(fee).toBeGreaterThan(1_000);
  });
});
