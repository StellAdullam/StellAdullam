/**
 * Rate Limit Metrics and Abuse Telemetry Service
 * Tracks 429 Too Many Requests occurrences across routes and IP addresses.
 */

export interface RateLimitEvent {
  identifier: string; // IP or user address
  route: string;
  timestamp: number;
}

export interface AbuseReport {
  identifier: string;
  totalViolations: number;
  recentViolationsLastHour: number;
  isFlaggedForBlock: boolean;
}

export class RateLimitMetricsService {
  private events: RateLimitEvent[] = [];
  public static readonly ABUSE_THRESHOLD_HOURLY = 20;

  public recordViolation(identifier: string, route: string, timestamp = Date.now()): void {
    this.events.push({ identifier, route, timestamp });

    // Keep events from the last 24 hours
    const cutoff = timestamp - 24 * 3600 * 1000;
    this.events = this.events.filter((e) => e.timestamp >= cutoff);
  }

  public getAbuseReport(identifier: string, now = Date.now()): AbuseReport {
    const userEvents = this.events.filter((e) => e.identifier === identifier);
    const hourCutoff = now - 3600 * 1000;
    const recent = userEvents.filter((e) => e.timestamp >= hourCutoff);

    return {
      identifier,
      totalViolations: userEvents.length,
      recentViolationsLastHour: recent.length,
      isFlaggedForBlock: recent.length >= RateLimitMetricsService.ABUSE_THRESHOLD_HOURLY,
    };
  }

  public clear(): void {
    this.events = [];
  }
}

export const rateLimitMetricsService = new RateLimitMetricsService();
