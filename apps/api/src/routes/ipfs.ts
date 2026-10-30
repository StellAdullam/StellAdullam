import { Elysia, t } from 'elysia';
import { ipfsStorageService } from '../services/IpfsStorageService';

export const ipfsRoutes = new Elysia({ prefix: '/api/v1/ipfs' })
  .get(
    '/:cid',
    async ({ params: { cid }, set }) => {
      try {
        const metadata = await ipfsStorageService.resolveMetadata(cid);
        return {
          success: true,
          data: metadata,
        };
      } catch (error: any) {
        set.status = 502;
        return {
          success: false,
          error: error?.message ?? 'Failed to resolve IPFS content from gateways',
        };
      }
    },
    {
      params: t.Object({
        cid: t.String({ minLength: 8 }),
      }),
    },
  );
