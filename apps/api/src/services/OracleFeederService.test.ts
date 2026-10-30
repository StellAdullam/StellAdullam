import { describe, expect, it } from 'vitest';
import { OracleFeederService } from './OracleFeederService';
import type { RealEstateValuationPayload } from '@stelladullam/shared';

describe('OracleFeederService', () => {
  it('accepts initial price feed and rejects rapid or excessive deviation updates', async () => {
    const feeder = new OracleFeederService({
      maxAllowedDeviationPercent: 15.0,
      minFeedIntervalSeconds: 10,
    });

    const payload1: RealEstateValuationPayload = {
      propertyId: 'prop-1',
      price: 100_000,
      confidence: 0.95,
      timestamp: new Date().toISOString(),
      sourceId: 'mls-feed-1',
    };

    const res1 = await feeder.processPriceFeed('prop-1', payload1);
    expect(res1.status).toBe('accepted');
    expect(feeder.getCachedPrice('prop-1')).toBe(100_000);

    // Immediate second update should be rejected as too frequent
    const resTooFast = await feeder.processPriceFeed('prop-1', {
      ...payload1,
      price: 105_000,
    });
    expect(resTooFast.status).toBe('rejected_stale');
  });
});
