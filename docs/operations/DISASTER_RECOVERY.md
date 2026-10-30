# StellAdullam — Disaster Recovery & Blockchain State Resynchronization SOP

**Severity:** Critical  
**Target RTO (Recovery Time Objective):** < 30 minutes  
**Target RPO (Recovery Point Objective):** < 5 minutes (or 0 for on-chain state)  
**Audience:** Site Reliability Engineers, DevOps, and Platform Administrators

---

## 1. Overview & Architectural Principles

StellAdullam operates under an **on-chain source of truth** architecture. 
- All token balances, property shares, lending collateral, and game NFTs live permanently on the **Stellar Soroban ledger**.
- The PostgreSQL database serves as an indexed cache for fast queries, search, and user preferences.
- In the event of catastrophic database corruption or infrastructure loss, the entire platform state can be rebuilt from the Stellar ledger.

---

## 2. Emergency Escalation Triage

```
┌────────────────────────────────────────────────────────────┐
│                    Incident Detected                       │
│  (DB connection failure, data loss, hardware failure)      │
└─────────────────────────────┬──────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│ Step 1: Engage Maintenance Mode                            │
│ - Set API ingress to return 503 Maintenance                │
│ - Pause frontend transactions to prevent user confusion    │
└─────────────────────────────┬──────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│ Step 2: Database Restoration                               │
│ - Scenario A: Restore from latest encrypted S3 snapshot    │
│ - Scenario B: Fresh DB schema + complete on-chain replay   │
└─────────────────────────────┬──────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│ Step 3: Blockchain Event Ingestion Catch-Up                │
│ - Run StellarIndexerService from last confirmed ledger     │
│ - Verify zero missed contract events                       │
└─────────────────────────────┬──────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│ Step 4: Health Verification & Traffic Resumption           │
│ - Verify GET /healthz returns 200 OK                       │
│ - Lift maintenance mode & resume normal operation          │
└────────────────────────────────────────────────────────────┘
```

---

## 3. Database Restoration Procedure

### Scenario A: Restore from Daily S3 Encrypted Snapshot

1. Fetch latest encrypted snapshot from backup bucket:
```bash
aws s3 cp s3://stelladullam-backups-prod/postgres/latest.dump.gpg ./latest.dump.gpg
```

2. Decrypt snapshot using operator private key:
```bash
gpg --decrypt --output latest.dump latest.dump.gpg
```

3. Restore database schema and records:
```bash
pg_restore -h $POSTGRES_HOST -U $POSTGRES_USER -d stelladullam -c -v latest.dump
```

---

## 4. On-Chain Ledger Resynchronization Procedure

To bring the restored database up to the exact current ledger sequence:

1. Identify highest ledger recorded in `transactions` table:
```sql
SELECT COALESCE(MAX(ledger_sequence), 1) AS last_synced_ledger FROM transactions;
```

2. Run the indexer catch-up worker starting from `last_synced_ledger`:
```bash
cd apps/api
bun run -e "
import { stellarIndexer } from './src/services/StellarIndexerService';
await stellarIndexer.start($LAST_SYNCED_LEDGER);
"
```

3. Confirm indexer has reached the current network ledger:
```bash
curl -s -X POST https://soroban-testnet.stellar.org \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"getLatestLedger"}'
```

---

## 5. Post-Recovery Validation Signoff

Before resuming traffic, the on-call engineer must verify:
- [ ] Database connectivity verified via `GET /healthz` (returns `status: ok`)
- [ ] Redis cache flushed and re-warmed (`redis-cli flushall`)
- [ ] Property share totals match contract storage (`defi-rwa.get_shares()`)
- [ ] Lending pool available liquidity matches contract reserve balances
- [ ] Incident log filed in platform operations registry
