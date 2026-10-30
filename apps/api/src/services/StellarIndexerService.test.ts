import { describe, expect, it, vi } from 'vitest';
import { StellarIndexerService } from './StellarIndexerService';

describe('StellarIndexerService', () => {
  it('instantiates and allows registering topic handlers', () => {
    const indexer = new StellarIndexerService('https://soroban-testnet.stellar.org');
    const mockHandler = vi.fn();

    indexer.onEvent('mint', mockHandler);
    expect(indexer.getLastIndexedLedger()).toBe(0);
    indexer.stop();
  });

  it('manages lifecycle correctly', async () => {
    const indexer = new StellarIndexerService('https://soroban-testnet.stellar.org');
    await indexer.start(100);
    expect(indexer.getLastIndexedLedger()).toBe(100);
    indexer.stop();
  });
});
