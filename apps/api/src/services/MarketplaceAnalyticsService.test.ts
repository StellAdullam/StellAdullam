import { describe, expect, it } from 'bun:test';
import { MarketplaceAnalyticsService, TradeRecord } from './MarketplaceAnalyticsService';

describe('MarketplaceAnalyticsService', () => {
  it('returns zero values when trades list is empty', () => {
    const summary = MarketplaceAnalyticsService.computeSummary([]);
    expect(summary.totalTradesCount).toBe(0);
    expect(summary.totalVolumeUsd).toBe(0);
    expect(summary.totalProtocolFeesUsd).toBe(0);
    expect(summary.topTradedPropertyId).toBeNull();
  });

  it('aggregates total volume, 24h volume, and top traded property accurately', () => {
    const now = 1000000000;
    const hourAgo = now - 3600 * 1000;
    const twoDaysAgo = now - 48 * 3600 * 1000;

    const trades: TradeRecord[] = [
      {
        id: 't1',
        propertyId: 'prop-alpha',
        shares: 10,
        pricePerShareUsd: 100, // volume = 1000
        feeCollectedUsd: 10,
        timestamp: hourAgo,
      },
      {
        id: 't2',
        propertyId: 'prop-beta',
        shares: 5,
        pricePerShareUsd: 50, // volume = 250
        feeCollectedUsd: 2.5,
        timestamp: hourAgo,
      },
      {
        id: 't3',
        propertyId: 'prop-alpha',
        shares: 20,
        pricePerShareUsd: 100, // volume = 2000 (outside 24h)
        feeCollectedUsd: 20,
        timestamp: twoDaysAgo,
      },
    ];

    const result = MarketplaceAnalyticsService.computeSummary(trades, now);

    expect(result.totalTradesCount).toBe(3);
    expect(result.totalVolumeUsd).toBe(3250);
    expect(result.totalProtocolFeesUsd).toBe(32.5);
    expect(result.volume24hUsd).toBe(1250); // t1 + t2
    expect(result.topTradedPropertyId).toBe('prop-alpha'); // 3000 vs 250
  });
});
