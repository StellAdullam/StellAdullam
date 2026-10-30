/**
 * Concurrency-bounded Promise batch execution utility.
 * Prevents overwhelming Soroban RPC and IPFS gateways with excessive parallel requests.
 */

export interface LimitOptions {
  concurrency?: number;
}

export async function mapConcurrent<T, R>(
  items: readonly T[],
  fn: (item: T, index: number) => Promise<R>,
  options: LimitOptions = {},
): Promise<R[]> {
  const concurrency = Math.max(1, options.concurrency ?? 5);
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (currentIndex < items.length) {
        const index = currentIndex++;
        results[index] = await fn(items[index], index);
      }
    },
  );

  await Promise.all(workers);
  return results;
}
