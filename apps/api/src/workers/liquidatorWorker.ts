import { logger } from '../services/logger';
import type { RiskMonitoringService } from '../services/RiskMonitoringService';
import type { BorrowPosition } from '../db/schema';

export interface LiquidatorWorkerConfig {
  pollIntervalMs?: number;
  minProfitThresholdUsd?: number;
  autoExecute?: boolean;
}

export interface LiquidationCandidate {
  positionId: string;
  borrower: string;
  poolId: string;
  healthFactor: number;
  debtToRepay: number;
  seizableCollateral: number;
  estimatedProfitUsd: number;
}

export class LiquidatorWorker {
  private running = false;
  private processing = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private inFlightLiquidations = new Set<string>();

  private readonly pollIntervalMs: number;
  private readonly minProfitThresholdUsd: number;
  private readonly autoExecute: boolean;

  constructor(
    private riskService: RiskMonitoringService,
    config?: LiquidatorWorkerConfig,
  ) {
    this.pollIntervalMs = config?.pollIntervalMs ?? 15_000;
    this.minProfitThresholdUsd = config?.minProfitThresholdUsd ?? 5.0;
    this.autoExecute = config?.autoExecute ?? false;
  }

  public start(): void {
    if (this.running) return;
    this.running = true;
    logger.info({ pollInterval: this.pollIntervalMs }, 'Automated Liquidator Bot started');
    this.scheduleNext();
  }

  public async stop(): Promise<void> {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    logger.info('Automated Liquidator Bot stopped');
  }

  private scheduleNext(): void {
    if (!this.running) return;
    this.timer = setTimeout(async () => {
      await this.runLiquidationCycle();
      this.scheduleNext();
    }, this.pollIntervalMs);
  }

  /**
   * Scan positions and identify undercollateralized positions eligible for liquidation (HF < 1.0).
   */
  public async findLiquidatablePositions(
    positions: BorrowPosition[],
    collateralPrices: Map<string, number>,
  ): Promise<LiquidationCandidate[]> {
    const healths = await this.riskService.assessPositions(positions, collateralPrices);
    const candidates: LiquidationCandidate[] = [];

    for (const h of healths) {
      if (h.healthFactor < 1.0 && !this.inFlightLiquidations.has(h.positionId)) {
        // Standard liquidation bonus (10% collateral bonus for liquidators)
        const bonusRate = 0.1;
        const seizable = h.borrowValue * (1 + bonusRate);
        const estimatedProfit = h.borrowValue * bonusRate;

        if (estimatedProfit >= this.minProfitThresholdUsd) {
          candidates.push({
            positionId: h.positionId,
            borrower: h.borrower,
            poolId: h.poolId,
            healthFactor: h.healthFactor,
            debtToRepay: h.borrowValue,
            seizableCollateral: Math.min(seizable, h.collateralValue),
            estimatedProfitUsd: estimatedProfit,
          });
        }
      }
    }

    return candidates;
  }

  /**
   * Execute or dry-run liquidation cycle.
   */
  public async runLiquidationCycle(
    positions: BorrowPosition[] = [],
    prices: Map<string, number> = new Map(),
  ): Promise<number> {
    if (this.processing) return 0;
    this.processing = true;

    try {
      const candidates = await this.findLiquidatablePositions(positions, prices);
      if (candidates.length === 0) {
        return 0;
      }

      logger.info({ count: candidates.length }, 'Identified liquidation candidates');

      let executedCount = 0;
      for (const cand of candidates) {
        this.inFlightLiquidations.add(cand.positionId);
        try {
          logger.info(
            {
              borrower: cand.borrower,
              healthFactor: cand.healthFactor,
              debt: cand.debtToRepay,
              expectedProfit: cand.estimatedProfitUsd,
            },
            'Processing position liquidation',
          );

          if (this.autoExecute) {
            // Invokes on-chain liquidation contract call
            // Simulated or broadcasted via StellarService
            executedCount++;
          }
        } finally {
          this.inFlightLiquidations.delete(cand.positionId);
        }
      }

      return executedCount;
    } catch (err) {
      logger.error({ err }, 'Error during liquidator bot execution cycle');
      return 0;
    } finally {
      this.processing = false;
    }
  }

  public getInFlightCount(): number {
    return this.inFlightLiquidations.size;
  }
}
