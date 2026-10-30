# StellAdullam — System Architecture

## Overview

StellAdullam is built as a unified Bun monorepo paired with a Soroban/Rust smart contract workspace, providing an institutional-grade platform for real estate tokenization (RWA), DeFi lending pools, and a gamified virtual economy (StellAdullam Land) on the Stellar blockchain.

```mermaid
graph TD
    subgraph Clients ["Client Applications"]
        Webapp["WebApp (apps/webapp)<br/>Next.js 16 + React 19<br/>DeFi & Tokenization Portal"]
        Land["Land Portal (apps/stelladullam-land)<br/>Next.js 16 + React 19<br/>Virtual City 20x20 Grid"]
    end

    subgraph Core ["Shared Foundation"]
        Shared["@stelladullam/shared<br/>Types · Zod Schemas<br/>Contract Clients · Math & Explorers"]
    end

    subgraph Backend ["Backend & Ingestion (apps/api)"]
        ElysiaAPI["Elysia / Bun REST API<br/>Port 3001"]
        Indexer["StellarIndexerService<br/>Soroban RPC Event Stream"]
        Liquidator["LiquidatorWorker<br/>Solvency & Margin Guardian"]
        Postgres[(PostgreSQL + Drizzle)]
        Redis[(Redis Cache)]
    end

    subgraph StellarNetwork ["Stellar Network (Soroban)"]
        RPC["Soroban RPC Server<br/>testnet / mainnet"]
        DeFiContract["defi-rwa (WASM)<br/>Property Shares & Lending"]
        GameLandToken["game-land-token (SEP-41)<br/>LAND Currency & Faucet"]
        GameNFT["game-property-nft<br/>400-Tile Land Registry"]
        GameMarketplace["game-marketplace<br/>P2P Escrow Orderbook"]
        GameEngine["game-engine<br/>ECS Pipeline & Improvements"]
        OracleContract["SEP-40 Price Oracle<br/>Valuation Feeds"]
    end

    Webapp --> Shared
    Land --> Shared
    Webapp --> ElysiaAPI
    Land --> ElysiaAPI
    ElysiaAPI --> Postgres
    ElysiaAPI --> Redis
    Indexer --> RPC
    Liquidator --> RPC
    Indexer --> Postgres
    Webapp -.->|Wallet Kit| RPC
    Land -.->|Wallet Kit| RPC
    RPC --> DeFiContract
    RPC --> GameLandToken
    RPC --> GameNFT
    RPC --> GameMarketplace
    RPC --> GameEngine
    DeFiContract --> OracleContract
```

---

## Workspaces Topology

| Package | Path | Stack | Role |
|---|---|---|---|
| `@stelladullam/webapp` | `apps/webapp` | Next.js 16, React 19, Tailwind 4, Zustand | Institutional DeFi platform & tokenization portal |
| `@stelladullam/land` | `apps/stelladullam-land` | Next.js 16, React 19, Tailwind 4, Web Audio | Blockchain city-building gamified economy |
| `@stelladullam/api` | `apps/api` | Elysia 1.4, Bun, Drizzle ORM, PostgreSQL, Redis | REST API, event indexer & liquidator daemon |
| `@stelladullam/shared` | `apps/shared` | TypeScript, Zod, Stellar SDK | Shared types, clients, precision math, explorers |
| _(Cargo workspace)_ | `apps/contracts` | Rust `no_std`, Soroban SDK 25.3 | 5 Soroban WASM smart contracts |

---

## Smart Contracts Architecture

```
apps/contracts/
├── defi-rwa/          ← Core platform: property fractionalization & collateralized lending
│   ├── access/        ← AdminControl, PauseControl, TimelockControl, RoleStorage
│   ├── events/        ← PropertyEvents, LendingEvents, EmergencyEvents
│   ├── lending/       ← Pool, DepositPosition, BorrowPosition, InterestModel, Oracle
│   └── storage/       ← Shares, Allowances, PropertyMetadata, Config (automated TTL)
├── game-engine/       ← ECS pipeline: improve properties & claim rental income
├── game-property-nft/ ← 400-tile NFT grid (20×20) with coordinate packing
├── game-land-token/   ← LAND SEP-41 fungible token with sybil-resistant faucet
└── game-marketplace/  ← Non-custodial escrow P2P orderbook with fee router
```

