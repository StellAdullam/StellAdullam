import { logger } from './logger';
import { transactionRepository } from '../repositories/TransactionRepository';
import { ApiError } from '../errors/ApiError';
import { createHmac, timingSafeEqual } from 'crypto';

export interface WebhookPayload {
  transactionHash: string;
  status: 'confirmed' | 'failed';
  network?: string;
  timestamp?: string;
}

export interface WebhookSubscriberInput {
  id?: string;
  url: string;
  secret?: string;
  poolIds?: string[];
  warningThreshold?: number;
  maxDispatchesPerMinute?: number;
}

export interface WebhookSubscriber {
  id: string;
  url: string;
  secret: string;
  poolIds?: string[];
  warningThreshold: number;
  maxDispatchesPerMinute: number;
  createdAt: string;
}

export interface HealthFactorDegradationEvent {
  borrowerAddress: string;
  poolId: string;
  previousHF: number;
  newHF: number;
  timestamp?: string;
}

export interface HealthFactorWebhookPayload {
  event: 'loan.health_factor.degraded';
  borrowerAddress: string;
  poolId: string;
  previousHF: number;
  newHF: number;
  severity: 'warning' | 'critical';
  timestamp: string;
}

export interface DispatchWebhookOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitterRatio?: number;
  fetchFn?: typeof fetch;
  sleepFn?: (ms: number) => Promise<void>;
  nowMs?: number;
}

export interface WebhookDispatchReport {
  subscriberId: string;
  url: string;
  delivered: boolean;
  attempts: number;
  statusCode?: number;
  rateLimited?: boolean;
  error?: string;
}

const DEFAULT_WARNING_THRESHOLD = 1.2;
const DEFAULT_MAX_DISPATCHES_PER_MINUTE = 60;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 200;
const DEFAULT_MAX_DELAY_MS = 5000;
const DEFAULT_JITTER_RATIO = 0.2;

export class WebhookService {
  private readonly webhookSecret: string;
  private readonly subscribers: Map<string, WebhookSubscriber> = new Map();
  private readonly dispatchTimestamps: Map<string, number[]> = new Map();

  constructor() {
    const configuredSecret = process.env.WEBHOOK_SECRET;
    if (configuredSecret) {
      this.webhookSecret = configuredSecret;
      return;
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('WEBHOOK_SECRET must be configured in production');
    }

    this.webhookSecret = 'default-secret-for-dev';
  }

  /**
   * Computes an HMAC-SHA256 hex signature for a serialized JSON webhook payload.
   */
  signPayload(payload: string, secret: string = this.webhookSecret): string {
    return createHmac('sha256', secret).update(payload).digest('hex');
  }

  /**
   * Validates the webhook signature from the request header.
   * Expects an X-Webhook-Signature header.
   */
  validateSignature(
    payload: string,
    signature: string,
    secret: string = this.webhookSecret,
  ): boolean {
    const digest = this.signPayload(payload, secret);
    const expected = Buffer.from(digest, 'hex');
    const received = Buffer.from(signature, 'hex');

    if (expected.length !== received.length) {
      return false;
    }

    return timingSafeEqual(expected, received);
  }

