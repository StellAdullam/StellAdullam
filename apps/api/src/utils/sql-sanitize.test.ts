import { describe, expect, it } from 'bun:test';
import { escapeLikePattern, sanitizeIdentifier, sanitizeSortOrder } from './sql-sanitize';

describe('sql-sanitize utilities', () => {
  it('quotes valid SQL identifiers', () => {
    expect(sanitizeIdentifier('owner_address')).toBe('"owner_address"');
    expect(sanitizeIdentifier('ledger_seq_1')).toBe('"ledger_seq_1"');
    expect(sanitizeIdentifier('_id')).toBe('"_id"');
  });

  it('rejects malicious or invalid SQL identifiers', () => {
    expect(() => sanitizeIdentifier('users; DROP TABLE users;--')).toThrow('Invalid SQL identifier');
    expect(() => sanitizeIdentifier('col"name')).toThrow('Invalid SQL identifier');
    expect(() => sanitizeIdentifier('123col')).toThrow('Invalid SQL identifier');
    expect(() => sanitizeIdentifier('')).toThrow('SQL identifier cannot be empty');
  });

  it('escapes LIKE wildcards properly', () => {
    expect(escapeLikePattern('100% genuine')).toBe('100\\% genuine');
    expect(escapeLikePattern('user_name')).toBe('user\\_name');
    expect(escapeLikePattern('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  it('sanitizes sort order values', () => {
    expect(sanitizeSortOrder('asc')).toBe('ASC');
    expect(sanitizeSortOrder('DESC')).toBe('DESC');
    expect(sanitizeSortOrder(' Asc ')).toBe('ASC');
    expect(() => sanitizeSortOrder('drop table')).toThrow('Invalid sort order');
  });
});
