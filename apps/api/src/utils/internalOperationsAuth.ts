import { timingSafeEqual } from 'crypto';

/**
 * Shared check for /internal/operations routes (header x-internal-api-key).
 */
export function isInternalOperationsAuthorized(
  headers: Record<string, string | undefined>,
): boolean {
  const expected = process.env.OPERATIONS_BACKEND_CREDENTIAL;
  const key = headers['x-internal-api-key'];
  if (!expected || !key) return false;

  const keyBuffer = Buffer.from(key);
  const expectedBuffer = Buffer.from(expected);
  if (keyBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(keyBuffer, expectedBuffer);
}
