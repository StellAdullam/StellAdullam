# Security Policy

The StellAdullam team takes the security of our smart contracts, backend services, and decentralized applications seriously. We welcome security researchers to disclose findings responsibly.

---

## Supported Versions

| Component | Version / Environment | Supported |
| :--- | :--- | :--- |
| Soroban Smart Contracts (`defi-rwa`, `game-*`) | Stellar Testnet / Mainnet | ✅ |
| Backend API (`apps/api`) | v1.x | ✅ |
| Frontend DApps (`apps/webapp`, `apps/stelladullam-land`) | Latest | ✅ |

---

## Reporting a Vulnerability

If you discover a security vulnerability or potential exploit, **please do not disclose it publicly or open a public GitHub issue.**

Instead, report it directly to our core security team:
* **Email**: `security@stelladullam.com` (or submit a Private Vulnerability Advisory on GitHub)
* **Response SLA**: We acknowledge receipt of reports within **48 hours**.
* **Status Updates**: You will receive regular status updates every 3 business days until remediation is complete.

### What to Include in Your Report
1. Detailed description of the vulnerability and impact.
2. Step-by-step reproduction instructions or a minimal test case script.
3. Affected contract addresses or endpoint routes.
4. Proposed fix or mitigation strategy (if available).

---

## Scope

### In Scope
* Reentrancy, invariant violations, or fund leakage in Soroban smart contracts (`apps/contracts`).
* Authentication bypass, privilege escalation, or SSRF in `apps/api`.
* Transaction forgery, signature extraction, or XSS in `apps/webapp` and `apps/stelladullam-land`.
* Oracle price manipulation or frontrunning exploits.

### Out of Scope
* Denial of Service attacks requiring volumetric network floods.
* Social engineering or phishing attempts targeting StellAdullam contributors.
* Issues in third-party wallet extensions (Freighter, xBull, Albedo).

---

## Safe Harbor

We consider ethical security research conducted in accordance with this policy to be authorized. We will not pursue legal action against researchers who:
* Act in good faith to avoid privacy violations, destruction of data, and interruption or degradation of our services.
* Give us reasonable time to remediate the issue prior to public disclosure.
