/**
 * Retry utility with exponential backoff and jitter.
 * Designed for resilient Soroban RPC interactions and network communication.
 */

export interface RetryOptions {
  retries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

export async function retryWithBackoff<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const maxRetries = options.retries ?? 3;
  const initialDelay = options.initialDelayMs ?? 100;
  const maxDelay = options.maxDelayMs ?? 3000;
  const factor = options.backoffFactor ?? 2;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let attempt = 0;

  while (true) {
    try {
      return await fn(attempt);
    } catch (error) {
      attempt++;
      if (attempt > maxRetries || !shouldRetry(error, attempt)) {
        throw error;
      }

      // Exponential delay with 15% random jitter
      const exponential = initialDelay * Math.pow(factor, attempt - 1);
      const capped = Math.min(exponential, maxDelay);
      const jitter = capped * 0.15 * (Math.random() * 2 - 1);
      const delay = Math.max(0, capped + jitter);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
