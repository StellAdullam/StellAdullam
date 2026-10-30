import { beforeEach, describe, expect, it } from 'bun:test';
import { IpfsGatewayHealthService } from './IpfsGatewayHealthService';

describe('IpfsGatewayHealthService', () => {
  beforeEach(() => {
    IpfsGatewayHealthService.clearCache();
  });

  it('checks all configured IPFS gateways and measures latency', async () => {
    const statuses = await IpfsGatewayHealthService.checkGateways();

    expect(statuses.length).toBeGreaterThanOrEqual(4);
    for (const s of statuses) {
      expect(s.gateway).toStartWith('https://');
      expect(s.healthy).toBe(true);
      expect(s.latencyMs).toBeGreaterThan(0);
      expect(s.lastChecked).toBeDefined();
    }
  });

  it('serves cached gateway statuses within TTL window', async () => {
    const res1 = await IpfsGatewayHealthService.checkGateways();
    const res2 = await IpfsGatewayHealthService.checkGateways();

    expect(res1[0].lastChecked).toBe(res2[0].lastChecked);
  });
});
