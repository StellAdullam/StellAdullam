import { beforeEach, describe, expect, it } from 'bun:test';
import { auditRoutes } from './audit';
import { AuditLogService } from '../services/AuditLogService';

describe('Audit Routes', () => {
  beforeEach(() => {
    AuditLogService.clear();
  });

  it('GET /api/v1/audit/logs returns recorded audit entries', async () => {
    AuditLogService.logAction('admin-address', 'EMERGENCY_PAUSE', { reason: 'Test' });

    const res = await auditRoutes.handle(new Request('http://localhost/api/v1/audit/logs'));
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.count).toBe(1);
    expect(body.data.logs[0].action).toBe('EMERGENCY_PAUSE');
  });

  it('filters logs by query param', async () => {
    AuditLogService.logAction('user-1', 'GRANT_ROLE', { role: 'Admin' });
    AuditLogService.logAction('user-2', 'LIQUIDATION_EXECUTE', { loanId: 'ln-123' });

    const res = await auditRoutes.handle(new Request('http://localhost/api/v1/audit/logs?action=GRANT_ROLE'));
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.count).toBe(1);
    expect(body.data.logs[0].action).toBe('GRANT_ROLE');
  });
});
