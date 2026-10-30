import { describe, expect, it } from 'vitest';
import { liquidationRiskService } from './LiquidationRiskService';

describe('LiquidationRiskService', () => {
  it('correctly classifies risk tiers based on health factors', () => {
    expect(liquidationRiskService.evaluateRiskTier(2.0)).toBe('safe');
    expect(liquidationRiskService.evaluateRiskTier(1.4)).toBe('moderate');
    expect(liquidationRiskService.evaluateRiskTier(1.2)).toBe('warning');
    expect(liquidationRiskService.evaluateRiskTier(1.05)).toBe('danger');
    expect(liquidationRiskService.evaluateRiskTier(0.95)).toBe('liquidatable');
  });

  it('calculates suggested debt repayment to restore safe 1.5 health factor', () => {
    // Collateral: $10,000, Liquidation Threshold: 80% ($8,000 max borrow power)
    // Debt: $7,000 -> HF = 8000 / 7000 = 1.14 (Warning tier, since 1.10 <= HF < 1.25)
    // Target HF: 1.5 -> Max debt = 8000 / 1.5 = $5,333.33
    // Suggested repayment: 7000 - 5333.33 = $1,666.67
    const analysis = liquidationRiskService.analyzePosition(10000, 7000, 0.8, 1.5);

    expect(analysis.healthFactor).toBe(1.14);
    expect(analysis.tier).toBe('warning');
    expect(analysis.isLiquidatable).toBe(false);
    expect(analysis.suggestedRepaymentToTargetHf).toBe(1666.67);
  });

  it('handles zero debt gracefully without division by zero', () => {
    const analysis = liquidationRiskService.analyzePosition(10000, 0);
    expect(analysis.healthFactor).toBe(Infinity);
    expect(analysis.tier).toBe('safe');
    expect(analysis.suggestedRepaymentToTargetHf).toBe(0);
  });
});
