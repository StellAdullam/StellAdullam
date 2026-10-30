export interface TradeRecord {
  id: string;
  propertyId: string;
  shares: number;
  pricePerShareUsd: number;
  feeCollectedUsd: number;
  timestamp: number;
}

export interface MarketplaceSummaryMetrics {
  totalTradesCount: number;
  totalVolumeUsd: number;
  totalProtocolFeesUsd: number;
  averageSharePriceUsd: number;
  volume24hUsd: number;
  topTradedPropertyId: string | null;
}

export class MarketplaceAnalyticsService {
  /**
   * Calculates comprehensive summary metrics across a series of marketplace trades.
   */
  public static computeSummary(trades: TradeRecord[], nowTimestamp: number = Date.now()): MarketplaceSummaryMetrics {
    if (!trades || trades.length === 0) {
      return {
        totalTradesCount: 0,
        totalVolumeUsd: 0,
        totalProtocolFeesUsd: 0,
        averageSharePriceUsd: 0,
        volume24hUsd: 0,
        topTradedPropertyId: null,
      };
    }

    const dayAgo = nowTimestamp - 24 * 60 * 60 * 1000;
    let totalVolume = 0;
    let totalFees = 0;
    let volume24h = 0;
    let sumSharePrice = 0;
    const propertyVolumeMap = new Map<string, number>();

    for (const trade of trades) {
      const tradeVolume = trade.shares * trade.pricePerShareUsd;
      totalVolume += tradeVolume;
      totalFees += trade.feeCollectedUsd;
      sumSharePrice += trade.pricePerShareUsd;

      if (trade.timestamp >= dayAgo) {
        volume24h += tradeVolume;
      }

      const existingPropVol = propertyVolumeMap.get(trade.propertyId) || 0;
      propertyVolumeMap.set(trade.propertyId, existingPropVol + tradeVolume);
    }

    let topTradedPropertyId: string | null = null;
    let highestPropVol = -1;
    for (const [propId, vol] of propertyVolumeMap.entries()) {
      if (vol > highestPropVol) {
        highestPropVol = vol;
        topTradedPropertyId = propId;
      }
    }

    return {
      totalTradesCount: trades.length,
      totalVolumeUsd: Number(totalVolume.toFixed(2)),
      totalProtocolFeesUsd: Number(totalFees.toFixed(2)),
      averageSharePriceUsd: Number((sumSharePrice / trades.length).toFixed(2)),
      volume24hUsd: Number(volume24h.toFixed(2)),
      topTradedPropertyId,
    };
  }
}
