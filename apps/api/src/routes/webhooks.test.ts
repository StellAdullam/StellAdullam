import { describe, expect, it } from 'bun:test';
import { webhookRoutes } from './webhooks';

describe('Webhook Routes', () => {
  it('POST /webhooks/subscriptions creates a new webhook subscription', async () => {
    const response = await webhookRoutes.handle(
      new Request('http://localhost/webhooks/subscriptions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          url: 'https://testbot.example.com/alerts',
          events: ['liquidation', 'dividend'],
        }),
      }),
    );

    expect(response.status).toBe(201);
    const body = (await response.json()) as any;
    expect(body.success).toBe(true);
    expect(body.subscription.url).toBe('https://testbot.example.com/alerts');
    expect(body.subscription.events).toEqual(['liquidation', 'dividend']);
  });

  it('DELETE /webhooks/subscriptions/:id deletes an existing subscription', async () => {
    const createRes = await webhookRoutes.handle(
      new Request('http://localhost/webhooks/subscriptions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          url: 'https://testbot.example.com/delete-me',
          events: ['*'],
        }),
      }),
    );
    const createBody = (await createRes.json()) as any;
    const subId = createBody.subscription.id;

    const delRes = await webhookRoutes.handle(
      new Request(`http://localhost/webhooks/subscriptions/${subId}`, {
        method: 'DELETE',
      }),
    );

    expect(delRes.status).toBe(200);
    const delBody = (await delRes.json()) as any;
    expect(delBody.success).toBe(true);
  });
});
