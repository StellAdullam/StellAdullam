import { describe, expect, it } from 'vitest';
import { LiquidatorWorker } from './liquidatorWorker';
import { RiskMonitoringService } from '../services/RiskMonitoringService';
import type { BorrowPosition } from '../db/schema';

describe('LiquidatorWorker', () => {
  it('correctly filters positions below health factor 1.0', async () => {
    const riskService = new RiskMonitoringService();
    const worker = new LiquidatorWorker(riskService, {
      minProfitThresholdUsd: 1.0,
      autoExecute: false,
    });

    const mockPositions: BorrowPosition[] = [
      {
        id: 'pos-1',
        borrowerId: 'user-healthy',
        poolId: 'pool-1',
        collateralAsset: 'PROP-1',
        collateralAmount: '100',
        principal: '50',
        accruedInterest: '0',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as BorrowPosition,
      {
        id: 'pos-2',
        borrowerId: 'user-underwater',
        poolId: 'pool-1',
        collateralAsset: 'PROP-2',
        collateralAmount: '50', // 50 * $1 = $50 collateral
        principal: '100', // $100 borrow => HF = 0.5 < 1.0
        accruedInterest: '0',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as BorrowPosition,
    ];

    const prices = new Map<string, number>([
      ['PROP-1', 1.0],
      ['PROP-2', 1.0],
    ]);

    const candidates = await worker.findLiquidatablePositions(mockPositions, prices);
    expect(candidates.length).toBe(1);
    expect(candidates[0].borrower).toBe('user-underwater');
    expect(candidates[0].healthFactor).toBe(0.5);
    expect(candidates[0].estimatedProfitUsd).toBe(10); // 10% of 100
  });

  it('manages worker lifecycle cleanly', async () => {
    const riskService = new RiskMonitoringService();
    const worker = new LiquidatorWorker(riskService);
    worker.start();
    expect(worker.getInFlightCount()).toBe(0);
    await worker.stop();
  });
});
