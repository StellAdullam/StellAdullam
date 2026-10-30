"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  ShoppingBag,
  LayoutDashboard,
  Wallet,
  Menu,
  X,
  Coins,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/map", label: "City Map", icon: Map },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

interface GameShellProps {
  children: React.ReactNode;
  /** Wallet address of the connected player, or null if disconnected */
  walletAddress?: string | null;
  /** LAND token balance */
  landBalance?: string;
}

export function GameShell({
  children,
  walletAddress = null,
  landBalance = "0",
}: GameShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-land-bg flex flex-col text-land-fg font-sans">
      {/* Top navigation */}
      <header className="h-14 bg-land-surface/95 backdrop-blur-md border-b border-land-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-land-fg hover:text-land-accent transition-colors shrink-0"
          >
            <span className="text-land-accent text-lg">◈</span>
            <span className="text-sm tracking-wide font-extrabold">
              StellAdullam <span className="text-land-gold">Land</span>
            </span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden sm:flex items-center gap-1 ml-2">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? "bg-land-accent-dim text-land-accent"
                      : "text-land-fg-muted hover:text-land-fg hover:bg-land-surface-raised"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: LAND balance + wallet + hamburger */}
        <div className="flex items-center gap-2.5">
          {walletAddress && (
            <div className="hidden xs:flex items-center gap-1.5 bg-land-gold-dim border border-land-border rounded-lg px-2.5 py-1">
              <Coins size={12} className="text-land-gold" />
              <span className="text-land-gold text-xs font-mono font-bold">
                {landBalance}
              </span>
              <span className="text-land-fg-subtle text-[10px] uppercase font-bold">
                LAND
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-land-surface-raised border border-land-border rounded-lg px-2.5 py-1 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                walletAddress ? "bg-land-success" : "bg-slate-600"
              }`}
            />
            <Wallet size={13} className="text-land-fg-muted" />
            <span className="text-[11px] font-mono text-land-fg-muted">
              {walletAddress
                ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}`
                : "Not connected"}
            </span>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden p-1.5 rounded-lg bg-land-surface-raised border border-land-border text-slate-400 hover:text-white transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-14 bg-slate-950/95 backdrop-blur-xl border-b border-land-border z-40 p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}

          {walletAddress && (
            <div className="pt-2 border-t border-slate-900 flex justify-between items-center px-4 py-2">
              <span className="text-xs text-slate-400 font-medium">Balance</span>
              <span className="text-xs font-mono font-bold text-land-gold flex items-center gap-1">
                <Coins size={12} />
                {landBalance} LAND
              </span>
            </div>
          )}
        </div>
      )}

      {/* Page content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
