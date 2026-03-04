"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { IntegrationLogo } from "@/components/integration-logo"
import { TimeAgo } from "@/components/time-ago"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { useRealtimeEvents } from "@/lib/hooks/use-realtime"
import type { DbEvent } from "@/lib/types"

function StatusChip({ status }: { status: string | null }) {
  const styles: Record<string, string> = {
    success: "bg-success/10 text-success",
    failed: "bg-danger/10 text-danger",
    pending: "bg-warning/10 text-warning",
    pending_approval: "bg-warning/10 text-warning",
    running: "bg-amber-dim text-amber",
  }
  return (
    <span className={cn(
      "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-medium",
      styles[status || ''] || "bg-surface-2 text-text-secondary"
    )}>
      {status || 'unknown'}
    </span>
  )
}

function EventRow({ event }: { event: DbEvent }) {
  const [expanded, setExpanded] = useState(false)
  const hasPayload = event.payload && Object.keys(event.payload).length > 0

  return (
    <div className="border-b border-border-subtle last:border-0">
      <button
        onClick={() => hasPayload && setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-3"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-2">
          <IntegrationLogo provider={event.integration || 'Unknown'} size={14} />
        </div>
        <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-text-primary">{event.agent?.name || 'System'}</span>
            <span className="truncate text-[13px] text-text-secondary">{event.title}</span>
          </div>
          <span className="text-[11px] text-text-tertiary">{event.target_name || event.target_type || ''}</span>
        </div>
        <StatusChip status={event.status} />
        <span className="shrink-0 font-mono text-[11px] text-text-tertiary">
          <TimeAgo timestamp={event.created_at} />
        </span>
        {hasPayload && (
          expanded ? <ChevronUp className="h-3.5 w-3.5 text-text-tertiary" /> : <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
        )}
      </button>
      {expanded && event.payload && (
        <div className="bg-surface-2 px-4 py-3 text-[13px] leading-relaxed text-text-secondary">
          <pre className="font-mono text-[11px] whitespace-pre-wrap max-h-48 overflow-auto">{JSON.stringify(event.payload, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export function ActivityFeed({ maxItems }: { maxItems?: number }) {
  const { events, isConnected, isLoading } = useRealtimeEvents(maxItems || 50)

  if (isLoading) return <SkeletonLoader type="feed" />

  const displayed = maxItems ? events.slice(0, maxItems) : events

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
        <h3 className="text-[13px] font-semibold text-text-primary">Live Activity</h3>
        <div className="flex items-center gap-1.5">
          <div className={cn("h-2 w-2 rounded-full", isConnected ? "bg-success status-running" : "bg-danger")} />
          <span className="text-[11px] text-text-tertiary">{isConnected ? 'Real-time' : 'Connecting...'}</span>
        </div>
      </div>
      <div className="max-h-[480px] overflow-y-auto">
        {displayed.length > 0 ? (
          displayed.map((event) => <EventRow key={event.id} event={event} />)
        ) : (
          <div className="flex items-center justify-center py-12 text-[13px] text-text-tertiary">
            No activity yet
          </div>
        )}
      </div>
    </div>
  )
}
