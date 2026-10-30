/**
 * Returns elements present in array A that are not present in array B.
 */
export function arrayDifference<T>(arrayA: readonly T[], arrayB: readonly T[]): T[] {
  const setB = new Set(arrayB);
  return arrayA.filter((item) => !setB.has(item));
}

/**
 * Returns elements present in either array A or array B, but not both (symmetric difference).
 */
export function arraySymmetricDifference<T>(arrayA: readonly T[], arrayB: readonly T[]): T[] {
  const setA = new Set(arrayA);
  const setB = new Set(arrayB);

  const diffA = arrayA.filter((item) => !setB.has(item));
  const diffB = arrayB.filter((item) => !setA.has(item));

  return [...diffA, ...diffB];
}
