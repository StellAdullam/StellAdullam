import { Elysia, t } from 'elysia';
import { historicalApyService } from '../services/HistoricalApyService';

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
