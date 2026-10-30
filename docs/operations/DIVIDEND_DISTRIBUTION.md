# StellAdullam — Monthly Rental Dividend Distribution Runbook

**Severity:** Operational  
**Frequency:** Monthly (1st of every calendar month, 00:00 UTC)  
**Audience:** Platform Treasury Operators & Compliance Officers

---

## 1. Overview & Financial Flow

Each tokenized property on StellAdullam collects physical tenant rent into the property escrow account. Once per month, the gross rental yield is converted to USDC and distributed to fractional share holders pro-rata using a **cryptographic Merkle root claim pattern**.

```mermaid
flowchart LR
    Rent[Tenant Rent USD] -->|Deposit| Escrow[Property Treasury SPV]
    Escrow -->|Ledger Snapshot| Snapshot[Holders Snapshot]
    Snapshot -->|Merkle Tree| Root[Merkle Root Hash]
    Root -->|Publish| Contract[defi-rwa Dividend Contract]
    Contract -->|Claim with Proof| Investor[Investor Wallet (USDC)]
```

---

## 2. Pre-Distribution Checklist

1. [ ] Confirm off-chain rental income received from property manager.
2. [ ] Verify total distributable USDC is deposited into the distribution wallet.
3. [ ] Query current ledger sequence number:
```bash
curl -s -X POST https://soroban-testnet.stellar.org \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"getLatestLedger"}'
```

---

## 3. Snapshot & Merkle Tree Generation

1. Execute the snapshot calculation script:
```bash
cd apps/api
bun run -e "
import { MerkleTree } from '@stelladullam/shared';
// Compute share balances at snapshot ledger
const claims = [
  'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI:1250000000',
  'GCABC...:500000000'
];
const tree = new MerkleTree(claims);
console.log('Merkle Root:', tree.getRoot());
"
```

2. Publish the Merkle root to the on-chain distribution contract:
```bash
stellar contract invoke \
  --contract-id $DEFI_RWA_CONTRACT_ID \
  --source-account $ADMIN_ADDRESS \
  --network testnet \
  --function set_dividend_root \
  -- \
  --property_id 1 \
  --merkle_root $MERKLE_ROOT
```

---

## 4. Post-Distribution Verification

1. [ ] Check frontend `DividendsClaimCard` displays updated claimable revenue.
2. [ ] Test canary claim transaction with testnet wallet.
3. [ ] Send automated email / notification alerts to token holders via `NotificationWorker`.

