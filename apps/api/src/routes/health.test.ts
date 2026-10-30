import { describe, expect, it } from 'vitest';
import { healthRoutes } from './health';

describe('System Health Monitoring Routes', () => {
  it('GET /api/v1/health/system returns memory telemetry and process metrics', async () => {
    const response = await healthRoutes.handle(
      new Request('http://localhost/api/v1/health/system'),
    );

    expect(response.status).toBe(200);
    const body = await response.json();

    expect(body.status).toBe('operational');
    expect(body.process.pid).toBeTypeOf('number');
    expect(body.memory.heapUsedMb).toBeGreaterThan(0);
    expect(body.memory.heapUtilizationRatio).toBeGreaterThan(0);
  });
});
