import { describe, expect, it, vi } from 'vitest';
import { AlertDispatcherService, HealthAlertPayload } from './AlertDispatcherService';

describe('AlertDispatcherService', () => {
  it('registers subscriber webhook URLs without duplication', () => {
    const service = new AlertDispatcherService();
    const borrower = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';

    service.registerWebhook(borrower, 'https://api.example.com/webhook-1');
    service.registerWebhook(borrower, 'https://api.example.com/webhook-1'); // Duplicate
    service.registerWebhook(borrower, 'https://api.example.com/webhook-2');

    expect(service.getWebhooks(borrower).length).toBe(2);
  });

  it('dispatches alerts to all registered webhooks and records delivery status', async () => {
    const service = new AlertDispatcherService();
    const borrower = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';

    service.registerWebhook(borrower, 'https://api.example.com/webhook-1');
    service.registerWebhook(borrower, 'https://api.example.com/webhook-2');

    const mockSender = vi.fn().mockImplementation(async (url: string) => {
      return url.includes('webhook-1'); // webhook-1 succeeds, webhook-2 fails
    });

    const alert: HealthAlertPayload = {
      borrower,
      poolId: 'POOL_USDC',
      healthFactor: 1.08,
      threshold: 'danger',
      timestamp: new Date().toISOString(),
    };

    const result = await service.dispatchAlert(alert, mockSender);

    expect(result.delivered).toBe(1);
    expect(result.failed).toBe(1);
    expect(mockSender).toHaveBeenCalledTimes(2);
  });
});
