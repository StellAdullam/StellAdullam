import { describe, expect, it, vi } from 'vitest';
import { FeeBumpService } from './FeeBumpService';

vi.mock('@stellar/stellar-sdk', () => {
  return {
    Keypair: {
      fromSecret: vi.fn(() => ({ publicKey: () => 'GBUMPKEY' })),
      random: vi.fn(() => ({
        publicKey: () => 'GBUMPKEY',
        secret: () => 'SBUMPSECRET',
      })),
    },
    Transaction: vi.fn().mockImplementation(() => ({
      fee: '100',
    })),
    TransactionBuilder: {
      buildFeeBumpTransaction: vi.fn((feeSource, fee, innerTx, passphrase) => ({
        sign: vi.fn(),
        toXDR: vi.fn(() => 'AAAA_FEE_BUMP_MOCK_XDR'),
      })),
    },
    Networks: {
      TESTNET: 'Test SDF Network ; September 2015',
    },
  };
});

describe('FeeBumpService', () => {
  it('wraps inner transactions into signed FeeBumpTransaction envelopes', () => {
    const service = new FeeBumpService('Test SDF Network ; September 2015');

    const result = service.buildFeeBump('AAAA_INNER_TX_XDR', {
      feeSourceSecret: 'SBUMPSECRET',
      surgeMultiplier: 2.5,
    });

    expect(result.feeBumpXdr).toBe('AAAA_FEE_BUMP_MOCK_XDR');
    expect(result.totalFeeStroops).toBe(250); // 100 * 2.5
  });

  it('enforces maximum base fee cap on excessive surge multipliers', () => {
    const service = new FeeBumpService('Test SDF Network ; September 2015');

    const result = service.buildFeeBump('AAAA_INNER_TX_XDR', {
      feeSourceSecret: 'SBUMPSECRET',
      surgeMultiplier: 200,
      maxBaseFeeStroops: 5000,
    });

    expect(result.totalFeeStroops).toBe(5000);
  });
});
