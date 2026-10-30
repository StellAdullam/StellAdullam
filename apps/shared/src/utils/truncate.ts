/**
 * truncate.ts
 * String truncation helpers for long descriptions, hashes, and titles in UI cards.
 */

/**
 * Truncates a string to a maximum length with an optional ellipsis.
 */
export function truncate(
  text: string,
  maxLength: number,
  ellipsis: string = "...",
): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  const sliceLen = Math.max(0, maxLength - ellipsis.length);
  return `${text.slice(0, sliceLen)}${ellipsis}`;
}

/**
 * Truncates the middle of a string (e.g., "0x1234567890abcdef" -> "0x1234...cdef").
 */
export function truncateMiddle(
  text: string,
  frontChars: number = 6,
  backChars: number = 4,
  separator: string = "...",
): string {
  if (!text || text.length <= frontChars + backChars + separator.length) {
    return text;
  }
  return `${text.slice(0, frontChars)}${separator}${text.slice(-backChars)}`;
}

/**
 * Truncates text by word count rather than raw character length.
 */
export function truncateWords(
  text: string,
  maxWords: number,
  ellipsis: string = "...",
): string {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return `${words.slice(0, maxWords).join(" ")}${ellipsis}`;
}
