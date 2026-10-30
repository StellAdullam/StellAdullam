import { describe, expect, it } from 'vitest';
import { sanitizeString, sanitizeDeep } from './sanitize';

describe('Sanitization Middleware', () => {
  it('strips script tags and dangerous HTML attributes', () => {
    const malicious = '<script>alert("hack")</script>Hello World';
    expect(sanitizeString(malicious)).toBe('Hello World');

    const withIframe = '<iframe src="evil.com"></iframe>Property Title';
    expect(sanitizeString(withIframe)).toBe('Property Title');

    const withEventHandler = '<img src="x" onerror="alert(1)" />Safe';
    expect(sanitizeString(withEventHandler)).toBe('<img src="x"  />Safe');
  });

  it('recursively sanitizes nested payloads', () => {
    const payload = {
      title: '<script>evil()</script>Downtown Penthouse',
      details: {
        description: 'Great view<script>steal()</script>',
        tags: ['residential', '<script>bad()</script>luxury'],
      },
      price: 500000,
    };

    const sanitized = sanitizeDeep(payload);
    expect(sanitized.title).toBe('Downtown Penthouse');
    expect(sanitized.details.description).toBe('Great view');
    expect(sanitized.details.tags[1]).toBe('luxury');
    expect(sanitized.price).toBe(500000);
  });
});
