/**
 * Zero-dependency deep cloning utility.
 * Prefers native structuredClone where available, with safe recursive fallback.
 */

export function deepClone<T>(item: T): T {
  if (item === null || typeof item !== 'object') {
    return item;
  }

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(item);
    } catch {
      // fallback for unsupported types
    }
  }

  if (item instanceof Date) {
    return new Date(item.getTime()) as any;
  }

  if (item instanceof RegExp) {
    return new RegExp(item.source, item.flags) as any;
  }

  if (Array.isArray(item)) {
    return item.map((element) => deepClone(element)) as any;
  }

  const copy = {} as Record<string, any>;
  for (const [key, value] of Object.entries(item)) {
    copy[key] = deepClone(value);
  }

  return copy as T;
}
