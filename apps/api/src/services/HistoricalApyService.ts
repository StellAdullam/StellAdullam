export interface PoolHistoricalDataPoint {
  date: string; // YYYY-MM-DD
  depositApy: number; // e.g. 5.2%
  borrowApy: number; // e.g. 8.4%
  tvlUsd: number;
  totalBorrowedUsd: number;
  utilizationRate: number; // e.g. 0.65 (65%)
}

export interface PoolAnalyticsSummary {
  poolId: string;
  currentDepositApy: number;
  currentBorrowApy: number;
  thirtyDayAvgDepositApy: number;
  thirtyDayAvgBorrowApy: number;
  currentTvlUsd: number;
  history: PoolHistoricalDataPoint[];
}

export class HistoricalApyService {
  private cache = new Map<string, { data: PoolAnalyticsSummary; timestamp: number }>();
  private readonly cacheTtlMs = 60_000; // 1 minute

  /**
   * Generates or fetches 30-day historical APY and liquidity trends for a lending pool.
   */
  public getPoolAnalytics(poolId: string, currentTvl: number = 2_500_000): PoolAnalyticsSummary {
    const cached = this.cache.get(poolId);
    const now = Date.now();
    if (cached && now - cached.timestamp < this.cacheTtlMs) {
      return cached.data;
    }

    const history: PoolHistoricalDataPoint[] = [];
    let sumDepositApy = 0;
    let sumBorrowApy = 0;

    const baseTvl = currentTvl;
    const baseBorrow = currentTvl * 0.72;

    for (let i = 29; i >= 0; i--) {
      const dateObj = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = dateObj.toISOString().split('T')[0];

      // Deterministic pseudo-variation based on day offset
      const wave = Math.sin(i * 0.4) * 0.8;
      const depositApy = Number((4.8 + wave * 0.5).toFixed(2));
      const borrowApy = Number((7.9 + wave * 0.7).toFixed(2));
      const tvlUsd = Math.round(baseTvl * (1 + (wave * 0.05)));
      const totalBorrowedUsd = Math.round(baseBorrow * (1 + (wave * 0.04)));
      const utilizationRate = Number((totalBorrowedUsd / (tvlUsd || 1)).toFixed(2));

      sumDepositApy += depositApy;
      sumBorrowApy += borrowApy;

      history.push({
        date: dateStr,
        depositApy,
        borrowApy,
        tvlUsd,
        totalBorrowedUsd,
        utilizationRate,
      });
    }

    const latest = history[history.length - 1];
    const summary: PoolAnalyticsSummary = {
      poolId,
      currentDepositApy: latest.depositApy,
      currentBorrowApy: latest.borrowApy,
      thirtyDayAvgDepositApy: Number((sumDepositApy / 30).toFixed(2)),
      thirtyDayAvgBorrowApy: Number((sumBorrowApy / 30).toFixed(2)),
      currentTvlUsd: latest.tvlUsd,
      history,
    };

    this.cache.set(poolId, { data: summary, timestamp: now });
    return summary;
  }
}

export const historicalApyService = new HistoricalApyService();
