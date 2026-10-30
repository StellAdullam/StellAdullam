import { describe, expect, it } from 'vitest';
import { truncateAddress } from './address';

describe('Address Truncation Utility', () => {
  it('truncates standard 56-char Stellar addresses with custom head and tail lengths', () => {
    const addr = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
    expect(truncateAddress(addr)).toBe('GBZX...MADI');
    expect(truncateAddress(addr, 6, 6)).toBe('GBZXN7...DNMADI');
  });

  it('handles short or empty strings safely', () => {
    expect(truncateAddress('')).toBe('');
    expect(truncateAddress('GABC')).toBe('GABC');
  });
});
