/**
 * Array chunking utility for pagination and batch task processing.
 */

export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const chunkSize = Math.max(1, Math.floor(size));
  const result: T[][] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }

  return result;
}
