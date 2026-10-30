import { describe, expect, it } from 'bun:test';
import { fromBase64, fromBase64Url, toBase64, toBase64Url } from './base64';

describe('base64 utilities', () => {
  it('encodes and decodes standard base64 strings', () => {
    const raw = 'StellAdullam Real Estate On Stellar';
    const encoded = toBase64(raw);
    expect(encoded).toBe('U3RlbGxBZHVsbGFtIFJlYWwgRXN0YXRlIE9uIFN0ZWxsYXI=');
    expect(fromBase64(encoded)).toBe(raw);
  });

  it('handles UTF-8 multi-byte characters', () => {
    const unicode = 'Stellar 🌟 Real Estate 🏰';
    const encoded = toBase64(unicode);
    expect(fromBase64(encoded)).toBe(unicode);
  });

  it('encodes and decodes URL-safe base64 strings without padding', () => {
    const raw = 'Hello >> World ?? ==';
    const urlSafe = toBase64Url(raw);

    expect(urlSafe).not.toContain('+');
    expect(urlSafe).not.toContain('/');
    expect(urlSafe).not.toContain('=');

    expect(fromBase64Url(urlSafe)).toBe(raw);
  });
});
