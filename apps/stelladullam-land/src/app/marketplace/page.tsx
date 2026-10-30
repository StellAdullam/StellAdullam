import { GameShell } from "@/components/layout/GameShell";
import { MarketplaceClient } from "./MarketplaceClient";

export const metadata = {
  title: "Marketplace | StellAdullam Land",
  description:
    "Browse, buy, and trade tokenized land parcels on the Stellar Testnet.",
};

export default function MarketplacePage() {
  return (
    <GameShell>
      <MarketplaceClient />
    </GameShell>
  );
}
