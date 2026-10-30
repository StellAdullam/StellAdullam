import { beforeEach, describe, expect, it } from 'bun:test';
import { funderRoutes } from './funder';
import { GasSponsorshipService } from '../services/GasSponsorshipService';

describe('Funder Routes', () => {
  const validStellarAddress = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';

  beforeEach(() => {
    GasSponsorshipService.resetQuota();
  });

  it('POST /api/v1/funder/sponsor approves qualifying transaction', async () => {
    const res = await funderRoutes.handle(
      new Request('http://localhost/api/v1/funder/sponsor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          address: validStellarAddress,
          innerTxXdr: 'AAAAAGFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWE=',
        }),
      }),
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.sponsored).toBe(true);
    expect(body.data.remainingDailyQuota).toBe(GasSponsorshipService.DAILY_QUOTA - 1);
  });

  it('POST /api/v1/funder/sponsor rejects invalid addresses', async () => {
    const res = await funderRoutes.handle(
      new Request('http://localhost/api/v1/funder/sponsor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          address: 'invalid_key',
          innerTxXdr: 'AAAAAGFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWE=',
        }),
      }),
    );

    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INVALID_ADDRESS');
  });

  it('GET /api/v1/funder/anchors returns available on-ramp assets', async () => {
    const res = await funderRoutes.handle(new Request('http://localhost/api/v1/funder/anchors'));
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.anchors.length).toBeGreaterThan(0);
    expect(body.data.anchors[0].code).toBe('USDC');
  });

  it('POST /api/v1/funder/anchors/estimate calculates net deposit and fee', async () => {
    const res = await funderRoutes.handle(
      new Request('http://localhost/api/v1/funder/anchors/estimate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          amountUsd: 500,
          assetCode: 'USDC',
        }),
      }),
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.feeUsd).toBe(1);
    expect(body.data.netAmountUsd).toBe(499);
    expect(body.data.sep24DepositUrl).toContain('sep24');
  });
});
