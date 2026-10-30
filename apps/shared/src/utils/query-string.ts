/**
 * query-string.ts
 * Type-safe URL query parameter serialization and deserialization utilities
 * for pagination, property filtering, and Stellar Horizon/RPC API requests.
 */

export function stringifyQuery(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      }
    } else {
      searchParams.append(key, String(value));
    }
  }

  const result = searchParams.toString();
  return result ? `?${result}` : "";
}

export function parseQuery<
  T extends Record<string, unknown> = Record<string, string | string[]>,
>(queryString: string): T {
  const cleanQuery = queryString.startsWith("?")
    ? queryString.slice(1)
    : queryString;
  const searchParams = new URLSearchParams(cleanQuery);
  const result: Record<string, unknown> = {};

  for (const [key, value] of searchParams.entries()) {
    if (key in result) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
