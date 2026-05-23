export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-56 rounded-xl skeleton-shimmer" />
        <div className="h-4 w-72 rounded-full skeleton-shimmer" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-3 w-32 rounded-full skeleton-shimmer" />
                <div className="h-8 w-20 rounded-xl skeleton-shimmer" />
                <div className="h-3 w-24 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-11 w-11 rounded-2xl skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Usage bar skeleton */}
      <div className="liquid-glass rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded-full skeleton-shimmer" />
          <div className="h-5 w-16 rounded-full skeleton-shimmer" />
        </div>
        <div className="h-2.5 w-full rounded-full skeleton-shimmer" />
        <div className="h-3 w-52 rounded-full skeleton-shimmer" />
      </div>

      {/* Lower grid skeleton */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 liquid-glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 rounded-full skeleton-shimmer" />
            <div className="h-4 w-14 rounded-full skeleton-shimmer" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-border/30 p-3">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 rounded-full skeleton-shimmer" />
                <div className="h-3 w-64 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-3 w-12 rounded-full skeleton-shimmer" />
            </div>
          ))}
        </div>
        <div className="liquid-glass rounded-2xl p-6 space-y-4">
          <div className="h-5 w-28 rounded-full skeleton-shimmer" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
