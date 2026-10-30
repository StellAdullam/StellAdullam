const MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if',
  'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'vs', 'via', 'with'
]);

/**
 * Converts a string into proper English Title Case, preserving minor connector words
 * in lowercase unless they appear as the initial word.
 */
export function toTitleCase(input: string): string {
  if (!input || !input.trim()) return '';

  const words = input.trim().split(/\s+/);
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && MINOR_WORDS.has(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}
