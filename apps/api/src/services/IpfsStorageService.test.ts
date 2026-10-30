import { describe, expect, it } from 'vitest';
import { IpfsStorageService } from './IpfsStorageService';

describe('IpfsStorageService', () => {
  it('computes SHA-256 and pins documents with valid CIDv1 URLs', async () => {
    const service = new IpfsStorageService('https://gateway.pinata.cloud/ipfs');
    const mockFile = Buffer.from('Certified Real Estate Title Deed CADASTRE-2026-99');

    const result = await service.pinDocument(mockFile, 'deed.pdf');

    expect(result.sha256Hex.length).toBe(64);
    expect(result.cid.startsWith('bafybeic')).toBe(true);
    expect(result.sizeBytes).toBe(mockFile.length);
    expect(result.gatewayUrl).toBe(`https://gateway.pinata.cloud/ipfs/${result.cid}`);
  });
});
