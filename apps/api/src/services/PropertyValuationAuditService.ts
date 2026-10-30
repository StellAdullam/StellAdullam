export interface ValuationAuditResult {
  propertyId: number;
  currentValuationUsd: number;
  previousValuationUsd?: number;
  percentageChange: number;
  riskScore: number; // 0 to 100
  status: 'approved' | 'flagged_for_review' | 'rejected';
  reasons: string[];
  auditedAt: string;
}

export class PropertyValuationAuditService {
  /**
   * Audits property valuation changes to protect lending pools against inflated collateral appraisals.
   */
  public static auditValuation(
    propertyId: number,
    currentValuationUsd: number,
    previousValuationUsd?: number,
    cadastreAreaSqm?: number,
  ): ValuationAuditResult {
    const reasons: string[] = [];
    let riskScore = 0;

    if (currentValuationUsd <= 0) {
      return {
        propertyId,
        currentValuationUsd,
        percentageChange: 0,
        riskScore: 100,
        status: 'rejected',
        reasons: ['Valuation must be greater than zero.'],
        auditedAt: new Date().toISOString(),
      };
    }

    let percentageChange = 0;
    if (previousValuationUsd && previousValuationUsd > 0) {
      percentageChange = Number(
        (((currentValuationUsd - previousValuationUsd) / previousValuationUsd) * 100).toFixed(2),
      );

      if (percentageChange > 50) {
        riskScore += 60;
        reasons.push(`Extreme appraisal jump (+${percentageChange}%) exceeds 50% threshold.`);
      } else if (percentageChange > 25) {
        riskScore += 35;
        reasons.push(
          `Moderate appraisal increase (+${percentageChange}%) requires secondary appraisal verification.`,
        );
      }
    }

    if (cadastreAreaSqm && cadastreAreaSqm > 0) {
      const pricePerSqm = currentValuationUsd / cadastreAreaSqm;
      if (pricePerSqm > 25000) {
        riskScore += 30;
        reasons.push(
          `Price per square meter ($${pricePerSqm.toFixed(0)}/sqm) exceeds municipal market median.`,
        );
      }
    }

    let status: 'approved' | 'flagged_for_review' | 'rejected' = 'approved';
    if (riskScore >= 70) {
      status = 'rejected';
    } else if (riskScore >= 30) {
      status = 'flagged_for_review';
    }

    return {
      propertyId,
      currentValuationUsd,
      previousValuationUsd,
      percentageChange,
      riskScore,
      status,
      reasons: reasons.length > 0 ? reasons : ['Valuation within normal market parameters.'],
      auditedAt: new Date().toISOString(),
    };
  }
}
