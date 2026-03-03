"use client"

import {
  Mail,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { activityEvents, type ActivityEvent } from "@/lib/mock-data"
import { useState } from "react"

const appIcons: Record<string, { icon: React.ElementType; color: string }> = {
  Gmail: { icon: Mail, color: "text-danger" },
  HubSpot: { icon: BarChart3, color: "text-warning" },
  Stripe: { icon: CreditCard, color: "text-indigo" },
  Slack: { icon: MessageSquare, color: "text-info" },
  Notion: { icon: FileText, color: "text-text-secondary" },
}

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: "bg-success/10 text-success",
    failed: "bg-danger/10 text-danger",
    pending: "bg-warning/10 text-warning",
    running: "bg-indigo-dim text-indigo",
  }
  return (
    <span className={cn(
      "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-medium",
      styles[status] || "bg-surface-2 text-text-secondary"
    )}>
      {status}
    </span>
  )
}

function EventRow({ event }: { event: ActivityEvent }) {
  const [expanded, setExpanded] = useState(false)
  const appInfo = appIcons[event.app] || { icon: FileText, color: "text-text-tertiary" }
  const AppIcon = appInfo.icon

  return (
    <div className="border-b border-border-subtle last:border-0">
      <button
        onClick={() => event.reasoning && setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-3"
      >
        <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-2", appInfo.color)}>
          <AppIcon className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-text-primary">{event.agentName}</span>
            <span className="text-[13px] text-text-secondary">{event.action}</span>
          </div>
          <span className="text-[11px] text-text-tertiary">{event.target}</span>
        </div>
        <StatusChip status={event.status} />
        <span className="shrink-0 font-mono text-[11px] text-text-tertiary">{event.timestamp}</span>
        {event.reasoning && (
          expanded ? <ChevronUp className="h-3.5 w-3.5 text-text-tertiary" /> : <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
        )}
      </button>
      {expanded && event.reasoning && (
        <div className="bg-surface-2 px-4 py-3 text-[13px] leading-relaxed text-text-secondary">
          {event.reasoning}
        </div>
      )}
    </div>
  )
}

export function ActivityFeed({ events, maxItems }: { events?: ActivityEvent[]; maxItems?: number }) {
  const data = events || activityEvents
  const displayed = maxItems ? data.slice(0, maxItems) : data

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
        <h3 className="text-[13px] font-semibold text-text-primary">Live Activity</h3>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-success status-running" />
          <span className="text-[11px] text-text-tertiary">Real-time</span>
        </div>
      </div>
      <div className="max-h-[480px] overflow-y-auto">
        {displayed.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
