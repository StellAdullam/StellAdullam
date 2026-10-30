# StellAdullam — Institutional Legal Terms, Regulatory Disclosures & Token Notice

**Last Updated:** October 2026  
**Status:** Protocol Testnet Phase (Pre-Mainnet)

---

## 1. Important Testnet Notice & Token Disclosures

> **IMPORTANT NOTICE:**  
> All tokens, fractional property shares, and smart contracts currently deployed across the StellAdullam platform (including `LAND`, `PRPT`, and testnet `USDC`) operate exclusively on the **Stellar Testnet**. These tokens are strictly experimental testing instruments. They possess **no monetary value**, do not represent legal title to physical real estate until official mainnet cutover and notarized registry integration, and cannot be redeemed for fiat currency.

---

## 2. Real-World Asset (RWA) Tokenization Regulatory Framework

1. **Fractional Real Estate Interests**: Fractional property shares (`PRPT`) are designed to represent digital beneficial interest in special purpose vehicles (SPVs) or legal land trusts that hold legal title to physical real estate parcels.
2. **Jurisdictional Exclusions**: The platform is not offered to individuals or entities located in sanctioned jurisdictions or where the purchase, sale, or holding of cryptographic tokens is prohibited by local securities regulators.
3. **Accredited Investor & KYC/AML Compliance**: Access to primary share tokenization offerings requires identity verification conforming to international Financial Action Task Force (FATF) guidelines, SEP-12 identity standards, and localized Know-Your-Customer (KYC) requirements.

---

## 3. Non-Custodial Protocol Architecture

1. **Key Custody**: StellAdullam is a non-custodial protocol. At no time does StellAdullam, its developers, or its node operators take custody or control of user private keys, Stellar accounts, or cryptographic assets.
2. **Transaction Finality**: All transactions submitted to the Stellar Network via Soroban smart contracts are immutable and irreversible. Users are solely responsible for verifying transaction parameters, public addresses, and fee limits prior to signing with their wallet software.

---

## 4. DeFi Lending & Liquidation Risk Disclosure

1. **Collateral Risk**: Borrowing against real estate token collateral is subject to automated liquidation. If the market appraisal or oracle valuation of collateral drops such that the position Health Factor falls below `1.0`, the protocol automatically permits third-party liquidators to seize collateral to restore pool solvency.
2. **Oracle Dependencies**: On-chain lending rates and collateral valuations depend on SEP-40 decentralized price oracles and verified Automated Valuation Models (AVMs). While guardrails exist against rapid deviation ($\pm 20\%$) and stale timestamps ($> 3,600\text{s}$), market shocks or network partitions may cause temporary valuation delays.
3. **Smart Contract Risk**: While StellAdullam smart contracts undergo continuous static analysis, Clippy enforcement, and formal verification tests, all software carries inherent residual risk. Users participate at their own discretion.

---

## 5. Intellectual Property & License

The StellAdullam software suite—including frontend portals, backend ingestion services, shared SDKs, and Soroban smart contracts—is released under the permissive **MIT License**. Third-party real estate imagery and cadastre documents remain the intellectual property of their respective titleholders and surveyor authorities.
