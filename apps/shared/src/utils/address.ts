/**
 * Shortens a Stellar public address or contract ID to a human-readable format.
 * Example: 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI' -> 'GBZX...MADI'
 */
export function truncateAddress(
  address: string,
  headLength: number = 4,
  tailLength: number = 4,
): string {
  if (!address || typeof address !== 'string') return '';
  const trimmed = address.trim();
  const minLength = headLength + tailLength + 3;

  if (trimmed.length <= minLength) {
    return trimmed;
  }

  const head = trimmed.slice(0, headLength);
  const tail = trimmed.slice(-tailLength);
  return `${head}...${tail}`;
}
