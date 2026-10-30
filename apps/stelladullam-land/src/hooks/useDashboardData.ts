"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameProperty } from "@/types/game.types";
import { generateMockGrid } from "@/lib/mockProperties";
import { getSorobanServer, LAND_TOKEN_CONTRACT_ID } from "@/lib/soroban-tx";
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk";

export interface DashboardDataState {
  landBalance: number;
  properties: GameProperty[];
  totalRentalYield: number;
  unclaimedRental: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboardData(
  viewerAddress: string | null,
): DashboardDataState {
  const [landBalance, setLandBalance] = useState<number>(1000);
  const [properties, setProperties] = useState<GameProperty[]>([]);
  const [totalRentalYield, setTotalRentalYield] = useState<number>(0);
  const [unclaimedRental, setUnclaimedRental] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchContractData = useCallback(async () => {
    if (!viewerAddress) {
      // Unconnected viewer state
      setProperties([]);
      setLandBalance(0);
      setTotalRentalYield(0);
      setUnclaimedRental(0);
      setIsLoading(false);
      return;
    }

    const useMock =
      process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
      !process.env.NEXT_PUBLIC_LAND_TOKEN_CONTRACT_ID;

    if (useMock) {
      // Mock Data Mode
      const allProps = generateMockGrid();
      // Filter properties owned by this address or mock owner
      const owned = allProps.filter(
        (p) =>
          p.owner.toLowerCase() === viewerAddress.toLowerCase() ||
          p.owner.toLowerCase() === "gcoownedxxxxxx",
      );

      // If newly registered test account with 0 owned, give 1-2 demo owned properties
      const effectiveOwned =
        owned.length > 0
          ? owned
          : allProps.slice(0, 2).map((p) => ({ ...p, owner: viewerAddress }));

      // Calculate yields
      let totalYield = 0;
      let totalUnclaimed = 0;
      effectiveOwned.forEach((p) => {
        const baseRate = 10;
        const multiplier = [1, 1.5, 3, 6][p.buildingLevel] || 1;
        const rate = baseRate * multiplier;
        totalYield += rate;
        totalUnclaimed += p.earnedIncome || rate * 2;
      });

      setProperties(effectiveOwned);
      setLandBalance(1000);
      setTotalRentalYield(totalYield);
      setUnclaimedRental(totalUnclaimed);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const server = getSorobanServer();
      const account = await server.getAccount(viewerAddress);

      // Call LandToken.balance(viewerAddress)
      const { Contract, TransactionBuilder, Networks } =
        await import("@stellar/stellar-sdk");
      const tokenContract = new Contract(LAND_TOKEN_CONTRACT_ID);

      const tx = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          tokenContract.call(
            "balance",
            nativeToScVal(viewerAddress, { type: "address" }),
          ),
        )
        .setTimeout(30)
        .build();

      const sim = await server.simulateTransaction(tx);
      if ("result" in sim && sim.result) {
        const rawBalance = scValToNative(sim.result.retval) as bigint | number;
        // 7 decimals
        const balanceFormatted = Number(rawBalance) / 1e7;
        setLandBalance(balanceFormatted);
      }

      // Read player properties
      const allProps = generateMockGrid();
      const owned = allProps.filter(
        (p) => p.owner.toLowerCase() === viewerAddress.toLowerCase(),
      );
      setProperties(owned);

      let totalYield = 0;
      let totalUnclaimed = 0;
      owned.forEach((p) => {
        const baseRate = 10;
        const multiplier = [1, 1.5, 3, 6][p.buildingLevel] || 1;
        const rate = baseRate * multiplier;
        totalYield += rate;
        totalUnclaimed += p.earnedIncome || 0;
      });

      setTotalRentalYield(totalYield);
      setUnclaimedRental(totalUnclaimed);
    } catch (err) {
      console.warn(
        "Live contract query failed, using resilient fallback:",
        err,
      );
      // Fallback gracefully so dashboard stays functional
      const allProps = generateMockGrid();
      const owned = allProps.filter(
        (p) => p.owner.toLowerCase() === viewerAddress.toLowerCase(),
      );
      setProperties(owned);
      setLandBalance(1000);
      setError(
        err instanceof Error ? err.message : "Contract synchronization issue",
      );
    } finally {
      setIsLoading(false);
    }
  }, [viewerAddress]);

  useEffect(() => {
    fetchContractData();

    // Poll every 30 seconds for live balance & rental accrual
    pollingRef.current = setInterval(() => {
      fetchContractData();
    }, 30000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchContractData]);

  return {
    landBalance,
    properties,
    totalRentalYield,
    unclaimedRental,
    isLoading,
    error,
    refresh: fetchContractData,
  };
}
