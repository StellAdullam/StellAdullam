import { describe, expect, it } from 'bun:test';
import { StellarAnchorService } from './StellarAnchorService';

describe('StellarAnchorService', () => {
  it('returns list of supported anchors', () => {
    const anchors = StellarAnchorService.getSupportedAnchors();
    expect(anchors.length).toBeGreaterThanOrEqual(3);
    const usdc = anchors.find((a) => a.code === 'USDC');
    expect(usdc).toBeDefined();
    expect(usdc?.fiatEquivalent).toBe('USD');
  });

  it('retrieves an anchor by code case-insensitively', () => {
    const eurc = StellarAnchorService.getAnchorByCode('eurc');
    expect(eurc).toBeDefined();
    expect(eurc?.code).toBe('EURC');
    expect(eurc?.fiatEquivalent).toBe('EUR');
  });

  it('returns undefined for unsupported currency code', () => {
    const unknown = StellarAnchorService.getAnchorByCode('XYZFAKE');
    expect(unknown).toBeUndefined();
  });

  it('calculates net deposit value correctly after fees', () => {
    const result = StellarAnchorService.calculateNetDeposit(1000, 'USDC');
    // USDC fee is 20 bps = 0.20% of 1000 = $2.00
    expect(result.feeUsd).toBe(2);
    expect(result.netAmountUsd).toBe(998);
  });

  it('handles zero or negative deposits safely', () => {
    const result = StellarAnchorService.calculateNetDeposit(0, 'USDC');
    expect(result.feeUsd).toBe(0);
    expect(result.netAmountUsd).toBe(0);
  });
});
