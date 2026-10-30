import { describe, expect, it } from 'bun:test';
import { ipfsRoutes } from './ipfs';

describe('IPFS Resolution Routes', () => {
  it('GET /api/v1/ipfs/:cid resolves document metadata and gateways', async () => {
    const cid = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi';
    const response = await ipfsRoutes.handle(
      new Request(`http://localhost/api/v1/ipfs/${cid}`),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.cid).toBe(cid);
    expect(body.data.gatewaysChecked.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/ipfs/:cid/status returns pinning persistence metrics', async () => {
    const cid = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
    const response = await ipfsRoutes.handle(
      new Request(`http://localhost/api/v1/ipfs/${cid}/status`),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('pinned');
    expect(body.data.redundancyGateways).toBe(3);
  });

  it('GET /api/v1/ipfs/gateways returns live gateway latency health statuses', async () => {
    const response = await ipfsRoutes.handle(
      new Request('http://localhost/api/v1/ipfs/gateways'),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(4);
    expect(body.data[0].latencyMs).toBeGreaterThan(0);
  });
});
