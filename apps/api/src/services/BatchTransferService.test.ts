import { describe, expect, it } from 'vitest';
import { batchTransferService, Shareholder } from './BatchTransferService';

describe('BatchTransferService', () => {
  it('calculates proportional shareholder allocations accurately', () => {
    const shareholders: Shareholder[] = [
      { address: 'GUSER_A', shares: 50 },
      { address: 'GUSER_B', shares: 30 },
      { address: 'GUSER_C', shares: 20 },
    ];

    const allocations = batchTransferService.calculateAllocations(100, shareholders);

    expect(allocations.length).toBe(3);
    expect(allocations[0].amountXlm).toBe('50.0000000');
    expect(allocations[1].amountXlm).toBe('30.0000000');
    expect(allocations[2].amountXlm).toBe('20.0000000');
  });

  it('chunks allocations into bounded Stellar transaction envelopes', () => {
    const mockAllocations = Array.from({ length: 250 }, (_, i) => ({
      address: `GUSER_${i}`,
      amountStroops: 10_000_000,
      amountXlm: '1.0000000',
    }));

    const chunks = batchTransferService.chunkBatches(mockAllocations, 100);

    expect(chunks.length).toBe(3);
    expect(chunks[0].allocations.length).toBe(100);
    expect(chunks[1].allocations.length).toBe(100);
    expect(chunks[2].allocations.length).toBe(50);
  });
});
