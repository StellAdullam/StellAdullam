/**
 * useGameWallet.ts
 *
 * Zustand-backed hook that manages wallet connection state for the
 * StellAdullam Land game. Uses @creit.tech/stellar-wallets-kit for
 * real wallet integration (Freighter, Albedo, etc.) with a graceful
 * fallback to the default viewer address for read-only demo mode.
 *
 * Connection flow:
 *   1. connect()        — opens the wallet selector modal
 *   2. kit.getAddress() — reads the connected public key
 *   3. State is persisted in Zustand (in-memory, reset on page reload)
 *
 * The hook is SSR-safe: wallet kit is only initialised on the client side.
 */

"use client";

import { create } from "zustand";
import {
  WalletNetwork,
  allowAllModules,
} from "@creit.tech/stellar-wallets-kit";
import { initializeWalletKit, getWalletKit } from "@/lib/walletKit";
import {
  submitSorobanTx,
  waitForSorobanTx,
  NETWORK_PASSPHRASE,
} from "@/lib/soroban-tx";

// ── Read-only demo address (env-configurable) ────────────────────────────────
const DEFAULT_VIEWER_ADDRESS =
  process.env.NEXT_PUBLIC_DEFAULT_VIEWER_ADDRESS ?? "";

// ── Zustand store ────────────────────────────────────────────────────────────

interface WalletStore {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  connectError: string | null;
  setIsConnected: (v: boolean) => void;
  setAddress: (v: string | null) => void;
  setIsConnecting: (v: boolean) => void;
  setConnectError: (v: string | null) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  isConnected: false,
  address: null,
  isConnecting: false,
  connectError: null,
  setIsConnected: (v) => set({ isConnected: v }),
  setAddress: (v) => set({ address: v }),
  setIsConnecting: (v) => set({ isConnecting: v }),
  setConnectError: (v) => set({ connectError: v }),
}));

// ── Public hook ──────────────────────────────────────────────────────────────

export function useGameWallet() {
  const {
    isConnected,
    address,
    isConnecting,
    connectError,
    setIsConnected,
    setAddress,
    setIsConnecting,
    setConnectError,
  } = useWalletStore();

  /**
   * Open the Stellar Wallets Kit modal and connect a wallet.
   * On success, persists the address and sets isConnected = true.
   */
  const connect = async (): Promise<void> => {
    if (typeof window === "undefined") return;

    setIsConnecting(true);
    setConnectError(null);

    try {
      const kit = initializeWalletKit(WalletNetwork.TESTNET);

      await kit.openModal({
        onWalletSelected: async (option) => {
          kit.setWallet(option.id);
          try {
            const { address: walletAddress } = await kit.getAddress();
            setAddress(walletAddress);
            setIsConnected(true);
          } catch (err) {
            setConnectError(
              err instanceof Error
                ? err.message
                : "Failed to get wallet address",
            );
          }
        },
      });
    } catch (err) {
      setConnectError(
        err instanceof Error ? err.message : "Failed to open wallet modal",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnect the wallet and clear session state.
   */
  const disconnect = (): void => {
    const kit = getWalletKit();
    if (kit) {
      try {
        kit.disconnect();
      } catch {
        // best-effort
      }
    }
    setIsConnected(false);
    setAddress(null);
    setConnectError(null);
  };

  /**
   * Sign an unsigned Soroban XDR with the connected wallet, submit it to
   * the Soroban RPC, and wait for on-chain confirmation.
   *
   * @param unsignedXdr  Base64 XDR built by a soroban-tx builder function.
   * @returns            The confirmed transaction hash.
   * @throws             If the wallet is not connected, signing fails,
   *                     submission is rejected, or the tx fails on-chain.
   */
  const signAndSubmit = async (unsignedXdr: string): Promise<string> => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }

    const kit = getWalletKit();
    if (!kit) {
      throw new Error(
        "Stellar Wallet Kit is not initialized. Call connect() first.",
      );
    }

    // Sign with the connected wallet (Freighter, Albedo, etc.)
    const { signedTxXdr } = await kit.signTransaction(unsignedXdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
      address,
    });

    // Submit to Soroban RPC
    const txHash = await submitSorobanTx(signedTxXdr);

    // Poll until SUCCESS or throw on FAILED
    await waitForSorobanTx(txHash);

    return txHash;
  };

  /**
   * Effective address: connected wallet address if available, otherwise the
   * read-only demo address configured via NEXT_PUBLIC_DEFAULT_VIEWER_ADDRESS.
   */
  const effectiveAddress = address ?? DEFAULT_VIEWER_ADDRESS;

  return {
    /** Whether a real wallet is connected. */
    isConnected,
    /** Connected wallet address, or null if not connected. */
    address,
    /**
     * The address to use for contract reads and display.
     * Falls back to the demo address when no wallet is connected.
     */
    effectiveAddress,
    /** Whether a connection attempt is in progress. */
    isConnecting,
    /** Last connection error message, if any. */
    connectError,
    /** Open wallet selector modal and connect. */
    connect,
    /** Disconnect the wallet and clear session state. */
    disconnect,
    /**
     * Sign an unsigned Soroban XDR and submit it on-chain.
     * Only available when a real wallet is connected.
     */
    signAndSubmit,
  };
}
