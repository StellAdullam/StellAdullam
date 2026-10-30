import { Elysia } from 'elysia';
import { checkDatabaseHealth } from '../db';

interface ServiceProbe {
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}

export const healthRoutes = new Elysia({ prefix: '' })
  .get('/healthz', async ({ set }) => {
    const startTime = Date.now();
    const dbHealth = await checkDatabaseHealth();

    // Probe Stellar Testnet RPC reachability
    let stellarRpcProbe: ServiceProbe = { healthy: false };
    const rpcUrl = process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';

    try {
      const rpcStart = Date.now();
      const res = await fetch(`${rpcUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      stellarRpcProbe = {
        healthy: res.ok || res.status === 404, // 200 or 404 indicates endpoint is answering
        latencyMs: Date.now() - rpcStart,
      };
    } catch (err) {
      stellarRpcProbe = {
        healthy: false,
        error: err instanceof Error ? err.message : 'RPC unreachable',
      };
    }

    const isSystemHealthy = dbHealth.healthy;
    if (!isSystemHealthy) {
      set.status = 503;
    }

    const mem = process.memoryUsage();

    return {
      status: isSystemHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      version: '1.0.0',
      probes: {
        database: {
          healthy: dbHealth.healthy,
          latencyMs: dbHealth.latency,
          ...(dbHealth.error && { error: dbHealth.error }),
        },
        stellarRpc: stellarRpcProbe,
      },
      system: {
        memory: {
          heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
          rssMb: Math.round(mem.rss / 1024 / 1024),
        },
      },
      totalDurationMs: Date.now() - startTime,
    };
  })
  .get('/api/v1/health/system', () => {
    const mem = process.memoryUsage();
    return {
      status: 'operational',
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        runtime: typeof (process.versions as any)?.bun !== 'undefined' ? 'bun' : 'node',
        version: process.version,
        platform: process.platform,
        arch: process.arch,
        uptimeSeconds: Math.floor(process.uptime()),
      },
      memory: {
        heapUsedMb: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
        heapTotalMb: Number((mem.heapTotal / 1024 / 1024).toFixed(2)),
        rssMb: Number((mem.rss / 1024 / 1024).toFixed(2)),
        externalMb: Number((mem.external / 1024 / 1024).toFixed(2)),
        heapUtilizationRatio: Number((mem.heapUsed / mem.heapTotal).toFixed(4)),
      },
    };
  })
  .get('/metrics', ({ set }) => {
    const mem = process.memoryUsage();
    const uptime = Math.floor(process.uptime());
    set.headers['content-type'] = 'text/plain; version=0.0.4; charset=utf-8';

    return [
      '# HELP process_uptime_seconds Process uptime in seconds',
      '# TYPE process_uptime_seconds gauge',
      `process_uptime_seconds ${uptime}`,
      '',
      '# HELP process_heap_used_bytes Process heap memory currently utilized',
      '# TYPE process_heap_used_bytes gauge',
      `process_heap_used_bytes ${mem.heapUsed}`,
      '',
      '# HELP process_heap_total_bytes Total allocated process heap memory',
      '# TYPE process_heap_total_bytes gauge',
      `process_heap_total_bytes ${mem.heapTotal}`,
      '',
      '# HELP process_rss_bytes Resident set size memory in bytes',
      '# TYPE process_rss_bytes gauge',
      `process_rss_bytes ${mem.rss}`,
      '',
      '# HELP nodejs_version_info Runtime platform and version info',
      '# TYPE nodejs_version_info gauge',
      `nodejs_version_info{version="${process.version}",platform="${process.platform}"} 1`,
      '',
    ].join('\n');
  });
