/**
 * hex.ts
 * High-performance hexadecimal and Uint8Array binary conversion utilities
 * for cryptographic hashes, Stellar transaction envelopes, and signatures.
 */

/**
 * Converts a Uint8Array byte buffer to a lowercase hexadecimal string.
 */
export function bytesToHex(bytes: Uint8Array): string {
  const hexParts: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    hexParts.push(bytes[i].toString(16).padStart(2, '0'));
  }
  return hexParts.join('');
}

/**
 * Strips an optional leading '0x' or '0X' prefix from a hex string.
 */
export function stripHexPrefix(hex: string): string {
  return hex.startsWith('0x') || hex.startsWith('0X') ? hex.slice(2) : hex;
}

/**
 * Validates whether a string is a valid even-length hex string.
 */
export function isHex(str: string): boolean {
  const clean = stripHexPrefix(str.trim());
  return clean.length % 2 === 0 && /^[0-9a-fA-F]*$/.test(clean);
}

/**
 * Converts a hexadecimal string to a Uint8Array.
 */
export function hexToBytes(hex: string): Uint8Array {
  const clean = stripHexPrefix(hex.trim());
  if (clean.length % 2 !== 0) {
    throw new Error(`Hex string must have an even length, got length ${clean.length}`);
  }

  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    const byte = parseInt(clean.substring(i, i + 2), 16);
    if (isNaN(byte)) {
      throw new Error(`Invalid hexadecimal byte at position ${i}: "${clean.substring(i, i + 2)}"`);
    }
    bytes[i / 2] = byte;
  }

  return bytes;
}
