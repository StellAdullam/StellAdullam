import { Elysia } from 'elysia';

/**
 * Production HTTP security hardening middleware.
 * Enforces standard OWASP headers against MIME sniffing, clickjacking, and cross-site scripting.
 */
export const securityHeaders = new Elysia({ name: 'middleware:security-headers' }).onRequest(
  ({ set }) => {
    set.headers['x-content-type-options'] = 'nosniff';
    set.headers['x-frame-options'] = 'DENY';
    set.headers['x-xss-protection'] = '1; mode=block';
    set.headers['referrer-policy'] = 'strict-origin-when-cross-origin';
    set.headers['content-security-policy'] = "default-src 'self'";
  },
);
