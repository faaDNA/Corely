function Bar({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-800 ${className ?? ''}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Memuat">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Bar className="h-7 w-56" />
          <Bar className="h-4 w-40" />
        </div>
        <div className="hidden gap-2 sm:flex">
          <Bar className="h-8 w-24" />
          <Bar className="h-8 w-24" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <Bar className="h-3 w-24" />
            <Bar className="mt-3 h-7 w-16" />
            <Bar className="mt-3 h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Content blocks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <Bar className="mb-4 h-4 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Bar className="h-4 w-4 rounded-full" />
                <Bar className={`h-4 flex-1 ${i === 1 ? 'max-w-[70%]' : ''}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <Bar className="mb-4 h-4 w-32" />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Bar className="h-3 w-40" />
              <Bar className="h-2 w-full" />
            </div>
            <div className="space-y-1.5">
              <Bar className="h-3 w-32" />
              <Bar className="h-2 w-full" />
            </div>
            <div className="space-y-1.5">
              <Bar className="h-3 w-36" />
              <Bar className="h-2 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer block */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <Bar className="mb-4 h-4 w-40" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Bar key={i} className="h-8 w-44" />
          ))}
        </div>
      </div>
    </div>
  );
}