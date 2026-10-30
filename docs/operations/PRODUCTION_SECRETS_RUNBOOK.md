# StellAdullam Production Secrets & Key Management Runbook

This standard operating procedure (SOP) defines the policies, architecture, and emergency workflows for managing cryptographic keys and sensitive credentials across the StellAdullam protocol on the Stellar network.

---

## 1. Cryptographic Key Inventory

| Key Alias | Key Type | Usage | Custody Mechanism | Rotation Cadence |
| :--- | :--- | :--- | :--- | :--- |
| `STELLAR_ADMIN_MULTISIG` | Stellar Ed25519 (2-of-3) | Protocol contract upgrades, emergency pause | Hardware Wallets (Ledger / Trezor) | Annually |
| `STELLAR_FEE_BUMP_SIGNER` | Stellar Ed25519 | Gas fee-sponsorship for gasless transactions | AWS KMS / HashiCorp Vault | 90 days |
| `ORACLE_FEEDER_KEY` | Stellar Ed25519 | Publishing real-time asset appraisals & rates | Kubernetes Secret / Vault Dynamic | 60 days |
| `LIQUIDATOR_BOT_KEY` | Stellar Ed25519 | Executing automated undercollateralized liquidations | AWS KMS / Vault Dynamic | 60 days |
| `PINATA_JWT_SECRET` | Secret Token | IPFS property cadastral deed pinning | GitHub Environment Secrets | 180 days |
| `DATABASE_URL` | PostgreSQL URI | Production analytics and indexing storage | AWS RDS IAM Auth | Continual |

---

## 2. Soroban Smart Contract Admin Governance

### Multi-Signature Architecture
All contract upgrade authorities and parameter modifications require 2-of-3 threshold signature execution:
- **Signer A**: Protocol Foundation Lead (Cold Hardware Storage).
- **Signer B**: Security Operations Lead (Cold Hardware Storage).
- **Signer C**: Community Timelock Escrow (Automated 48-hour delay queue).

### Emergency Stop (Circuit Breaker)
In case of detected exploits or extreme oracle deviation:
- Signer A or Signer B can unilaterally trigger `pause_deposits()` or `pause_borrows()` via pre-authorized limited guardian keys.
- Unpausing requires standard 2-of-3 threshold consensus.

---

## 3. Automated Relayer & Bot Key Security

1. **Principle of Least Privilege**:
   - Bot accounts (`STELLAR_FEE_BUMP_SIGNER`, `ORACLE_FEEDER_KEY`) MUST NOT hold contract administrative permissions.
   - Bot balances are automatically capped: if the balance exceeds 500 XLM, excess funds are swept into the protocol treasury.
   - Low-balance alerting triggers at < 50 XLM via PagerDuty/Slack webhooks.

2. **Automated Key Rotation Procedure**:
   ```bash
   # 1. Generate new Ed25519 Keypair
   NEW_SECRET=$(stellar keys generate new-bot-feeder)

   # 2. Add signature threshold / fund new account
   stellar-cli account fund $(stellar keys address new-bot-feeder)

   # 3. Update Kubernetes Secret via Vault
   vault kv put secret/stelladullam/feeder STELLAR_ADMIN_SECRET="$NEW_SECRET"

   # 4. Roll restart worker pods
   kubectl rollout restart deployment/stelladullam-feeder -n production
   ```

---

## 4. Compromise & Emergency Revocation Runbook

If a private key is leaked or suspected compromised:

1. **Immediate Revocation**:
   Use the Stellar account master weight threshold to strip signing power immediately without requiring contract code modification:
   ```bash
   # Set signer weight of compromised key to 0
   stellar tx set-options --sign compromised-account \
     --remove-signer compromised-pubkey
   ```
2. **Sweep Residual Funds**:
   Transfer all native XLM and token balances to the cold multisig reserve address:
   `GAEDULLAM_COLD_RESERVE_STOCKS`
3. **Trigger Circuit Breaker**:
   Call `/api/v1/admin/pause` or execute `pause_borrows` on `defi-rwa`.
4. **Publish Incident Advisory**:
   File security status report on `https://status.stelladullam.io` and notify ecosystem partners.
