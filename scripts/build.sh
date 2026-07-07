#!/bin/bash
# build.sh — Build all StellAdullam Soroban contracts to WASM
#
# Usage: ./scripts/build.sh
#
# Requires:
#   - Rust stable toolchain
#   - wasm32v1-none target: rustup target add wasm32v1-none

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTRACTS_DIR="$ROOT_DIR/apps/contracts"
TARGET_DIR="$CONTRACTS_DIR/target/wasm32v1-none/release"

echo "🔧 StellAdullam — Building Soroban contracts"
echo "   Contracts dir: $CONTRACTS_DIR"
echo ""

# ── Prerequisites ──────────────────────────────────────────────────────────────

# Check Rust is installed
if ! command -v cargo &>/dev/null; then
    echo "❌ Cargo (Rust) is not installed. Visit https://rustup.rs"
    exit 1
fi

# Install WASM target if not present
if ! rustup target list --installed | grep -q "wasm32v1-none"; then
    echo "📦 Installing wasm32v1-none Rust target..."
    rustup target add wasm32v1-none
fi

# ── Build all contracts ────────────────────────────────────────────────────────

cd "$CONTRACTS_DIR"

echo "🦀 Building all contracts (release, wasm32v1-none)..."
cargo build --target wasm32v1-none --release

echo ""
echo "📦 Built WASM artifacts:"

TOTAL_SIZE=0
for wasm in "$TARGET_DIR"/*.wasm; do
    if [ -f "$wasm" ]; then
        FILENAME=$(basename "$wasm")
        SIZE=$(stat -c%s "$wasm" 2>/dev/null || stat -f%z "$wasm" 2>/dev/null || echo 0)
        SIZE_KB=$(echo "scale=1; $SIZE / 1024" | bc)
        TOTAL_SIZE=$((TOTAL_SIZE + SIZE))

        # Warn if any single contract exceeds 1MB
        if [ "$SIZE" -gt 1048576 ]; then
            echo "  ⚠️  $FILENAME — ${SIZE_KB}KB (EXCEEDS 1MB LIMIT)"
        else
            echo "  ✅  $FILENAME — ${SIZE_KB}KB"
        fi
    fi
done

TOTAL_KB=$(echo "scale=1; $TOTAL_SIZE / 1024" | bc)
echo ""
echo "   Total WASM size: ${TOTAL_KB}KB"
echo ""
echo "✅ All contracts built successfully."
echo "   Output: $TARGET_DIR"
