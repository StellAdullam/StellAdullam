import { describe, expect, it } from 'bun:test';
import { toTitleCase } from './title-case';

describe('toTitleCase', () => {
  it('returns empty string for empty inputs', () => {
    expect(toTitleCase('')).toBe('');
    expect(toTitleCase('   ')).toBe('');
  });

  it('capitalizes standard words properly', () => {
    expect(toTitleCase('grand central plaza')).toBe('Grand Central Plaza');
    expect(toTitleCase('METROPOLITAN FINANCIAL TOWER')).toBe('Metropolitan Financial Tower');
  });

  it('keeps minor words lowercase unless at the start', () => {
    expect(toTitleCase('tower of stellar lights')).toBe('Tower of Stellar Lights');
    expect(toTitleCase('the house on the hill')).toBe('The House on the Hill');
  });
});
