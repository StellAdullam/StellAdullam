/**
 * Compares two objects for shallow equality across their enumerable keys.
 */
export function shallowEqual<T extends Record<string, unknown>>(
  objA: T | null | undefined,
  objB: T | null | undefined,
): boolean {
  if (Object.is(objA, objB)) return true;
  if (!objA || !objB || typeof objA !== "object" || typeof objB !== "object") {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !Object.is(objA[key], objB[key])
    ) {
      return false;
    }
  }

  return true;
}
