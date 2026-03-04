'use client'

import { cn } from '@/lib/utils'

export function SkeletonLoader({ type = 'card' }: { type?: 'card' | 'table' | 'feed' }) {
  if (type === 'table') {
    return (
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-1">
        <div className="border-b border-border-subtle px-3 py-2.5">
          <div className="h-3 w-48 animate-pulse rounded bg-surface-3" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border-subtle px-3 py-3 last:border-0">
            <div className="h-2 w-2 animate-pulse rounded-full bg-surface-3" />
            <div className="h-3 w-32 animate-pulse rounded bg-surface-3" />
            <div className="h-3 w-24 animate-pulse rounded bg-surface-3" />
            <div className="ml-auto h-3 w-16 animate-pulse rounded bg-surface-3" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'feed') {
    return (
      <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
        <div className="border-b border-border-subtle px-3 py-2.5">
          <div className="h-3 w-32 animate-pulse rounded bg-surface-3" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border-subtle px-3 py-2.5 last:border-0">
            <div className="h-7 w-7 animate-pulse rounded-md bg-surface-3" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="h-3 w-48 animate-pulse rounded bg-surface-3" />
              <div className="h-2 w-32 animate-pulse rounded bg-surface-3" />
            </div>
            <div className="h-4 w-14 animate-pulse rounded bg-surface-3" />
          </div>
        ))}
      </div>
    )
  }

  // card type
  return (
    <div className="grid grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg border border-border-subtle bg-surface-1 p-4">
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 animate-pulse rounded bg-surface-3" />
            <div className="h-4 w-4 animate-pulse rounded bg-surface-3" />
          </div>
          <div className="h-7 w-16 animate-pulse rounded bg-surface-3" />
        </div>
      ))}
    </div>
  )
}
