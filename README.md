<div align="center">

# StellAdullam

**Tokenize. Lend. Earn. — Real Estate Meets DeFi on Stellar.**

[![Monorepo CI](https://github.com/stelladullam/stelladullam/actions/workflows/monorepo-ci.yml/badge.svg)](https://github.com/stelladullam/stelladullam/actions/workflows/monorepo-ci.yml)
[![API CI](https://github.com/stelladullam/stelladullam/actions/workflows/api-ci.yml/badge.svg)](https://github.com/stelladullam/stelladullam/actions/workflows/api-ci.yml)
[![Webapp CI](https://github.com/stelladullam/stelladullam/actions/workflows/webapp-ci.yml/badge.svg)](https://github.com/stelladullam/stelladullam/actions/workflows/webapp-ci.yml)
[![Contracts CI](https://github.com/stelladullam/stelladullam/actions/workflows/contracts-ci.yml/badge.svg)](https://github.com/stelladullam/stelladullam/actions/workflows/contracts-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Status](https://img.shields.io/badge/Status-Live_Testnet-brightgreen)

StellAdullam is an institutional-grade platform that bridges traditional real estate with decentralized finance. Property owners can tokenize real-world assets as on-chain shares, and investors can use those shares as collateral to access DeFi lending pools — all on Stellar's high-throughput, low-cost network.

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#why-stellar">Why Stellar</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#contributing">Contributing</a> ·
  <a href="docs/">Docs</a>
</p>

</div>

---

## Overview

StellAdullam solves two tightly coupled problems at the intersection of real estate and DeFi:

1. **Illiquidity of real estate.** Tokenizing property into fractional on-chain shares makes it possible to trade, transfer, and leverage real-world assets with the same programmability as any blockchain token — starting from as little as **$100**.

2. **Collateral limitations in DeFi.** By accepting tokenized real estate as collateral, StellAdullam unlocks lending capacity backed by tangible, regulated assets rather than purely speculative crypto positions.

The platform is built to meet institutional compliance requirements — KYC/AML on-chain, role-based access, audit trails — while remaining open and composable for DeFi participants. We focus on **emerging markets** (Latin America, Africa) where property-backed lending can have the greatest real-world impact.

**Current status:** Live on Stellar Testnet. Smart contracts deployed, audited, and passing CI at ≥80% coverage. Mainnet launch planned Q4 2026.

---

## Why Stellar?

StellAdullam chose **Stellar** (over Ethereum, Solana, or Polygon) for three reasons:

| Factor | Stellar | Why It Matters |
|---|---|---|
| **Transaction cost** | ~$0.00001 per tx | Enables fractional ownership — buying $100 worth of shares costs pennies, not dollars |
| **Throughput** | 1,000+ tx/s | Real-time settlements for lending, liquidations, and marketplace trades |
| **Built-in compliance** | SEP-006, SEP-012, SEP-041 | First-class support for KYC/AML, multi-sig, and asset controls — no need for custom contracts to meet regulatory standards |

Stellar's **Soroban smart contracts** (Rust + WASM) provide a deterministic, resource-budgeted execution environment that eliminates the risk of unbounded computation — critical for a financial platform.

> **The trade-off:** Stellar's ecosystem is smaller than Ethereum's. We accept this in exchange for lower cost, higher throughput, and simpler compliance tooling.

---

## Demo

<!-- Insert a screenshot of the StellAdullam dashboard here -->

> **Try it live:** The StellAdullam API is live at [api.stelladullam.com](https://api.stelladullam.com) (production) and [staging-api.stelladullam.com](https://staging-api.stelladullam.com) (staging). The game — **StellAdullam Land** — runs locally at `localhost:3002`.

---

## Features

### Real Estate Tokenization

- **Fractional share ownership** of individual properties, tracked entirely on-chain
- **KYC/AML compliance** enforced at the smart contract level
- **Minting and burning** controls with role-gated admin operations
- **Property metadata** storage with immutable audit history

### DeFi Lending Protocol

- **Collateralized borrowing** using tokenized real estate shares
- **Privacy-configurable lending pools** for institutional participants
- **Automated interest calculation** and liquidation mechanisms
- **Oracle-integrated asset valuation** for accurate collateral ratios

### StellAdullam Land (Game)

- **Blockchain city-building game** on Stellar Testnet
- **400-tile 20×20 grid** where players own, improve, and trade properties
- **LAND token economy** with rental income and a live marketplace
- **Real Soroban contract integration** for all game mechanics

### Compliance & Security

- **Wallet-based authentication** via Stellar signatures — no passwords, no centralized auth
- **Role-based access control** across admin, operator, and user tiers
- **Webhook signature verification** for all external integrations
- **Rate limiting**, input sanitization, and structured audit logging throughout

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      StellAdullam Platform                       │
│                                                                  │
│  ┌─────────────────┐   ┌─────────────────┐   ┌───────────────┐  │
│  │   Web Frontend  │   │   Backend API   │   │Smart Contracts│  │
│  │  Next.js + React│◄──►│  Elysia / Bun  │◄──►│  Soroban/Rust │  │
│  │  localhost:3000 │   │  localhost:3001 │   │Stellar Network│  │
│  └────────┬────────┘   └────────┬────────┘   └───────────────┘  │
│           │                     │                                │
│  ┌────────┴────────┐            │                                │
│  │  StellAdullam   │            │                                │
│  │  Land (Game)    │            │                                │
│  │  localhost:3002 │            │                                │
│  └─────────────────┘            │                                │
│                                 ▼                                │
│                       ┌──────────────────┐                       │
│                       │  Shared Library  │                       │
│                       │ Types · Utils    │                       │
│                       │ Validation · SDK │                       │
│                       └──────────────────┘                       │
└──────────────────────────────────────────────────────────────────┘
```

The repository is a **Bun monorepo** with four workspaces:

| Workspace | Package | Path | Role |
|---|---|---|---|
| Main DeFi webapp | `@stelladullam/webapp` | `apps/webapp` | Next.js 16 frontend with React 19 |
| Backend API | `@stelladullam/api` | `apps/api` | Elysia REST API on Bun |
| Shared library | `@stelladullam/shared` | `apps/shared` | Types, utilities, Stellar SDK helpers |
| Game app | `@stelladullam/land` | `apps/stelladullam-land` | Next.js city-building game |
| Smart contracts | _(Cargo workspace)_ | `apps/contracts` | Soroban smart contracts (Rust) |

### Smart Contracts

| Contract | Purpose | Testnet ID |
|---|---|---|
| `defi-rwa` | Property tokenization + DeFi lending | `CBFQV2RY5VHVFU3HT2I72FLXWY5YNZC37LWJSOZQCX45B76NBO4YZHM4` |
| `game-engine` | Game mechanics orchestration | `CBTPPGX6LT2EPKR7JD7LLUB23E6HI5EFQRXKV3VQNZ6QWJTJ3EZ76RSH` |
| `game-property-nft` | 400-tile property NFTs | `CCPUVGQAMDUUASHMXB7Z6F6XHCZI2WXOPR7DXEVPJBEGYZVJEABEABLE` |
| `game-land-token` | LAND fungible token (SEP-41) | `CBQBXOWI3YB5SFICLVPYHK2EL3SY3XIZUZA6QZIGGXDKMVXAT74IOR3K` |
| `game-marketplace` | P2P property exchange | `CDKRZTY5PFNA4DHI2GFPSTOAADI2WV7SXYVS4VMTDC6M7IKKIPQJP5A3` |

### Data Flows

**Property Tokenization**
```
User submits property → Frontend validates → API verifies KYC
→ Soroban contract mints shares → Event emitted → API indexes
→ Frontend reflects updated portfolio
```

**DeFi Borrowing**
```
User requests loan → Frontend calculates available collateral
→ API checks on-chain share balance → Contract validates collateral ratio
→ Contract disburses funds → Frontend updates lending position
```

**Game — Claim Rental Income**
```
Player clicks Claim → Frontend builds XDR via shared SDK
→ Wallet signs transaction → Soroban claim_rental executes
→ LAND minted to player → SSE pushes ledger update → UI reflects new balance
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend (webapp)** | Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, Zustand 5, Zod 3, Framer Motion |
| **Frontend (land)** | Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4 |
| **Backend API** | Elysia 1.4, Bun runtime, TypeScript 5.9, Drizzle ORM 0.45, Zod 3 |
| **Database** | PostgreSQL 16 (Drizzle migrations), Redis (optional caching) |
| **Smart Contracts** | Rust (no_std), Soroban SDK 25.3, WASM target `wasm32v1-none` |
| **Blockchain** | Stellar (Testnet / Mainnet), Horizon REST API, Soroban RPC |
| **Wallet Integration** | `@creit.tech/stellar-wallets-kit`, Privy, smart-account-kit |
| **Testing** | `bun test`, `@testing-library/react`, MSW 2, fast-check (property tests) |
| **CI/CD** | GitHub Actions (5 independent workflow files) |
| **Tooling** | Bun 1.2+, ESLint 9, Prettier 3, Concurrently |

---

## Getting Started

### Prerequisites

- **Bun** >= 1.0 — [Install Bun](https://bun.sh)
- **Docker** — for PostgreSQL and Redis [Install Docker](https://docs.docker.com/get-docker/)
- **Rust** (optional) — only needed for smart contract work [Install Rust](https://www.rust-lang.org/tools/install)

### Quick Start

```bash
# 1. Clone and install
git clone https://github.com/stelladullam/stelladullam.git
cd stelladullam
bun install

# 2. Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/webapp/.env.example apps/webapp/.env.local

# 3. Start PostgreSQL + Redis
docker compose -f docker-compose.dev.yml up -d

# 4. Run database migrations
cd apps/api && bun run db:migrate && cd ../..

# 5. Launch everything
bun run dev
```

- **Webapp:** [http://localhost:3000](http://localhost:3000)
- **API:** [http://localhost:3001](http://localhost:3001)
- **Swagger:** [http://localhost:3001/swagger](http://localhost:3001/swagger)
- **Game (Land):** [http://localhost:3002](http://localhost:3002)

See [docs/local-setup.md](docs/local-setup.md) for a complete walkthrough.

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `bun install` fails | Outdated Bun version | Run `bun upgrade` (requires Bun ≥ 1.0) |
| Docker containers won't start | Port 5432 or 6379 already in use | `docker compose -f docker-compose.dev.yml down` then `up -d` again |
| API returns DB connection errors | Migrations not applied | `cd apps/api && bun run db:migrate` |
| Webapp can't connect to API | `.env.local` missing or wrong URL | Verify `NEXT_PUBLIC_API_URL=http://localhost:3001` in `apps/webapp/.env.local` |
| Stellar transaction fails | Insufficient testnet funds | Use the [Stellar Lab friendbot](https://laboratory.stellar.org/#account-creator?network=testnet) to fund your testnet account |
| Contract deployment fails | Soroban CLI not installed | `cargo install --locked stellar-cli` |

---

## Available Scripts

Run from the repository root:

| Script | Description |
|---|---|
| `bun run dev` | Start frontend, game app, and API concurrently |
| `bun run build` | Build all workspaces |
| `bun run test` | Run all workspace test suites |
| `bun run lint` | Lint all workspaces |
| `bun run typecheck` | Type-check all workspaces |
| `bun run format` | Format all files with Prettier |
| `bun run clean` | Remove all build artifacts and `node_modules` |
| `bun run build:contracts` | Build Soroban contracts via `scripts/build.sh` |
| `bun run deploy:contracts` | Deploy contracts via `scripts/deploy.sh` |

---

## Environment Variables

All required environment variables are documented in [`docs/deployment/environment-variables.md`](docs/deployment/environment-variables.md). The source of truth is `apps/api/.env.example`.

Key categories:

- **Database** — PostgreSQL connection string and pool settings
- **API Server** — Port, environment, log level
- **Security** — Webhook secret, operations credential, API keys
- **Stellar / Soroban** — Horizon URL, RPC URL, network passphrase, admin keypair, contract IDs
- **KYC** — Upload directory for compliance documents
- **Notifications** — Webhook delivery endpoint config

> **Security note:** Never commit `.env` files. `STELLAR_ADMIN_SECRET` is a root credential — treat it like a private key and load it from a secrets manager in production.

---

## CI/CD

StellAdullam runs five independent GitHub Actions workflows on every push and pull request to `main` and `develop`:

| Workflow | File | Checks |
|---|---|---|
| Monorepo | `monorepo-ci.yml` | Workspace integrity, dependency audit, bundle sizes, cross-workspace integration, security compliance |
| API | `api-ci.yml` | Lint, type-check, unit tests, build |
| Webapp | `webapp-ci.yml` | Lint, type-check, unit tests, build |
| Shared | `shared-ci.yml` | Lint, type-check, build |
| Contracts | `contracts-ci.yml` | Rust format, Clippy, unit tests, WASM build, coverage ≥80%, cargo audit, cargo deny |

All five workflows must pass before any pull request can be merged.

---

## Project Structure

```
stelladullam/
├── apps/
│   ├── api/                    # Elysia/Bun backend API
│   │   ├── src/
│   │   │   ├── controllers/    # Request parsing + response shaping
│   │   │   ├── services/       # StellarService, OracleService, etc.
│   │   │   ├── repositories/   # Drizzle ORM queries
│   │   │   ├── routes/         # properties, lending, users, kyc, oracle
│   │   │   ├── middleware/     # requestLogger, errorHandler, auth
│   │   │   ├── db/             # Drizzle schema + migrations
│   │   │   └── workers/        # Notification delivery worker
│   │   └── drizzle/            # SQL migration files
│   ├── webapp/                 # Next.js DeFi frontend
│   │   └── src/
│   │       ├── app/            # App Router pages + layouts
│   │       ├── components/     # landing/, layout/, property/, lending/, kyc/, auth/, ui/
│   │       ├── hooks/          # useLendingPools, usePortfolio, useHealthFactor
│   │       ├── services/       # API client wrappers
│   │       ├── mocks/          # MSW handlers + fixtures
│   │       └── types/          # Frontend-specific TypeScript types
│   ├── stelladullam-land/      # Next.js blockchain city-building game
│   ├── contracts/              # Soroban smart contracts (Rust)
│   │   └── contracts/
│   │       ├── defi-rwa/       # Main DeFi tokenization + lending
│   │       ├── game-engine/    # ECS pipeline for game mechanics
│   │       ├── game-property-nft/  # 400-tile NFT grid
│   │       ├── game-land-token/    # LAND fungible token (SEP-41)
│   │       └── game-marketplace/   # P2P property exchange
│   └── shared/                 # Shared TypeScript library
│       └── src/
│           ├── types/          # All domain types
│           ├── schemas/        # Zod schemas
│           ├── clients/        # Typed Soroban contract clients
│           ├── utils/          # Stellar helpers, formatters
│           └── contracts/      # Deployed contract ID artifacts
├── docs/
│   ├── api/                    # API endpoint documentation
│   ├── architecture/           # System design documents
│   ├── contracts/              # Contract deployment guides
│   ├── deployment/             # Environment variables, deploy guides
│   ├── game/                   # Game economy, rules, developer setup
│   ├── guides/                 # Developer getting-started guides
│   ├── operations/             # Production runbooks
│   └── testing/                # Smoke tests and testing strategy
├── scripts/
│   ├── build.sh                # Builds all Soroban contracts
│   └── deploy.sh               # Deploys contracts to Stellar
└── .github/
    └── workflows/              # 5 CI workflow definitions
```

---

## Documentation

| Document | Description |
|---|---|
| [`docs/guides/getting-started.md`](docs/guides/getting-started.md) | Full local setup walkthrough |
| [`docs/architecture/system-architecture.md`](docs/architecture/system-architecture.md) | System design and component breakdown |
| [`docs/deployment/environment-variables.md`](docs/deployment/environment-variables.md) | Complete environment variable reference |
| [`docs/deployment/deploy-contracts.md`](docs/deployment/deploy-contracts.md) | Contract deployment to Stellar networks |
| [`docs/api/overview.md`](docs/api/overview.md) | API overview and authentication |
| [`docs/api/minting-workflow.md`](docs/api/minting-workflow.md) | Property tokenization API flow |
| [`docs/api/kyc-workflow.md`](docs/api/kyc-workflow.md) | KYC verification API flow |
| [`docs/game/ECONOMY.md`](docs/game/ECONOMY.md) | LAND token economy specification |
| [`docs/game/GAME_RULES.md`](docs/game/GAME_RULES.md) | Game mechanics and rules |
| [`docs/game/DEVELOPER_SETUP.md`](docs/game/DEVELOPER_SETUP.md) | Game developer setup guide |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution workflow and standards |

---

## Contributing

We welcome contributions. StellAdullam uses a **fork-based workflow** — all changes must come through a fork and pull request. No direct pushes to `main` or `develop`.

Read the full contribution guide before submitting your first PR: **[CONTRIBUTING.md](CONTRIBUTING.md)**

---

## License

[MIT](LICENSE) — StellAdullam
