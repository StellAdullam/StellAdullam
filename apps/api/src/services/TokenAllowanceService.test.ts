import { describe, expect, it } from 'vitest';
import { TokenAllowanceService } from './TokenAllowanceService';

describe('TokenAllowanceService', () => {
  it('correctly categorizes zero, positive, and infinite allowances', () => {
    const service = new TokenAllowanceService();
    const zero = service.evaluateAllowance('CTOKEN', 'CSPENDER', 0);
    expect(zero.isApproved).toBe(false);
    expect(zero.allowanceAmount).toBe('0');

    const active = service.evaluateAllowance('CTOKEN', 'CSPENDER', 5000);
    expect(active.isApproved).toBe(true);
    expect(active.isMaxAllowance).toBe(false);

    const max = service.evaluateAllowance('CTOKEN', 'CSPENDER', '9999999999999999999');
    expect(max.isMaxAllowance).toBe(true);
  });
});
