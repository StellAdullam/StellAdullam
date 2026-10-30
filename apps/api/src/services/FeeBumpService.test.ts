import { describe, expect, it, vi, afterEach } from 'bun:test';
import { FeeBumpService } from './FeeBumpService';
import * as StellarSdk from '@stellar/stellar-sdk';

describe('FeeBumpService', () => {
  const validKeypair = StellarSdk.Keypair.random();
  const feeSourceSecret = validKeypair.secret();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('wraps inner transactions into signed FeeBumpTransaction envelopes', () => {
    vi.spyOn(StellarSdk.TransactionBuilder, 'buildFeeBumpTransaction').mockReturnValue({
      sign: vi.fn(),
      toXDR: () => 'AAAA_FEE_BUMP_MOCK_XDR',
    } as unknown as StellarSdk.FeeBumpTransaction);

    const service = new FeeBumpService('Test SDF Network ; September 2015');
    const mockTx = { fee: '100' } as unknown as StellarSdk.Transaction;

    const result = service.buildFeeBump(mockTx, {
      feeSourceSecret,
      surgeMultiplier: 2.5,
    });

    expect(result.feeBumpXdr).toBe('AAAA_FEE_BUMP_MOCK_XDR');
    expect(result.totalFeeStroops).toBe(250); // 100 * 2.5
  });

  it('enforces maximum base fee cap on excessive surge multipliers', () => {
    vi.spyOn(StellarSdk.TransactionBuilder, 'buildFeeBumpTransaction').mockReturnValue({
      sign: vi.fn(),
      toXDR: () => 'AAAA_FEE_BUMP_MOCK_XDR',
    } as unknown as StellarSdk.FeeBumpTransaction);

    const service = new FeeBumpService('Test SDF Network ; September 2015');
    const mockTx = { fee: '100' } as unknown as StellarSdk.Transaction;

    const result = service.buildFeeBump(mockTx, {
      feeSourceSecret,
      surgeMultiplier: 200,
      maxBaseFeeStroops: 5000,
    });

    expect(result.totalFeeStroops).toBe(5000);
  });
});
