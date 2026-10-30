import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { propertyRoutes } from './routes/properties';
import { lendingRoutes } from './routes/lending';
import { userRoutes } from './routes/users';
import { kycRoutes } from './routes/kyc';
import { webhookRoutes } from './routes/webhooks';
import { internalOperationsRoutes } from './routes/internalOperations';
import { authRoutes } from './routes/auth';
import { ledgerRoutes } from './routes/ledger';
import { portfolioRoutes } from './routes/portfolio';
import { analyticsRoutes } from './routes/analytics';
import { funderRoutes } from './routes/funder';
import { exportRoutes } from './routes/export';
import { simulationRoutes } from './routes/simulation';
import { ipfsRoutes } from './routes/ipfs';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware';

/**
 * Base Elysia app without swagger
 * This allows tests to import the app without triggering @scalar/themes Zod incompatibility
 */
const app = new Elysia()
  .use(requestLogger)
  .use(cors())
  .use(errorHandler)
  .use(authRoutes)
  .use(propertyRoutes)
  .use(lendingRoutes)
  .use(portfolioRoutes)
  .use(analyticsRoutes)
  .use(funderRoutes)
  .use(exportRoutes)
  .use(simulationRoutes)
  .use(ipfsRoutes)
  .use(userRoutes)
  .use(kycRoutes)
  .use(webhookRoutes)
  .use(internalOperationsRoutes)
  .use(ledgerRoutes);

export default app;
