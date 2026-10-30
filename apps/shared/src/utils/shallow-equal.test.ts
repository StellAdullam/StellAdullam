import { describe, expect, it } from 'bun:test';
import { shallowEqual } from './shallow-equal';

describe('shallowEqual', () => {
  it('identifies identical references as equal', () => {
    const obj = { a: 1, b: 'two' };
    expect(shallowEqual(obj, obj)).toBe(true);
    expect(shallowEqual(null, null)).toBe(true);
  });

  it('correctly compares equivalent shallow objects', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(shallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it('detects missing or differing keys', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('does not recursively compare nested objects', () => {
    const nested1 = { a: { c: 1 } };
    const nested2 = { a: { c: 1 } };
    expect(shallowEqual(nested1, nested2)).toBe(false);
  });
});
