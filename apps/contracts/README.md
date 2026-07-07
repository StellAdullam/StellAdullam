# StellAdullam — Soroban Smart Contracts

Production-grade Soroban smart contracts for the StellAdullam platform, written in Rust and compiled to WASM for the Stellar blockchain.

## Contracts

| Contract | Path | Purpose |
|---|---|---|
| `defi-rwa` | `contracts/defi-rwa/` | Property tokenization + DeFi lending protocol |
| `game-engine` | `contracts/game-engine/` | Game mechanics orchestration (ECS pipeline) |
| `game-property-nft` | `contracts/game-property-nft/` | 400-tile property NFT grid |
| `game-land-token` | `contracts/game-land-token/` | LAND fungible token (SEP-41) |
| `game-marketplace` | `contracts/game-marketplace/` | P2P property exchange |

## Prerequisites

- Rust stable with `wasm32v1-none` target: `rustup target add wasm32v1-none`
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli): `cargo install --locked stellar-cli`
- Docker (optional, for local Stellar network)

## Build

```bash
# Build all contracts (WASM, release mode)
cargo build --target wasm32v1-none --release

# Or use the monorepo script from the root
bun run build:contracts
```

Compiled WASM files will be in `target/wasm32v1-none/release/*.wasm`.

## Test

```bash
# Run all unit tests
cargo test --lib

# Run tests for a specific contract
cargo test --lib -p game-engine
```

## Deploy

```bash
# From repo root
bun run deploy:contracts
```

See [docs/contracts/deployment.md](../../docs/contracts/deployment.md) for step-by-step deployment instructions.

## Testnet Contract IDs

| Contract | ID |
|---|---|
| `defi-rwa` (Real Estate Token) | `CBFQV2RY5VHVFU3HT2I72FLXWY5YNZC37LWJSOZQCX45B76NBO4YZHM4` |
| `defi-rwa` (DeFi Lending) | `CBFOZBCYMIDIZLNHT6ANMBU6LSGC6REM6Z5M4ST35E5T5FDWWZAWZLTX` |
| `game-engine` | `CBTPPGX6LT2EPKR7JD7LLUB23E6HI5EFQRXKV3VQNZ6QWJTJ3EZ76RSH` |
| `game-property-nft` | `CCPUVGQAMDUUASHMXB7Z6F6XHCZI2WXOPR7DXEVPJBEGYZVJEABEABLE` |
| `game-land-token` | `CBQBXOWI3YB5SFICLVPYHK2EL3SY3XIZUZA6QZIGGXDKMVXAT74IOR3K` |
| `game-marketplace` | `CDKRZTY5PFNA4DHI2GFPSTOAADI2WV7SXYVS4VMTDC6M7IKKIPQJP5A3` |

## Architecture

### `defi-rwa` — Core DeFi Contract

The primary platform contract combining property share tokenization with a full DeFi lending protocol.

**Share Management**: Admin-gated `mint_shares`/`burn_shares`, ERC-20-like `transfer_shares`/`approve`/`transfer_from`, and KYC-gated `purchase_shares` that calls the SEP-41 payment token.

**Lending Protocol**: Pooled lending with compound interest (utilization-based rates), collateralized borrowing with health factor checks, automated accrual, oracle price feeds, and emergency pause/recovery via timelock.

**Access Control**: `AdminControl`, `PauseControl`, `TimelockControl`, `RoleStorage` — full RBAC with `EmergencyGuard` role.

### `game-engine` — ECS Pipeline

Orchestrates game mechanics between NFT and token contracts using a staged ECS (Entity-Component-System) pipeline:
- **PreUpdate**: Ownership validation
- **Update**: LAND token cost deduction
- **PostUpdate**: State application + event emission

Exposes `improve(property_id)` and `claim_rental(property_id)`.

### `game-property-nft` — Property Grid

A 400-tile (20×20) NFT grid where all tiles are minted to treasury at initialization. Supports ERC-721-like approve + transfer_from, engine-gated level and claim ledger updates, and per-owner index queries.

### `game-land-token` — LAND Token

Full SEP-41 fungible token with treasury + engine mint authorization. Testnet faucet provides 1,000 LAND per wallet (one-time claim).

### `game-marketplace` — P2P Exchange

Escrow-based marketplace: `list` takes NFT custody, `buy` atomically transfers LAND to seller and NFT to buyer, `cancel` returns escrow. Re-entrancy guard via Rust drop pattern (checks-effects-interactions).

## Security Considerations

- All admin operations require `require_auth()` — no unsigned state mutations
- `game-marketplace` uses re-entrancy guard + checks-effects-interactions
- `defi-rwa` has timelock-protected emergency recovery path
- Soroban's budget limits prevent unbounded computation
- `cargo audit` + `cargo deny` run in CI with `--audit-level=high`
- Contract coverage ≥80% enforced in CI via `cargo-llvm-cov`
