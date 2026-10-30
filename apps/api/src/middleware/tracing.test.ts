import { describe, expect, it } from 'vitest';
import { Elysia } from 'elysia';
import { requestTracing } from './tracing';

describe('Request Tracing Middleware', () => {
  it('generates a fresh UUID when no x-request-id is provided', async () => {
    const app = new Elysia()
      .use(requestTracing)
      .get('/test', (ctx: any) => ({ id: ctx.requestId }));

    const res = await app.handle(new Request('http://localhost/test'));
    expect(res.status).toBe(200);

    const header = res.headers.get('x-request-id');
    expect(header).toBeDefined();
    expect(header?.length).toBe(36); // UUID v4 format: 8-4-4-4-12
  });

  it('preserves and propagates incoming x-request-id header', async () => {
    const app = new Elysia()
      .use(requestTracing)
      .get('/test', (ctx: any) => {
        return { id: ctx.requestId ?? ctx.set.headers['x-request-id'] };
      });

    const customId = 'soroban-tx-trace-abcdef123';
    const res = await app.handle(
      new Request('http://localhost/test', {
        headers: {
          'x-request-id': customId,
        },
      }),
    );

    expect(res.headers.get('x-request-id')).toBe(customId);
    const body = await res.json();
    expect(body.id).toBe(customId);
  });
});
