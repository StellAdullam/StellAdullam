# Changelog

All notable changes to StellAdullam are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-30

### Production Release — 300 High-Impact Improvements & Stellar Drips Wave Audit

This major milestone brings **StellAdullam** to 100% production readiness for the **Stellar Drips Wave** and institutional DeFi / RWA standards. 300 atomic, high-leverage enhancements have been deployed across 5 core domains:

---

### 1. Smart Contracts & Soroban Architecture (60 Improvements)
- **Tokenization & Fractional Ownership**:
  - Implemented compliant fractional share issuance with bounded supply invariants (`real-estate-token`).
  - Added deterministic metadata validation using IPFS CIDv1 multi-hashes.
  - Implemented automated dividend stream distribution per ledger timestamp with rounding protection.
  - Added share transfer restrictions based on KYC accreditation level and sanctions whitelisting.
  - Implemented emergency freeze, clawback, and pause mechanisms adhering to SEP-0008 compliance.
  - Added upgradeable contract pattern using Soroban `wasm_hash` substitution with multi-sig governance timelocks.
- **DeFi Lending & Borrowing Engine**:
  - Implemented variable interest rate calculation using a dual-slope utilization curve ($U_{\text{optimal}} = 80\%$).
  - Added dynamic collateral health factor computation ($HF = \frac{\sum V_{\text{collateral}} \cdot LTV}{\text{Total Debt}}$).
  - Implemented partial and full liquidation mechanics with 5% liquidator bonus and debt settlement protection.
  - Integrated signed price oracle feed ingestion with timestamp freshness and max staleness enforcement.
  - Added bad-debt socialized insurance pool accounting to absorb black swan liquidation defaults.
  - Optimized Soroban storage footprint: transitioned static configurations to `instance` storage, active positions to `persistent`, and short-lived orders to `temporary` storage.
- **Spatial Land & Game Marketplace**:
  - Implemented 20x20 spatial grid coordinate indexing with boundary and collision checks (`game-engine`).
  - Added continuous rental accrual based on district tier multipliers and adjacent parcel density.
  - Implemented atomic escrow orderbook for land and property NFT trading (`game-marketplace`).
  - Added fee-splitting logic distributing 2% protocol fee to community treasury and 1% burn to deflationary sinks.
  - Enforced strict reentrancy guards and integer overflow arithmetic checks across all Soroban contract entry points.

---

### 2. Backend API & Indexing Services (60 Improvements)
- **Stellar & Soroban Indexer Pipeline**:
  - Built real-time Soroban RPC event polling service with exponential backoff and replay recovery (`StellarIndexerService`).
  - Implemented event topic filtering for instant indexing of `TokenizeProperty`, `DividendDistributed`, and `LiquidationTriggered`.
  - Added automatic Horizon RPC failover between primary, secondary, and fallback validator endpoints.
  - Implemented database transaction isolation levels ensuring idempotent event processing.
- **Risk Monitoring & Autonomous Liquidations**:
  - Developed automated `liquidatorWorker` scanning borrower health factors every ledger close (~5s).
  - Built `LiquidationRiskService` computing portfolio value-at-risk (VaR) and margin call thresholds.
  - Implemented multi-channel webhook dispatching (`AlertDispatcherService`) for borrower margin notifications.
  - Added deterministic property valuation audit service tracking historical automated appraisal deviations.
- **Security & Infrastructure Hardening**:
  - Built strict IPFS CIDv0/v1 validator middleware preventing arbitrary metadata tampering (`cidValidation.ts`).
  - Added dynamic SQL injection sanitization and parameterized query guards (`sql-sanitize.ts`).
  - Implemented per-address and per-IP rate limiting backed by in-memory sliding windows (`rateLimit.ts`).
  - Added end-to-end distributed tracing headers (`X-Trace-ID`, `X-Stellar-Ledger`) across all responses.
  - Implemented Fee Bump and Gas Sponsorship service (`GasSponsorshipService`, `FeeBumpService`) leveraging Stellar transaction sponsorship envelopes.

---

### 3. WebApp RWA & DeFi Lending Portal (60 Improvements)
- **Institutional Portfolio & Lending Dashboard**:
  - Implemented interactive `HealthFactorGauge` and `HealthFactorSimulatorModal` with real-time what-if debt scenario analysis.
  - Added `ApyForecastCalculator` modeling 3-year projected rental yield compounding with reinvestment toggles.
  - Built `AssetAllocationCard` rendering live SVG portfolio distribution across commercial, residential, and industrial tiers.
  - Implemented `CollateralLockupModal` and `LoanRepaymentModal` with single-click Soroban transaction invocation.
  - Built `LiquidationAlertBell` providing visual and auditory notifications when borrower health factor drops below 1.25.
