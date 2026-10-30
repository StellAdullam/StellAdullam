import { beforeEach, describe, expect, it } from 'bun:test';
import { AuditLogService } from './AuditLogService';

describe('AuditLogService', () => {
  beforeEach(() => {
    AuditLogService.clear();
  });

  it('records an audit entry successfully', () => {
    const entry = AuditLogService.logAction(
      'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      'EMERGENCY_PAUSE',
      { reason: 'Oracle deviation detected' },
    );

    expect(entry.id).toContain('audit-');
    expect(entry.action).toBe('EMERGENCY_PAUSE');
    expect(entry.details.reason).toBe('Oracle deviation detected');

    const logs = AuditLogService.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].id).toBe(entry.id);
  });

  it('filters logs by action category', () => {
    AuditLogService.logAction('actor-1', 'GRANT_ROLE', { role: 'EmergencyGuard' });
    AuditLogService.logAction('actor-2', 'UPDATE_PARAMETER', { feeBps: 150 });

    const roleLogs = AuditLogService.getLogs(10, 'GRANT_ROLE');
    expect(roleLogs.length).toBe(1);
    expect(roleLogs[0].action).toBe('GRANT_ROLE');

    const paramLogs = AuditLogService.getLogs(10, 'UPDATE_PARAMETER');
    expect(paramLogs.length).toBe(1);
    expect(paramLogs[0].action).toBe('UPDATE_PARAMETER');
  });
});
