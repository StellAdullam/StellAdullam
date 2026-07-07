import { GameShell } from "@/components/layout/GameShell";
import { CityMap } from "@/components/game/CityMap";

export const metadata = {
  title: "City Map | StellAdullam Land",
  description:
    "Explore the 20×20 StellAdullam City grid. Discover, select, and trade virtual land parcels.",
};

export default function MapPage() {
  return (
    <GameShell>
      <CityMap />
    </GameShell>
  );
}
