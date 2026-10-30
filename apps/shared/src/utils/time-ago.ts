/**
 * time-ago.ts
 * Relative time humanization utilities for Stellar transaction timestamps,
 * auction deadlines, and oracle update intervals.
 */

export function timeAgo(timestamp: number | Date, now: number | Date = Date.now()): string {
  const target = timestamp instanceof Date ? timestamp.getTime() : timestamp;
  const current = now instanceof Date ? now.getTime() : now;
  const diffSec = Math.floor((current - target) / 1000);

  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}d ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear}y ago`;
}

export function timeUntil(timestamp: number | Date, now: number | Date = Date.now()): string {
  const target = timestamp instanceof Date ? timestamp.getTime() : timestamp;
  const current = now instanceof Date ? now.getTime() : now;
  const diffSec = Math.floor((target - current) / 1000);

  if (diffSec <= 0) return 'expired';
  if (diffSec < 60) return `in ${diffSec}s`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `in ${diffMin}m`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `in ${diffHour}h`;

  const diffDay = Math.floor(diffHour / 24);
  return `in ${diffDay}d`;
}
