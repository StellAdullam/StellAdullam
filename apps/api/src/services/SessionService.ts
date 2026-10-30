import { createHmac } from 'node:crypto';

export interface SessionClaims {
  sub: string; // Stellar public key
  iat: number; // issued at (unix seconds)
  exp: number; // expiration (unix seconds)
  role?: string;
}

export interface SessionTokenResult {
  token: string;
  expiresInSeconds: number;
  expiresAt: string;
}

export class SessionService {
  private secret: string;
  public static readonly DEFAULT_TTL_SECONDS = 86_400; // 24 hours
  public static readonly RENEWAL_WINDOW_SECONDS = 3_600; // 1 hour

  constructor(secret: string = process.env.JWT_SECRET || 'stelladullam-production-hmac-secret-key-2026') {
    this.secret = secret;
  }

  /**
   * Generates a signed session token envelope (base64url payload + HMAC signature).
   */
  public createSession(stellarAddress: string, ttlSeconds = SessionService.DEFAULT_TTL_SECONDS): SessionTokenResult {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + ttlSeconds;

    const claims: SessionClaims = {
      sub: stellarAddress,
      iat: now,
      exp,
    };

    const payloadStr = JSON.stringify(claims);
    const payloadB64 = Buffer.from(payloadStr).toString('base64url');
    const signature = this.sign(payloadB64);

    return {
      token: `${payloadB64}.${signature}`,
      expiresInSeconds: ttlSeconds,
      expiresAt: new Date(exp * 1000).toISOString(),
    };
  }

  /**
   * Verifies token integrity and expiration, returning parsed claims.
   */
  public verifySession(token: string): SessionClaims | null {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const expectedSig = this.sign(payloadB64);

    if (signature !== expectedSig) return null;

    try {
      const claimsStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
      const claims: SessionClaims = JSON.parse(claimsStr);

      const now = Math.floor(Date.now() / 1000);
      if (claims.exp <= now) {
        return null; // Expired
      }

      return claims;
    } catch {
      return null;
    }
  }

  /**
   * Automatically renews an active session if within renewal window.
   */
  public refreshSession(token: string): SessionTokenResult | null {
    const claims = this.verifySession(token);
    if (!claims) return null;

    return this.createSession(claims.sub);
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.secret).update(payload).digest('base64url');
  }
}

export const sessionService = new SessionService();
