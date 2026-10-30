import { describe, expect, it } from 'bun:test';
import { formatBytes, parseBytes } from './bytes';

describe('bytes utilities', () => {
  it('formats byte numbers to human-readable strings', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(-100)).toBe('0 B');
    expect(formatBytes(500)).toBe('500.00 B');
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1048576)).toBe('1.00 MB');
    expect(formatBytes(1073741824)).toBe('1.00 GB');
  });

  it('formats byte numbers with custom decimal places', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
    expect(formatBytes(1536, 0)).toBe('2 KB');
  });

  it('parses formatted strings back to raw bytes', () => {
    expect(parseBytes('1024 B')).toBe(1024);
    expect(parseBytes('1 KB')).toBe(1024);
    expect(parseBytes('1.5 MB')).toBe(1572864);
    expect(parseBytes('2 GB')).toBe(2147483648);
  });

  it('throws an error on invalid byte string formats', () => {
    expect(() => parseBytes('invalid')).toThrow('Invalid byte size format');
    expect(() => parseBytes('100 FOO')).toThrow('Unsupported byte unit');
  });
});
