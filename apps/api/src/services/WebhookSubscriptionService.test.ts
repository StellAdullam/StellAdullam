import { beforeEach, describe, expect, it } from 'bun:test';
import { WebhookSubscriptionService } from './WebhookSubscriptionService';

describe('WebhookSubscriptionService', () => {
  beforeEach(() => {
    WebhookSubscriptionService.clear();
  });

  it('registers a new webhook subscription with generated secret', () => {
    const sub = WebhookSubscriptionService.register('https://api.example.com/webhook', [
      'liquidation',
      'dividend',
    ]);

    expect(sub.id).toStartWith('sub_');
    expect(sub.url).toBe('https://api.example.com/webhook');
    expect(sub.events).toEqual(['liquidation', 'dividend']);
    expect(sub.secret.length).toBeGreaterThan(10);
    expect(sub.active).toBe(true);
  });

  it('rejects invalid URL protocols', () => {
    expect(() => {
      WebhookSubscriptionService.register('ftp://invalid.com', ['*']);
    }).toThrow('Webhook URL must use HTTP or HTTPS protocol.');
  });

  it('rejects empty event lists', () => {
    expect(() => {
      WebhookSubscriptionService.register('https://example.com/webhook', []);
    }).toThrow('At least one event topic must be selected.');
  });

  it('filters active subscriptions by event topic', () => {
    WebhookSubscriptionService.register('https://a.com/webhook', ['liquidation']);
    WebhookSubscriptionService.register('https://b.com/webhook', ['dividend']);
    WebhookSubscriptionService.register('https://c.com/webhook', ['*']);

    const liqSubs = WebhookSubscriptionService.listActive('liquidation');
    expect(liqSubs.length).toBe(2);

    const divSubs = WebhookSubscriptionService.listActive('dividend');
    expect(divSubs.length).toBe(2);

    const otherSubs = WebhookSubscriptionService.listActive('borrow');
    expect(otherSubs.length).toBe(1); // Catch-all '*'
  });

  it('generates deterministic HMAC-SHA256 signatures for payloads', () => {
    const payload = JSON.stringify({ event: 'liquidation', amount: 1000 });
    const secret = 'super-secret-key-123';
    const sig1 = WebhookSubscriptionService.generateSignature(payload, secret);
    const sig2 = WebhookSubscriptionService.generateSignature(payload, secret);

    expect(sig1).toBe(sig2);
    expect(sig1.length).toBe(64); // SHA-256 hex length
  });

  it('unregisters an existing subscription', () => {
    const sub = WebhookSubscriptionService.register('https://example.com/hook', ['*']);
    expect(WebhookSubscriptionService.get(sub.id)).toBeDefined();

    const removed = WebhookSubscriptionService.unregister(sub.id);
    expect(removed).toBe(true);
    expect(WebhookSubscriptionService.get(sub.id)).toBeUndefined();
  });
});
