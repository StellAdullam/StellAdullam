/**
 * Liquidation Risk Evaluation Service
 * Analyzes health factors, categorizes insolvency risk tiers, and computes remediation amounts.
 */

export type RiskTier = 'safe' | 'moderate' | 'warning' | 'danger' | 'liquidatable';

export interface PositionRiskAnalysis {
  healthFactor: number;
  tier: RiskTier;
  isLiquidatable: boolean;
  distanceToLiquidationPercent: number;
  suggestedRepaymentToTargetHf: number; // Amount needed to restore HF to target (default 1.5)
}

export class LiquidationRiskService {
  public static readonly TARGET_SAFE_HF = 1.5;
  public static readonly WARNING_HF = 1.25;
  public static readonly DANGER_HF = 1.1;
  public static readonly LIQUIDATION_THRESHOLD_HF = 1.0;

  /**
   * Evaluates the risk tier for a given health factor.
   */
  public evaluateRiskTier(healthFactor: number): RiskTier {
    if (healthFactor < LiquidationRiskService.LIQUIDATION_THRESHOLD_HF) {
      return 'liquidatable';
    }
    if (healthFactor < LiquidationRiskService.DANGER_HF) {
      return 'danger';
    }
    if (healthFactor < LiquidationRiskService.WARNING_HF) {
      return 'warning';
    }
    if (healthFactor < LiquidationRiskService.TARGET_SAFE_HF) {
      return 'moderate';
    }
    return 'safe';
  }

  /**
   * Analyzes an active position and calculates remediation metrics.
   */
  public analyzePosition(
    collateralValueUsd: number,
    debtValueUsd: number,
    liquidationThresholdRatio: number = 0.8, // 80%
    targetSafeHf: number = LiquidationRiskService.TARGET_SAFE_HF,
  ): PositionRiskAnalysis {
    if (debtValueUsd <= 0) {
      return {
        healthFactor: Infinity,
        tier: 'safe',
        isLiquidatable: false,
        distanceToLiquidationPercent: 100,
        suggestedRepaymentToTargetHf: 0,
      };
    }

    const healthFactor = (collateralValueUsd * liquidationThresholdRatio) / debtValueUsd;
    const tier = this.evaluateRiskTier(healthFactor);
    const isLiquidatable = healthFactor < LiquidationRiskService.LIQUIDATION_THRESHOLD_HF;

    // Distance to liquidation: percentage debt can increase or collateral drop before reaching HF 1.0
    const distanceToLiquidationPercent = Math.max(0, Number(((healthFactor - 1.0) / healthFactor * 100).toFixed(2)));

    // Target debt: targetDebt = (collateralValue * liquidationThreshold) / targetSafeHf
    const maxDebtForTargetHf = (collateralValueUsd * liquidationThresholdRatio) / targetSafeHf;
    const suggestedRepaymentToTargetHf = Math.max(0, Number((debtValueUsd - maxDebtForTargetHf).toFixed(2)));

    return {
      healthFactor: Number(healthFactor.toFixed(2)),
      tier,
      isLiquidatable,
      distanceToLiquidationPercent,
      suggestedRepaymentToTargetHf,
    };
  }
}

export const liquidationRiskService = new LiquidationRiskService();
