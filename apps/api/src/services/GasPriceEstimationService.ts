export interface GasFeeTier {
  speed: 'low' | 'medium' | 'high';
  feeStroops: number;
  feeXlm: string;
  estimatedSeconds: number;
}

export interface GasFeeEstimationResponse {
  baseFeeStroops: number;
  tiers: {
    low: GasFeeTier;
    medium: GasFeeTier;
    high: GasFeeTier;
  };
  congestionLevel: 'low' | 'moderate' | 'high';
  timestamp: string;
}

export class GasPriceEstimationService {
  /**
   * Calculates recommended transaction fee tiers based on base fee and congestion levels.
   */
  public static estimateFees(currentBaseFee: number = 100): GasFeeEstimationResponse {
    const base = Math.max(100, currentBaseFee);

    const lowFee = base;
    const mediumFee = Math.max(200, Math.round(base * 1.5));
    const highFee = Math.max(500, Math.round(base * 2.5));

    const congestionLevel: 'low' | 'moderate' | 'high' =
      base > 500 ? 'high' : base > 200 ? 'moderate' : 'low';

    return {
      baseFeeStroops: base,
      tiers: {
        low: {
          speed: 'low',
          feeStroops: lowFee,
          feeXlm: (lowFee / 10_000_000).toFixed(7),
          estimatedSeconds: 5.0,
        },
        medium: {
          speed: 'medium',
          feeStroops: mediumFee,
          feeXlm: (mediumFee / 10_000_000).toFixed(7),
          estimatedSeconds: 3.5,
        },
        high: {
          speed: 'high',
          feeStroops: highFee,
          feeXlm: (highFee / 10_000_000).toFixed(7),
          estimatedSeconds: 2.0,
        },
      },
      congestionLevel,
      timestamp: new Date().toISOString(),
    };
  }
}
