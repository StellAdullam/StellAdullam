import { describe, expect, it } from 'bun:test';
import { propertyRoutes } from './properties';

describe('Property Valuation Audit Routes', () => {
  it('GET /properties/:id/audit returns valuation appraisal audit analysis', async () => {
    const res = await propertyRoutes.handle(
      new Request('http://localhost/properties/1/audit')
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.propertyId).toBe(1);
    expect(body.data.status).toBe('approved');
    expect(body.data.currentValuationUsd).toBeGreaterThan(0);
    expect(body.data.riskScore).toBeLessThan(70);
  });
});
