import { describe, expect, it } from 'bun:test';
import { PortfolioAllocationService } from './PortfolioAllocationService';

describe('PortfolioAllocationService', () => {
  const dummyAddress = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';

  it('computes allocation percentages correctly', () => {
    const result = PortfolioAllocationService.calculateAllocation(
      dummyAddress,
      5000, // Real estate: 50%
      3000, // DeFi deposit: 30%
      1500, // Liquid: 15%
      500   // Dividends: 5%
    );

    expect(result.address).toBe(dummyAddress);
    expect(result.totalValueUsd).toBe(10000);
    expect(result.allocations[0].percentage).toBe(50);
    expect(result.allocations[1].percentage).toBe(30);
    expect(result.allocations[2].percentage).toBe(15);
    expect(result.allocations[3].percentage).toBe(5);
    expect(result.diversificationScore).toBeGreaterThan(60);
  });

  it('handles empty portfolio values gracefully without NaN', () => {
    const result = PortfolioAllocationService.calculateAllocation(
      dummyAddress,
      0,
      0,
      0,
      0
    );

    expect(result.totalValueUsd).toBe(0);
    expect(result.diversificationScore).toBe(0);
    for (const alloc of result.allocations) {
      expect(alloc.percentage).toBe(0);
    }
  });
});
