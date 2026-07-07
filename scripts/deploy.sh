#!/bin/bash
# deploy.sh — Deploy StellAdullam Soroban contracts to Stellar
#
# Usage:
#   ./scripts/deploy.sh [network] [contract]
#
#   network  : testnet (default) | mainnet
#   contract : all (default) | defi-rwa | game-engine | game-property-nft
#              | game-land-token | game-marketplace
#
# Environment variables required:
#   STELLAR_ADMIN_SECRET  — deployer secret key (S...)
#
# Requires:
#   - stellar CLI:  cargo install --locked stellar-cli
#   - Rust + wasm32v1-none target (run scripts/build.sh first)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTRACTS_DIR="$ROOT_DIR/apps/contracts"
SHARED_DIR="$ROOT_DIR/apps/shared/src"

NETWORK="${1:-testnet}"
CONTRACT_NAME="${2:-all}"

# ── Network config ─────────────────────────────────────────────────────────────

if [ "$NETWORK" = "testnet" ]; then
    RPC_URL="https://soroban-testnet.stellar.org"
    NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
    CONTRACTS_JSON="$SHARED_DIR/contracts.testnet.json"
    GAME_CONTRACTS_JSON="$SHARED_DIR/contracts/game-contracts.testnet.json"
elif [ "$NETWORK" = "mainnet" ]; then
    RPC_URL="https://rpc.mainnet.stellar.org"
    NETWORK_PASSPHRASE="Public Global Stellar Network ; September 2015"
    CONTRACTS_JSON="$SHARED_DIR/contracts.mainnet.json"
    GAME_CONTRACTS_JSON="$SHARED_DIR/contracts/game-contracts.mainnet.json"
else
    echo "❌ Unsupported network: $NETWORK (use 'testnet' or 'mainnet')"
    exit 1
fi

echo "🚀 StellAdullam — Deploying contracts to $NETWORK"
echo "   RPC: $RPC_URL"
echo ""

# ── Prerequisite checks ────────────────────────────────────────────────────────

if [ -z "$STELLAR_ADMIN_SECRET" ]; then
    echo "❌ STELLAR_ADMIN_SECRET environment variable is not set."
    echo "   Export your deployer secret key before running this script."
    exit 1
fi

if ! command -v stellar &>/dev/null; then
    echo "❌ stellar CLI is not installed."
    echo "   Install with: cargo install --locked stellar-cli"
    exit 1
fi

ADMIN_ADDRESS=$(stellar keys address --hd-path 0 <<< "$STELLAR_ADMIN_SECRET" 2>/dev/null || \
    echo "")
if [ -z "$ADMIN_ADDRESS" ]; then
    echo "❌ Could not derive address from STELLAR_ADMIN_SECRET. Verify the key is valid."
    exit 1
fi

echo "   Deployer: $ADMIN_ADDRESS"
echo ""

# ── Build helpers ──────────────────────────────────────────────────────────────

WASM_DIR="$CONTRACTS_DIR/target/wasm32v1-none/release"

get_wasm() {
    local contract_name="$1"
    # Convert kebab-case to snake_case for WASM filename
    local wasm_name="${contract_name//-/_}"
    echo "$WASM_DIR/${wasm_name}.wasm"
}

deploy_contract() {
    local display_name="$1"
    local wasm_path="$2"

    if [ ! -f "$wasm_path" ]; then
        echo "❌ WASM not found: $wasm_path"
        echo "   Run scripts/build.sh first."
        exit 1
    fi

    echo "📤 Deploying $display_name..."
    local contract_id
    contract_id=$(stellar contract deploy \
        --wasm "$wasm_path" \
        --source "$STELLAR_ADMIN_SECRET" \
        --rpc-url "$RPC_URL" \
        --network-passphrase "$NETWORK_PASSPHRASE")

    echo "   Contract ID: $contract_id"
    echo "$contract_id"
}

# ── Individual contract deployers ──────────────────────────────────────────────

deploy_defi_rwa() {
    local wasm
    wasm=$(get_wasm "defi_rwa")
    local contract_id
    contract_id=$(deploy_contract "defi-rwa (RealEstateToken + DeFi Lending)" "$wasm")

    echo "   Initializing defi-rwa with admin=$ADMIN_ADDRESS..."
    stellar contract invoke \
        --id "$contract_id" \
        --source "$STELLAR_ADMIN_SECRET" \
        --rpc-url "$RPC_URL" \
        --network-passphrase "$NETWORK_PASSPHRASE" \
        -- __constructor \
        --admin "$ADMIN_ADDRESS"

    # Update shared contracts.json
    if command -v jq &>/dev/null; then
        jq --arg id "$contract_id" \
           '.contracts.REAL_ESTATE_TOKEN = $id | .contracts.DEFI_LENDING = $id' \
           "$CONTRACTS_JSON" > /tmp/contracts_tmp.json && \
           mv /tmp/contracts_tmp.json "$CONTRACTS_JSON"
        echo "   ✅ Updated $CONTRACTS_JSON"
    fi

    echo ""
}

