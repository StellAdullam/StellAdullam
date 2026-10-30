import { describe, expect, it, vi } from 'vitest';
import { TypedEventEmitter } from './event-emitter';

interface TestEvents {
  landPurchased: { tokenId: number; buyer: string };
  loanRepaid: { loanId: string; amount: number };
}

describe('TypedEventEmitter', () => {
  it('registers listeners and notifies them on emit', () => {
    const emitter = new TypedEventEmitter<TestEvents>();
    const listener = vi.fn();

    emitter.on('landPurchased', listener);
    emitter.emit('landPurchased', { tokenId: 42, buyer: 'GUSER123' });

    expect(listener).toHaveBeenCalledWith({ tokenId: 42, buyer: 'GUSER123' });
  });

  it('unsubscribes listeners correctly using returned disposer', () => {
    const emitter = new TypedEventEmitter<TestEvents>();
    const listener = vi.fn();

    const unsubscribe = emitter.on('loanRepaid', listener);
    emitter.emit('loanRepaid', { loanId: 'L-1', amount: 500 });
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    emitter.emit('loanRepaid', { loanId: 'L-2', amount: 1000 });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
