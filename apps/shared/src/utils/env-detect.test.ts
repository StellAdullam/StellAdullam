import { describe, expect, it } from 'vitest';
import { isBrowser, isBun, isDevelopment, isNode, isProduction, isTest } from './env-detect';

describe('Environment Detection Utilities', () => {
  it('correctly detects execution in non-browser environment', () => {
    expect(isBrowser()).toBe(false);
  });

  it('correctly detects test environment', () => {
    expect(isTest()).toBe(true);
  });

  it('correctly differentiates production vs non-production', () => {
    expect(isProduction()).toBe(false);
    expect(isDevelopment()).toBe(false); // since isTest() is true
  });

  it('accurately identifies runtime engine', () => {
    const isBunRuntime = typeof (process.versions as any)?.bun !== 'undefined';
    expect(isBun()).toBe(isBunRuntime);
    if (!isBunRuntime) {
      expect(isNode()).toBe(true);
    }
  });
});
