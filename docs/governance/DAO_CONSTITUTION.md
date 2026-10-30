# StellAdullam DAO Constitution & Governance Framework

## Article I: Mission & Preamble
The StellAdullam Decentralized Autonomous Organization (the "DAO") exists to govern the tokenization of real-world property assets, capital lending pools, and public goods infrastructure on the Stellar blockchain. The protocol prioritizes financial transparency, algorithmic solvency, decentralized ownership, and adherence to legal cadastral compliance.

---

## Article II: Governance Tokenomics & Voting Power

### Section 2.1: Voting Weight Calculation
Voting power is distributed across protocol stakeholders according to cryptographic proof of commitment:
1. **Staked LAND Tokens**: $1\text{ Staked LAND} = 1.0\text{ Vote}$.
2. **Property Fraction NFT Shares**: Proportional governance over property-specific operational decisions (tenant lease terms, structural renovations, appraisal adjustments).
3. **Time-Weighted Staking (veLAND)**: Tokens locked for extended durations (3 months to 2 years) receive up to a $2.5\times$ voting multiplier.

### Section 2.2: Sybil & Flash-Loan Resistance
- Snapshots of voting power are taken at the block preceding proposal publication.
- Unstaked or newly transferred tokens within the same ledger sequence cannot participate in ongoing votes.

---

## Article III: Proposal Lifecycle (SIP)

All protocol adjustments must proceed through the StellAdullam Improvement Proposal (SIP) lifecycle:

```
[Phase 1: Community Discussion] (Forum, min. 5 days)
                │
                ▼
[Phase 2: Formal SIP Submission] (Requires 10,000 LAND threshold)
                │
                ▼
[Phase 3: On-Chain Voting] (7 days duration)
                │
   ┌────────────┴────────────┐
   │                         │
[Quorum Met (>4%) & >50% Yes]  [Failed / Rejected]
   │
   ▼
[Phase 4: 48-Hour Timelock Queue]
   │
   ▼
[Phase 5: Execution on Stellar Network]
```

---

## Article IV: Emergency Guardian Council & Circuit Breakers

### Section 4.1: Composition
The Guardian Council consists of three elected community security leads operating a 2-of-3 threshold Ed25519 multi-signature account on the Stellar network.

### Section 4.2: Limited Scope
The Guardian Council holds strictly bounded powers:
- **Authorized Actions**: Triggering `pause_deposits()`, `pause_borrows()`, or `pause_liquidations()` in verified security emergencies or extreme oracle divergence.
- **Unauthorized Actions**: Guardians cannot withdraw user deposits, transfer treasury reserves, alter interest accrual formulas, or modify contract bytecode without standard SIP timelock passage.

---

## Article V: Protocol Treasury Allocation

Protocol revenue accrued from marketplace fees (1%) and lending pool reserve factors (10%) is distributed according to constitutional ratios:
- **50%**: Protocol Liquidity Backstop & Insurance Escrow.
- **30%**: Staked LAND dividend distributions.
- **20%**: Developer Grants and Stellar Community Growth Fund.

---

## Article VI: Amendments

Amendments to this Constitution require a supermajority vote:
- Minimum quorum: **10% of total circulating voting power**.
- Approval threshold: **66.7% affirmative votes**.
- Mandatory review period: **14 days**.

