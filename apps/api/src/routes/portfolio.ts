import { Elysia, t } from 'elysia';
import { PropertyRepository } from '../repositories/PropertyRepository';
import { LendingRepository } from '../repositories/LendingRepository';
import { isValidStellarAddress } from '@stelladullam/shared';
import { PortfolioAllocationService } from '../services/PortfolioAllocationService';

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
        let userProperties: any[] = [];
        let positions: any[] = [];

        try {
          const propRepo = new PropertyRepository();
          userProperties = await propRepo.findByOwner(address);
        } catch {
          userProperties = [];
        }

        try {
          const lendingRepo = new LendingRepository();
          positions = await lendingRepo.findBorrowPositionsByBorrower(address);
        } catch {
          positions = [];
        }

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
  )
  .get(
    '/:address/allocation',
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
        let userProperties: any[] = [];
        let positions: any[] = [];

        try {
          const propRepo = new PropertyRepository();
          userProperties = await propRepo.findByOwner(address);
        } catch {
          userProperties = [];
        }

        try {
          const lendingRepo = new LendingRepository();
          positions = await lendingRepo.findBorrowPositionsByBorrower(address);
        } catch {
          positions = [];
        }

        let realEstateValue = 0;
        for (const p of userProperties) {
          realEstateValue += Number(p.valuation) || 0;
        }

        let collateralDeposits = 0;
        for (const pos of positions) {
          collateralDeposits += Number(pos.collateralAmount) || 0;
        }

        const liquidTokens = 2500; // Estimated liquid XLM balance
        const claimableDividends = userProperties.length * 12.5;

        const breakdown = PortfolioAllocationService.calculateAllocation(
          address,
          realEstateValue,
          collateralDeposits,
          liquidTokens,
          claimableDividends,
        );

        return {
          success: true,
          data: breakdown,
        };
      } catch (err: unknown) {
        set.status = 500;
        return {
          success: false,
          error: {
            code: 'ALLOCATION_CALCULATION_FAILED',
            message: err instanceof Error ? err.message : 'Failed to compute portfolio allocation',
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
