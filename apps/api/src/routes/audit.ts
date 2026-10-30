import { Elysia, t } from 'elysia';
import { AuditLogService, AuditEntry } from '../services/AuditLogService';

export const auditRoutes = new Elysia({ prefix: '/api/v1/audit' })
  .get(
    '/logs',
    ({ query: { limit, action } }) => {
      const parsedLimit = limit ? Number(limit) : 20;
      const logs = AuditLogService.getLogs(parsedLimit, action as AuditEntry['action']);
      return {
        success: true,
        data: {
          logs,
          count: logs.length,
        },
      };
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
        action: t.Optional(t.String()),
      }),
    },
  );
