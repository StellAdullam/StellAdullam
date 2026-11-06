import { Elysia } from 'elysia';
import { z } from 'zod';
import { jwt } from '@elysiajs/jwt';
import { validate, rateLimit } from '../middleware';
import { AuthController } from '../controllers/AuthController';
import { sessionService } from '../services/SessionService';

const challengeSchema = z.object({
  stellarAddress: z
    .string()
    .length(56)
    .regex(/^G[A-Z2-7]{55}$/),
});

const sessionSchema = z.object({
  stellarAddress: z
    .string()
    .length(56)
    .regex(/^G[A-Z2-7]{55}$/),
  signature: z.string().min(1),
});

const DEV_DEFAULT_SECRET = 'super-secret-default-key-for-dev';

if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEV_DEFAULT_SECRET)
) {
  throw new Error(
    'FATAL: JWT_SECRET must be set to a strong, unique secret in production environment.',
  );
}

const JWT_SECRET = process.env.JWT_SECRET || DEV_DEFAULT_SECRET;

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwt({ name: 'jwt', secret: JWT_SECRET }))
  // POST /auth/challenge - Get a nonce to sign
  .use(validate({ body: challengeSchema }))
  .post('/challenge', async (ctx) => AuthController.getChallenge(ctx), {
    beforeHandle: [rateLimit()],
  })

  // POST /auth/session - Verify signature and issue JWT
  .use(validate({ body: sessionSchema }))
  .post('/session', async (ctx) => AuthController.verifySession(ctx), {
    beforeHandle: [rateLimit()],
  })

  // POST /auth/refresh - Silent rotation of valid session tokens
  .post('/refresh', async ({ request, set }) => {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      set.status = 401;
      return { success: false, error: 'Missing authorization token' };
    }

    const refreshed = sessionService.refreshSession(token);
    if (!refreshed) {
      set.status = 401;
      return { success: false, error: 'Invalid or expired session token' };
    }

    return {
      success: true,
      data: refreshed,
    };
  });
