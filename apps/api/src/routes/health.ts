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
      const res = await fetch(`${rpcUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
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
  });
