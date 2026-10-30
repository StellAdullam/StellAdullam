import { describe, expect, it, vi } from 'vitest';
import { CircuitBreaker, CircuitBreakerOpenError } from './circuit-breaker';

describe('CircuitBreaker', () => {
  it('opens after reaching failure threshold and executes fallback', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 2, cooldownMs: 50, name: 'stellar-rpc' });
    const failingFn = vi.fn().mockRejectedValue(new Error('RPC network timeout'));

    // First failure
    await expect(cb.execute(failingFn)).rejects.toThrow('RPC network timeout');
    expect(cb.getState()).toBe('CLOSED');

    // Second failure -> trips breaker
    await expect(cb.execute(failingFn)).rejects.toThrow('RPC network timeout');
    expect(cb.getState()).toBe('OPEN');

    // Third call while OPEN throws CircuitBreakerOpenError without calling target function
    await expect(cb.execute(failingFn)).rejects.toThrow(CircuitBreakerOpenError);
    expect(failingFn).toHaveBeenCalledTimes(2);

    // Can return fallback instead of throwing
    const fallbackRes = await cb.execute(failingFn, () => 'cached_data');
    expect(fallbackRes).toBe('cached_data');
  });

  it('transitions to HALF_OPEN after cooldown and closes on success', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 20 });
    const failingFn = vi.fn().mockRejectedValue(new Error('error'));
    await expect(cb.execute(failingFn)).rejects.toThrow();
    expect(cb.getState()).toBe('OPEN');

    // Wait for cooldown
    await new Promise((resolve) => setTimeout(resolve, 25));
    expect(cb.getState()).toBe('HALF_OPEN');

    // Successful canary call closes the circuit
    const successFn = vi.fn().mockResolvedValue('ok');
    const result = await cb.execute(successFn);
    expect(result).toBe('ok');
    expect(cb.getState()).toBe('CLOSED');
  });
});
