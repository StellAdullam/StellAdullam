# Runbook: Dividend Distribution

**Version**: 1.0  
**Owner**: StellAdullam Platform Operations  
**Trigger**: Scheduled (monthly) or manual request from property owner  
**Severity**: Medium — affects user balances; must be idempotent

---

## Overview

Dividend distribution pays pro-rata income to all share owners of a tokenized property.
The source of funds is the property's accumulated rental/yield held in the DeFi RWA contract.

This runbook covers the full distribution lifecycle:
1. Pre-distribution checks
2. Snapshot share ownership
3. Build + sign distribution transactions
4. Submit and verify
5. Reconcile and record

---

## Pre-Distribution Checks

### 1. Verify property status

```bash
# Check property is approved and verified
curl -H "Authorization: Bearer $ADMIN_JWT" \
  "$API_URL/properties/$PROPERTY_ID" \
  | jq '{ verified, reviewStatus, sorobanPropertyId }'
```

Expected: `verified: true`, `reviewStatus: "approved"`, `sorobanPropertyId` set.

### 2. Check distribution balance

```bash
# Get the property pool's available liquidity
curl "$API_URL/lending/pools/$POOL_ID" \
  | jq '{ totalDeposits, totalBorrows, availableLiquidity }'
```

Ensure `availableLiquidity > 0` before proceeding.

### 3. Verify no active liquidations

```bash
curl -H "x-api-key: $LIQUIDATOR_API_KEY" \
  "$API_URL/risk-monitoring/positions?propertyId=$PROPERTY_ID&atRisk=true" \
  | jq '.count'
```

If `count > 0`, resolve liquidations first. Do not distribute while positions are at risk.

---

## Snapshot Share Ownership

Record the current share ownership at a specific Stellar ledger sequence.

```bash
# Get current ledger (the "snapshot ledger")
SNAPSHOT_LEDGER=$(curl -s "$API_URL/ledger/latest" | jq -r '.sequence')
echo "Snapshot ledger: $SNAPSHOT_LEDGER"

# Get all share owners for this property
curl -H "Authorization: Bearer $ADMIN_JWT" \
  "$API_URL/properties/$PROPERTY_ID/shares" \
  | jq '.owners' > /tmp/share-snapshot-$PROPERTY_ID-$SNAPSHOT_LEDGER.json

# Verify total shares
TOTAL=$(jq '[.[].shares] | add' /tmp/share-snapshot-$PROPERTY_ID-$SNAPSHOT_LEDGER.json)
echo "Total shares in snapshot: $TOTAL"
```

Store this snapshot — it is the authoritative source for the distribution amounts.
**Do not proceed if the snapshot file is missing or total shares are 0.**

---

## Calculate Distribution Amounts

```bash
DIVIDEND_AMOUNT_LAND=<total LAND to distribute>
TOTAL_SHARES=$(jq '[.[].shares] | add' /tmp/share-snapshot-$PROPERTY_ID-$SNAPSHOT_LEDGER.json)

# Per-share payout in LAND (7-decimal fixed point)
PER_SHARE_PAYOUT=$(echo "scale=7; $DIVIDEND_AMOUNT_LAND / $TOTAL_SHARES" | bc)
echo "Per share: $PER_SHARE_PAYOUT LAND"

# Generate per-owner payouts
jq --argjson pps "$PER_SHARE_PAYOUT" \
  'map({ walletAddress, shares, payout: (.shares * $pps) })' \
  /tmp/share-snapshot-$PROPERTY_ID-$SNAPSHOT_LEDGER.json \
  > /tmp/payouts-$PROPERTY_ID-$SNAPSHOT_LEDGER.json
```

---

## Build Distribution Transactions

Distribution is executed as a series of LAND token `transfer` transactions from the treasury
to each shareholder. Each transaction must be idempotent — use the snapshot ledger as a
unique reference to prevent double-payment.

### Check for prior payments (idempotency)

