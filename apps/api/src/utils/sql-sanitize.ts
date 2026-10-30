/**
 * sql-sanitize.ts
 * Security utility functions for sanitizing SQL column identifiers, table names,
 * and LIKE wildcards to prevent SQL injection in dynamic query construction.
 */

/**
 * Validates and quotes a SQL column or table identifier.
 * Rejects any identifier containing characters other than alphanumeric and underscores.
 */
export function sanitizeIdentifier(identifier: string): string {
  const trimmed = identifier.trim();
  if (!trimmed) {
    throw new Error('SQL identifier cannot be empty');
  }

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
    throw new Error(`Invalid SQL identifier format: "${identifier}"`);
  }

  return `"${trimmed}"`;
}

/**
 * Escapes special wildcard characters ('%', '_', '\') in LIKE / ILIKE queries
 */
export function escapeLikePattern(pattern: string): string {
  return pattern.replace(/[\\%_]/g, '\\$&');
}

/**
 * Validates whether a sort order is strictly 'ASC' or 'DESC' (case-insensitive)
 */
export function sanitizeSortOrder(order: string): 'ASC' | 'DESC' {
  const upper = order.trim().toUpperCase();
  if (upper === 'ASC' || upper === 'DESC') {
    return upper;
  }
  throw new Error(`Invalid sort order: "${order}". Must be ASC or DESC.`);
}
