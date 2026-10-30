import { Elysia, t } from 'elysia';
import { isValidStellarAddress } from '@stelladullam/shared';

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
        set.status = 502;
        return {
          success: false,
          error: {
            code: 'FRIENDBOT_UNREACHABLE',
            message: `Failed to contact Stellar Friendbot: ${message}`,
          },
        };
      }
    },
    {
      body: t.Object({
        address: t.String(),
      }),
    },
  );
