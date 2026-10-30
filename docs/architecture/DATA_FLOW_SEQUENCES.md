# StellAdullam End-to-End Data Flow Sequence Diagrams

This document models the critical transactional sequences of the StellAdullam platform across the frontend, backend API, IPFS storage, Price Oracle, and Soroban smart contracts.

---

## 1. Property Tokenization & Cadastral Attestation Flow

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Property Owner
    participant App as Webapp (Tokenize Wizard)
    participant API as Elysia Backend API
    participant IPFS as IPFS / Pinata Storage
    participant Soroban as defi-rwa Contract
    participant Ledger as Stellar Ledger

    Owner->>App: Submits legal deed, cadastral ID, valuation
    App->>API: POST /api/v1/properties/tokenize (multipart)
    API->>IPFS: Pins deed document & legal certification
    IPFS-->>API: Returns CIDv1 (bafybeic...) & SHA-256 hash
    API->>API: Verifies jurisdictional compliance & appraisal
    API-->>App: Returns prepared Soroban transaction XDR
    App->>Owner: Requests Freighter / Albedo signature
    Owner->>App: Signs with Ed25519 key
    App->>Ledger: Submits transaction via Soroban RPC
    Ledger->>Soroban: Invokes tokenize_property()
    Soroban->>Soroban: Mints fractional shares & records IPFS CID
    Soroban-->>Ledger: Emits PropertyTokenizedEvent
    Ledger-->>App: Transaction confirmed (ledger seq #)
    App-->>Owner: Displays Tokenization Receipt & Explorer Link
```

---

## 2. DeFi Collateralized Borrowing Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Borrower as Borrower
    participant App as Webapp (Lending UI)
    participant Oracle as Soroban Price Oracle
    participant Pool as defi-rwa Lending Pool
    participant Token as USDC Token Contract

    Borrower->>App: Selects loan amount & approves collateral
    App->>Pool: Queries get_health_factor() & current pool liquidity
    Pool->>Oracle: Fetches asset spot price (normalized PRECISION)
    Oracle-->>Pool: Price validated within max_age staleness
    Pool-->>App: Health factor simulation (e.g. 1.85 HF)
    Borrower->>App: Confirms borrow transaction
    App->>Pool: Invokes borrow(borrower, pool_id, amount, collateral)
    Pool->>Pool: Verifies amount >= MIN_BORROW_AMOUNT (50 USDC)
    Pool->>Pool: Verifies HF >= 1.50 minimum initial health threshold
    Pool->>Token: Transfers collateral shares to contract escrow
    Pool->>Token: Transfers borrowed USDC to borrower address
    Pool->>Pool: Updates user borrow position & bumps storage TTL
    Pool-->>Borrower: Transaction Success
```

---

## 3. Automated Liquidation Bot Workflow

```mermaid
sequenceDiagram
    autonumber
    participant Bot as Liquidator Worker Bot
    participant Indexer as Stellar Indexer Service
    participant Pool as defi-rwa Lending Contract
    participant Oracle as Reflector Price Oracle
    participant Ledger as Stellar Testnet

    loop Every 30 seconds
        Bot->>Indexer: Fetches active borrow positions
        Indexer-->>Bot: Returns open loans list
        loop For each borrower position
            Bot->>Pool: Calls get_health_factor(borrower, pool_id)
            Pool->>Oracle: Resolves latest collateral appraisal
            Pool-->>Bot: Current Health Factor
            alt Health Factor < 1.0 (Underwater Debt)
                Bot->>Bot: Calculates optimal liquidation repay amount
                Bot->>Pool: Submits liquidate(liquidator, borrower, debt_amount)
                Pool->>Pool: Verifies HF < 1.0
                Pool->>Ledger: Slashes collateral + 5% liquidation bonus to bot
                Pool->>Ledger: Burns/repays liquidated debt
                Pool-->>Bot: Liquidation executed successfully
            else Health Factor >= 1.0
                Bot->>Bot: Position solvent, skip
            end
        end
    end
```

---

## 4. Land Building Upgrade & Rental Harvesting

```mermaid
sequenceDiagram
    autonumber
    actor Player as City Builder Player
    participant LandApp as StellAdullam Land
    participant Engine as GameEngine Contract
    participant LandNFT as GamePropertyNft
    participant LAND as GameLandToken

    Player->>LandApp: Clicks "Upgrade to Commercial" on Parcel (X=5, Y=5)
    LandApp->>Engine: Queries get_improvement_cost(target_level=2)
    Engine-->>LandApp: Cost = 600 LAND tokens
    Player->>LAND: Approves GameEngine for 600 LAND
    Player->>Engine: Invokes improve(caller, property_id)
    Engine->>Engine: Runs ECS Pipeline (PreUpdate -> Update -> PostUpdate)
    Engine->>LandNFT: Validates caller owns property_id
    Engine->>LAND: Burns 600 LAND tokens from caller balance
    Engine->>LandNFT: set_improvement_level(property_id, level=2)
    Engine-->>LandApp: Emits (symbol_short!("improved"), caller, property_id)
    LandApp-->>Player: Triggers celebratory particle animation & sound FX
```
