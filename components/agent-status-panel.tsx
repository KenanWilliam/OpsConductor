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
import { Play, Pause, Bot } from "lucide-react"
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
    if (!workspace) return
    const supabase = createClient()

    // Optimistic update
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'running' as const } : a))

    const { error } = await supabase.from('agent_runs').insert({
      agent_id: agent.id,
      workspace_id: workspace.id,
      status: 'running',
      triggered_by: 'manual',
      started_at: new Date().toISOString(),
    })

    if (error) {
      // Rollback optimistic update
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: agent.status } : a))
      if (error.code === 'P0040') {
        toastError('Agent is not runnable (archived or error state).')
      } else if (error.code === 'P0001') {
        toastError('Monthly event quota reached. Upgrade your plan.')
      } else {
        toastError(error)
      }
      return
    }

    await supabase.from('agents').update({ status: 'running', last_run_at: new Date().toISOString() }).eq('id', agent.id)
    toastSuccess(`Agent ${agent.name} started`)
  }

  async function handlePause(agent: DbAgent) {
    const newStatus = agent.status === 'paused' ? 'idle' : 'paused'
    const supabase = createClient()
    const { error } = await supabase.from('agents').update({ status: newStatus }).eq('id', agent.id)
    if (!error) {
      toastSuccess(agent.status === 'paused' ? `Agent ${agent.name} resumed` : `Agent ${agent.name} paused`)
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: newStatus as DbAgent['status'] } : a))
    } else {
      toastError(error)
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
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Bot className="h-8 w-8 text-text-tertiary" />
            <p className="text-[13px] font-medium text-text-primary">No agents yet</p>
            <p className="text-[11px] text-text-secondary max-w-[200px]">Create your first agent to start automating.</p>
            <Link href="/agents/new" className="mt-1 text-[12px] font-medium text-amber hover:text-amber-hover transition-colors">Create agent →</Link>
          </div>
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
