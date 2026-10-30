# StellAdullam Protocol Bug Bounty Program

StellAdullam operates an open bug bounty program to incentivize independent security researchers and white-hat auditors to identify and responsibly disclose vulnerabilities within our smart contracts and infrastructure.

---

## 1. Scope

### In-Scope Smart Contracts (Soroban / Rust)
- `contracts/defi-rwa`: RWA property tokenization, fractional share ownership, lending pools, and interest accrual.
- `contracts/game-engine`: Staged ECS pipeline, rental dividend harvest formulas, building tier upgrades.
- `contracts/game-property-nft`: 20x20 spatial coordinate parcel registry.
- `contracts/game-land-token`: LAND utility token, burning mechanisms, and faucet.
- `contracts/game-marketplace`: Escrow listing and atomic trade execution.

### In-Scope Backend API (`apps/api`)
- Transaction simulation and fee bump proxy services.
- Geocoding and cadastral jurisdiction mapping.
- Authentication and session validation routes.

### Out of Scope
- Distributed Denial of Service (DDoS) against public RPC endpoints.
- Phishing, social engineering, or physical attacks against core developers.
- Third-party wallets (e.g., Freighter, Albedo) or underlying Stellar core consensus bugs.

---

## 2. Reward Tiers

Rewards are denominated in USD and distributed in **USDC** or **XLM** on the Stellar network:

| Severity | Impact Description | Maximum Reward |
| :--- | :--- | :--- |
| **Critical** | Direct theft of user deposits, unauthorized token minting, permanent fund freezing | **$50,000 USD** |
| **High** | Temporary fund lockup, broken circuit breaker bypass, oracle price spoofing | **$15,000 USD** |
| **Medium** | Griefing attacks, unhandled contract panics, transaction replay under specific conditions | **$5,000 USD** |
| **Low** | Minor rounding errors (&lt; 100 Stroops), informative gas optimizations | **$1,000 USD** |

---

## 3. Vulnerability Reporting SOP

1. **Submission Channel**:
   Email a detailed report with reproduction steps and proof-of-concept (PoC) code to:
   `security@stelladullam.io`
2. **Encryption**:
   Sensitive vulnerabilities should be encrypted using the StellAdullam Security PGP Key (`0x7A9D82F10E45B9C3`).
3. **Response SLA**:
   - Initial acknowledgement: **Within 24 hours**.
   - Severity triage & confirmation: **Within 48 hours**.
   - Remediation patch deployment: **Within 7 days**.
4. **Responsible Disclosure**:
   Researchers must maintain strict confidentiality until a remediation patch is deployed and verified on mainnet (standard 90-day embargo).
