import { describe, expect, it } from 'bun:test';
import { fromRoman, toRoman } from './roman';

describe('roman utilities', () => {
  it('converts numbers to Roman numerals', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(2)).toBe('II');
    expect(toRoman(3)).toBe('III');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(5)).toBe('V');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(10)).toBe('X');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(90)).toBe('XC');
    expect(toRoman(2026)).toBe('MMXXVI');
  });

  it('converts Roman numerals back to numbers', () => {
    expect(fromRoman('I')).toBe(1);
    expect(fromRoman('IV')).toBe(4);
    expect(fromRoman('IX')).toBe(9);
    expect(fromRoman('X')).toBe(10);
    expect(fromRoman('MMXXVI')).toBe(2026);
  });

  it('handles edge cases safely', () => {
    expect(toRoman(0)).toBe('0');
    expect(toRoman(-5)).toBe('-5');
    expect(fromRoman('')).toBe(0);
  });
});
