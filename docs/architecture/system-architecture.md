# StellAdullam — System Architecture

## Overview

StellAdullam is built as a Bun monorepo with four workspaces and a Rust/Cargo workspace, all working together to provide a complete platform for real estate tokenization and DeFi lending on the Stellar blockchain.

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         StellAdullam Platform                        │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐ │
│  │  @stelladullam/  │  │  @stelladullam/  │  │  Soroban Contracts │ │
│  │     webapp       │◄─►│      api         │◄─►│  (Rust / WASM)    │ │
│  │  Next.js + React │  │  Elysia / Bun    │  │  Stellar Network   │ │
│  │  localhost:3000  │  │  localhost:3001  │  │  testnet/mainnet   │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────────────────┘ │
│           │                     │                                    │
│  ┌────────┴─────────┐           │                                    │
│  │  @stelladullam/  │           │                                    │
│  │      land        │           │                                    │
│  │  Next.js (game)  │           │                                    │
│  │  localhost:3002  │           │                                    │
│  └──────────────────┘           │                                    │
│           │                     │                                    │
│           └──────────┬──────────┘                                    │
│                      ▼                                               │
│            ┌──────────────────────┐                                  │
│            │  @stelladullam/shared│                                  │
│            │  Types · Zod Schemas │                                  │
│            │  Contract Clients    │                                  │
│            │  Stellar SDK Helpers │                                  │
│            └──────────────────────┘                                  │
└──────────────────────────────────────────────────────────────────────┘
```

## Workspaces

| Package | Path | Stack | Role |
|---|---|---|---|
| `@stelladullam/webapp` | `apps/webapp` | Next.js 16, React 19, Tailwind 4, Zustand | DeFi platform frontend |
| `@stelladullam/api` | `apps/api` | Elysia 1.4, Bun, Drizzle ORM, PostgreSQL | REST API + background workers |
| `@stelladullam/shared` | `apps/shared` | TypeScript, Zod, Stellar SDK | Shared types, clients, utilities |
| `@stelladullam/land` | `apps/stelladullam-land` | Next.js 16, React 19, Tailwind 4 | Blockchain city-building game |
| _(Cargo workspace)_ | `apps/contracts` | Rust no_std, Soroban SDK 25.3 | 5 Soroban smart contracts |

## Smart Contracts

```
apps/contracts/
├── defi-rwa/          ← Core platform contract: tokenization + lending
│   ├── access/        ← AdminControl, PauseControl, TimelockControl, RoleStorage
│   ├── events/        ← PropertyEvents, LendingEvents, EmergencyEvents
│   ├── lending/       ← Pool, DepositPosition, BorrowPosition, InterestModel
│   └── storage/       ← Shares, Allowances, PropertyMetadata, PriceOracle
├── game-engine/       ← ECS pipeline: improve + claim_rental
├── game-property-nft/ ← 400-tile NFT grid (20×20)
├── game-land-token/   ← LAND SEP-41 fungible token
└── game-marketplace/  ← Escrow-based P2P exchange
```

### Contract Interaction Graph

```
  game-marketplace
        │ transfer_from / transfer
        ▼
  game-property-nft ◄─── set_improvement_level / set_last_claimed_ledger ─── game-engine
                                                                                  │
                                                                          burn_from / mint
                                                                                  │
                                                                         game-land-token
```

## Data Flow

### Property Tokenization

```
User submits property
    → Frontend validates form (Zod schema from @stelladullam/shared)
    → POST /properties (API validates, creates DB record, status = pending_review)
    → Admin reviews via /internal-operations → status = approved
    → POST /properties/:id/tokenize
        → API calls StellarService.mintPropertyShares()
        → StellarService uses RealEstateTokenContractClient (shared)
        → Soroban defi-rwa.mint_shares() executes on-chain
        → API stores soroban_property_id, sets verified = true
    → Frontend reflects updated portfolio
```

### DeFi Lending

```
User borrows against property shares
    → Frontend calls useHealthFactor hook to preview health factor
    → POST /lending/pools/:id/borrow
        → API calls StellarService.callAndSubmitContract('borrow', [...])
        → defi-rwa contract validates:
            - pool is active, not paused
            - sufficient liquidity
            - oracle price × collateral ÷ PRECISION ≥ min health factor (1.5×)
        → Collateral token transferred to contract
        → Loan token transferred to borrower
        → BorrowPosition stored in DB + on-chain
    → Risk monitoring worker tracks health factors
```

### Game — Claim Rental Income

```
Player clicks "Claim All"
    → Dashboard computes accrued income client-side (mirrors on-chain formula)
    → For each claimable property:
        → Build claim_rental XDR via shared GameEngineClient
        → Wallet signs via @creit.tech/stellar-wallets-kit
        → Submit to Stellar RPC
        → game-engine.claim_rental() verifies ownership, mints LAND, updates ledger
        → SSE /api/ledger/stream pushes new ledger sequence
        → UI re-computes income (now 0 since lastClaimedLedger = current)
