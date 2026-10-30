import { describe, expect, it } from 'vitest';
import { apyForecastService } from './ApyForecastService';

describe('ApyForecastService', () => {
  it('calculates borrow APR accurately below and above optimal utilization', () => {
    // Zero utilization: base rate = 2.0%
    const atZero = apyForecastService.calculateBorrowApr(0);
    expect(atZero).toBe(2.0);

    // At optimal (80%): base (2%) + slope1 (4%) = 6.0%
    const atOptimal = apyForecastService.calculateBorrowApr(0.8);
    expect(atOptimal).toBe(6.0);

    // Above optimal (100%): base (2%) + slope1 (4%) + slope2 (30%) = 36.0%
    const atMax = apyForecastService.calculateBorrowApr(1.0);
    expect(atMax).toBe(36.0);
  });

  it('calculates deposit APR accounting for reserve factor', () => {
    // At 50% utilization:
    // borrowApr = 2 + (0.5 / 0.8) * 4 = 4.5%
    // depositApr = 4.5 * 0.5 * 0.9 = 2.025% -> 2.03%
    const depositApr = apyForecastService.calculateDepositApr(0.5);
    expect(depositApr).toBeCloseTo(2.03, 1);
  });

  it('generates multi-step visualization curve points', () => {
    const curve = apyForecastService.generateForecastCurve({}, 10);
    expect(curve.length).toBe(11);
    expect(curve[0].utilizationRate).toBe(0);
    expect(curve[10].utilizationRate).toBe(1.0);
    expect(curve[10].borrowAprPercent).toBe(36.0);
  });
});
