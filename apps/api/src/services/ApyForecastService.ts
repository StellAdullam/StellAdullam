/**
 * APY Forecasting and Interest Rate Simulation Service
 * Models the 2-slope jump rate utilization curve matching Soroban defi-rwa smart contract.
 */

export interface UtilizationPoint {
  utilizationRate: number; // 0 to 1
  borrowAprPercent: number;
  depositAprPercent: number;
}

export interface PoolForecastConfig {
  baseRateBps?: number; // e.g. 200 = 2%
  optimalUtilizationBps?: number; // e.g. 8000 = 80%
  slope1Bps?: number; // e.g. 400 = 4%
  slope2Bps?: number; // e.g. 3000 = 30%
  reserveFactorBps?: number; // e.g. 1000 = 10%
}

export class ApyForecastService {
  /**
   * Calculates borrow APR in percentage for a given utilization fraction (0.0 to 1.0).
   */
  public calculateBorrowApr(
    utilization: number,
    config: PoolForecastConfig = {},
  ): number {
    const base = (config.baseRateBps ?? 200) / 100;
    const optimal = (config.optimalUtilizationBps ?? 8000) / 10000;
    const slope1 = (config.slope1Bps ?? 400) / 100;
    const slope2 = (config.slope2Bps ?? 3000) / 100;

    const u = Math.min(Math.max(utilization, 0), 1);

    if (u <= optimal) {
      return base + (u / optimal) * slope1;
    } else {
      const excessRatio = (u - optimal) / (1 - optimal);
      return base + slope1 + excessRatio * slope2;
    }
  }

  /**
   * Calculates supply/deposit APR in percentage: borrowApr * utilization * (1 - reserveFactor).
   */
  public calculateDepositApr(
    utilization: number,
    config: PoolForecastConfig = {},
  ): number {
    const borrowApr = this.calculateBorrowApr(utilization, config);
    const reserveFactor = (config.reserveFactorBps ?? 1000) / 10000;
    const u = Math.min(Math.max(utilization, 0), 1);

    return Number((borrowApr * u * (1 - reserveFactor)).toFixed(2));
  }

  /**
   * Generates a 20-step simulation curve for plotting interactive charts.
   */
  public generateForecastCurve(
    config: PoolForecastConfig = {},
    steps: number = 20,
  ): UtilizationPoint[] {
    const points: UtilizationPoint[] = [];

    for (let i = 0; i <= steps; i++) {
      const u = Number((i / steps).toFixed(2));
      const borrowApr = Number(this.calculateBorrowApr(u, config).toFixed(2));
      const depositApr = this.calculateDepositApr(u, config);

      points.push({
        utilizationRate: u,
        borrowAprPercent: borrowApr,
        depositAprPercent: depositApr,
      });
    }

    return points;
  }
}

export const apyForecastService = new ApyForecastService();
