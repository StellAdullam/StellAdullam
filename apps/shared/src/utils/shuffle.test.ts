import { describe, expect, it } from 'bun:test';
import { shuffleArray, sampleArray } from './shuffle';

describe('shuffleArray', () => {
  it('returns empty array when input is empty', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('preserves array length and elements', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = shuffleArray(input);
    expect(shuffled.length).toBe(input.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(input);
  });

  it('does not mutate original array', () => {
    const original = [1, 2, 3];
    const frozen = Object.freeze([...original]);
    const shuffled = shuffleArray(frozen);
    expect(shuffled.length).toBe(3);
  });
});

describe('sampleArray', () => {
  it('returns empty array when size is zero or negative', () => {
    expect(sampleArray([1, 2, 3], 0)).toEqual([]);
    expect(sampleArray([1, 2, 3], -5)).toEqual([]);
  });

  it('returns requested sample size without exceeding array length', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    const sample = sampleArray(input, 3);
    expect(sample.length).toBe(3);
    for (const item of sample) {
      expect(input.includes(item)).toBe(true);
    }

    const fullSample = sampleArray(input, 10);
    expect(fullSample.length).toBe(5);
  });
});
