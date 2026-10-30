/**
 * unique.ts
 * Set-based array deduplication, difference, and intersection utilities
 * for account addresses, token IDs, and contract event collections.
 */

/**
 * Returns a deduplicated array preserving first-seen order.
 */
export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/**
 * Returns an array deduplicated by a key selector function.
 */
export function uniqueBy<T, K>(items: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  const result: T[] = [];

  for (const item of items) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}

/**
 * Returns items present in both array A and array B.
 */
export function intersection<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return unique(a.filter((item) => setB.has(item)));
}

/**
 * Returns items present in array A that are not in array B.
 */
export function difference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return unique(a.filter((item) => !setB.has(item)));
}
