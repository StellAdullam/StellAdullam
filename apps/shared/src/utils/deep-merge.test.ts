import { describe, expect, it } from 'vitest';
import { deepMerge } from './deep-merge';

describe('Deep Merge Utility', () => {
  it('deeply merges nested objects without mutating originals', () => {
    const target = {
      rpc: { url: 'http://old.url', timeout: 5000 },
      features: { lending: true, staking: false },
    };
    const source = {
      rpc: { url: 'http://new.url' },
      features: { staking: true },
      version: '2.0',
    };

    const merged = deepMerge(target, source);

    expect(merged.rpc.url).toBe('http://new.url');
    expect(merged.rpc.timeout).toBe(5000);
    expect(merged.features.lending).toBe(true);
    expect(merged.features.staking).toBe(true);
    expect((merged as any).version).toBe('2.0');

    // Immutability check
    expect(target.rpc.url).toBe('http://old.url');
  });
});
