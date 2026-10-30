import { describe, expect, it, vi } from 'vitest';
import { retryWithBackoff } from './retry';

describe('retryWithBackoff Utility', () => {
  it('returns immediately on first attempt success', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await retryWithBackoff(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and resolves when succeeding on later attempt', async () => {
    let calls = 0;
    const fn = vi.fn().mockImplementation(async () => {
      calls++;
      if (calls < 3) {
        throw new Error('RPC temporary timeout');
      }
      return 'recovered';
    });

    const result = await retryWithBackoff(fn, {
      retries: 3,
      initialDelayMs: 10,
    });

    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws final error when max retries exceeded', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Permanent RPC 500'));

    await expect(
      retryWithBackoff(fn, { retries: 2, initialDelayMs: 10 }),
    ).rejects.toThrow('Permanent RPC 500');

    expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });
});
