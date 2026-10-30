import { describe, expect, it, vi } from 'vitest';
import { debounce, throttle } from './debounce';

describe('Debounce and Throttle Utilities', () => {
  it('debounces rapid calls to a single trailing invocation', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('throttles rapid calls to rate-limited invocations', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 50);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 60));
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
