import { logger } from './logger';
import { OracleService } from './OracleService';
import type { RealEstateValuationPayload } from '@stelladullam/shared';

export interface OracleFeedConfig {
  maxAllowedDeviationPercent?: number; // e.g. 20%
  minFeedIntervalSeconds?: number;
  autoBroadcast?: boolean;
}

export interface OracleFeedResult {
  assetId: string;
  previousPrice: number;
  newPrice: number;
  deviationPercent: number;
  status: 'accepted' | 'rejected_deviation' | 'rejected_stale';
  txHash?: string;
  reason?: string;
}

export class OracleFeederService {
  private lastPrices = new Map<string, { price: number; timestamp: number }>();
  private readonly maxDeviationPercent: number;
  private readonly minFeedIntervalSeconds: number;
  private readonly autoBroadcast: boolean;

  constructor(config?: OracleFeedConfig) {
    this.maxDeviationPercent = config?.maxAllowedDeviationPercent ?? 20.0;
    this.minFeedIntervalSeconds = config?.minFeedIntervalSeconds ?? 300; // 5 min min interval
    this.autoBroadcast = config?.autoBroadcast ?? false;
  }

  /**
   * Process a valuation feed proposal and verify price volatility guardrails.
   */
  public async processPriceFeed(
    assetId: string,
    proposedValuation: RealEstateValuationPayload,
  ): Promise<OracleFeedResult> {
    const newPrice = proposedValuation.price;
    const now = Date.now();
    const last = this.lastPrices.get(assetId);

    // Initial price recording
    if (!last) {
      this.lastPrices.set(assetId, { price: newPrice, timestamp: now });
      logger.info({ assetId, price: newPrice }, 'Initialized oracle price for asset');
      return {
        assetId,
        previousPrice: 0,
        newPrice,
        deviationPercent: 0,
        status: 'accepted',
      };
    }

    // Check minimum interval
    const elapsedSeconds = (now - last.timestamp) / 1000;
    if (elapsedSeconds < this.minFeedIntervalSeconds) {
      return {
        assetId,
        previousPrice: last.price,
        newPrice,
        deviationPercent: 0,
        status: 'rejected_stale',
        reason: `Update too frequent. Must wait ${this.minFeedIntervalSeconds - elapsedSeconds}s`,
      };
    }

    // Check price deviation threshold
    const deviationPercent = Math.abs((newPrice - last.price) / last.price) * 100;
    if (deviationPercent > this.maxDeviationPercent) {
      logger.warn(
        { assetId, previous: last.price, proposed: newPrice, deviation: deviationPercent },
        'Oracle feed price deviation exceeded safety limit',
      );
      return {
        assetId,
        previousPrice: last.price,
        newPrice,
        deviationPercent,
        status: 'rejected_deviation',
        reason: `Price deviation of ${deviationPercent.toFixed(1)}% exceeds maximum allowed ${this.maxDeviationPercent}%`,
      };
    }

    // Update state
    this.lastPrices.set(assetId, { price: newPrice, timestamp: now });
    logger.info(
      { assetId, newPrice, deviationPercent: deviationPercent.toFixed(2) },
      'Oracle price feed accepted and updated',
    );

    return {
      assetId,
      previousPrice: last.price,
      newPrice,
      deviationPercent,
      status: 'accepted',
    };
  }

  public getCachedPrice(assetId: string): number | undefined {
    return this.lastPrices.get(assetId)?.price;
  }
}

export const oracleFeeder = new OracleFeederService();