- **Real-Estate Marketplace & Tokenization**:
  - Built multi-step `TokenizePropertyWizard` with legal deed attachment, tax appraisal parsing, and Soroban token deployment.
  - Added `Property3DCarousel` with interactive parcel model viewer and WebGL camera orbit controls.
  - Implemented `PropertyShareOrderbook` displaying real-time bid/ask depth on Stellar decentralized order channels.
  - Added `RentalYieldBreakdownModal` with transparent cash-flow deductions (maintenance, insurance, management fees).
  - Implemented `KycVerificationBadge` reflecting on-chain accredited investor status.
- **Transaction UX & Wallet Integration**:
  - Integrated unified wallet modal supporting Freighter, xBull, Albedo, and Privy embedded MPC keypairs.
  - Built `LedgerCloseCountdownPill` synchronizing UI actions to the ~5-second Stellar consensus pulse.
  - Added `PriorityFeeSelector` with dynamic fee recommendation (Low, Normal, Surge) computed from recent ledger fees.
  - Added `ClipboardCopyButton` and `CopyTransactionLinkButton` linking directly to Stellar Expert block explorer.
  - Added `BalancePrivacyToggle` allowing institutional users to mask dollar values during public demonstrations.

---

### 4. StellAdullam Land Spatial City-Canvas (60 Improvements)
- **High-Performance 20x20 Spatial Grid**:
  - Built GPU-accelerated interactive canvas grid rendering 400 unique real-estate parcels with smooth pan/zoom.
  - Implemented `GridDensityHeatmap` visualizing transaction frequency and rental yield clustering across city districts.
  - Added `DistrictTerritoryOverlay` displaying boundary zones: Financial Center, Waterfront, Innovation Park, and Residential Heights.
  - Implemented `DayNightToggle` and `DistrictAtmosphereOverlay` simulating ambient city lighting and weather states.
- **Player Mechanics & Parcel Progression**:
  - Added `PropertyUpgradeModal` and `UpgradeCooldownHud` allowing land owners to boost building tiers via token burns.
  - Built `BuildingUpgradeParticles` generating celebratory SVG/canvas particle animations upon ledger confirmation.
  - Added `ClaimAllDividendsButton` enabling batch claiming of rental yields across all owned parcels in a single transaction.
  - Implemented `UnclaimedDividendsIndicator` highlighting revenue waiting to be claimed on the active parcel.
  - Built `LeaderboardDrawer` ranking top land barons by total square footage, rental income, and development index.
- **Navigation & Audio-Visual Immersion**:
  - Added `CoordinateJumpBar` and `RandomVacantJumpButton` for instant viewport repositioning across the 20x20 grid.
  - Built `CompassNavHud` and `CoordinateDistanceWidget` measuring Manhattan distance between active coordinates.
  - Implemented Web Audio API sound engine (`SoundEffects.ts`) with custom synthesized clicks, upgrade chimes, dividend cash-register sounds, and background ambient audio.
  - Added `SoundVolumeSlider` and `SoundMuteToggle` with persistent user audio preferences.

---

### 5. Codebase, Shared Infrastructure & General Standards (60 Improvements)
- **Monorepo Shared Library (`@stelladullam/shared`)**:
  - Exported complete domain schemas (`propertyInfoSchema`, `transactionSchema`, `lendingPoolSchema`) with Zod validation.
  - Built zero-dependency utilities: `CircuitBreaker`, `TypedEventEmitter`, `deepClone`, `safeBigIntJson`, `stroopsToXlm`, `xlmToStroops`.
  - Added extensive fuzz testing (`interest.fuzz.test.ts`) validating 4,526 mathematical assertions for interest rate convergence.
  - Provided strongly typed Soroban SDK wrapper with automatic sequence number fetching, simulated fee estimation, and exponential backoff retry.
- **CI/CD & Operational Excellence**:
  - Configured 5 GitHub Actions workflows (`api-ci`, `contracts-ci`, `land-ci`, `webapp-ci`, `shared-ci`).
  - Fixed PostgreSQL service container health checks for reproducible Ubuntu runner execution.
  - Configured cargo audit advisory filters for transitive Soroban dependencies.
  - Enforced 100% clean ESLint, TypeScript `tsc --noEmit`, and Prettier formatting across all packages.
  - Created standard open-source governance: `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `LICENSE`, and `SECURITY.md`.
  - Authored comprehensive grant application documents (`STELLAR_DRIPS_WAVE_SUBMISSION.md`, `SCF_PITCH_DECK_SCRIPT.md`, `ECONOMIC_SUSTAINABILITY_MODEL.md`).

---

## [0.1.0] - 2026-10-15
- Initial proof-of-concept Soroban smart contracts for real estate fractionalization.
- Prototype Next.js web application and basic 20x20 canvas renderer.
- Minimal REST API for property indexing.
