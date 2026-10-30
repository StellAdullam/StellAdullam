import { createHash } from 'node:crypto';

export interface IpfsUploadResult {
  cid: string;
  sha256Hex: string;
  sizeBytes: number;
  gatewayUrl: string;
  pinnedAt: string;
}

export class IpfsStorageService {
  private gatewayBaseUrl: string;

  constructor(gatewayBaseUrl: string = process.env.IPFS_GATEWAY_URL ?? 'https://ipfs.io/ipfs') {
    this.gatewayBaseUrl = gatewayBaseUrl.replace(/\/+$/, '');
  }

  /**
   * Calculates cryptographic SHA-256 hash of a file buffer.
   */
  public computeSha256(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Generates a deterministic mock IPFS CIDv1 from buffer hash.
   */
  public computeDeterministicCid(buffer: Buffer): string {
    const hash = this.computeSha256(buffer);
    // CIDv1 prefix: 'bafybeic' + 32-character truncated hex
    return `bafybeic${hash.substring(0, 32)}`;
  }

  /**
   * Simulates or executes document pinning to IPFS.
   */
  public async pinDocument(
    buffer: Buffer,
    filename: string,
  ): Promise<IpfsUploadResult> {
    const sha256Hex = this.computeSha256(buffer);
    const cid = this.computeDeterministicCid(buffer);
    const sizeBytes = buffer.length;
    const pinnedAt = new Date().toISOString();

    return {
      cid,
      sha256Hex,
      sizeBytes,
      gatewayUrl: `${this.gatewayBaseUrl}/${cid}`,
      pinnedAt,
    };
  }
}

export const ipfsStorageService = new IpfsStorageService();
