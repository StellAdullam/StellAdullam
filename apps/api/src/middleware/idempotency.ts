import { Elysia } from 'elysia';
import { ApiError } from '../errors/ApiError';

interface IdempotentRecord {
  status: number;
  body: unknown;
  headers: Record<string, string>;
  expiresAt: number;
}

const idempotencyStore = new Map<string, IdempotentRecord>();
const inFlightRequests = new Set<string>();

const DEFAULT_TTL_MS = 120_000; // 2 minutes

// Periodic cleanup of expired records
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of idempotencyStore.entries()) {
    if (record.expiresAt < now) {
      idempotencyStore.delete(key);
    }
  }
}, 60_000);

/**
 * Idempotency plugin for Elysia.
 *
 * When an `Idempotency-Key` header is present on mutating requests (POST, PUT, PATCH):
 * - Rejects concurrent duplicate requests with 409 Conflict.
 * - Returns previously cached response on duplicate subsequent calls.
 */
export const idempotency = (ttlMs: number = DEFAULT_TTL_MS) =>
  new Elysia({ name: 'idempotency' })
    .onRequest(({ request, set }) => {
      if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
        return;
      }

      const key =
        request.headers.get('idempotency-key') || request.headers.get('x-idempotency-key');

      if (!key) return;

      if (inFlightRequests.has(key)) {
        throw ApiError.conflict(
          'A request with this idempotency key is currently being processed. Please retry shortly.',
        );
      }

      const cached = idempotencyStore.get(key);
      if (cached && cached.expiresAt > Date.now()) {
        set.status = cached.status;
        return cached.body;
      }

      inFlightRequests.add(key);
    })
    .onAfterHandle(({ request, response, set }) => {
      const key =
        request.headers.get('idempotency-key') || request.headers.get('x-idempotency-key');

      if (!key) return;

      inFlightRequests.delete(key);

      const status = typeof set.status === 'number' ? set.status : 200;
      if (status >= 200 && status < 300) {
        idempotencyStore.set(key, {
          status,
          body: response,
          headers: {},
          expiresAt: Date.now() + ttlMs,
        });
      }
    })
    .onError(({ request }) => {
      const key =
        request.headers.get('idempotency-key') || request.headers.get('x-idempotency-key');

      if (key) {
        inFlightRequests.delete(key);
      }
    });
