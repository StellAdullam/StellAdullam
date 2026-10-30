import { describe, expect, it } from 'bun:test';
import { arrayDifference, arraySymmetricDifference } from './array-diff';

describe('arrayDifference', () => {
  it('returns empty array if A is empty', () => {
    expect(arrayDifference([], [1, 2, 3])).toEqual([]);
  });

  it('returns elements in A that are not in B', () => {
    expect(arrayDifference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
    expect(arrayDifference(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c']);
  });
});

describe('arraySymmetricDifference', () => {
  it('returns elements unique to either array', () => {
    const diff = arraySymmetricDifference([1, 2, 3], [2, 3, 4]);
    expect(diff).toEqual([1, 4]);
  });

  it('returns all elements if arrays are disjoint', () => {
    expect(arraySymmetricDifference([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
  });
});
