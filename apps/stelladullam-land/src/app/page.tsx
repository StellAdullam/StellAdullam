"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  ShoppingBag,
  LayoutDashboard,
  ShieldCheck,
  Coins,
  Building2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { GameShell } from "@/components/layout/GameShell";
import { useGameWallet } from "@/hooks/useGameWallet";

export default function LandHomePage() {
  const { isConnected, address, connect } = useGameWallet();

  return (
    <GameShell walletAddress={address} landBalance="1,000">
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 text-xs font-semibold shadow-lg">
            <Sparkles size={13} />
            <span>Built on Stellar & Soroban Testnet</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Tokenize. Build. Earn.
            <br />
            <span className="bg-gradient-to-r from-land-accent via-indigo-400 to-land-gold bg-clip-text text-transparent">
              StellAdullam Land
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A 400-parcel interactive virtual city built on the Stellar
            blockchain. Claim starter LAND tokens, acquire property parcels from
            the treasury, upgrade skyscrapers, and earn automated rental yields.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/map"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm px-7 py-3.5 transition shadow-xl shadow-indigo-600/20"
            >
              <Compass size={18} />
              Explore 20×20 City Map
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/marketplace"
              className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm px-6 py-3.5 transition"
            >
              <ShoppingBag size={18} />
              Marketplace
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Coins size={22} />
            </div>
            <h3 className="text-base font-bold text-white">Starter Faucet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every new wallet can claim 1,000 free testnet LAND directly from
              the smart contract faucet to fund their first parcel purchase.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Building2 size={22} />
            </div>
            <h3 className="text-base font-bold text-white">
              400 Virtual Parcels
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each tile on the 20×20 grid is an individual NFT. Upgrade parcels
              from Vacant to Residential, Commercial, and Skyscraper tiers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp size={22} />
            </div>
            <h3 className="text-base font-bold text-white">
              Passive Rental Yield
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Properties continuously accrue LAND income every 8-minute epoch.
              Sweep your earnings anytime with a single click.
            </p>
          </div>
        </div>

        {/* Live Testnet Status Banner */}
        <div className="w-full rounded-2xl bg-indigo-950/20 border border-indigo-500/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Stellar Soroban Testnet Live
              </h4>
              <p className="text-xs text-slate-400">
                Connected to contract cluster with SEP-41 token integration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
            >
              Start Onboarding Tour →
            </Link>
          </div>
        </div>
      </div>
    </GameShell>
  );
}
