/**
 * case.ts
 * String naming convention transformation utilities (camelCase, snake_case,
 * kebab-case, PascalCase) for database fields and Soroban symbols.
 */

function splitWords(str: string): string[] {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Converts a string to camelCase (e.g. "total_asset_value" -> "totalAssetValue")
 */
export function toCamelCase(str: string): string {
  const words = splitWords(str);
  if (words.length === 0) return '';

  return words
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (idx === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

/**
 * Converts a string to snake_case (e.g. "totalAssetValue" -> "total_asset_value")
 */
export function toSnakeCase(str: string): string {
  const words = splitWords(str);
  return words.map((w) => w.toLowerCase()).join('_');
}

/**
 * Converts a string to kebab-case (e.g. "TotalAssetValue" -> "total-asset-value")
 */
export function toKebabCase(str: string): string {
  const words = splitWords(str);
  return words.map((w) => w.toLowerCase()).join('-');
}

/**
 * Converts a string to PascalCase (e.g. "total_asset_value" -> "TotalAssetValue")
 */
export function toPascalCase(str: string): string {
  const words = splitWords(str);
  return words
    .map((w) => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}
