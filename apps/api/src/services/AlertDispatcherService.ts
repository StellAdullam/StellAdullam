/**
 * Alert Dispatcher Service
 * Delivers asynchronous webhook notifications when loans approach liquidation thresholds.
 */

export interface HealthAlertPayload {
  borrower: string;
  poolId: string;
  healthFactor: number;
  threshold: 'warning' | 'danger' | 'liquidatable';
  timestamp: string;
}

export type WebhookSender = (url: string, payload: HealthAlertPayload) => Promise<boolean>;

export class AlertDispatcherService {
  private subscribers = new Map<string, string[]>(); // borrower -> webhookUrls

  public registerWebhook(borrower: string, webhookUrl: string): void {
    if (!this.subscribers.has(borrower)) {
      this.subscribers.set(borrower, []);
    }
    const list = this.subscribers.get(borrower)!;
    if (!list.includes(webhookUrl)) {
      list.push(webhookUrl);
    }
  }

  public getWebhooks(borrower: string): string[] {
    return this.subscribers.get(borrower) ?? [];
  }

  public async dispatchAlert(
    alert: HealthAlertPayload,
    sender?: WebhookSender,
  ): Promise<{ delivered: number; failed: number }> {
    const urls = this.getWebhooks(alert.borrower);
    let delivered = 0;
    let failed = 0;

    const defaultSender: WebhookSender = async (url, data) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(3000),
        });
        return res.ok;
      } catch {
        return false;
      }
    };

    const sendFn = sender ?? defaultSender;

    await Promise.all(
      urls.map(async (url) => {
        const ok = await sendFn(url, alert);
        if (ok) {
          delivered++;
        } else {
          failed++;
        }
      }),
    );

    return { delivered, failed };
  }
}

export const alertDispatcherService = new AlertDispatcherService();
