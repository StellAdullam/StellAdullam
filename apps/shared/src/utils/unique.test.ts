import { describe, expect, it } from 'bun:test';
import { difference, intersection, unique, uniqueBy } from './unique';

describe('unique utilities', () => {
  it('deduplicates primitive arrays', () => {
    expect(unique([1, 2, 2, 3, 1, 4])).toEqual([1, 2, 3, 4]);
    expect(unique(['GAAA', 'GBBB', 'GAAA'])).toEqual(['GAAA', 'GBBB']);
  });

  it('deduplicates objects by key selector', () => {
    const properties = [
      { id: 1, name: 'Downtown' },
      { id: 2, name: 'Harbor' },
      { id: 1, name: 'Downtown Duplicate' },
    ];

    const deduplicated = uniqueBy(properties, (p) => p.id);
    expect(deduplicated.length).toBe(2);
    expect(deduplicated.map((p) => p.id)).toEqual([1, 2]);
    expect(deduplicated[0].name).toBe('Downtown');
  });

  it('computes array intersection', () => {
    expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    expect(intersection(['A', 'B'], ['C', 'D'])).toEqual([]);
  });

  it('computes array difference', () => {
    expect(difference([1, 2, 3], [2, 4])).toEqual([1, 3]);
    expect(difference(['A', 'B'], ['A', 'B'])).toEqual([]);
  });
});
