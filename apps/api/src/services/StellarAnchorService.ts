export interface AnchorAssetInfo {
  code: string;
  issuer: string;
  fiatEquivalent: string;
  minDepositUsd: number;
  maxDepositUsd: number;
  depositFeeBps: number;
  sep24Url: string;
}

export class StellarAnchorService {
  private static readonly SUPPORTED_ANCHORS: AnchorAssetInfo[] = [
    {
      code: 'USDC',
      issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      fiatEquivalent: 'USD',
      minDepositUsd: 10,
      maxDepositUsd: 100000,
      depositFeeBps: 20, // 0.20%
      sep24Url: 'https://anchor.stelladullam.io/sep24/deposit',
    },
    {
      code: 'EURC',
      issuer: 'GDHU6WRG4IEQXM5OZBCXZTGEG644H6J6VTT76DOQOWOGXFFN5K6FGYXN',
      fiatEquivalent: 'EUR',
      minDepositUsd: 10,
      maxDepositUsd: 100000,
      depositFeeBps: 25,
      sep24Url: 'https://anchor.stelladullam.io/sep24/deposit/eur',
    },
    {
      code: 'NGNT',
      issuer: 'GAWODDEFVIILQUEVOVWSVTM3TFZLWUO7YOOQTICAUAN2RNOZNVCQU4AY',
      fiatEquivalent: 'NGN',
      minDepositUsd: 5,
      maxDepositUsd: 50000,
      depositFeeBps: 50,
      sep24Url: 'https://anchor.stelladullam.io/sep24/deposit/ngn',
    },
  ];

  /**
   * Returns supported Stellar Anchor fiat on-ramp assets and SEP-24 endpoints.
   */
  public static getSupportedAnchors(): AnchorAssetInfo[] {
    return this.SUPPORTED_ANCHORS;
  }

  /**
   * Finds anchor asset details by currency code.
   */
  public static getAnchorByCode(code: string): AnchorAssetInfo | undefined {
    return this.SUPPORTED_ANCHORS.find((a) => a.code.toUpperCase() === code.trim().toUpperCase());
  }

  /**
   * Calculates net deposit value after anchor fee deduction.
   */
  public static calculateNetDeposit(
    depositAmountUsd: number,
    assetCode: string,
  ): {
    feeUsd: number;
    netAmountUsd: number;
  } {
    const anchor = this.getAnchorByCode(assetCode);
    const feeBps = anchor ? anchor.depositFeeBps : 30;
    const feeUsd = Number(((depositAmountUsd * feeBps) / 10000).toFixed(2));
    const netAmountUsd = Math.max(0, depositAmountUsd - feeUsd);

    return {
      feeUsd,
      netAmountUsd,
    };
  }
}
