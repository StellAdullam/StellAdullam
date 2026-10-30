import { describe, expect, it } from 'vitest';
import { isAllowedOrigin } from './cors';

describe('CORS Origin Whitelist', () => {
  it('allows trusted local and production origins', () => {
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('http://localhost:3002')).toBe(true);
    expect(isAllowedOrigin('https://stelladullam.vercel.app')).toBe(true);
    expect(isAllowedOrigin(undefined)).toBe(true); // CLI / curl
  });

  it('rejects unauthorized external origins', () => {
    expect(isAllowedOrigin('https://malicious-site.com')).toBe(false);
    expect(isAllowedOrigin('http://evil.org')).toBe(false);
  });
});
