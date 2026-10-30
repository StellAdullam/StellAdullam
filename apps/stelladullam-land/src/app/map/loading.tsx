export default function MapLoading() {
  return (
    <div className="min-h-screen bg-land-bg text-land-fg flex flex-col">
      {/* Top Bar Skeleton */}
      <div className="h-14 bg-land-surface/80 border-b border-land-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-28 rounded-lg bg-land-surface-raised animate-shimmer" />
          <div className="h-5 w-20 rounded-md bg-land-surface-raised animate-shimmer" />
        </div>
        <div className="h-8 w-28 rounded-lg bg-land-surface-raised animate-shimmer" />
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full">
        {/* Map Header & Stats Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-land-border/40">
          <div className="h-8 w-40 rounded-xl bg-land-surface animate-shimmer" />
          <div className="flex items-center gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 rounded-xl bg-land-surface border border-land-border p-2 flex items-center justify-between"
              >
                <div className="h-5 w-8 rounded bg-land-surface-raised animate-shimmer" />
                <div className="h-3 w-10 rounded bg-land-surface-raised animate-shimmer" />
              </div>
            ))}
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="flex items-center gap-4 py-1 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-land-surface-raised animate-shimmer" />
              <div className="h-3 w-16 rounded bg-land-surface animate-shimmer" />
            </div>
          ))}
        </div>

        {/* 20x20 City Grid Skeleton Preview */}
        <div className="flex-1 rounded-2xl bg-land-surface/40 border border-land-border p-6 flex flex-col items-center justify-center min-h-[480px]">
          <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1.5 w-full max-w-4xl opacity-75">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md bg-land-surface-raised animate-shimmer"
              />
            ))}
          </div>
          <p className="mt-6 text-xs text-land-fg-muted animate-pulse">
            Loading StellAdullam City Grid from Stellar Testnet...
          </p>
        </div>
      </div>
    </div>
  );
}
