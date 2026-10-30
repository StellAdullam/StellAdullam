# StellAdullam: Hackathon Presentation & 3-Minute Video Script

## 🎯 30-Second Elevator Pitch

> *"Real estate is the world's largest asset class at $379 trillion, yet it remains completely illiquid for ordinary investors. Meanwhile, DeFi lending protocols rely on speculative crypto collateral prone to 80% liquidations.*
> 
> *StellAdullam bridges both worlds on Stellar: property owners tokenize real-world assets into fractional on-chain shares, investors use those audited shares as collateral in decentralized lending pools, and players explore and trade properties in our gamified virtual economy — powered by high-speed, sub-penny Soroban smart contracts."*

---

## ⏱️ 3-Minute Video Demo Script

### Act 1: The Problem & The Solution (0:00 – 0:45)
* **Visual**: Camera on presenter, switching to StellAdullam landing dashboard.
* **Audio**:
  *"Welcome to StellAdullam. Today, buying prime real estate requires tens of thousands of dollars and weeks of paperwork. And if you need liquidity, your only option is a costly bank mortgage.*
  *StellAdullam changes this on Stellar. By leveraging Soroban smart contracts, fractional property shares can be purchased starting from just $100 with guaranteed compliance, while unlocking low-interest DeFi credit backed by tangible, productive assets."*

### Act 2: WebApp — RWA Tokenization & DeFi Lending (0:45 – 1:45)
* **Visual**: Screen recording navigating `apps/webapp`:
  1. Open Property Details page with 3D viewer and title deed badge.
  2. Show live lending pool with APY and collateral factors.
  3. Deposit tokenized shares and preview the dynamic Health Factor Gauge.
* **Audio**:
  *"Here on the investment platform, investors browse audited institutional properties. Each property title is permanently hashed on-chain. With one click via Freighter, investors can purchase fractional shares or deposit their shares into a lending pool. Notice our real-time Health Factor Gauge — borrowers can safely withdraw liquidity while smart contracts continuously safeguard pool solvency."*

### Act 3: StellAdullam Land — The Virtual Real Estate Economy (1:45 – 2:30)
* **Visual**: Screen recording in `apps/stelladullam-land`:
  1. Connect wallet and click **Claim 1,000 LAND** from the testnet faucet.
  2. Navigate the **20×20 City Map** grid; hover over parcels to display the hover cards.
  3. Upgrade a building from Residential to Commercial; collect rental yield.
  4. Browse the open **Marketplace** and buy a listed parcel.
* **Audio**:
  *"To bring real estate to the next generation of users, we created StellAdullam Land — a 400-tile city grid on Stellar Testnet. New players claim 1,000 starter LAND from our on-chain faucet. Hovering over any parcel reveals real-time ownership and valuation. Properties earn automatic rental yields every 8 minutes. You can reinvest those earnings into building upgrades or list parcels on the peer-to-peer marketplace."*

### Act 4: Why Stellar & Conclusion (2:30 – 3:00)
* **Visual**: Architecture slide showing Soroban smart contracts, sub-penny transaction fees, and team call to action.
* **Audio**:
  *"We chose Stellar because fractional ownership and high-frequency game loops require sub-penny fees ($0.00001 per tx) and guaranteed 5-second finality. Ethereum gas fees would make this impossible. StellAdullam is 100% open source, tested, and live on testnet. Thank you!"*

---

## 🏆 Judge Evaluation Cheat Sheet

| Evaluation Criterion | How StellAdullam Wins |
| :--- | :--- |
| **Stellar Ecosystem Relevance** | Native Soroban Rust contracts (`defi-rwa`, `game-land-token`, `game-marketplace`, `game-property-nft`), SEP-41 conformance, Stellar Wallets Kit. |
| **Real-World Impact** | Unlocks real estate wealth creation for retail investors in emerging markets starting at $100. |
| **Technical Completeness** | Full monorepo with Bun/Elysia backend, Next.js frontend, typed contract clients, automated CI/CD, and $\ge 80\%$ test coverage. |
| **User Experience** | Instant wallet onboarding, interactive 20×20 map grid with hover cards, and zero friction. |
