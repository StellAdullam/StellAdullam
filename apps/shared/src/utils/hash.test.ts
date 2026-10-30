import { describe, expect, it } from 'vitest';
import { sha256Hex, verifySha256 } from './hash';

describe('Universal WebCrypto SHA-256 Hash', () => {
  it('computes correct NIST standard SHA-256 hash for ascii string', async () => {
    // Known NIST vector: sha256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    const emptyHash = await sha256Hex('');
    expect(emptyHash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

    const helloHash = await sha256Hex('hello world');
    expect(helloHash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('correctly verifies matching and mismatching hashes', async () => {
    const data = 'Stellar Real Estate Tokenization';
    const hash = await sha256Hex(data);

    expect(await verifySha256(data, hash)).toBe(true);
    expect(await verifySha256(data, '0000000000000000000000000000000000000000000000000000000000000000')).toBe(false);
  });
});