```bash
# Query the audit trail for this distribution batch
curl -H "Authorization: Bearer $ADMIN_JWT" \
  "$API_URL/transactions?type=dividend&propertyId=$PROPERTY_ID&snapshotLedger=$SNAPSHOT_LEDGER" \
  | jq '.count'
```

If `count > 0`, a distribution for this ledger was already processed. **Stop — do not reprocess.**

### Build XDR transactions

For each owner in the payout file:

```bash
# Using stellar-cli (run from apps/contracts or with stellar-cli installed)
while IFS= read -r payout; do
  RECIPIENT=$(echo "$payout" | jq -r '.walletAddress')
  AMOUNT=$(echo "$payout" | jq -r '.payout')
  
  # Build transfer XDR from treasury to recipient
  stellar contract invoke \
    --id "$LAND_TOKEN_CONTRACT_ID" \
    --source "$TREASURY_SECRET" \
    --network testnet \
    -- transfer \
    --from "$TREASURY_ADDRESS" \
    --to "$RECIPIENT" \
    --amount "$(echo "$AMOUNT * 10000000" | bc | cut -d. -f1)"
    
  echo "Paid $AMOUNT LAND to $RECIPIENT"
  sleep 0.5  # Rate limit: one tx per 500ms
done < <(jq -c '.[]' /tmp/payouts-$PROPERTY_ID-$SNAPSHOT_LEDGER.json)
```

---

## Verify Distribution

After all transactions, verify every owner received the correct amount:

```bash
# Verify each owner's LAND balance increased by their payout
while IFS= read -r payout; do
  RECIPIENT=$(echo "$payout" | jq -r '.walletAddress')
  EXPECTED=$(echo "$payout" | jq -r '.payout')
  
  BALANCE=$(stellar contract invoke \
    --id "$LAND_TOKEN_CONTRACT_ID" \
    --source "$TREASURY_ADDRESS" \
    --network testnet \
    -- balance \
    --id "$RECIPIENT")
    
  echo "$RECIPIENT: balance=$BALANCE, expected_payout=$EXPECTED"
done < <(jq -c '.[]' /tmp/payouts-$PROPERTY_ID-$SNAPSHOT_LEDGER.json)
```

---

## Record Distribution in Database

```bash
# POST a dividend transaction record for the audit trail
curl -X POST \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"dividend\",
    \"propertyId\": \"$PROPERTY_ID\",
    \"snapshotLedger\": $SNAPSHOT_LEDGER,
    \"totalAmount\": $DIVIDEND_AMOUNT_LAND,
    \"totalRecipients\": $(jq '. | length' /tmp/payouts-$PROPERTY_ID-$SNAPSHOT_LEDGER.json),
    \"completedAt\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }" \
  "$API_URL/transactions/dividend"
```

---

## Rollback / Partial Failure

If distribution fails mid-run:

1. Do **not** re-run the entire distribution — only re-send to recipients who did not receive payment.
2. Query the on-chain LAND balance for each recipient to determine who was paid.
3. Re-process only the unpaid recipients using the same `snapshotLedger` reference.
4. The idempotency check at the start will prevent double-payment on any retry.

---

## Post-Distribution Checklist

- [ ] Snapshot file archived to `/tmp/archive/` with timestamp
- [ ] All payout transactions confirmed on Stellar (use Stellar Explorer or Horizon)
- [ ] Audit record created in database
- [ ] Property owner notified (via notification webhook if configured)
- [ ] Risk monitoring re-enabled for the property pool
- [ ] Temporary files removed: `rm /tmp/*-$PROPERTY_ID-$SNAPSHOT_LEDGER.json`

---

## Escalation

If distribution fails after three retries or any treasury transaction is rejected:

1. Pause the property pool: `POST /lending/pools/$POOL_ID/pause`
2. File an incident report with the failing transaction hash and error XDR
3. Contact the Stellar network status page: https://status.stellar.org
4. Do not attempt further distributions until the root cause is identified
