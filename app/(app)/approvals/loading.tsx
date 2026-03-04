import { cn } from "@/lib/utils"

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded", className)} />
}

export default function ApprovalsLoading() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <Skeleton className="h-7 w-28 mb-1" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-2 mb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border-subtle bg-surface-1 p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-14 rounded" />
                </div>
                <Skeleton className="h-3.5 w-72" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
