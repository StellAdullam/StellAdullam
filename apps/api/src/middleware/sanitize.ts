/**
 * Sanitizes a single string by stripping dangerous HTML tags and script injections.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/onload\s*=\s*["'][^"']*["']/gi, '')
    .replace(/onerror\s*=\s*["'][^"']*["']/gi, '');
}

/**
 * Recursively sanitizes all string fields within an object or array.
 */
export function sanitizeDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return sanitizeString(value) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDeep(item)) as unknown as T;
  }

  if (typeof value === 'object' && value !== null) {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitizedObj[key] = sanitizeDeep(val);
    }
    return sanitizedObj as T;
  }

  return value;
}
