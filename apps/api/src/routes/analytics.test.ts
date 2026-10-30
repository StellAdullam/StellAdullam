import { describe, expect, it } from 'bun:test';
import { analyticsRoutes } from './analytics';

describe('Analytics Routes', () => {
  it('GET /api/v1/analytics/overview returns valid ecosystem numbers', async () => {
    const res = await analyticsRoutes.handle(
      new Request('http://localhost/api/v1/analytics/overview'),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.totalPropertiesTokenized).toBeGreaterThan(0);
    expect(body.data.totalCityTiles).toBe(400);
  });

  it('GET /api/v1/analytics/marketplace returns volume metrics', async () => {
    const res = await analyticsRoutes.handle(
      new Request('http://localhost/api/v1/analytics/marketplace'),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.totalTradesCount).toBe(2);
    expect(body.data.totalVolumeUsd).toBe(5500); // (25*120) + (10*250) = 3000 + 2500 = 5500
    expect(body.data.totalProtocolFeesUsd).toBe(27.5);
  });
});
