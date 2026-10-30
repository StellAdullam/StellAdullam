export interface SponsorshipEligibility {
  eligible: boolean;
  reason?: string;
  remainingDailyQuota: number;
  maxSponsoredFeeStroops: number;
}

export class GasSponsorshipService {
  private static userDailyCounts: Map<string, { count: number; windowStartMs: number }> = new Map();
  public static readonly DAILY_QUOTA = 10;
  public static readonly MAX_SPONSORED_FEE_STROOPS = 5000;
  public static readonly WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Evaluates whether a Stellar address is eligible for gas fee sponsorship.
   */
  public static checkEligibility(address: string, _operationType?: string): SponsorshipEligibility {
    const now = Date.now();
    const record = this.userDailyCounts.get(address);

    if (!record || now - record.windowStartMs > this.WINDOW_MS) {
      return {
        eligible: true,
        remainingDailyQuota: this.DAILY_QUOTA,
        maxSponsoredFeeStroops: this.MAX_SPONSORED_FEE_STROOPS,
      };
    }

    if (record.count >= this.DAILY_QUOTA) {
      return {
        eligible: false,
        reason:
          'Daily gas sponsorship quota exceeded. Please self-fund transaction fees or retry tomorrow.',
        remainingDailyQuota: 0,
        maxSponsoredFeeStroops: this.MAX_SPONSORED_FEE_STROOPS,
      };
    }

    return {
      eligible: true,
      remainingDailyQuota: this.DAILY_QUOTA - record.count,
      maxSponsoredFeeStroops: this.MAX_SPONSORED_FEE_STROOPS,
    };
  }

  /**
   * Consumes one sponsorship allowance for the given address.
   */
  public static recordSponsorship(address: string): boolean {
    const now = Date.now();
    const record = this.userDailyCounts.get(address);

    if (!record || now - record.windowStartMs > this.WINDOW_MS) {
      this.userDailyCounts.set(address, { count: 1, windowStartMs: now });
      return true;
    }

    if (record.count >= this.DAILY_QUOTA) {
      return false;
    }

    record.count += 1;
    return true;
  }

  public static resetQuota(address?: string): void {
    if (address) {
      this.userDailyCounts.delete(address);
    } else {
      this.userDailyCounts.clear();
    }
  }
}
