/**
 * Returns a new array with elements randomly shuffled using the Fisher-Yates algorithm.
 * Does not mutate the source array.
 */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Picks a random sample of `size` elements from the provided array.
 */
export function sampleArray<T>(items: readonly T[], size: number = 1): T[] {
  if (size <= 0 || items.length === 0) return [];
  const shuffled = shuffleArray(items);
  return shuffled.slice(0, Math.min(size, items.length));
}
