/**
 * Price Deviation and Flash Crash Detection Service
 * Guards against abnormal oracle volatility and price manipulation.
 */

export interface PriceRecord {
  price: number;
  timestamp: number;
}

export interface DeviationAlert {
  asset: string;
  currentPrice: number;
  baselinePrice: number;
  deviationPercent: number;
  isTriggered: boolean;
  actionRequired: 'none' | 'alert' | 'pause_circuit_breaker';
}

export class PriceDeviationService {
  private history = new Map<string, PriceRecord[]>();
  public static readonly DEFAULT_ALERT_THRESHOLD_PERCENT = 15; // 15%
  public static readonly DEFAULT_CIRCUIT_BREAKER_PERCENT = 30; // 30%
  public static readonly WINDOW_SECONDS = 3600; // 1 hour

  /**
   * Records a price update and analyzes deviation against moving baseline.
   */
  public recordAndEvaluate(
    asset: string,
    currentPrice: number,
    timestamp = Date.now(),
  ): DeviationAlert {
    if (!this.history.has(asset)) {
      this.history.set(asset, []);
    }

    const records = this.history.get(asset)!;
    records.push({ price: currentPrice, timestamp });

    // Prune entries older than window
    const cutoff = timestamp - PriceDeviationService.WINDOW_SECONDS * 1000;
    const activeRecords = records.filter((r) => r.timestamp >= cutoff);
    this.history.set(asset, activeRecords);

    if (activeRecords.length <= 1) {
      return {
        asset,
        currentPrice,
        baselinePrice: currentPrice,
        deviationPercent: 0,
        isTriggered: false,
        actionRequired: 'none',
      };
    }

    // Baseline is moving average of previous entries excluding current
    const previous = activeRecords.slice(0, activeRecords.length - 1);
    const avg = previous.reduce((sum, r) => sum + r.price, 0) / previous.length;
    const deviationPercent = Math.abs((currentPrice - avg) / avg) * 100;

    let actionRequired: 'none' | 'alert' | 'pause_circuit_breaker' = 'none';
    if (deviationPercent >= PriceDeviationService.DEFAULT_CIRCUIT_BREAKER_PERCENT) {
      actionRequired = 'pause_circuit_breaker';
    } else if (deviationPercent >= PriceDeviationService.DEFAULT_ALERT_THRESHOLD_PERCENT) {
      actionRequired = 'alert';
    }

    return {
      asset,
      currentPrice,
      baselinePrice: Number(avg.toFixed(4)),
      deviationPercent: Number(deviationPercent.toFixed(2)),
      isTriggered: actionRequired !== 'none',
      actionRequired,
    };
  }

  public clearHistory(): void {
    this.history.clear();
  }
}

export const priceDeviationService = new PriceDeviationService();
