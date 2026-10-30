/**
 * Cryptographically secure random string generation utilities.
 * Powered by standard WebCrypto API (crypto.getRandomValues).
 */

const DEFAULT_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function secureRandomString(
  length: number = 32,
  alphabet: string = DEFAULT_ALPHABET,
): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  let result = "";
  const alphabetLength = alphabet.length;

  for (let i = 0; i < length; i++) {
    result += alphabet[bytes[i] % alphabetLength];
  }

  return result;
}

export function generateNonce(prefix = "nonce_"): string {
  return `${prefix}${secureRandomString(24)}`;
}
