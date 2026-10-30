import { Elysia, t } from 'elysia';
import { PropertyRepository } from '../repositories/PropertyRepository';
import { LendingRepository } from '../repositories/LendingRepository';
import { isValidStellarAddress } from '@stelladullam/shared';

export interface UserPortfolioSummary {
  address: string;
  totalAssetValueUsd: number;
  totalDebtValueUsd: number;
  netWorthUsd: number;
  healthFactor: number;
  shareHoldingsCount: number;
  activeLoansCount: number;
  claimableDividendsUsd: number;
}

export const portfolioRoutes = new Elysia({ prefix: '/api/v1/portfolio' })
  .get(
    '/:address',
    async ({ params: { address }, set }) => {
      if (!isValidStellarAddress(address)) {
        set.status = 400;
        return {
          success: false,
          error: {
            code: 'INVALID_ADDRESS',
            message: `The provided address '${address}' is not a valid Stellar public key.`,
          },
        };
      }

      try {
        // Fetch user holdings and borrow positions
        const propRepo = new PropertyRepository();
        const lendingRepo = new LendingRepository();

        const [userProperties, positions] = await Promise.all([
          propRepo.findByOwner(address).catch(() => []),
          lendingRepo.findBorrowPositionsByBorrower(address).catch(() => []),
        ]);

        let totalAssetValue = 0;
        for (const p of userProperties) {
          totalAssetValue += Number(p.valuation) || 0;
        }

        let totalDebtValue = 0;
        for (const pos of positions) {
          const principal = Number(pos.principal) || 0;
          const interest = Number(pos.accruedInterest) || 0;
          totalDebtValue += principal + interest;
        }

        const netWorth = Math.max(0, totalAssetValue - totalDebtValue);
        const healthFactor = totalDebtValue > 0 ? totalAssetValue / totalDebtValue : 999.0;
        const claimableDividends = userProperties.length * 12.5; // Estimated nominal yields

        const summary: UserPortfolioSummary = {
          address,
          totalAssetValueUsd: totalAssetValue,
          totalDebtValueUsd: totalDebtValue,
          netWorthUsd: netWorth,
          healthFactor: Number(healthFactor.toFixed(2)),
          shareHoldingsCount: userProperties.length,
          activeLoansCount: positions.length,
          claimableDividendsUsd: claimableDividends,
        };

        return {
          success: true,
          data: summary,
        };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        set.status = 500;
        return {
          success: false,
          error: {
            code: 'PORTFOLIO_CALCULATION_FAILED',
            message: errorMsg,
          },
        };
      }
    },
    {
      params: t.Object({
        address: t.String(),
      }),
    },
  );