```

## Database Schema

```
PostgreSQL (Drizzle ORM)
├── users              — wallet, kyc_status, tier, created_at
├── properties         — metadata, location (jsonb), review_status, soroban_property_id
├── property_documents — deed, appraisal, inspection files
├── share_ownerships   — property_id, owner_id, shares, purchase_price
├── lending_pools      — config: collateral_factor, liquidation_threshold, APYs
├── deposit_positions  — depositor, pool, amount, shares, accrued_interest
├── borrow_positions   — borrower, pool, principal, collateral, health_factor
├── transactions       — audit trail for all on-chain ops
├── notifications      — delivery queue (worker polls + POSTs to webhook)
└── valuations         — oracle price records with methodology + provenance
```

## Authentication & Authorization

```
Wallet-based auth flow:
    GET /auth/challenge?address=G...
        → API generates a time-limited challenge nonce
    POST /auth/verify { address, signature, nonce }
        → API verifies Stellar signature (stellar-sdk StrKey + transaction envelope)
        → Returns JWT session token
    All protected routes require Authorization: Bearer <token>
```

Role tiers: `user` → `operator` → `admin`  
Contract roles: `AdminControl` (single admin address), `EmergencyGuard` (role-based)

## Caching Strategy

| Resource | Cache | TTL | Invalidation |
|---|---|---|---|
| `GET /properties` | Redis | 30s | On any property write |
| `GET /lending/pools` | Redis | 10s | On any pool write |
| Soroban RPC responses | Client-side | Per request | N/A |

Redis is optional — the API falls back to direct DB queries if unavailable.

## Observability

### API
- **Structured logging** — `requestLogger` middleware logs method, path, status, latency on every request
- **Health endpoint** — `GET /health` returns DB latency, Redis status
- **Swagger** — `GET /swagger` — auto-generated OpenAPI spec from Elysia route types
- **Error codes** — all errors return `{ code, message, details? }` with typed `ApiError` class

### Blockchain
- **Soroban event polling** — `soroban-poller.ts` in the game app subscribes to contract events
- **SSE ledger stream** — `/api/ledger/stream` pushes live ledger sequence numbers
- **Transaction status** — `StellarService.getTransactionStatus()` polls Horizon

### Smart Contracts
- All state-changing operations emit Soroban events via `env.events().publish()`
- Event topics follow `(symbol, address, property_id)` convention
- Indexing via `soroban-poller.ts` in the game frontend

## Security

### Defense in Depth

| Layer | Controls |
|---|---|
| Smart contracts | `require_auth()` on all mutations, re-entrancy guard, checks-effects-interactions |
| API | CORS, rate limiting, webhook HMAC verification, input validation (Zod), parameterized queries (Drizzle) |
| Authentication | Wallet signature verification, JWT with short expiry, challenge nonce replay protection |
| Secrets | Never logged, loaded from env/secrets manager, `STELLAR_ADMIN_SECRET` never in source |
| CI | `cargo audit`, `cargo deny`, `bun audit`, no `eval` enforcement, secret pattern scanning |

### Contract Security Patterns
- `defi-rwa`: TimelockControl for emergency recovery (scheduled delay prevents instant rug)
- `game-marketplace`: ExecutionGuard (Rust drop trait) prevents re-entrancy
- `game-engine`: Staged ECS pipeline — validate ownership before any token operation
- `game-property-nft`: Pausable pattern for incident response

## Deployment Architecture

### Development

```
Local:
├── apps/webapp     → localhost:3000 (Next.js dev)
├── apps/api        → localhost:3001 (Bun --watch)
├── apps/stelladullam-land → localhost:3002 (Next.js dev)
├── PostgreSQL      → localhost:5432 (Docker)
├── Redis           → localhost:6379 (Docker)
└── Soroban RPC     → soroban-testnet.stellar.org
```

### Production (recommended)

```
Cloud:
├── webapp + land   → Vercel (Next.js edge, configured in vercel.json)
├── api             → Container (Fly.io / Railway / ECS)
├── PostgreSQL      → Managed (Supabase / RDS / Neon)
├── Redis           → Managed (Upstash / ElastiCache)
├── Secrets         → AWS Secrets Manager / HashiCorp Vault
└── Soroban RPC     → soroban.stellar.org (mainnet)
```

## CI/CD

Five independent GitHub Actions workflows — all must pass before merge:

| Workflow | Trigger | Gates |
|---|---|---|
| `monorepo-ci.yml` | Any `apps/**` change | Workspace integrity, dep audit, bundle size, cross-workspace types, security scan |
| `api-ci.yml` | `apps/api/**` | Lint, typecheck, unit tests (PostgreSQL service), build |
| `webapp-ci.yml` | `apps/webapp/**` | Lint, typecheck, unit tests, build, bundle size check |
| `shared-ci.yml` | `apps/shared/**` | Lint, typecheck, build |
| `contracts-ci.yml` | `apps/contracts/**` | `cargo fmt`, `clippy -D warnings`, unit tests, WASM build, size ≤1MB, coverage ≥80%, audit, deny |

Additional: `changelog.yml` (release notes), `vercel-preview.yml` (PR preview deployments).

## Future Considerations

- **Dividend distribution** — on-chain income distribution contract (runbook drafted, implementation pending)
- **Multi-chain** — bridge contracts for EVM chains via Stellar's cross-chain capabilities
- **Mobile app** — React Native app sharing `@stelladullam/shared` types
- **Event indexing service** — dedicated Soroban event indexer replacing in-app polling
- **Zero-knowledge KYC** — privacy-preserving compliance using ZK proofs
