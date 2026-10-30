import { describe, expect, it } from 'bun:test';
import { compact, omit, pick } from './omit';

describe('omit & pick utilities', () => {
  const property = {
    id: 1,
    title: 'Luxury Villa',
    owner: 'GA7Q...',
    secretKey: 'SABC...',
    valuation: 150000,
  };

  it('picks specified keys from object', () => {
    const picked = pick(property, ['id', 'title', 'valuation']);
    expect(picked).toEqual({
      id: 1,
      title: 'Luxury Villa',
      valuation: 150000,
    });
  });

  it('omits specified keys from object', () => {
    const safe = omit(property, ['secretKey']);
    expect(safe).toEqual({
      id: 1,
      title: 'Luxury Villa',
      owner: 'GA7Q...',
      valuation: 150000,
    });
    expect((safe as any).secretKey).toBeUndefined();
  });

  it('compacts null, undefined, and empty string properties', () => {
    const dirty = {
      name: 'Adullam',
      empty: '',
      missing: undefined,
      nullVal: null,
      zero: 0,
      bool: false,
    };

    const cleaned = compact(dirty);
    expect(cleaned).toEqual({
      name: 'Adullam',
      zero: 0,
      bool: false,
    });
  });
});
