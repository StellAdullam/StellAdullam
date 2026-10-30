import { describe, expect, it } from 'vitest';
import { sleep } from './sleep';

describe('Sleep Delay Utility', () => {
  it('delays execution by approximately requested duration', async () => {
    const start = Date.now();
    await sleep(50);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(40);
  });

  it('aborts immediately when AbortSignal triggers', async () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10);

    await expect(sleep(500, controller.signal)).rejects.toThrow('Sleep aborted');
  });
});
