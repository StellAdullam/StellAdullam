import { describe, expect, it } from 'bun:test';
import { stringifyQuery, parseQuery } from './query-string';

describe('query-string utilities', () => {
  it('serializes flat objects to query strings', () => {
    const query = stringifyQuery({ page: 1, limit: 20, sort: 'asc' });
    expect(query).toBe('?page=1&limit=20&sort=asc');
  });

  it('serializes array parameters correctly', () => {
    const query = stringifyQuery({ district: ['residential', 'commercial'] });
    expect(query).toBe('?district=residential&district=commercial');
  });

  it('omits null and undefined fields', () => {
    const query = stringifyQuery({ page: 2, empty: null, undef: undefined, zero: 0 });
    expect(query).toBe('?page=2&zero=0');
  });

  it('returns empty string if object has no valid parameters', () => {
    expect(stringifyQuery({})).toBe('');
    expect(stringifyQuery({ a: null })).toBe('');
  });

  it('parses query string into typed object', () => {
    const parsed = parseQuery('?page=1&limit=20&filter=active');
    expect(parsed).toEqual({
      page: '1',
      limit: '20',
      filter: 'active',
    });
  });

  it('parses multi-value query keys into arrays', () => {
    const parsed = parseQuery('district=commercial&district=industrial&order=desc');
    expect(parsed).toEqual({
      district: ['commercial', 'industrial'],
      order: 'desc',
    });
  });
});
