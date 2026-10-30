import { createHmac } from 'crypto';

export interface WebhookSubscription {
  id: string;
  url: string;
  secret: string;
  events: string[];
  createdAt: string;
  active: boolean;
}

export interface WebhookDispatchResult {
  subscriptionId: string;
  url: string;
  statusCode?: number;
  success: boolean;
  error?: string;
}

export class WebhookSubscriptionService {
  private static subscriptions: Map<string, WebhookSubscription> = new Map();

  public static register(url: string, events: string[], secret?: string): WebhookSubscription {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Webhook URL must use HTTP or HTTPS protocol.');
    }

    if (!events || events.length === 0) {
      throw new Error('At least one event topic must be selected.');
    }

    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const generatedSecret =
      secret || Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

    const subscription: WebhookSubscription = {
      id,
      url,
      secret: generatedSecret,
      events,
      createdAt: new Date().toISOString(),
      active: true,
    };

    this.subscriptions.set(id, subscription);
    return subscription;
  }

  public static get(id: string): WebhookSubscription | undefined {
    return this.subscriptions.get(id);
  }

  public static unregister(id: string): boolean {
    return this.subscriptions.delete(id);
  }

  public static listActive(eventFilter?: string): WebhookSubscription[] {
    const all = Array.from(this.subscriptions.values()).filter((sub) => sub.active);
    if (!eventFilter) return all;
    return all.filter((sub) => sub.events.includes(eventFilter) || sub.events.includes('*'));
  }

  public static generateSignature(payload: string, secret: string): string {
    return createHmac('sha256', secret).update(payload).digest('hex');
  }

  public static clear(): void {
    this.subscriptions.clear();
  }
}
