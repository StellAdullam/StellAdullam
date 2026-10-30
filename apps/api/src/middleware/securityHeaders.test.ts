import { describe, expect, it } from 'vitest';
import { Elysia } from 'elysia';
import { securityHeaders } from './securityHeaders';

describe('Security Headers Middleware', () => {
  it('attaches OWASP security headers to all HTTP responses', async () => {
    const app = new Elysia()
      .use(securityHeaders)
      .get('/ping', () => 'pong');

    const response = await app.handle(new Request('http://localhost/ping'));
    expect(response.status).toBe(200);

    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('x-xss-protection')).toBe('1; mode=block');
    expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('content-security-policy')).toBe("default-src 'self'");
  });
});
