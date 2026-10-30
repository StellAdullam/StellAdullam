/**
 * partition.ts
 * Splits an array into two subsets based on a predicate function.
 * Useful for segregating active vs expired listings, solvent vs liquidatable loans.
 */

export function partition<T>(
  items: T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];

  items.forEach((item, index) => {
    if (predicate(item, index)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });

  return [truthy, falsy];
}
