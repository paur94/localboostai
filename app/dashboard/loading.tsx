export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-56 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-4 w-80 rounded-2xl bg-white/5 animate-pulse" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="liquid-glass rounded-3xl p-6 space-y-3"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-3 w-32 rounded-full bg-white/10 animate-pulse" />
                <div className="h-8 w-20 rounded-xl bg-white/10 animate-pulse" />
                <div className="h-3 w-24 rounded-full bg-white/10 animate-pulse" />
              </div>
              <div className="h-10 w-10 rounded-2xl bg-white/10 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Usage bar skeleton */}
      <div className="liquid-glass rounded-3xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded-full bg-white/10 animate-pulse" />
          <div className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 animate-pulse" />
        <div className="h-3 w-52 rounded-full bg-white/10 animate-pulse" />
      </div>

      {/* Lower grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 liquid-glass rounded-3xl p-6 space-y-4">
          <div className="h-5 w-36 rounded-full bg-white/10 animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 rounded-2xl border border-white/5 p-3">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 rounded-full bg-white/10 animate-pulse" />
                <div className="h-3 w-64 rounded-full bg-white/10 animate-pulse" />
              </div>
              <div className="h-3 w-12 rounded-full bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="liquid-glass rounded-3xl p-6 space-y-4">
          <div className="h-5 w-28 rounded-full bg-white/10 animate-pulse" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
