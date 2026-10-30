import { beforeEach, describe, expect, it } from 'bun:test';
import { StellarNetworkService } from './StellarNetworkService';

describe('StellarNetworkService', () => {
  beforeEach(() => {
    StellarNetworkService.clearCache();
  });

  it('returns valid network status metrics with fallback resilience', async () => {
    const status = await StellarNetworkService.getNetworkStatus();

    expect(status.network).toBeDefined();
    expect(status.baseFeeStroops).toBeGreaterThan(0);
    expect(status.ledgerCloseTimeSeconds).toBe(5.0);
    expect(status.protocolVersion).toBeGreaterThanOrEqual(20);
    expect(['optimal', 'congested', 'degraded']).toContain(status.status);
    expect(status.timestamp).toBeDefined();
  });

  it('serves cached status on rapid sequential invocations', async () => {
    const status1 = await StellarNetworkService.getNetworkStatus();
    const status2 = await StellarNetworkService.getNetworkStatus();

    expect(status1.timestamp).toBe(status2.timestamp);
  });
});