---

## Core Operational Lifecycles

### 1. Real Estate Tokenization & Share Minting

```mermaid
sequenceDiagram
    autonumber
    actor Issuer as Property Owner / Issuer
    participant UI as WebApp Portal
    participant API as Backend API
    participant DB as PostgreSQL
    participant Soroban as defi-rwa Contract
    participant Horizon as Stellar Network

    Issuer->>UI: Submit Property Deed & Appraisal
    UI->>UI: Validate form (Zod property schema)
    UI->>API: POST /api/v1/properties
    API->>DB: Store pending_review status + IPFS deed CID
    API-->>UI: Property record created
    Note over API,DB: Compliance & Title Verification Check
    API->>Soroban: mint_shares(property_id, total_shares, recipient)
    Soroban->>Soroban: Verify AdminControl caller authorization
    Soroban->>Soroban: Store PropertyMetadata & extend persistent TTL
    Soroban->>Horizon: Emit PropertyMinted Event
    Horizon-->>API: Transaction Confirmed (txHash)
    API->>DB: Update status = approved, verified = true
    API-->>UI: Shares distributed to wallet
```

---

### 2. DeFi Lending & Automated Liquidation Protocol

```mermaid
sequenceDiagram
    autonumber
    actor Borrower as Borrower
    participant WebApp as WebApp Lending
    participant Contract as defi-rwa Lending Pool
    participant Oracle as SEP-40 Price Oracle
    participant Liquidator as LiquidatorWorker Bot
    actor LiquidatorActor as Liquidator

    Borrower->>WebApp: Select Collateral & Adjust Borrow Slider
    WebApp->>Contract: deposit_collateral(property_id, amount)
    Borrower->>Contract: borrow(pool_id, amount)
    Contract->>Oracle: get_price(collateral_asset)
    Oracle-->>Contract: Verify freshness (age <= 3600s) & price
    Contract->>Contract: Validate Health Factor >= 1.25
    Contract-->>Borrower: Transfer USDC debt principal

    Note over Oracle,Contract: Market Price Decline Event (HF < 1.0)
    Liquidator->>Contract: Check health factor
    Liquidator->>LiquidatorActor: Trigger liquidation opportunity
    LiquidatorActor->>Contract: liquidate(pool_id, borrower, repay_amount)
    Contract->>Contract: Seize collateral + 10% bonus
    Contract-->>LiquidatorActor: Collateral shares transferred
```

---

### 3. Soroban Event Ingestion Daemon (`StellarIndexerService`)

```mermaid
flowchart TD
    Init([Start StellarIndexerService]) --> Checkpoint[Read lastIndexedLedger Checkpoint]
    Checkpoint --> QueryRPC[Call Soroban RPC getEvents]
    QueryRPC --> CheckEvents{Events Found?}
    CheckEvents -- No --> Sleep[Wait Poll Interval 5000ms]
    Sleep --> QueryRPC
    CheckEvents -- Yes --> Parse[Parse Event Topics & XDR Payload]
    Parse --> Dispatch[Dispatch to Registered Topic Handlers]
    Dispatch --> DBUpdate[Update PostgreSQL Tables & Cache]
    DBUpdate --> BumpLedger[Advance lastIndexedLedger Checkpoint]
    BumpLedger --> QueryRPC
```

---

## Observability & Security Standards

- **Soroban TTL Refresh**: Storage entries automatically extend instance and persistent TTL on every read/write access (`120,960` threshold, `518,400` bump).
- **Oracle Guardrails**: Enforce a maximum allowable staleness window (`3,600s`) and future timestamp drift limit (`60s`) against `env.ledger().timestamp()`.
- **Circuit Breakers**: In-memory `CircuitBreaker` pattern across shared client adapters preventing cascading RPC failures.
- **Idempotency**: All mutation APIs require `Idempotency-Key` headers to protect against accidental duplicate blockchain submissions.
