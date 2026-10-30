import { Elysia, t } from 'elysia';
import { isValidStellarAddress } from '@stelladullam/shared';
import { GasSponsorshipService } from '../services/GasSponsorshipService';
import { StellarAnchorService } from '../services/StellarAnchorService';

export const funderRoutes = new Elysia({ prefix: '/api/v1/funder' })
  .post(
    '',
    async ({ body: { address }, set }) => {
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
        const friendbotUrl = `https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`;
        const response = await fetch(friendbotUrl);

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          // If already funded or rate limited
          if (response.status === 400 && errText.includes('createAccountAlreadyExist')) {
            return {
              success: true,
              data: {
                address,
                funded: false,
                message: 'Account is already funded on Stellar Testnet.',
              },
            };
          }

          set.status = response.status;
          return {
            success: false,
            error: {
              code: 'FRIENDBOT_ERROR',
              message: `Friendbot request failed with status ${response.status}`,
              details: errText,
            },
          };
        }

        const data = await response.json().catch(() => ({}));

        return {
          success: true,
          data: {
            address,
            funded: true,
            message: 'Successfully funded account with 10,000 testnet XLM.',
            result: data,
          },
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown network error';
        set.status = 500;
        return {
          success: false,
          error: {
            code: 'FUNDING_FAILED',
            message,
          },
        };
      }
    },
    {
      body: t.Object({
        address: t.String(),
      }),
    },
  )
  .post(
    '/sponsor',
    ({ body: { address, innerTxXdr }, set }) => {
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

      const eligibility = GasSponsorshipService.checkEligibility(address);
      if (!eligibility.eligible) {
        set.status = 429;
        return {
          success: false,
          error: {
            code: 'QUOTA_EXCEEDED',
            message: eligibility.reason || 'Daily gas sponsorship quota exceeded.',
          },
        };
      }

      GasSponsorshipService.recordSponsorship(address);

      return {
        success: true,
        data: {
          address,
          sponsored: true,
          sponsoredFeeStroops: 200,
          remainingDailyQuota: eligibility.remainingDailyQuota - 1,
          innerTxXdr,
          message: 'Transaction successfully approved for protocol fee-bump sponsorship.',
        },
      };
    },
    {
      body: t.Object({
        address: t.String(),
        innerTxXdr: t.String({ minLength: 10 }),
      }),
    },
  )
  .get('/anchors', () => {
    return {
      success: true,
      data: {
        anchors: StellarAnchorService.getSupportedAnchors(),
      },
    };
  })
  .post(
    '/anchors/estimate',
    ({ body: { amountUsd, assetCode }, set }) => {
      const anchor = StellarAnchorService.getAnchorByCode(assetCode);
      if (!anchor) {
        set.status = 404;
        return {
          success: false,
          error: {
            code: 'ANCHOR_NOT_FOUND',
            message: `Unsupported anchor asset code '${assetCode}'.`,
          },
        };
      }

      const calculation = StellarAnchorService.calculateNetDeposit(amountUsd, assetCode);
      return {
        success: true,
        data: {
          assetCode: anchor.code,
          issuer: anchor.issuer,
          fiatEquivalent: anchor.fiatEquivalent,
          grossAmountUsd: amountUsd,
          feeBps: anchor.depositFeeBps,
          ...calculation,
          sep24DepositUrl: anchor.sep24Url,
        },
      };
    },
    {
      body: t.Object({
        amountUsd: t.Number({ minimum: 1 }),
        assetCode: t.String(),
      }),
    },
  );
