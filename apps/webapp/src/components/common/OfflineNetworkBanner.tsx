"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export function OfflineNetworkBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    setIsOffline(!navigator.onLine);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline && !justReconnected) return null;

  return (
    <div
      className={`fixed top-0 inset-x-0 z-50 py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
        isOffline
          ? "bg-red-600 text-white animate-pulse"
          : "bg-emerald-600 text-white"
      }`}
    >
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span>You are currently offline. Stellar transactions and live price updates are paused.</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" />
          <span>Connection restored. Synchronizing with Stellar network...</span>
        </>
      )}
    </div>
  );
}
