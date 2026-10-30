export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-land-bg text-land-fg flex flex-col">
      {/* Top Bar Skeleton */}
      <div className="h-14 bg-land-surface/80 border-b border-land-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-28 rounded-lg bg-land-surface-raised animate-shimmer" />
          <div className="h-5 w-20 rounded-md bg-land-surface-raised animate-shimmer" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-32 rounded-lg bg-land-surface-raised animate-shimmer" />
          <div className="h-8 w-24 rounded-lg bg-land-surface-raised animate-shimmer" />
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-56 rounded-xl bg-land-surface animate-shimmer" />
            <div className="h-4 w-72 rounded-lg bg-land-surface animate-shimmer" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-28 rounded-xl bg-land-surface animate-shimmer" />
            <div className="h-10 w-36 rounded-xl bg-land-surface animate-shimmer" />
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-land-surface border border-land-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-land-surface-raised animate-shimmer" />
                <div className="h-8 w-8 rounded-xl bg-land-surface-raised animate-shimmer" />
              </div>
              <div className="h-7 w-32 rounded-lg bg-land-surface-raised animate-shimmer" />
              <div className="h-3 w-20 rounded bg-land-surface-raised animate-shimmer" />
            </div>
          ))}
        </div>

        {/* Property Portfolio Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-44 rounded-lg bg-land-surface animate-shimmer" />
            <div className="h-4 w-24 rounded bg-land-surface animate-shimmer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-land-surface border border-land-border p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-32 rounded-lg bg-land-surface-raised animate-shimmer" />
                  <div className="h-5 w-16 rounded-full bg-land-surface-raised animate-shimmer" />
                </div>
                <div className="h-28 rounded-xl bg-land-surface-raised animate-shimmer" />
                <div className="space-y-2 pt-2 border-t border-land-border/60">
                  <div className="flex justify-between">
                    <div className="h-3.5 w-20 rounded bg-land-surface-raised animate-shimmer" />
                    <div className="h-3.5 w-16 rounded bg-land-surface-raised animate-shimmer" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3.5 w-24 rounded bg-land-surface-raised animate-shimmer" />
                    <div className="h-3.5 w-14 rounded bg-land-surface-raised animate-shimmer" />
                  </div>
                </div>
                <div className="h-10 rounded-xl bg-land-surface-raised animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
