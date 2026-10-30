export interface AssetAllocationItem {
  category: 'real_estate' | 'defi_deposit' | 'liquid_crypto' | 'accrued_dividends';
  label: string;
  valueUsd: number;
  percentage: number;
  color: string;
}

export interface PortfolioAllocationBreakdown {
  address: string;
  totalValueUsd: number;
  allocations: AssetAllocationItem[];
  diversificationScore: number; // 0 to 100
}

export class PortfolioAllocationService {
  /**
   * Calculates asset category breakdown and percentage distributions for a user portfolio.
   */
  public static calculateAllocation(
    address: string,
    realEstateValueUsd: number,
    depositValueUsd: number,
    liquidTokensUsd: number,
    dividendsUsd: number,
  ): PortfolioAllocationBreakdown {
    const rawItems: Array<{
      category: AssetAllocationItem['category'];
      label: string;
      valueUsd: number;
      color: string;
    }> = [
      {
        category: 'real_estate',
        label: 'Real Estate Equity',
        valueUsd: Math.max(0, realEstateValueUsd),
        color: '#6366f1', // Indigo
      },
      {
        category: 'defi_deposit',
        label: 'Lending Collateral & Deposits',
        valueUsd: Math.max(0, depositValueUsd),
        color: '#10b981', // Emerald
      },
      {
        category: 'liquid_crypto',
        label: 'Liquid XLM & Stablecoins',
        valueUsd: Math.max(0, liquidTokensUsd),
        color: '#06b6d4', // Cyan
      },
      {
        category: 'accrued_dividends',
        label: 'Unclaimed Rental Dividends',
        valueUsd: Math.max(0, dividendsUsd),
        color: '#f59e0b', // Amber
      },
    ];

    const totalValueUsd = rawItems.reduce((acc, item) => acc + item.valueUsd, 0);

    const allocations: AssetAllocationItem[] = rawItems.map((item) => {
      const percentage =
        totalValueUsd > 0 ? Number(((item.valueUsd / totalValueUsd) * 100).toFixed(2)) : 0;
      return {
        ...item,
        percentage,
      };
    });

    // Herfindahl-Hirschman index (HHI) based diversification score
    let hhi = 0;
    if (totalValueUsd > 0) {
      for (const item of allocations) {
        hhi += Math.pow(item.percentage, 2);
      }
    }
    // HHI ranges from 2500 (equal split) to 10000 (100% single asset)
    // Map to 0-100 score where 100 is highly diversified
    const diversificationScore =
      totalValueUsd > 0 ? Math.max(0, Math.min(100, Math.round((10000 - hhi) / 75))) : 0;

    return {
      address,
      totalValueUsd,
      allocations,
      diversificationScore,
    };
  }
}
