"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { AgentStatusDot } from "@/components/agent-status-dot"
import { TimeAgo } from "@/components/time-ago"
import { IntegrationLogo } from "@/components/integration-logo"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import { Play, Pause } from "lucide-react"
import type { DbAgent } from "@/lib/types"

export function AgentStatusPanel() {
  const { workspace } = useWorkspace()
  const [agents, setAgents] = useState<DbAgent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workspace?.id) return
    const supabase = createClient()

    async function fetchAgents() {
      const { data } = await supabase
        .from('agents')
        .select('*')
        .neq('status', 'archived')
        .order('status', { ascending: true })
        .order('last_run_at', { ascending: false })
      if (data) setAgents(data)
      setLoading(false)
    }
    fetchAgents()

    // Realtime agent status changes
    const channel = supabase
      .channel('agents-status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'agents',
        filter: `workspace_id=eq.${workspace.id}`,
      }, (payload) => {
        setAgents(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [workspace?.id])

  async function handleRunNow(agent: DbAgent) {
    const res = await fetch(`/api/agents/${agent.id}/run`, { method: 'POST' })
    if (res.ok) {
      toastSuccess(`Agent ${agent.name} started`)
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'running' as const } : a))
    } else {
      const err = await res.json()
      toastError(err.error || 'Failed to start agent')
    }
  }

  async function handlePause(agent: DbAgent) {
    const newStatus = agent.status === 'running' ? 'paused' : 'idle'
    const res = await fetch(`/api/agents/${agent.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toastSuccess(agent.status === 'running' ? `Agent ${agent.name} paused` : `Agent ${agent.name} resumed`)
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: newStatus as DbAgent['status'] } : a))
    }
  }

  if (loading) return <SkeletonLoader type="feed" />

  const activeAgents = agents.filter(a => ['running', 'idle', 'error', 'paused'].includes(a.status))

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
      <div className="border-b border-border-subtle px-3 py-2.5">
        <h3 className="text-[13px] font-semibold text-text-primary">Agent Status</h3>
      </div>
      <div className="space-y-0.5 p-1.5">
        {activeAgents.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-[13px] text-text-tertiary">No agents configured</div>
        ) : (
          activeAgents.map((agent) => (
            <div key={agent.id} className="flex flex-col gap-2 rounded-md p-2.5 transition-colors hover:bg-surface-3">
              <div className="flex items-center justify-between">
                <Link href={`/agents/${agent.id}`} className="flex items-center gap-2 hover:text-amber">
                  <AgentStatusDot status={agent.status} />
                  <span className="text-[13px] font-medium text-text-primary">{agent.name}</span>
                </Link>
                <div className="flex items-center gap-1">
                  {agent.status === 'running' ? (
                    <button onClick={() => handlePause(agent)} className="rounded p-1 text-text-tertiary hover:bg-surface-2 hover:text-warning" title="Pause">
                      <Pause className="h-3 w-3" />
                    </button>
                  ) : (
                    <button onClick={() => handleRunNow(agent)} className="rounded p-1 text-text-tertiary hover:bg-surface-2 hover:text-success" title="Run Now">
                      <Play className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-tertiary">{agent.role || 'Agent'}</span>
                <span className="font-mono text-[11px] text-text-tertiary"><TimeAgo timestamp={agent.last_run_at} /></span>
              </div>
              <div className="font-mono text-[10px] text-text-tertiary">
                {agent.run_count} runs · {agent.integrations?.length || 0} integrations
              </div>
              {agent.integrations && agent.integrations.length > 0 && (
                <div className="flex items-center gap-1">
                  {agent.integrations.slice(0, 4).map((int) => (
                    <div key={int} className="flex h-5 w-5 items-center justify-center rounded-full border border-border-subtle bg-surface-2">
                      <IntegrationLogo provider={int} size={12} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
