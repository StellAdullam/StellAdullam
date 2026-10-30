import { describe, expect, it } from 'bun:test';
import { healthRoutes } from './health';

describe('System Health Monitoring Routes', () => {
  it('GET /api/v1/health/system returns memory telemetry and process metrics', async () => {
    const response = await healthRoutes.handle(
      new Request('http://localhost/api/v1/health/system'),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;

    expect(body.status).toBe('operational');
    expect(typeof body.process.pid).toBe('number');
    expect(body.memory.heapUsedMb).toBeGreaterThan(0);
    expect(body.memory.heapUtilizationRatio).toBeGreaterThan(0);
  });

  it('GET /metrics returns Prometheus formatted exposition telemetry', async () => {
    const response = await healthRoutes.handle(new Request('http://localhost/metrics'));

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');
    const text = await response.text();

    expect(text).toContain('process_uptime_seconds');
    expect(text).toContain('process_heap_used_bytes');
    expect(text).toContain('nodejs_version_info');
  });
});
