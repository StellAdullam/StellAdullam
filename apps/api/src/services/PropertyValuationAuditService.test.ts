import { describe, expect, it } from 'bun:test';
import { PropertyValuationAuditService } from './PropertyValuationAuditService';

describe('PropertyValuationAuditService', () => {
  it('approves valuation within normal market variance', () => {
    const result = PropertyValuationAuditService.auditValuation(1, 105000, 100000, 200);

    expect(result.propertyId).toBe(1);
    expect(result.status).toBe('approved');
    expect(result.percentageChange).toBe(5);
    expect(result.riskScore).toBe(0);
  });

  it('flags valuation with moderate jump for review', () => {
    const result = PropertyValuationAuditService.auditValuation(2, 135000, 100000, 200);

    expect(result.status).toBe('flagged_for_review');
    expect(result.riskScore).toBe(35);
    expect(result.reasons[0]).toContain('Moderate appraisal increase');
  });

  it('rejects extreme valuation spike (>50%) and excessive price/sqm', () => {
    const result = PropertyValuationAuditService.auditValuation(3, 300000, 100000, 5);

    expect(result.status).toBe('rejected');
    expect(result.riskScore).toBeGreaterThanOrEqual(70);
    expect(result.reasons.length).toBeGreaterThanOrEqual(2);
  });

  it('rejects zero or negative valuation', () => {
    const result = PropertyValuationAuditService.auditValuation(4, 0);

    expect(result.status).toBe('rejected');
    expect(result.riskScore).toBe(100);
  });
});
