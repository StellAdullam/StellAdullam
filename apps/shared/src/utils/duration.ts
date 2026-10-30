/**
 * duration.ts
 * Human-readable duration formatting and parsing utilities for
 * timelock delays, loan maturation windows, and auction countdowns.
 */

/**
 * Formats a duration in seconds into a concise string (e.g. 3665 -> "1h 1m 5s").
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.slice(0, 3).join(" ");
}

/**
 * Parses a duration string (e.g. "2d 4h 30m") into seconds.
 */
export function parseDuration(durationStr: string): number {
  if (!durationStr) return 0;

  let totalSeconds = 0;
  const regex = /(\d+)\s*([dhms])/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(durationStr)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case "d":
        totalSeconds += value * 86400;
        break;
      case "h":
        totalSeconds += value * 3600;
        break;
      case "m":
        totalSeconds += value * 60;
        break;
      case "s":
        totalSeconds += value;
        break;
    }
  }

  return totalSeconds;
}
