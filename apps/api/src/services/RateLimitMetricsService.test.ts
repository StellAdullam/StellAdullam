import { describe, expect, it } from 'vitest';
import { RateLimitMetricsService } from './RateLimitMetricsService';

describe('RateLimitMetricsService', () => {
  it('records violations and calculates hourly violation frequency', () => {
    const service = new RateLimitMetricsService();
    const ip = '192.168.1.100';

    service.recordViolation(ip, '/api/v1/funder');
    service.recordViolation(ip, '/api/v1/funder');
    service.recordViolation(ip, '/api/v1/simulate');

    const report = service.getAbuseReport(ip);
    expect(report.totalViolations).toBe(3);
    expect(report.recentViolationsLastHour).toBe(3);
    expect(report.isFlaggedForBlock).toBe(false);
  });

  it('flags identifiers exceeding hourly threshold for temporary firewall blocking', () => {
    const service = new RateLimitMetricsService();
    const abusiveIp = '10.0.0.99';

    for (let i = 0; i < 25; i++) {
      service.recordViolation(abusiveIp, '/api/v1/auth/challenge');
    }

    const report = service.getAbuseReport(abusiveIp);
    expect(report.recentViolationsLastHour).toBe(25);
    expect(report.isFlaggedForBlock).toBe(true);
  });
});
