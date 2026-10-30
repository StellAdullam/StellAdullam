/**
 * Zero-dependency deep cloning utility.
 * Prefers native structuredClone where available, with safe recursive fallback.
 */

export function deepClone<T>(item: T): T {
  if (item === null || typeof item !== "object") {
    return item;
  }

  if (typeof structuredClone === "function") {
    try {
      return structuredClone(item);
    } catch {
      // fallback for unsupported types
    }
  }

  if (item instanceof Date) {
    return new Date(item.getTime()) as unknown as T;
  }

  if (item instanceof RegExp) {
    return new RegExp(item.source, item.flags) as unknown as T;
  }

  if (Array.isArray(item)) {
    return item.map((element) => deepClone(element)) as unknown as T;
  }

  const copy: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
    copy[key] = deepClone(value);
  }

  return copy as T;
}
