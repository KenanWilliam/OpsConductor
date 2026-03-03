"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { activityEvents, type ActivityEvent } from "@/lib/mock-data"
import {
  Activity,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Mail,
  CreditCard,
  MessageSquare,
  FileText,
  Clock,
  List,
  SlidersHorizontal,
} from "lucide-react"

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

function ActivityRow({ event }: { event: ActivityEvent }) {
  const [expanded, setExpanded] = useState(false)
  const appInfo = appIcons[event.app] || { icon: FileText, color: "text-text-tertiary" }
  const AppIcon = appInfo.icon

  return (
    <tr className="group border-b border-border-subtle last:border-0 transition-colors hover:bg-surface-3">
      <td className="px-3 py-2.5 font-mono text-[11px] text-text-tertiary whitespace-nowrap">{event.timestamp}</td>
      <td className="px-3 py-2.5 text-[13px] font-medium text-text-primary">{event.agentName}</td>
      <td className="px-3 py-2.5">
        <div className={cn("flex h-6 w-6 items-center justify-center rounded bg-surface-2", appInfo.color)}>
          <AppIcon className="h-3 w-3" />
        </div>
      </td>
      <td className="px-3 py-2.5 text-[13px] text-text-secondary">{event.action}</td>
      <td className="px-3 py-2.5 text-[13px] text-text-secondary">{event.target}</td>
      <td className="px-3 py-2.5"><StatusChip status={event.status} /></td>
      <td className="px-3 py-2.5 text-right font-mono text-[11px] text-text-tertiary">${event.cost.toFixed(3)}</td>
      <td className="px-3 py-2.5">
        {event.reasoning && (
          <button onClick={() => setExpanded(!expanded)} className="rounded p-1 text-text-tertiary hover:text-text-secondary">
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </td>
    </tr>
  )
}

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showInsights, setShowInsights] = useState(false)

  const filtered = activityEvents.filter(e => {
    const matchesSearch = searchQuery === "" ||
      e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.target.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCost = filtered.reduce((sum, e) => sum + e.cost, 0)
  const successRate = filtered.length > 0
    ? Math.round((filtered.filter(e => e.status === "success").length / filtered.length) * 100)
    : 0

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col gap-5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo" />
              <h1 className="text-xl font-semibold text-text-primary">Activity Log</h1>
            </div>
            <p className="text-[13px] text-text-secondary">Complete record of all agent actions</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInsights(!showInsights)}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors",
                showInsights
                  ? "border-indigo bg-indigo-dim text-indigo"
                  : "border-border-base bg-surface-2 text-text-secondary hover:text-text-primary"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Insights
            </button>
            <button className="flex items-center gap-1.5 rounded-md border border-border-base bg-surface-2 px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search actions, agents, targets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-border-base bg-surface-1 pl-8 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-indigo focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-surface-1 p-0.5">
            {["all", "success", "failed", "pending"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded px-2 py-1 text-[11px] font-medium capitalize transition-colors",
                  statusFilter === s
                    ? "bg-surface-3 text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-1">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Time</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Agent</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">App</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Action</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Target</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Status</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Cost</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <ActivityRow key={event.id} event={event} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Panel */}
      {showInsights && (
        <div className="w-72 shrink-0 border-l border-border-subtle bg-surface-1 p-4">
          <h3 className="mb-4 text-[13px] font-semibold text-text-primary">Insights</h3>
          <div className="space-y-4">
            <div className="rounded-md bg-surface-2 p-3">
              <p className="text-[11px] text-text-tertiary">Total Actions</p>
              <p className="text-lg font-semibold text-text-primary">{filtered.length}</p>
            </div>
            <div className="rounded-md bg-surface-2 p-3">
              <p className="text-[11px] text-text-tertiary">Total Cost</p>
              <p className="font-mono text-lg font-semibold text-text-primary">${totalCost.toFixed(3)}</p>
            </div>
            <div className="rounded-md bg-surface-2 p-3">
              <p className="text-[11px] text-text-tertiary">Success Rate</p>
              <p className="text-lg font-semibold text-success">{successRate}%</p>
            </div>
            <div className="rounded-md bg-surface-2 p-3">
              <p className="text-[11px] text-text-tertiary">Most Active Agent</p>
              <p className="text-[13px] font-medium text-text-primary">Lead Nurturer</p>
            </div>
            <div className="rounded-md bg-surface-2 p-3">
              <p className="text-[11px] text-text-tertiary">Most Used App</p>
              <p className="text-[13px] font-medium text-text-primary">HubSpot</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
