# StellAdullam Soroban Smart Contract Developer Guide

This guide provides a comprehensive walkthrough for building, testing, optimizing, and deploying StellAdullam's Soroban smart contracts on the Stellar network.

---

## 1. Prerequisites & Toolchain Setup

Soroban contracts are written in Rust and compiled to WebAssembly (`wasm32-unknown-unknown`).

```bash
# 1. Install Rust (stable toolchain)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 2. Add the WebAssembly compilation target
rustup target add wasm32-unknown-unknown

# 3. Install the official Stellar CLI
cargo install --locked stellar-cli --features opt
```

Verify your installation:
```bash
stellar --version
# Expected: stellar-cli 21.0.0 or higher
```

---

## 2. Smart Contract Architecture

The StellAdullam protocol comprises 5 interconnected Soroban smart contracts located in `apps/contracts/contracts/`:

```
apps/contracts/contracts/
├── defi-rwa/             # RWA fractionalization, 2-slope lending pool, oracle & timelock
├── game-engine/          # Staged ECS pipeline, rental accrual, building tier upgrades
├── game-property-nft/    # 20x20 spatial coordinate land NFT registry
├── game-land-token/      # LAND utility token with testnet faucet & burn mechanics
└── game-marketplace/     # Non-custodial escrow trading with 1% protocol fee & batch cancels
```

### Key Contract Invariants
- **Storage TTL Bumping**: All persistent positions and instance data invoke `extend_ttl` during reads and writes to guarantee state permanence.
- **Two-Step Ownership Transfer**: Administrative roles follow `transfer_admin_begin` and `transfer_admin_accept` pattern to prevent accidental blackholing.
- **Circuit Breakers**: Granular `pause_deposits`, `pause_borrows`, and `pause_liquidations` flags isolate systemic risks during oracle volatility.

---

## 3. Building & Optimizing WASM Binaries

Compile all protocol contracts in release mode:

```bash
cd apps/contracts
cargo build --target wasm32-unknown-unknown --release
```

Optimize WASM bytecode for minimal on-chain footprint and gas execution limits:

```bash
# Optimize defi-rwa
stellar contract optimize \
  --wasm target/wasm32-unknown-unknown/release/defi_rwa.wasm

# Inspect optimized size (must remain below 64KB for optimal gas consumption)
ls -lh target/wasm32-unknown-unknown/release/defi_rwa.optimized.wasm
```

---

## 4. Running Contract Unit Tests

Soroban SDK includes an in-memory testing runtime (`soroban_sdk::Env`) allowing full deterministic test coverage without running a local validator.

```bash
# Run all contract tests across the workspace
cargo test

# Run tests for a specific contract
cargo test -p defi-rwa
cargo test -p game-engine
cargo test -p game-marketplace
```

### Writing Tests with Mock Auths & Time Simulation
```rust
#[test]
fn test_accrue_rental_income() {
    let env = Env::default();
    env.mock_all_auths();

    let owner = Address::generate(&env);
    let engine_id = env.register(GameEngine, ());
    let client = GameEngineClient::new(&env, &engine_id);

    // Advance blockchain ledger sequence
    let mut ledger = env.ledger().get();
    ledger.sequence_number += 500; // 5 epochs
    env.ledger().set(ledger);

    let accrued = client.get_accrued_income(&0);
    assert!(accrued > 0);
}
```

---

## 5. Testnet Deployment Workflow

### Step 1: Configure Network & Deployer Identity
```bash
# Configure Stellar Testnet RPC
stellar network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate deployer key and fund via Friendbot
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet
```

### Step 2: Deploy Contract Bytecode
```bash
DEPLOYER_ADDRESS=$(stellar keys address deployer)

CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/defi_rwa.optimized.wasm \
  --source deployer \
  --network testnet)

echo "Contract deployed at: $CONTRACT_ID"
```

### Step 3: Initialize Contract Parameters
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- \
  initialize \
  --admin $DEPLOYER_ADDRESS
```

---

## 6. Client SDK Integration

TypeScript client interfaces are automatically generated using `@stellar/stellar-sdk` and exported in `@stelladullam/shared`:

```typescript
import { DefiLendingContractClient } from '@stelladullam/shared';

const client = new DefiLendingContractClient({
  contractId: 'CA...',
  networkPassphrase: 'Test SDF Network ; September 2015',
  rpcUrl: 'https://soroban-testnet.stellar.org',
});

// Query on-chain health factor
const healthFactor = await client.getHealthFactor(userAddress, 'POOL_USDC');
console.log('User Health Factor:', healthFactor);
```
