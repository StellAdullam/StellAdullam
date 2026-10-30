function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}

/**
 * Performs a deep merge of two objects without mutating inputs.
 */
export function deepMerge<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(target: T, source: U): T & U {
  const output = { ...target } as Record<string, unknown>;

  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      const sourceVal = source[key];
      const targetVal = target[key];

      if (isObject(sourceVal)) {
        if (isObject(targetVal)) {
          output[key] = deepMerge(targetVal, sourceVal);
        } else {
          output[key] = { ...sourceVal };
        }
      } else {
        output[key] = sourceVal;
      }
    }
  }

  return output as T & U;
}
