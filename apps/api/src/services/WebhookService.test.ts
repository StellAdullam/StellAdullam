import { describe, expect, it, spyOn, beforeEach, afterEach, mock } from 'bun:test';
import {
  webhookService,
  type WebhookPayload,
  type HealthFactorWebhookPayload,
} from './WebhookService';
import { transactionRepository } from '../repositories/TransactionRepository';
import type { Transaction } from '../db/schema/transactions';
import { logger } from './logger';
import { createHmac } from 'crypto';

describe('WebhookService', () => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'default-secret-for-dev';

  beforeEach(() => {
    webhookService.clearSubscribers();
    // Mock logger to avoid noisy output
    spyOn(logger, 'info').mockImplementation(() => {});
    spyOn(logger, 'warn').mockImplementation(() => {});
    spyOn(logger, 'error').mockImplementation(() => {});
    spyOn(logger.crud, 'success').mockImplementation(() => {});
    spyOn(logger.crud, 'failure').mockImplementation(() => {});
  });

  afterEach(() => {
    webhookService.clearSubscribers();
    // Restore spies on shared singletons (e.g. transactionRepository) so DB integration tests are not affected
    mock.restore();
  });

  describe('validateSignature', () => {
    it('should return true for valid signature', () => {
      const payload = JSON.stringify({ test: 'data' });
      const hmac = createHmac('sha256', WEBHOOK_SECRET);
      const signature = hmac.update(payload).digest('hex');

      const isValid = webhookService.validateSignature(payload, signature);
      expect(isValid).toBe(true);
    });

    it('should return false for invalid signature', () => {
      const payload = JSON.stringify({ test: 'data' });
      const isValid = webhookService.validateSignature(payload, 'wrong-signature');
      expect(isValid).toBe(false);
    });
  });

  describe('processTransactionWebhook', () => {
    it('should update transaction status to confirmed', async () => {
      const txHash = 'a'.repeat(64);
      const mockTx = { id: 'uuid-1', hash: txHash, status: 'pending' };

      const findSpy = spyOn(transactionRepository, 'findByHash').mockResolvedValue(
        mockTx as unknown as Transaction,
      );
      const updateSpy = spyOn(transactionRepository, 'updateStatus').mockResolvedValue({
        ...mockTx,
        status: 'confirmed',
      } as unknown as Transaction);

      const payload: WebhookPayload = {
        transactionHash: txHash,
        status: 'confirmed',
      };

      await webhookService.processTransactionWebhook(payload);

      expect(findSpy).toHaveBeenCalledWith(txHash);
      expect(updateSpy).toHaveBeenCalledWith('uuid-1', 'confirmed');
    });

    it('should throw NOT_FOUND for unknown transaction', async () => {
      const txHash = 'unknown-hash';
      spyOn(transactionRepository, 'findByHash').mockResolvedValue(undefined);

      const payload: WebhookPayload = {
        transactionHash: txHash,
        status: 'confirmed',
      };

      expect(webhookService.processTransactionWebhook(payload)).rejects.toThrow(
        'Transaction with hash unknown-hash not found',
      );
    });

    it('should throw CONFLICT for duplicate status update', async () => {
      const txHash = 'a'.repeat(64);
      const mockTx = { id: 'uuid-1', hash: txHash, status: 'confirmed' };

      spyOn(transactionRepository, 'findByHash').mockResolvedValue(
        mockTx as unknown as Transaction,
      );

      const payload: WebhookPayload = {
        transactionHash: txHash,
        status: 'confirmed',
      };

      expect(webhookService.processTransactionWebhook(payload)).rejects.toThrow(
        'Transaction status is already confirmed',
      );
    });
  });

  describe('Health Factor Degradation Webhook Dispatch', () => {
    const BORROWER = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';

    it('registers and filters webhook subscribers by poolId', () => {
      const sub1 = webhookService.registerSubscriber({
        id: 'sub-usdc',
        url: 'https://liquidator.example/webhooks/hf',
        secret: 'custom-sub-secret',
        poolIds: ['USDC-POOL'],
      });
      webhookService.registerSubscriber({
        id: 'sub-all',
        url: 'https://monitor.example/webhooks/all',
      });

      expect(sub1.warningThreshold).toBe(1.2);
      expect(webhookService.getSubscribers('USDC-POOL')).toHaveLength(2);
      expect(webhookService.getSubscribers('XLM-POOL')).toHaveLength(1);

      expect(webhookService.unregisterSubscriber('sub-usdc')).toBe(true);
      expect(webhookService.getSubscribers('USDC-POOL')).toHaveLength(1);
    });

    it('dispatches HMAC-SHA256 signed payload when health factor drops into warning zone (1.0 < HF <= 1.2)', async () => {
      webhookService.registerSubscriber({
        id: 'sub-1',
        url: 'https://alerts.example/webhook',
        secret: 'inst-secret-key',
        poolIds: ['USDC-POOL'],
        warningThreshold: 1.2,
      });

      let capturedHeaders: Record<string, string> = {};
      let capturedBody = '';

      const mockFetch = mock(async (_url: string, init?: RequestInit) => {
        capturedHeaders = (init?.headers as Record<string, string>) ?? {};
        capturedBody = String(init?.body ?? '');
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      });

      const reports = await webhookService.dispatchHealthFactorDegradation(
        {
          borrowerAddress: BORROWER,
          poolId: 'USDC-POOL',
          previousHF: 1.55,
          newHF: 1.14,
          timestamp: '2026-03-29T12:00:00.000Z',
        },
        { fetchFn: mockFetch as unknown as typeof fetch },
      );

      expect(reports).toHaveLength(1);
      expect(reports[0]?.delivered).toBe(true);
      expect(reports[0]?.attempts).toBe(1);

      const parsed = JSON.parse(capturedBody) as HealthFactorWebhookPayload;
      expect(parsed.borrowerAddress).toBe(BORROWER);
      expect(parsed.poolId).toBe('USDC-POOL');
      expect(parsed.previousHF).toBe(1.55);
      expect(parsed.newHF).toBe(1.14);
      expect(parsed.severity).toBe('warning');
      expect(parsed.timestamp).toBe('2026-03-29T12:00:00.000Z');

      const signature = capturedHeaders['X-Webhook-Signature'] ?? '';
      expect(webhookService.validateSignature(capturedBody, signature, 'inst-secret-key')).toBe(
        true,
      );
      expect(capturedHeaders['X-Webhook-Event']).toBe('loan.health_factor.degraded');
      expect(capturedHeaders['X-RateLimit-Limit']).toBe('60');
    });

    it('retries failed endpoint deliveries with exponential backoff and jitter', async () => {
      webhookService.registerSubscriber({
        id: 'sub-retry',
        url: 'https://flaky.example/webhook',
      });

      const recordedDelays: number[] = [];
      let callCount = 0;

      const mockFetch = mock(async () => {
        callCount += 1;
        if (callCount < 3) {
          return new Response('Bad Gateway', { status: 502 });
        }
        return new Response('OK', { status: 200 });
      });

      const reports = await webhookService.dispatchHealthFactorDegradation(
        {
          borrowerAddress: BORROWER,
          poolId: 'USDC-POOL',
          previousHF: 1.3,
          newHF: 0.95,
        },
        {
          maxRetries: 3,
          baseDelayMs: 100,
          maxDelayMs: 1000,
          jitterRatio: 0.1,
          fetchFn: mockFetch as unknown as typeof fetch,
          sleepFn: async (ms: number) => {
            recordedDelays.push(ms);
          },
        },
      );

      expect(reports[0]?.delivered).toBe(true);
      expect(reports[0]?.attempts).toBe(3);
      expect(recordedDelays).toHaveLength(2);
      expect(recordedDelays[0]).toBeGreaterThanOrEqual(90);
      expect(recordedDelays[1]).toBeGreaterThanOrEqual(180);
    });

    it('enforces per-subscriber rate limiting', async () => {
      webhookService.registerSubscriber({
        id: 'sub-ratelimit',
        url: 'https://ratelimited.example/webhook',
        maxDispatchesPerMinute: 1,
      });

      const mockFetch = mock(async () => new Response('OK', { status: 200 }));
      const nowMs = 1_750_000_000_000;

      const first = await webhookService.dispatchHealthFactorDegradation(
        {
          borrowerAddress: BORROWER,
          poolId: 'USDC-POOL',
          previousHF: 1.4,
          newHF: 1.15,
        },
        { fetchFn: mockFetch as unknown as typeof fetch, nowMs },
      );
      expect(first[0]?.delivered).toBe(true);

      const second = await webhookService.dispatchHealthFactorDegradation(
        {
          borrowerAddress: BORROWER,
          poolId: 'USDC-POOL',
          previousHF: 1.15,
          newHF: 1.05,
        },
        { fetchFn: mockFetch as unknown as typeof fetch, nowMs: nowMs + 1000 },
      );
      expect(second[0]?.delivered).toBe(false);
      expect(second[0]?.rateLimited).toBe(true);
    });
  });
});
