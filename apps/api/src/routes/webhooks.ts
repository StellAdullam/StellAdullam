import { Elysia, t } from 'elysia';
import { webhookController } from '../controllers/WebhookController';
import type { WebhookPayload } from '../services/WebhookService';
import { WebhookSubscriptionService } from '../services/WebhookSubscriptionService';
import { rateLimit } from '../middleware';
import { errorHandler } from '../middleware/errorHandler';

export const webhookRoutes = new Elysia({ prefix: '/webhooks' })
  .use(errorHandler)
  .post(
    '/transactions',
    async ({ body, headers }) => {
      return await webhookController.handleTransactionWebhook({
        body: body as WebhookPayload,
        headers,
      });
    },
    {
      body: t.Object({
        transactionHash: t.String({ minLength: 64, maxLength: 64 }),
        status: t.Union([t.Literal('confirmed'), t.Literal('failed')]),
        network: t.Optional(t.String()),
        timestamp: t.Optional(t.String()),
      }),
      beforeHandle: [rateLimit()],
      detail: {
        summary: 'Handle transaction webhooks',
        description: 'Receives notifications from Stellar network and updates transaction status',
        tags: ['Webhooks'],
      },
    },
  )
  .post(
    '/subscriptions',
    ({ body, set }) => {
      try {
        const sub = WebhookSubscriptionService.register(body.url, body.events, body.secret);
        set.status = 201;
        return {
          success: true,
          subscription: {
            id: sub.id,
            url: sub.url,
            events: sub.events,
            createdAt: sub.createdAt,
            secret: sub.secret,
          },
        };
      } catch (err) {
        set.status = 400;
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Invalid subscription request',
        };
      }
    },
    {
      body: t.Object({
        url: t.String({ minLength: 8 }),
        events: t.Array(t.String()),
        secret: t.Optional(t.String()),
      }),
      beforeHandle: [rateLimit()],
      detail: {
        summary: 'Register webhook subscriber',
        description:
          'Registers endpoint to receive signed notifications for on-chain and DeFi events',
        tags: ['Webhooks'],
      },
    },
  )
  .delete(
    '/subscriptions/:id',
    ({ params, set }) => {
      const removed = WebhookSubscriptionService.unregister(params.id);
      if (!removed) {
        set.status = 404;
        return {
          success: false,
          error: 'Subscription not found',
        };
      }
      return {
        success: true,
        message: 'Subscription successfully unregistered',
      };
    },
    {
      beforeHandle: [rateLimit()],
      detail: {
        summary: 'Unregister webhook subscriber',
        tags: ['Webhooks'],
      },
    },
  );
