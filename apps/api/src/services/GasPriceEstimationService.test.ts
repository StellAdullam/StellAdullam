import { describe, expect, it } from 'bun:test';
import { GasPriceEstimationService } from './GasPriceEstimationService';

describe('GasPriceEstimationService', () => {
  it('estimates fee tiers correctly for standard base fee', () => {
    const estimates = GasPriceEstimationService.estimateFees(100);

    expect(estimates.baseFeeStroops).toBe(100);
    expect(estimates.tiers.low.feeStroops).toBe(100);
    expect(estimates.tiers.medium.feeStroops).toBe(200);
    expect(estimates.tiers.high.feeStroops).toBe(500);
    expect(estimates.congestionLevel).toBe('low');
    expect(estimates.tiers.low.feeXlm).toBe('0.0000100');
  });

  it('adjusts congestion level and fee tiers under high network load', () => {
    const estimates = GasPriceEstimationService.estimateFees(600);

    expect(estimates.baseFeeStroops).toBe(600);
    expect(estimates.congestionLevel).toBe('high');
    expect(estimates.tiers.low.feeStroops).toBe(600);
    expect(estimates.tiers.medium.feeStroops).toBe(900);
    expect(estimates.tiers.high.feeStroops).toBe(1500);
  });
});
