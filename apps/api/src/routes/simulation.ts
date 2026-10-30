import { Elysia, t } from 'elysia';
import { transactionSimulationService } from '../services/TransactionSimulationService';

export const simulationRoutes = new Elysia({ prefix: '/api/v1/simulation' }).post(
  '',
  async ({ body: { transactionXdr, networkPassphrase } }) => {
    const result = await transactionSimulationService.simulateTransactionXdr(
      transactionXdr,
      networkPassphrase,
    );

    return {
      success: result.isSuccess,
      data: result,
    };
  },
  {
    body: t.Object({
      transactionXdr: t.String(),
      networkPassphrase: t.Optional(t.String()),
    }),
  },
);
