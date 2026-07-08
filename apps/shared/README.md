# @stelladullam/shared

Shared TypeScript library for StellAdullam — types, Zod schemas, typed Soroban contract clients, and Stellar SDK utilities used by both the webapp and API.

## Structure

```
src/
├── clients/
│   ├── contracts/
│   │   ├── defiLending.ts       ← DefiLendingContractClient
│   │   ├── realEstateToken.ts   ← RealEstateTokenContractClient
│   │   ├── engine.ts            ← GameEngineClient
│   │   ├── land-token.ts        ← LandTokenClient
│   │   ├── marketplace.ts       ← MarketplaceClient
│   │   └── property-nft.ts      ← PropertyNftClient
│   ├── clientConfig.ts          ← Shared Soroban client config helpers
│   └── index.ts
├── errors/
│   ├── AppError.ts              ← Typed AppError class
│   ├── codes.ts                 ← Error code enum
│   ├── guards.ts                ← isAppError type guard
│   └── types.ts
├── schemas/
│   ├── common.schema.ts         ← Pagination, address, etc.
│   ├── lending.schema.ts        ← Pool, deposit, borrow Zod schemas
│   ├── property.schema.ts       ← Property, document, share schemas
│   ├── transaction.schema.ts
│   └── user.schema.ts
├── testing/
│   ├── constants.ts             ← Test addresses, contract IDs
│   ├── factories.ts             ← Property, pool, position factories
│   └── scenarios.ts             ← End-to-end test scenarios
├── types/
│   ├── api.ts                   ← API request/response types
│   ├── game.ts                  ← Game types + economy constants
│   ├── game-events.ts           ← Soroban event types
│   ├── index.ts
│   ├── observability.ts         ← Health, metrics types
│   ├── pagination.ts
│   └── risk.ts                  ← HealthFactor, RiskLevel types
├── utils/
│   ├── format.ts                ← Number, currency, address formatters
│   ├── interest.ts              ← APY calculation helpers
│   ├── pagination.ts            ← Cursor + offset pagination utils
│   ├── performance.ts           ← Timing / benchmark helpers
│   ├── stellar.ts               ← Address validation, XDR helpers
│   └── validation.ts            ← Zod + custom validators
├── contracts.testnet.json       ← DeFi RWA contract IDs (testnet)
├── contracts.mainnet.json       ← DeFi RWA contract IDs (mainnet)
└── contracts/
    └── game-contracts.testnet.json  ← Game contract IDs (testnet)
```

## Usage

```ts
// Types
import type { Property, LendingPool, Player } from "@stelladullam/shared";

// Economy constants
import {
  EPOCH_LEDGERS,
  BASE_RENTAL_RATE,
  HOUSE_MULTIPLIER,
  APARTMENT_MULTIPLIER,
  SKYSCRAPER_MULTIPLIER,
} from "@stelladullam/shared";

// Contract clients (API-side, Node/Bun)
import {
  RealEstateTokenContractClient,
  DefiLendingContractClient,
  createNodeContractSigner,
} from "@stelladullam/shared";

// Utilities
import { formatLandAmount, isValidStellarAddress } from "@stelladullam/shared";
```

## Build

```bash
# From repo root
bun run build:shared

# Or directly
cd apps/shared && bun run build
```

Output goes to `dist/`. The package exports both `dist/index.js` (CJS) and type declarations via `dist/index.d.ts`.

## Tests

```bash
cd apps/shared && bun test
```

Tests live in `tests/` and cover utility functions, schema validation, and contract client config.
