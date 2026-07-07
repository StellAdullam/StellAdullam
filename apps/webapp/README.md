# @stelladullam/webapp

Next.js 16 / React 19 frontend for the StellAdullam real estate tokenization and DeFi lending platform.

## Getting Started

```bash
# Copy environment variables
cp .env.local.example .env.local

# Install dependencies (from repo root)
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

See `.env.example` for a full variable reference. The main variables you need:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | StellAdullam backend API (default: `http://localhost:3001`) |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Soroban RPC endpoint |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet` or `mainnet` |
| `PRIVY_APP_ID` / `PRIVY_APP_SECRET` | Privy authentication |

## Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start dev server with hot reload |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | ESLint check |
| `bun run type-check` | TypeScript type check |
| `bun run test` | Run unit tests |

## Architecture

```
src/
├── app/              # Next.js App Router pages + layouts
│   ├── (auth)/       # Auth-gated routes
│   ├── dashboard/    # User portfolio dashboard
│   ├── marketplace/  # Property marketplace
│   ├── lending/      # DeFi lending pools
│   ├── tokenize/     # Property tokenization flow
│   ├── kyc/          # KYC verification
│   └── admin/        # Admin operations
├── components/
│   ├── landing/      # Hero, Features, HowItWorks, CTA
│   ├── layout/       # Navbar, Footer, BrandLogo
│   ├── property/     # PropertyDetail, PropertyViewer3D
│   ├── lending/      # PoolActionModal
│   ├── kyc/          # KYCForm (4 steps)
│   ├── auth/         # Wallet provider registry
│   └── ui/           # Design system primitives
├── hooks/            # useLendingPools, usePortfolio, useHealthFactor, etc.
├── services/         # API client wrappers
├── mocks/            # MSW handlers + fixtures for testing
└── types/            # Frontend-specific TypeScript types
```

## Wallet Providers

StellAdullam supports three wallet integration paths:

1. **Stellar Wallets Kit** (`@creit.tech/stellar-wallets-kit`) — Freighter, Albedo, etc.
2. **Privy** (`@privy-io/react-auth`) — Email, social, embedded wallets
3. **Smart Account Kit** (`smart-account-kit`) — Account abstraction

See [docs/api/authentication.md](../../docs/api/authentication.md) for the authentication flow.
