import { describe, expect, it } from 'bun:test';
import { diagnosticsRoutes } from './diagnostics';

describe('Diagnostics Routes', () => {
  it('GET /api/v1/diagnostics/system returns valid host telemetry', async () => {
    const res = await diagnosticsRoutes.handle(
      new Request('http://localhost/api/v1/diagnostics/system'),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('healthy');
    expect(body.data.memoryUsageMb.heapUsed).toBeGreaterThan(0);
  });
});
