export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-land-bg text-land-fg flex flex-col">
      {/* Top Bar Skeleton */}
      <div className="h-14 bg-land-surface/80 border-b border-land-border px-6 flex items-center justify-between">
        <div className="h-7 w-32 rounded-lg bg-land-surface-raised animate-shimmer" />
        <div className="h-8 w-28 rounded-lg bg-land-surface-raised animate-shimmer" />
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 space-y-6">
        {/* Title & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-xl bg-land-surface animate-shimmer" />
            <div className="h-4 w-64 rounded bg-land-surface animate-shimmer" />
          </div>
          {/* Search & Sort Skeletons */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-44 rounded-xl bg-land-surface animate-shimmer" />
            <div className="h-10 w-32 rounded-xl bg-land-surface animate-shimmer" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-lg bg-land-surface animate-shimmer shrink-0"
            />
          ))}
        </div>

        {/* Marketplace Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-land-surface border border-land-border p-4 space-y-4"
            >
              <div className="h-36 rounded-xl bg-land-surface-raised animate-shimmer" />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-28 rounded bg-land-surface-raised animate-shimmer" />
                  <div className="h-4 w-12 rounded bg-land-surface-raised animate-shimmer" />
                </div>
                <div className="h-3 w-36 rounded bg-land-surface-raised animate-shimmer" />
              </div>
              <div className="pt-3 border-t border-land-border/60 flex items-center justify-between">
                <div className="h-5 w-20 rounded bg-land-surface-raised animate-shimmer" />
                <div className="h-8 w-24 rounded-lg bg-land-surface-raised animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
