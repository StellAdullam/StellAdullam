export interface DiagnosticMetrics {
  status: 'healthy' | 'degraded' | 'critical';
  uptimeSeconds: number;
  memoryUsageMb: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
  };
  nodeVersion: string;
  platform: string;
  timestamp: string;
}

export class SystemDiagnosticsService {
  private static readonly START_TIME = Date.now();

  /**
   * Collects runtime diagnostic metrics and memory telemetry.
   */
  public static collectMetrics(): DiagnosticMetrics {
    const memory = process.memoryUsage
      ? process.memoryUsage()
      : { heapUsed: 0, heapTotal: 0, rss: 0 };
    const uptimeSeconds = Math.floor((Date.now() - this.START_TIME) / 1000);

    return {
      status: 'healthy',
      uptimeSeconds,
      memoryUsageMb: {
        heapUsed: Number((memory.heapUsed / (1024 * 1024)).toFixed(2)),
        heapTotal: Number((memory.heapTotal / (1024 * 1024)).toFixed(2)),
        rss: Number((memory.rss / (1024 * 1024)).toFixed(2)),
      },
      nodeVersion: process.version || 'bun/1.3',
      platform: process.platform,
      timestamp: new Date().toISOString(),
    };
  }
}
