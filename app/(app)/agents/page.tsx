"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { agents, type Agent } from "@/lib/mock-data"
import {
  MoreHorizontal,
  Plus,
  LayoutGrid,
  List,
  Mail,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText,
  Pause,
  Trash2,
  Play,
} from "lucide-react"

const appIconMap: Record<string, React.ElementType> = {
  Gmail: Mail,
  HubSpot: BarChart3,
  Stripe: CreditCard,
  Slack: MessageSquare,
  Notion: FileText,
}

function StatusDot({ status }: { status: Agent["status"] }) {
  const styles: Record<string, string> = {
    running: "bg-success status-running",
    idle: "bg-[#27272a]",
    paused: "bg-warning",
    error: "bg-danger",
  }
  return <div className={cn("h-2 w-2 rounded-full", styles[status])} />
}

function StatusLabel({ status }: { status: Agent["status"] }) {
  const labels: Record<string, { text: string; color: string }> = {
    running: { text: "Running", color: "text-success" },
    idle: { text: "Idle", color: "text-text-tertiary" },
    paused: { text: "Paused", color: "text-warning" },
    error: { text: "Error", color: "text-danger" },
  }
  const s = labels[status]
  return <span className={cn("text-[11px] font-medium", s.color)}>{s.text}</span>
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 48
    const y = 16 - (v / max) * 14
    return `${x},${y}`
  }).join(" ")
  return (
    <svg width="48" height="18" viewBox="0 0 48 18" className="overflow-visible">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan" />
    </svg>
  )
}

function AppIconStack({ apps }: { apps: string[] }) {
  return (
    <div className="flex items-center -space-x-1.5">
      {apps.slice(0, 4).map((app) => {
        const Icon = appIconMap[app] || FileText
        return (
          <div key={app} className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-surface-2">
            <Icon className="h-3 w-3 text-text-secondary" />
          </div>
        )
      })}
    </div>
  )
}

export default function AgentsPage() {
  const [view, setView] = useState<"table" | "card">("table")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredAgents = statusFilter === "all"
    ? agents
    : agents.filter(a => a.status === statusFilter)

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Agents</h1>
          <p className="text-[13px] text-text-secondary">{agents.length} agents configured</p>
        </div>
        <Link href="/workflows" className="flex items-center gap-2 rounded-md bg-cyan px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-cyan-muted">
          <Plus className="h-4 w-4" />
          New Agent
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {["all", "running", "idle", "paused", "error"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[11px] font-medium capitalize transition-colors",
                statusFilter === s
                  ? "bg-surface-3 text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-surface-1 p-0.5">
          <button
            onClick={() => setView("table")}
            className={cn(
              "rounded p-1.5 transition-colors",
              view === "table" ? "bg-surface-3 text-text-primary" : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("card")}
            className={cn(
              "rounded p-1.5 transition-colors",
              view === "card" ? "bg-surface-3 text-text-primary" : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" ? (
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-1">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Status</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Agent</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Role</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Apps</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Actions/wk</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Cost/mo</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Last Active</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="group transition-colors hover:bg-surface-3">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <StatusDot status={agent.status} />
                      <StatusLabel status={agent.status} />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/agents/${agent.id}`} className="text-[13px] font-medium text-text-primary hover:text-cyan">
                      {agent.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-text-secondary">{agent.role}</td>
                  <td className="px-3 py-3"><AppIconStack apps={agent.connectedApps} /></td>
                  <td className="px-3 py-3 text-right font-mono text-[13px] text-text-secondary">{agent.actionsThisWeek}</td>
                  <td className="px-3 py-3 text-right font-mono text-[13px] text-text-secondary">${agent.costThisMonth.toFixed(2)}</td>
                  <td className="px-3 py-3 text-right font-mono text-[11px] text-text-tertiary">{agent.lastActive}</td>
                  <td className="px-3 py-3">
                    <button className="rounded p-1 text-text-tertiary opacity-0 transition-all hover:bg-surface-2 hover:text-text-secondary group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-3 gap-3">
          {filteredAgents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4 transition-colors hover:bg-surface-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusDot status={agent.status} />
                  <span className="text-[13px] font-semibold text-text-primary">{agent.name}</span>
                </div>
                <Sparkline data={agent.sparklineData} />
              </div>
              <p className="text-[11px] text-text-tertiary">{agent.role}</p>
              <div className="flex items-center justify-between">
                <AppIconStack apps={agent.connectedApps} />
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-text-secondary">{agent.actionsThisWeek} actions</span>
                  <span className="font-mono text-[11px] text-text-tertiary">${agent.costThisMonth.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
                <StatusLabel status={agent.status} />
                <span className="font-mono text-[11px] text-text-tertiary">{agent.lastActive}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
