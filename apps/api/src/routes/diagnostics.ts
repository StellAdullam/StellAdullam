import { Elysia } from 'elysia';
import { SystemDiagnosticsService } from '../services/SystemDiagnosticsService';

export const diagnosticsRoutes = new Elysia({ prefix: '/api/v1/diagnostics' })
  .get('/system', () => {
    const metrics = SystemDiagnosticsService.collectMetrics();
    return {
      success: true,
      data: metrics,
    };
  });
