import { describe, expect, it } from 'vitest';
import { deepClone } from './clone';

describe('Deep Clone Utility', () => {
  it('deeply clones complex nested objects and arrays without mutating source', () => {
    const original = {
      user: { name: 'Alice', balances: [100, 200, 300] },
      meta: { active: true },
    };

    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.user).not.toBe(original.user);
    expect(cloned.user.balances).not.toBe(original.user.balances);

    cloned.user.balances.push(400);
    expect(original.user.balances.length).toBe(3);
  });

  it('preserves primitive values and null/undefined', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('stellar')).toBe('stellar');
    expect(deepClone(null)).toBeNull();
    expect(deepClone(undefined)).toBeUndefined();
  });
});
