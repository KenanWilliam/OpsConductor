import { cn } from "@/lib/utils"

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded", className)} />
}

export default function CockpitLoading() {
  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div>
        <Skeleton className="h-7 w-28 mb-1" />
        <Skeleton className="h-4 w-52" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      {/* Activity + Agents */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 rounded-lg border border-border-subtle bg-surface-1">
          <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-border-subtle px-3 py-2.5 last:border-0">
                <Skeleton className="h-7 w-7 rounded-md" />
                <div className="flex flex-1 flex-col gap-1">
                  <Skeleton className="h-3.5 w-44" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 rounded-lg border border-border-subtle bg-surface-1">
          <div className="border-b border-border-subtle px-3 py-2.5">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-1 p-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-md p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-14" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval preview */}
      <div className="rounded-lg border border-border-subtle bg-surface-1">
        <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-14 rounded" />
                </div>
                <Skeleton className="h-3.5 w-64" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-14 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
