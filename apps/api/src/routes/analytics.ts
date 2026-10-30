import { Elysia, t } from 'elysia';
import { historicalApyService } from '../services/HistoricalApyService';
import { MarketplaceAnalyticsService, TradeRecord } from '../services/MarketplaceAnalyticsService';

export interface EcosystemOverviewMetrics {
  totalPropertiesTokenized: number;
  totalTokenizedValuationUsd: number;
  totalLendingTvlUsd: number;
  totalActiveLoansUsd: number;
  circulatingLandSupply: number;
  burnedLandSupply: number;
  activeCityTilesClaimed: number;
  totalCityTiles: number;
  timestamp: string;
}

// In-memory trade buffer for recent marketplace settlements
const recentTrades: TradeRecord[] = [
  {
    id: 'tr-001',
    propertyId: 'b7b80a6b-2993-4e8c-859a-14db456789ab',
    shares: 25,
    pricePerShareUsd: 120,
    feeCollectedUsd: 15,
    timestamp: Date.now() - 3600 * 1000,
  },
  {
    id: 'tr-002',
    propertyId: 'c8c90a6b-3994-4e8c-859a-24db456789cd',
    shares: 10,
    pricePerShareUsd: 250,
    feeCollectedUsd: 12.5,
    timestamp: Date.now() - 7200 * 1000,
  },
];

export const analyticsRoutes = new Elysia({ prefix: '/api/v1/analytics' })
  .get('/overview', () => {
    const overview: EcosystemOverviewMetrics = {
      totalPropertiesTokenized: 18,
      totalTokenizedValuationUsd: 14_850_000,
      totalLendingTvlUsd: 6_420_000,
      totalActiveLoansUsd: 3_890_000,
      circulatingLandSupply: 485_000,
      burnedLandSupply: 115_000,
      activeCityTilesClaimed: 84,
      totalCityTiles: 400,
      timestamp: new Date().toISOString(),
    };

    return {
      success: true,
      data: overview,
    };
  })
  .get('/marketplace', () => {
    const summary = MarketplaceAnalyticsService.computeSummary(recentTrades);
    return {
      success: true,
      data: summary,
    };
  })
  .get(
    '/pools/:poolId',
    ({ params: { poolId } }) => {
      const data = historicalApyService.getPoolAnalytics(poolId);
      return {
        success: true,
        data,
      };
    },
    {
      params: t.Object({
        poolId: t.String(),
      }),
    },
  );
