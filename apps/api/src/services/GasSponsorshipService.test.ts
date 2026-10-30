import { beforeEach, describe, expect, it } from 'bun:test';
import { GasSponsorshipService } from './GasSponsorshipService';

describe('GasSponsorshipService', () => {
  const dummyAddress = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';

  beforeEach(() => {
    GasSponsorshipService.resetQuota();
  });

  it('approves sponsorship for addresses within daily quota', () => {
    const status = GasSponsorshipService.checkEligibility(dummyAddress);

    expect(status.eligible).toBe(true);
    expect(status.remainingDailyQuota).toBe(GasSponsorshipService.DAILY_QUOTA);
    expect(status.maxSponsoredFeeStroops).toBe(GasSponsorshipService.MAX_SPONSORED_FEE_STROOPS);
  });

  it('decrements remaining quota when sponsorship is recorded', () => {
    GasSponsorshipService.recordSponsorship(dummyAddress);
    GasSponsorshipService.recordSponsorship(dummyAddress);

    const status = GasSponsorshipService.checkEligibility(dummyAddress);
    expect(status.eligible).toBe(true);
    expect(status.remainingDailyQuota).toBe(GasSponsorshipService.DAILY_QUOTA - 2);
  });

  it('rejects sponsorship when daily quota is exhausted', () => {
    for (let i = 0; i < GasSponsorshipService.DAILY_QUOTA; i++) {
      GasSponsorshipService.recordSponsorship(dummyAddress);
    }

    const status = GasSponsorshipService.checkEligibility(dummyAddress);
    expect(status.eligible).toBe(false);
    expect(status.remainingDailyQuota).toBe(0);
    expect(status.reason).toContain('Daily gas sponsorship quota exceeded');

    // Attempting to record beyond quota returns false
    expect(GasSponsorshipService.recordSponsorship(dummyAddress)).toBe(false);
  });
});
