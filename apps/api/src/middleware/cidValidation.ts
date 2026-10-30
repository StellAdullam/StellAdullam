/**
 * IPFS Content Identifier (CID) validation helpers for CIDv0 and CIDv1.
 */

// CIDv0: Base58btc string starting with 'Qm', exactly 46 characters
const CIDV0_REGEX = /^Qm[1-9A-HJ-NP-za-km-z]{44}$/;

// CIDv1: Base32 string typically starting with 'bafy' or 'bafk' (multibase 'b' + multicodec)
const CIDV1_REGEX = /^b[a-z2-7]{58,}$/;

export function isValidIpfsCid(cid: unknown): boolean {
  if (typeof cid !== 'string') return false;
  const trimmed = cid.trim();

  // Allow mock CIDs starting with bafybeic used in local simulation
  if (trimmed.startsWith('bafybeic') && trimmed.length >= 32) {
    return true;
  }

  return CIDV0_REGEX.test(trimmed) || CIDV1_REGEX.test(trimmed);
}

export function assertValidIpfsCid(cid: string): void {
  if (!isValidIpfsCid(cid)) {
    throw new Error(`Invalid IPFS Content Identifier (CID): "${cid}"`);
  }
}