deploy_game_property_nft() {
    local wasm
    wasm=$(get_wasm "game_property_nft")
    local contract_id
    contract_id=$(deploy_contract "game-property-nft" "$wasm")

    echo ""
    echo "   ⚠️  Initialize game-property-nft after deploying game-engine:"
    echo "   stellar contract invoke --id $contract_id -- initialize"
    echo "      --treasury <TREASURY_ADDRESS> --game_engine <ENGINE_CONTRACT_ID>"
    echo ""

    if command -v jq &>/dev/null; then
        jq --arg id "$contract_id" \
           '.contracts.GAME_PROPERTY_NFT.contractId = $id' \
           "$GAME_CONTRACTS_JSON" > /tmp/game_tmp.json && \
           mv /tmp/game_tmp.json "$GAME_CONTRACTS_JSON"
        echo "   ✅ Updated $GAME_CONTRACTS_JSON (GAME_PROPERTY_NFT)"
    fi

    echo ""
}

deploy_game_land_token() {
    local wasm
    wasm=$(get_wasm "game_land_token")
    local contract_id
    contract_id=$(deploy_contract "game-land-token (LAND)" "$wasm")

    local IS_TESTNET="false"
    [ "$NETWORK" = "testnet" ] && IS_TESTNET="true"

    echo ""
    echo "   ⚠️  Initialize game-land-token after deploying game-engine:"
    echo "   stellar contract invoke --id $contract_id -- initialize"
    echo "      --treasury <TREASURY_ADDRESS> --engine <ENGINE_CONTRACT_ID>"
    echo "      --is_testnet $IS_TESTNET"
    echo ""

    if command -v jq &>/dev/null; then
        jq --arg id "$contract_id" \
           '.contracts.GAME_LAND_TOKEN.contractId = $id' \
           "$GAME_CONTRACTS_JSON" > /tmp/game_tmp.json && \
           mv /tmp/game_tmp.json "$GAME_CONTRACTS_JSON"
        echo "   ✅ Updated $GAME_CONTRACTS_JSON (GAME_LAND_TOKEN)"
    fi

    echo ""
}

deploy_game_marketplace() {
    local wasm
    wasm=$(get_wasm "game_marketplace")
    local contract_id
    contract_id=$(deploy_contract "game-marketplace" "$wasm")

    echo ""
    echo "   ⚠️  Initialize game-marketplace after deploying NFT + token:"
    echo "   stellar contract invoke --id $contract_id -- initialize"
    echo "      --nft_contract <NFT_CONTRACT_ID> --land_token <TOKEN_CONTRACT_ID>"
    echo ""

    if command -v jq &>/dev/null; then
        jq --arg id "$contract_id" \
           '.contracts.GAME_MARKETPLACE.contractId = $id' \
           "$GAME_CONTRACTS_JSON" > /tmp/game_tmp.json && \
           mv /tmp/game_tmp.json "$GAME_CONTRACTS_JSON"
        echo "   ✅ Updated $GAME_CONTRACTS_JSON (GAME_MARKETPLACE)"
    fi

    echo ""
}

deploy_game_engine() {
    local wasm
    wasm=$(get_wasm "game_engine")
    local contract_id
    contract_id=$(deploy_contract "game-engine" "$wasm")

    echo ""
    echo "   ⚠️  Initialize game-engine after deploying NFT + token:"
    echo "   stellar contract invoke --id $contract_id -- initialize"
    echo "      --nft_contract <NFT_CONTRACT_ID>"
    echo "      --token_contract <TOKEN_CONTRACT_ID>"
    echo "      --treasury <TREASURY_ADDRESS>"
    echo ""

    if command -v jq &>/dev/null; then
        jq --arg id "$contract_id" \
           '.contracts.GAME_ENGINE.contractId = $id' \
           "$GAME_CONTRACTS_JSON" > /tmp/game_tmp.json && \
           mv /tmp/game_tmp.json "$GAME_CONTRACTS_JSON"
        echo "   ✅ Updated $GAME_CONTRACTS_JSON (GAME_ENGINE)"
    fi

    echo ""
}

# ── Deploy ─────────────────────────────────────────────────────────────────────

case $CONTRACT_NAME in
    "defi-rwa")
        deploy_defi_rwa
        ;;
    "game-property-nft")
        deploy_game_property_nft
        ;;
    "game-land-token")
        deploy_game_land_token
        ;;
    "game-marketplace")
        deploy_game_marketplace
        ;;
    "game-engine")
        deploy_game_engine
        ;;
    "all")
        deploy_defi_rwa
        deploy_game_property_nft
        deploy_game_land_token
        deploy_game_engine
        deploy_game_marketplace
        ;;
    *)
        echo "❌ Unknown contract: $CONTRACT_NAME"
        echo ""
        echo "Available contracts:"
        echo "  all (default)    — deploy all contracts in correct order"
        echo "  defi-rwa         — main DeFi tokenization + lending contract"
        echo "  game-property-nft — 400-tile NFT grid"
        echo "  game-land-token  — LAND SEP-41 fungible token"
        echo "  game-engine      — game mechanics orchestration"
        echo "  game-marketplace — P2P property exchange"
        exit 1
        ;;
esac

echo "✅ Deployment complete."
echo ""
echo "Next steps:"
echo "  1. Initialize contracts in order: NFT → token → engine → marketplace"
echo "  2. Update apps/shared/src/contracts*.json with the new contract IDs"
echo "  3. Run the post-deploy checklist: docs/deployment/post-deploy-checklist.md"
