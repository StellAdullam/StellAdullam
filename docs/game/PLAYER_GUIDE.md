# StellAdullam Land — Player Guide

Welcome to **StellAdullam Land**, the blockchain city-building game built natively on the **Stellar Testnet** using Soroban smart contracts. In this virtual world, you own virtual real estate parcels as NFTs, upgrade buildings, earn automated rental yields in **LAND** tokens, and trade properties with other players on an open marketplace.

---

## Quick Start (3 Steps to Play)

### 1. Connect Your Wallet
1. Open the game in your browser (`http://localhost:3002` or production deployment).
2. Click **Connect Wallet** in the top navigation bar.
3. Select your preferred Stellar wallet:
   - **Freighter** (Recommended browser extension)
   - **Albedo** (Web-based popup)
   - **xBull** / **Lobstr**
4. Ensure your wallet network is set to **Testnet**.

### 2. Claim Your 1,000 Starter LAND
Every new wallet receives **1,000 free LAND** from our testnet faucet to fund your initial investments:
1. In the onboarding modal, click **Claim 1,000 LAND**.
2. Approve the Soroban transaction in your wallet.
3. Once confirmed on-chain, your balance updates to `1,000 LAND`.

### 3. Claim Your First Property Tile
1. Browse the 20×20 city map or choose a sector during onboarding.
2. Select an unowned tile from the **City Treasury** (priced at **500 LAND**).
3. Confirm the purchase to mint your NFT tile. Congratulations, you are now a property owner!

---

## The City Grid (20×20 Map)

The city consists of **400 unique tiles** indexed from $(0, 0)$ to $(19, 19)$:
* **Golden / Amber Tiles**: Owned by the City Treasury, available for purchase at base price.
* **Muted Grey Tiles**: Unclaimed / Vacant territory.
* **Colored Tiles**: Player-owned tiles (the color is deterministically generated from the owner's Stellar address).
* **Golden Dot**: The property is actively listed for sale on the marketplace.

> **Hover Card**: Hovering over any tile for 300ms opens an instant preview showing coordinates, owner, building tier, and listing price.

---

## Earning Rental Income

All properties generate passive LAND rental income automatically on a fixed ledger epoch schedule.

### Income Calculations
* **Epoch Length**: 1 epoch occurs roughly every **8 minutes** (~100 Stellar ledgers).
* **Base Rental Rate**: A vacant parcel produces **10 LAND per epoch**.
* Higher building tiers multiply your yield:

| Building Level | Upgrade Cost | Income Multiplier | Income per Epoch | Approx. Hourly Rate |
| :--- | :--- | :--- | :--- | :--- |
| **Level 0: Vacant** | Starter | 1.0× | **10 LAND** | ~75 LAND/hr |
| **Level 1: Residential** | 200 LAND | 1.5× | **15 LAND** | ~112.5 LAND/hr |
| **Level 2: Commercial** | 600 LAND | 3.0× | **30 LAND** | ~225 LAND/hr |
| **Level 3: Skyscraper** | 1,800 LAND | 6.0× | **60 LAND** | ~450 LAND/hr |

### Claiming Accumulated Rent
Your accrued income continues accumulating even when you are offline:
1. Visit your **Portfolio Dashboard** (`/dashboard`).
2. View your total unclaimed LAND across all properties.
3. Click **Claim Rent** on an individual property or **Claim All** to sweep rewards directly to your wallet in a single transaction.

---

## Upgrading Buildings

Reinvest your rental income to upgrade your structures and maximize earnings.

### How to Upgrade
1. Click on any tile you own on the **City Map** or select it in your **Dashboard**.
2. In the right-hand **Property Panel**, view the upgrade preview.
3. Click **Upgrade to [Next Level]** and approve the transaction.
4. Your property is immediately promoted to the next tier and begins earning higher yields.

---

## Trading on the Marketplace

StellAdullam Land features an on-chain peer-to-peer property exchange:

### Listing a Property for Sale
1. Open the property detail panel for a tile you own.
2. Select **List for Sale**.
3. Set your asking price in **LAND** tokens.
4. Confirm the listing transaction. The property is escrowed in the marketplace contract and marked with an amber dot on the map.

### Buying a Listed Property
1. Navigate to the **Marketplace** page (`/marketplace`).
2. Filter properties by building level or price.
3. Click **Buy Now** and sign the purchase transaction.
4. The NFT is instantly transferred to your wallet, and the seller receives the LAND payment.

---

## Glossary of Terms

* **LAND**: The primary utility token of the game, implemented as a Soroban SEP-41 compliant smart contract with 7 decimal places.
* **Epoch**: A recurring timeframe on the Stellar ledger (approx. 8 minutes) at which rental earnings accrue.
* **City Treasury**: The protocol contract that owns initial unminted property parcels.
* **Freighter**: The official browser wallet extension developed by the Stellar Development Foundation.
* **Stellar Testnet**: The public testing blockchain where transactions use free testnet XLM and zero real-world value.

