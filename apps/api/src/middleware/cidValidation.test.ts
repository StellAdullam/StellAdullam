import { describe, expect, it } from 'vitest';
import { assertValidIpfsCid, isValidIpfsCid } from './cidValidation';

describe('IPFS CID Validation Utilities', () => {
  it('validates canonical CIDv0 Base58 hashes', () => {
    const validCidV0 = 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco';
    expect(isValidIpfsCid(validCidV0)).toBe(true);
    expect(() => assertValidIpfsCid(validCidV0)).not.toThrow();
  });

  it('validates canonical CIDv1 Base32 identifiers', () => {
    const validCidV1 = 'bafybeicdeedcadastre1234567890abcdef1234567890';
    expect(isValidIpfsCid(validCidV1)).toBe(true);
  });

  it('rejects invalid or malformed strings', () => {
    expect(isValidIpfsCid('invalid-cid-string')).toBe(false);
    expect(isValidIpfsCid('')).toBe(false);
    expect(isValidIpfsCid(null)).toBe(false);
    expect(() => assertValidIpfsCid('not_a_cid')).toThrow('Invalid IPFS Content Identifier');
  });
});
