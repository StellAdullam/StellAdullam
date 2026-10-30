import { describe, expect, it } from 'vitest';
import { generateUuid, isValidUuid } from './uuid';

describe('UUID Utilities', () => {
  it('generates valid RFC 4122 UUID v4 strings', () => {
    const id = generateUuid();
    expect(id).toBeDefined();
    expect(isValidUuid(id)).toBe(true);

    const id2 = generateUuid();
    expect(id).not.toBe(id2);
  });

  it('rejects invalid UUID strings', () => {
    expect(isValidUuid('not-a-uuid')).toBe(false);
    expect(isValidUuid('12345678-1234-1234-1234-123456789012')).toBe(false); // wrong version
  });
});