  /**
   * Registers an institutional borrower or liquidator webhook subscriber for
   * loan health factor degradation alerts.
   */
  registerSubscriber(input: WebhookSubscriberInput): WebhookSubscriber {
    if (!input.url || !/^https?:\/\/.+/i.test(input.url.trim())) {
      throw ApiError.badRequest('A valid HTTP/HTTPS subscriber webhook URL is required');
    }

    const warningThreshold = input.warningThreshold ?? DEFAULT_WARNING_THRESHOLD;
    if (warningThreshold <= 0 || warningThreshold > 5.0) {
      throw ApiError.badRequest('warningThreshold must be between 0 and 5.0');
    }

    const maxDispatchesPerMinute =
      input.maxDispatchesPerMinute ?? DEFAULT_MAX_DISPATCHES_PER_MINUTE;
    if (maxDispatchesPerMinute <= 0) {
      throw ApiError.badRequest('maxDispatchesPerMinute must be greater than zero');
    }

    const id = input.id?.trim() || `sub_${this.subscribers.size + 1}_${Date.now()}`;
    const subscriber: WebhookSubscriber = {
      id,
      url: input.url.trim(),
      secret: input.secret?.trim() || this.webhookSecret,
      poolIds: input.poolIds,
      warningThreshold,
      maxDispatchesPerMinute,
      createdAt: new Date().toISOString(),
    };

    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  /**
   * Removes a registered webhook subscriber by ID.
   */
  unregisterSubscriber(subscriberId: string): boolean {
    this.dispatchTimestamps.delete(subscriberId);
    return this.subscribers.delete(subscriberId);
  }

  /**
   * Lists active webhook subscribers, optionally filtered by lending pool ID.
   */
  getSubscribers(poolId?: string): WebhookSubscriber[] {
    const all = Array.from(this.subscribers.values());
    if (!poolId) {
      return all;
    }
    return all.filter(
      (sub) => !sub.poolIds || sub.poolIds.length === 0 || sub.poolIds.includes(poolId),
    );
  }

  /**
   * Clears all registered webhook subscribers and rate-limit counters.
   */
  clearSubscribers(): void {
    this.subscribers.clear();
    this.dispatchTimestamps.clear();
  }

  /**
   * Calculates exponential backoff delay with random jitter for retry attempt `attempt` (1-indexed).
   */
  calculateRetryDelayMs(
    attempt: number,
    baseDelayMs: number = DEFAULT_BASE_DELAY_MS,
    maxDelayMs: number = DEFAULT_MAX_DELAY_MS,
    jitterRatio: number = DEFAULT_JITTER_RATIO,
    randomValue: number = Math.random(),
  ): number {
    const exponential = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, Math.max(0, attempt - 1)));
    const jitterSpan = exponential * jitterRatio;
    const jitterOffset = (randomValue * 2 - 1) * jitterSpan;
    return Math.max(0, Math.round(exponential + jitterOffset));
  }

  /**
   * Dispatches signed HMAC-SHA256 webhook notifications to matching subscribers when a loan's
   * health factor drops into the warning ($1.0 < \text{HF} \le 1.2$) or critical ($\text{HF} \le 1.0$) zone.
   */
  async dispatchHealthFactorDegradation(
    event: HealthFactorDegradationEvent,
    options: DispatchWebhookOptions = {},
  ): Promise<WebhookDispatchReport[]> {
    if (event.newHF >= event.previousHF) {
      return [];
    }

    const candidates = this.getSubscribers(event.poolId).filter(
      (sub) => event.newHF <= sub.warningThreshold,
    );
    if (candidates.length === 0) {
      return [];
    }

    const timestamp = event.timestamp ?? new Date().toISOString();
    const severity: 'warning' | 'critical' = event.newHF <= 1.0 ? 'critical' : 'warning';
    const payloadObj: HealthFactorWebhookPayload = {
      event: 'loan.health_factor.degraded',
      borrowerAddress: event.borrowerAddress,
      poolId: event.poolId,
      previousHF: event.previousHF,
      newHF: event.newHF,
      severity,
      timestamp,
    };

    const payloadJson = JSON.stringify(payloadObj);
    const reports: WebhookDispatchReport[] = [];

    for (const subscriber of candidates) {
      const report = await this.deliverToSubscriber(subscriber, payloadJson, timestamp, options);
      reports.push(report);
    }

    return reports;
  }

  private async deliverToSubscriber(
    subscriber: WebhookSubscriber,
    payloadJson: string,
    timestamp: string,
    options: DispatchWebhookOptions,
  ): Promise<WebhookDispatchReport> {
    const nowMs = options.nowMs ?? Date.now();
    const windowStartMs = nowMs - 60_000;
    const history = (this.dispatchTimestamps.get(subscriber.id) ?? []).filter(
      (t) => t > windowStartMs,
    );

    if (history.length >= subscriber.maxDispatchesPerMinute) {
      this.dispatchTimestamps.set(subscriber.id, history);
      return {
        subscriberId: subscriber.id,
        url: subscriber.url,
        delivered: false,
        attempts: 0,
        rateLimited: true,
        error: 'Rate limit exceeded for subscriber',
      };
    }

    history.push(nowMs);
    this.dispatchTimestamps.set(subscriber.id, history);

    const remainingQuota = Math.max(0, subscriber.maxDispatchesPerMinute - history.length);
    const signature = this.signPayload(payloadJson, subscriber.secret);
    const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
    const maxDelayMs = options.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
    const jitterRatio = options.jitterRatio ?? DEFAULT_JITTER_RATIO;
    const fetchFn = options.fetchFn ?? fetch;
    const sleepFn =
      options.sleepFn ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));

    let lastStatusCode: number | undefined;
    let lastError: string | undefined;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        const response = await fetchFn(subscriber.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Event': 'loan.health_factor.degraded',
            'X-Webhook-Signature': signature,
            'X-Webhook-Timestamp': timestamp,
            'X-RateLimit-Limit': String(subscriber.maxDispatchesPerMinute),
            'X-RateLimit-Remaining': String(remainingQuota),
          },
          body: payloadJson,
        });

        lastStatusCode = response.status;
        if (response.ok) {
          return {
            subscriberId: subscriber.id,
            url: subscriber.url,
            delivered: true,
            attempts: attempt,
            statusCode: response.status,
          };
        }

        lastError = `HTTP ${response.status}`;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
      }

      if (attempt <= maxRetries) {
        const delayMs = this.calculateRetryDelayMs(attempt, baseDelayMs, maxDelayMs, jitterRatio);
        await sleepFn(delayMs);
      }
    }

    logger.warn('Failed to deliver health factor webhook after retries', {
      subscriberId: subscriber.id,
      url: subscriber.url,
      attempts: maxRetries + 1,
      error: lastError,
    });

    return {
      subscriberId: subscriber.id,
      url: subscriber.url,
      delivered: false,
      attempts: maxRetries + 1,
      statusCode: lastStatusCode,
      error: lastError,
    };
  }

  /**
   * Processes the transaction webhook payload.
   * Updates transaction status and handles idempotency.
   */
  async processTransactionWebhook(payload: WebhookPayload): Promise<void> {
    const { transactionHash, status } = payload;

    logger.info('Processing transaction webhook', {
      operation: 'WEBHOOK_PROCESS',
      transactionHash,
      status,
    });

    const transaction = await transactionRepository.findByHash(transactionHash);

    if (!transaction) {
      logger.warn('Transaction not found for webhook', { transactionHash });
      throw ApiError.notFound(`Transaction with hash ${transactionHash} not found`);
    }

    // Idempotency: skip update if status is already the same or already in a terminal state
    if (transaction.status === status) {
      logger.info('Transaction status already up to date, skipping', {
        transactionId: transaction.id,
        transactionHash,
        status,
      });
      throw ApiError.conflict(`Transaction status is already ${status}`);
    }

    if (
      transaction.status !== 'pending' &&
      transaction.status !== 'confirmed' &&
      transaction.status !== 'failed'
    ) {
      // This shouldn't happen based on our enum but good to be safe
      logger.warn('Transaction in unexpected state', {
        transactionId: transaction.id,
        state: transaction.status,
      });
    }

    try {
      await transactionRepository.updateStatus(transaction.id, status);

      logger.crud.success('WEBHOOK_UPDATE', 'Transaction', transaction.id);
    } catch (error) {
      logger.crud.failure('WEBHOOK_UPDATE', 'Transaction', error as Error, transaction.id);
      throw ApiError.internal('Failed to update transaction status');
    }
  }
}

export const webhookService = new WebhookService();
