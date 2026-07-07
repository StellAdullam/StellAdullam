# @stelladullam/api

Production-ready REST API for StellAdullam — Real Estate Tokenization & DeFi Lending on the Stellar Blockchain.

Built with [Elysia](https://elysiajs.com/) on the [Bun](https://bun.sh) runtime.

## Getting Started

```bash
# Copy environment variables
cp .env.example .env

# Start PostgreSQL + Redis
docker compose -f ../../docker-compose.dev.yml up -d

# Install dependencies (from repo root)
bun install

# Run database migrations
bun run db:migrate

# Start dev server (hot reload)
bun run dev
```

API runs on [http://localhost:3001](http://localhost:3001).
Swagger docs at [http://localhost:3001/swagger](http://localhost:3001/swagger).

## Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start dev server with `--watch` |
| `bun run build` | Bundle for production |
| `bun run start` | Start production build |
| `bun run test` | Run test suite |
| `bun run test:ci` | Sequential tests for CI (avoids DB race conditions) |
| `bun run lint` | ESLint |
| `bun run type-check` | TypeScript type check |
| `bun run db:generate` | Generate Drizzle migration from schema changes |
| `bun run db:migrate` | Apply pending migrations |
| `bun run db:studio` | Open Drizzle Studio (DB browser) |

## Architecture

```
src/
├── routes/           # Route definitions (properties, lending, users, kyc, …)
├── controllers/      # Request parsing + response shaping
├── services/         # Business logic (StellarService, OracleService, …)
├── repositories/     # Data access layer (Drizzle ORM queries)
├── middleware/       # requestLogger, errorHandler, auth
├── db/
│   ├── schema/       # Drizzle table definitions (properties, lending, users, …)
│   └── migrate.ts    # Migration runner
├── workers/          # Background workers (notification delivery)
├── errors/           # ApiError with typed error codes
└── index.ts          # Server entrypoint + Swagger + lifecycle management
```

## API Endpoints

| Prefix | Purpose |
|---|---|
| `GET/POST/PUT/DELETE /properties` | Property CRUD + tokenization + share management |
| `/lending` | Pools, deposits, borrows, repayments, liquidations |
| `/users` | User management |
| `/kyc` | KYC document upload + status |
| `/auth` | Wallet challenge + signature verification |
| `/ledger` | Stellar ledger queries + SSE stream |
| `/oracle` | Price oracle feeds + asset valuation |
| `/risk-monitoring` | Health factor monitoring, at-risk positions |
| `/notifications` | Notification management |
| `/webhooks` | Signed webhook ingestion |
| `/internal-operations` | Admin property verification (credential-gated) |
| `GET /health` | Service health check |
| `GET /swagger` | OpenAPI documentation |

## Environment Variables

See `.env.example` for the full reference. Key categories:

- **Database** — `DATABASE_URL`, `DATABASE_POOL_MAX`
- **Stellar/Soroban** — `STELLAR_NETWORK`, `STELLAR_HORIZON_URL`, `STELLAR_RPC_URL`, `STELLAR_ADMIN_PUBLIC_KEY`, `STELLAR_ADMIN_SECRET`
- **Security** — `WEBHOOK_SECRET`, `LIQUIDATOR_API_KEY`, `INTERNAL_API_KEY`, `OPERATIONS_BACKEND_CREDENTIAL`
- **Cache** — `REDIS_URL` (optional)
- **Notifications** — `NOTIFICATIONS_ENABLED`, `NOTIFICATION_WEBHOOK_URL`

> **Security:** `STELLAR_ADMIN_SECRET` is a root credential. Never commit it. In production, load from a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.).
