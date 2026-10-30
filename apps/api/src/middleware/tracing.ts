import { Elysia } from 'elysia';
import { randomUUID } from 'node:crypto';

/**
 * Distributed tracing middleware that enforces or generates an X-Request-Id correlation token
 * on every incoming HTTP request and mirrors it back in the response headers.
 */
export const requestTracing = new Elysia({ name: 'middleware:tracing' })
  .onRequest(({ request, set }) => {
    const incomingId = request.headers.get('x-request-id');
    const requestId =
      incomingId && incomingId.trim().length > 0 ? incomingId.trim() : randomUUID();
    set.headers['x-request-id'] = requestId;
  })
  .derive(({ request, set }) => {
    const incomingId = request.headers.get('x-request-id');
    const requestId =
      (set.headers?.['x-request-id'] as string) ??
      (incomingId && incomingId.trim().length > 0 ? incomingId.trim() : randomUUID());
    set.headers['x-request-id'] = requestId;
    return {
      requestId,
    };
  });
