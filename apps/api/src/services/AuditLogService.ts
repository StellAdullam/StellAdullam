export interface AuditEntry {
  id: string;
  timestamp: number;
  actor: string;
  action: 'EMERGENCY_PAUSE' | 'EMERGENCY_UNPAUSE' | 'UPDATE_PARAMETER' | 'GRANT_ROLE' | 'REVOKE_ROLE' | 'LIQUIDATION_EXECUTE';
  details: Record<string, any>;
}

export class AuditLogService {
  private static readonly logs: AuditEntry[] = [];
  private static readonly MAX_ENTRIES = 500;

  /**
   * Appends an administrative audit event to the in-memory circular buffer.
   */
  public static logAction(
    actor: string,
    action: AuditEntry['action'],
    details: Record<string, any> = {}
  ): AuditEntry {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      actor,
      action,
      details,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.MAX_ENTRIES) {
      this.logs.pop();
    }

    return entry;
  }

  /**
   * Retrieves recent audit entries, optionally filtered by action type.
   */
  public static getLogs(limit: number = 50, actionFilter?: AuditEntry['action']): AuditEntry[] {
    let result = this.logs;
    if (actionFilter) {
      result = result.filter((e) => e.action === actionFilter);
    }
    return result.slice(0, Math.min(limit, 100));
  }

  /**
   * Clears the log buffer (testing only).
   */
  public static clear(): void {
    this.logs.length = 0;
  }
}
