import { describe, expect, it } from 'vitest';
import { SessionService } from './SessionService';

describe('SessionService Authentication', () => {
  it('creates and verifies valid signed session tokens', () => {
    const service = new SessionService('test-secret-123456');
    const address = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';

    const result = service.createSession(address, 3600);
    expect(result.token.includes('.')).toBe(true);

    const claims = service.verifySession(result.token);
    expect(claims).not.toBeNull();
    expect(claims?.sub).toBe(address);
    expect(claims?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('rejects tampered or forged signatures', () => {
    const service = new SessionService('test-secret-123456');
    const address = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';

    const result = service.createSession(address, 3600);
    const tampered = result.token + 'evil';

    expect(service.verifySession(tampered)).toBeNull();
  });

  it('refreshes active tokens with renewed expiry', () => {
    const service = new SessionService('test-secret-123456');
    const address = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';

    const initial = service.createSession(address, 3600);
    const refreshed = service.refreshSession(initial.token);

    expect(refreshed).not.toBeNull();
    const newClaims = service.verifySession(refreshed!.token);
    expect(newClaims?.sub).toBe(address);
  });
});
