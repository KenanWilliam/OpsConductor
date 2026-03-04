"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { AgentStatusDot, AgentStatusLabel } from "@/components/agent-status-dot"
import { IntegrationLogo } from "@/components/integration-logo"
import { TimeAgo } from "@/components/time-ago"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import { EmptyState } from "@/components/empty-state"
import {
  MoreHorizontal, Plus, LayoutGrid, List, Search, Play, Pause, Bot
} from "lucide-react"
import type { DbAgent } from "@/lib/types"

export default function AgentsPage() {
  const { workspace } = useWorkspace()
  const [agents, setAgents] = useState<DbAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"table" | "card">("table")
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!workspace?.id) return
    const supabase = createClient()

    async function fetchAgents() {
      const { data } = await supabase
        .from('agents')
        .select('*')
        .neq('status', 'archived')
        .order('created_at', { ascending: false })
      if (data) setAgents(data)
      setLoading(false)
    }
    fetchAgents()
  }, [workspace?.id])

  async function handleRunNow(agent: DbAgent) {
    const res = await fetch(`/api/agents/${agent.id}/run`, { method: 'POST' })
    if (res.ok) {
      toastSuccess(`Agent ${agent.name} started`)
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'running' as const, run_count: a.run_count + 1 } : a))
    } else {
      toastError('Failed to start agent')
    }
  }

  async function handleTogglePause(agent: DbAgent) {
    const newStatus = agent.status === 'running' ? 'paused' : 'idle'
    const res = await fetch(`/api/agents/${agent.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toastSuccess(agent.status === 'running' ? `${agent.name} paused` : `${agent.name} resumed`)
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: newStatus as DbAgent['status'] } : a))
    }
  }

  const filteredAgents = agents
    .filter(a => statusFilter === "all" || a.status === statusFilter)
    .filter(a => search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || (a.role || '').toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return <div className="p-6"><SkeletonLoader type="table" /></div>
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Agents</h1>
          <p className="text-[13px] text-text-secondary">{agents.length} agents configured</p>
        </div>
        <Link href="/agents/new" className="flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-amber-hover">
          <Plus className="h-4 w-4" />
          New Agent
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5">
            {["all", "running", "idle", "paused", "error"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("rounded-md px-2.5 py-1.5 text-[11px] font-medium capitalize transition-colors",
                  statusFilter === s ? "bg-surface-3 text-text-primary" : "text-text-tertiary hover:text-text-secondary"
                )}>
                {s}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-border-base bg-surface-1 pl-8 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-amber focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border-subtle bg-surface-1 p-0.5">
          <button onClick={() => setView("table")} className={cn("rounded p-1.5 transition-colors", view === "table" ? "bg-surface-3 text-text-primary" : "text-text-tertiary hover:text-text-secondary")}>
            <List className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setView("card")} className={cn("rounded p-1.5 transition-colors", view === "card" ? "bg-surface-3 text-text-primary" : "text-text-tertiary hover:text-text-secondary")}>
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <EmptyState icon={Bot} headline="No agents found" description={agents.length === 0 ? "Create your first agent to get started." : "No agents match your current filters."} />
      ) : view === "table" ? (
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-1">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Status</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Agent</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Role</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Approval</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Integrations</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Runs</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Last Run</th>
                <th className="w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="group transition-colors hover:bg-surface-3">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <AgentStatusDot status={agent.status} />
                      <AgentStatusLabel status={agent.status} />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/agents/${agent.id}`} className="text-[13px] font-medium text-text-primary hover:text-amber">
                      {agent.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-text-secondary">{agent.role || '—'}</td>
                  <td className="px-3 py-3">
                    <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-medium capitalize",
                      agent.approval_mode === 'always' ? "bg-warning/10 text-warning" :
                      agent.approval_mode === 'never' ? "bg-success/10 text-success" :
                      "bg-info/10 text-info"
                    )}>
                      {agent.approval_mode === 'risk_above' ? `> ${agent.approval_threshold}` : agent.approval_mode}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center -space-x-1.5">
                      {(agent.integrations || []).slice(0, 4).map((int) => (
                        <div key={int} className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-surface-2">
                          <IntegrationLogo provider={int} size={14} />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-[13px] text-text-secondary">{agent.run_count}</td>
                  <td className="px-3 py-3 text-right font-mono text-[11px] text-text-tertiary"><TimeAgo timestamp={agent.last_run_at} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {agent.status === 'running' ? (
                        <button onClick={() => handleTogglePause(agent)} className="rounded p-1 text-text-tertiary hover:bg-surface-2 hover:text-warning" title="Pause">
                          <Pause className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button onClick={() => handleRunNow(agent)} className="rounded p-1 text-text-tertiary hover:bg-surface-2 hover:text-success" title="Run Now">
                          <Play className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <Link href={`/agents/${agent.id}`} className="rounded p-1 text-text-tertiary hover:bg-surface-2 hover:text-text-secondary">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filteredAgents.map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.id}`}
              className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4 transition-colors hover:bg-surface-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AgentStatusDot status={agent.status} />
                  <span className="text-[13px] font-semibold text-text-primary">{agent.name}</span>
                </div>
              </div>
              <p className="text-[11px] text-text-tertiary">{agent.role || 'Agent'}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center -space-x-1.5">
                  {(agent.integrations || []).slice(0, 4).map((int) => (
                    <div key={int} className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-surface-2">
                      <IntegrationLogo provider={int} size={14} />
                    </div>
                  ))}
                </div>
                <span className="font-mono text-[11px] text-text-secondary">{agent.run_count} runs</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
                <AgentStatusLabel status={agent.status} />
                <span className="font-mono text-[11px] text-text-tertiary"><TimeAgo timestamp={agent.last_run_at} /></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
