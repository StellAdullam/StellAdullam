import { describe, expect, it } from 'bun:test';
import { SystemDiagnosticsService } from './SystemDiagnosticsService';

describe('SystemDiagnosticsService', () => {
  it('collects diagnostic metrics with healthy status', () => {
    const metrics = SystemDiagnosticsService.collectMetrics();
    expect(metrics.status).toBe('healthy');
    expect(metrics.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(metrics.memoryUsageMb.heapUsed).toBeGreaterThan(0);
    expect(typeof metrics.nodeVersion).toBe('string');
    expect(typeof metrics.platform).toBe('string');
    expect(new Date(metrics.timestamp).getTime()).toBeGreaterThan(0);
  });
});
