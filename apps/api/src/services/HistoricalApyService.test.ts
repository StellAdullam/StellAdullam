import { describe, expect, it } from 'vitest';
import { HistoricalApyService } from './HistoricalApyService';

describe('HistoricalApyService', () => {
  it('computes 30-day time series data points and averages correctly', () => {
    const service = new HistoricalApyService();
    const analytics = service.getPoolAnalytics('usdc-pool-1', 1_000_000);

    expect(analytics.poolId).toBe('usdc-pool-1');
    expect(analytics.history.length).toBe(30);
    expect(analytics.currentDepositApy).toBeGreaterThan(0);
    expect(analytics.thirtyDayAvgBorrowApy).toBeGreaterThan(analytics.thirtyDayAvgDepositApy);
  });
});
