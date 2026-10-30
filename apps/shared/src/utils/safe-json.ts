/**
 * Resilient JSON parsing utility with default fallbacks and optional validator predicate.
 */

export function safeJsonParse<T>(
  raw: unknown,
  fallback: T,
  validator?: (val: unknown) => val is T,
): T {
  if (typeof raw !== "string") {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    if (validator && !validator(parsed)) {
      return fallback;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function safeJsonStringify(
  value: unknown,
  fallback = "{}",
  indent?: number,
): string {
  try {
    return JSON.stringify(value, null, indent);
  } catch {
    return fallback;
  }
}
