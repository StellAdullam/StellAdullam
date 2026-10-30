/**
 * group-by.ts
 * Groups elements of an array into an object keyed by the result of a key selector.
 */

export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T, index: number) => K,
): Record<K, T[]> {
  const result = {} as Record<K, T[]>;

  items.forEach((item, index) => {
    const key = keyFn(item, index);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  });

  return result;
}
