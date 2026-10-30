import { describe, expect, it } from 'bun:test';
import { clamp, clamp01, inRange, lerp, normalize } from './clamp';

describe('clamp utilities', () => {
  it('clamps values correctly within min and max', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('throws an error if min > max in clamp', () => {
    expect(() => clamp(5, 10, 0)).toThrow('min (10) cannot be greater than max (0)');
  });

  it('clamps values to [0, 1] with clamp01', () => {
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(-0.2)).toBe(0);
    expect(clamp01(1.5)).toBe(1);
  });

  it('evaluates inRange correctly', () => {
    expect(inRange(5, 0, 10)).toBe(true);
    expect(inRange(0, 0, 10)).toBe(true);
    expect(inRange(10, 0, 10)).toBe(true);
    expect(inRange(-1, 0, 10)).toBe(false);
    expect(inRange(11, 0, 10)).toBe(false);
  });

  it('interpolates linearly with lerp', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
    expect(lerp(10, 20, 1.5)).toBe(20); // Clamped
  });

  it('normalizes value to [0, 1]', () => {
    expect(normalize(50, 0, 100)).toBe(0.5);
    expect(normalize(0, 0, 100)).toBe(0);
    expect(normalize(100, 0, 100)).toBe(1);
    expect(normalize(-50, 0, 100)).toBe(0); // Clamped
  });
});
