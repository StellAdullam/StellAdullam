"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Coins,
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  Wallet,
  Tag,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useGameWallet } from "@/hooks/useGameWallet";
import { GameProperty, BuildingLevel } from "@/types/game.types";
import {
  generateMockGrid,
  BUILDING_NAMES,
  abbreviateAddress,
  getGridCoords,
} from "@/lib/mockProperties";
import { addressToHSL } from "@/lib/colorHash";
import { buildBuyFromPlayerXdr } from "@/lib/soroban-tx";
import { GameEmptyState } from "@/components/layout/GameErrorFallback";

export function MarketplaceClient() {
  const { isConnected, address, connect, signAndSubmit } = useGameWallet();

  // All properties from grid
  const [properties, setProperties] = useState<GameProperty[]>(() =>
    generateMockGrid(),
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    id: string;
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filter listed properties
  const listedProperties = useMemo(() => {
    return properties.filter((p) => p.isListed);
  }, [properties]);

  // Applied filtering and sorting
  const filteredProperties = useMemo(() => {
    return listedProperties
      .filter((p) => {
        const { row, col } = getGridCoords(p.id);
        const matchesQuery =
          searchQuery.trim() === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${row},${col}`.includes(searchQuery.trim());

        const matchesLevel =
          selectedLevel === "all" || p.buildingLevel === selectedLevel;

        return matchesQuery && matchesLevel;
      })
      .sort((a, b) => {
        const priceA = a.pricePerShare || 0;
        const priceB = b.pricePerShare || 0;
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      });
  }, [listedProperties, searchQuery, selectedLevel, sortOrder]);

  const handleBuy = useCallback(
    async (prop: GameProperty) => {
      if (!isConnected || !address) {
        await connect();
        return;
      }

      setPurchasingId(prop.id);
      setStatusMessage(null);

      try {
        const xdr = await buildBuyFromPlayerXdr(address, prop.id);
        await signAndSubmit(xdr);

        // Optimistically update property ownership
        setProperties((prev) =>
          prev.map((item) =>
            item.id === prop.id
              ? {
                  ...item,
                  owner: address,
                  isListed: false,
                  pricePerShare: 0,
                }
              : item,
          ),
        );

        setStatusMessage({
          id: prop.id,
          type: "success",
          text: `Successfully acquired ${prop.name}!`,
        });
      } catch (err) {
        console.error("Marketplace purchase failed:", err);
        setStatusMessage({
          id: prop.id,
          type: "error",
          text:
            err instanceof Error
              ? err.message
              : "Purchase transaction was not confirmed.",
        });
      } finally {
        setPurchasingId(null);
      }
    },
    [isConnected, address, connect, signAndSubmit],
  );

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-land-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-land-gold">◈</span>
            Property Marketplace
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Browse, acquire, and trade on-chain real estate parcels using LAND
            tokens.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-2 flex items-center gap-2">
            <Tag size={14} className="text-purple-400" />
            <span className="text-xs text-slate-400 font-medium">Active:</span>
            <span className="text-sm font-bold text-white font-mono">
              {listedProperties.length}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search by coordinate (e.g. 3,7) or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-xl bg-slate-900/90 border border-slate-800 p-1">
            <button
              onClick={() => setSelectedLevel("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedLevel === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Tiers
            </button>
            {[0, 1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl as BuildingLevel)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedLevel === lvl
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {BUILDING_NAMES[lvl as BuildingLevel]}
              </button>
            ))}
          </div>

          {/* Sort button */}
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <ArrowUpDown size={14} />
            <span>Price: {sortOrder === "asc" ? "Low-High" : "High-Low"}</span>
          </button>
        </div>
      </div>

      {/* Grid of Listings */}
      {filteredProperties.length === 0 ? (
        <GameEmptyState
          title="No active listings match your criteria"
          description="Try clearing your filters or head to your dashboard to list one of your own properties for sale."
          actionHref="/dashboard"
          actionLabel="View My Portfolio"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProperties.map((prop) => {
            const { row, col } = getGridCoords(prop.id);
            const isOwner =
              isConnected &&
              address &&
              prop.owner.toLowerCase() === address.toLowerCase();
            const swatchColor = addressToHSL(prop.owner);
            const isPending = purchasingId === prop.id;
            const message =
              statusMessage?.id === prop.id ? statusMessage : null;

            return (
              <div
                key={prop.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition p-4 flex flex-col justify-between space-y-4 shadow-xl"
              >
                {/* Card Header & Graphic */}
                <div className="space-y-3">
                  <div className="relative h-32 rounded-xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center border border-slate-800/60">
                    <div
                      className="absolute inset-0 opacity-25"
                      style={{
                        background: `radial-gradient(circle, ${swatchColor} 0%, transparent 70%)`,
                      }}
                    />
                    <Building2 className="h-10 w-10 text-slate-300 mb-1 z-10" />
                    <span className="text-[11px] font-mono text-slate-400 z-10 font-bold">
                      Sector ({row}, {col})
                    </span>
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 border border-purple-800 text-purple-300">
                      {BUILDING_NAMES[prop.buildingLevel]}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide truncate">
                      {prop.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: swatchColor }}
                      />
                      <span>Owner: {abbreviateAddress(prop.owner)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Action */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Price:</span>
                    <span className="text-sm font-extrabold text-white flex items-center gap-1 font-mono">
                      <Coins size={14} className="text-purple-400" />
                      {prop.pricePerShare} LAND
                    </span>
                  </div>

                  {message && (
                    <div
                      className={`text-[11px] p-2 rounded-lg flex items-center gap-1.5 ${
                        message.type === "success"
                          ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                          : "bg-rose-950/40 border border-rose-500/30 text-rose-300"
                      }`}
                    >
                      {message.type === "success" ? (
                        <CheckCircle2 size={12} className="shrink-0" />
                      ) : (
                        <AlertCircle size={12} className="shrink-0" />
                      )}
                      <span className="truncate">{message.text}</span>
                    </div>
                  )}

                  {isOwner ? (
                    <div className="w-full py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center text-xs font-bold text-slate-400">
                      Your Active Listing
                    </div>
                  ) : !isConnected ? (
                    <button
                      onClick={connect}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <Wallet size={14} />
                      Connect to Buy
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(prop)}
                      disabled={isPending}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/10"
                    >
                      {isPending ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        "Buy Now"
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
