import { describe, expect, it } from 'bun:test';
import { ledgerRoutes } from './ledger';

describe('Ledger Routes', () => {
  it('GET /api/ledger/status returns Stellar network and ledger telemetry', async () => {
    const res = await ledgerRoutes.handle(new Request('http://localhost/api/ledger/status'));

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;

    expect(body.network).toBeDefined();
    expect(body.latestLedger).toBeGreaterThan(0);
    expect(body.baseFeeStroops).toBeGreaterThan(0);
    expect(body.protocolVersion).toBeGreaterThanOrEqual(20);
    expect(body.ledgerCloseTimeSeconds).toBe(5.0);
  });

  it('GET /api/ledger/fees returns dynamic gas fee tier recommendations', async () => {
    const res = await ledgerRoutes.handle(new Request('http://localhost/api/ledger/fees'));

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;

    expect(body.baseFeeStroops).toBeGreaterThanOrEqual(100);
    expect(body.tiers.low.feeStroops).toBeGreaterThanOrEqual(100);
    expect(body.tiers.medium.feeStroops).toBeGreaterThanOrEqual(200);
    expect(body.tiers.high.feeStroops).toBeGreaterThanOrEqual(500);
    expect(['low', 'moderate', 'high']).toContain(body.congestionLevel);
  });
});
