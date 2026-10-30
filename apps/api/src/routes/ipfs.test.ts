import { describe, expect, it } from 'vitest';
import app from '../app';

describe('IPFS Resolution Routes', () => {
  it('GET /api/v1/ipfs/:cid resolves document metadata and gateways', async () => {
    const testCid = 'bafybeicdeedcadastre1234567890';
    const response = await app.handle(
      new Request(`http://localhost/api/v1/ipfs/${testCid}`),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.cid).toBe(testCid);
    expect(body.data.verified).toBe(true);
    expect(body.data.gatewaysChecked.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/ipfs/:cid/status returns pinning persistence metrics', async () => {
    const testCid = 'bafybeicpinningstatuscheck123456';
    const response = await app.handle(
      new Request(`http://localhost/api/v1/ipfs/${testCid}/status`),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('pinned');
    expect(body.data.redundancyGateways).toBe(3);
  });
});
