import { describe, expect, it } from 'bun:test';
import { portfolioRoutes } from './portfolio';

describe('Portfolio Routes', () => {
  const validStellarAddress = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';

  it('GET /api/v1/portfolio/:address returns portfolio summary', async () => {
    const res = await portfolioRoutes.handle(
      new Request(`http://localhost/api/v1/portfolio/${validStellarAddress}`),
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.address).toBe(validStellarAddress);
    expect(body.data.healthFactor).toBeGreaterThan(0);
  });

  it('GET /api/v1/portfolio/:address/allocation returns allocation breakdown', async () => {
    const res = await portfolioRoutes.handle(
      new Request(`http://localhost/api/v1/portfolio/${validStellarAddress}/allocation`),
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.allocations.length).toBe(4);
    expect(body.data.diversificationScore).toBeGreaterThanOrEqual(0);
  });

  it('rejects invalid Stellar address with HTTP 400', async () => {
    const res = await portfolioRoutes.handle(
      new Request('http://localhost/api/v1/portfolio/invalid-address/allocation'),
    );

    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INVALID_ADDRESS');
  });
});
