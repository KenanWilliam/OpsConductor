"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { useRealtimeAgents } from "@/lib/hooks/use-realtime"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import { IntegrationLogo } from "@/components/integration-logo"
import { AgentStatusDot } from "@/components/agent-status-dot"
import { RiskBadge } from "@/components/risk-badge"
import { TimeAgo } from "@/components/time-ago"
import { JsonViewer } from "@/components/json-viewer"
import type { DbAgent, AgentRun, DbEvent } from "@/lib/types"
type Agent = DbAgent
type Event = DbEvent
import {
  ArrowLeft, Pause, Play, Trash2,
  Loader2, Settings, ListChecks, Activity, Zap,
} from "lucide-react"

const TABS = [
  { id: "overview", label: "Overview", icon: Zap },
  { id: "runs", label: "Runs", icon: ListChecks },
  { id: "events", label: "Events", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
] as const

type TabId = typeof TABS[number]["id"]

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: agentId } = require("react").use(params)
  const router = useRouter()
  const { workspace } = useWorkspace()
  const supabase = createClient()

  const [agent, setAgent] = useState<Agent | null>(null)
  const [runs, setRuns] = useState<AgentRun[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [tab, setTab] = useState<TabId>("overview")
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editRole, setEditRole] = useState("")
  const [editModel, setEditModel] = useState("")
  const [editApprovalMode, setEditApprovalMode] = useState<string>("always")
  const [editApprovalThreshold, setEditApprovalThreshold] = useState<string>("medium")
  const [editTriggerType, setEditTriggerType] = useState<string>("manual")
  const [editTriggerConfig, setEditTriggerConfig] = useState<Record<string, unknown>>({})
  const [editIntegrations, setEditIntegrations] = useState<string[]>([])
  const [editPrompt, setEditPrompt] = useState("")
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [activeIntegrations, setActiveIntegrations] = useState<{ id: string; provider: string }[]>([])

  const fetchAgent = useCallback(async () => {
    const { data } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()
    if (data) {
      setAgent(data as Agent)
      setEditName(data.name)
      setEditDescription(data.description || "")
      setEditRole(data.role || "")
      setEditModel(data.model || "claude-sonnet-4-6")
      setEditApprovalMode(data.approval_mode || "always")
      setEditApprovalThreshold(data.approval_threshold || "medium")
      setEditTriggerType(data.trigger_type || "manual")
      setEditTriggerConfig(data.trigger_config || {})
      setEditIntegrations((data.integrations as string[]) || [])
      setEditPrompt(data.system_prompt || "")
    }
    setLoading(false)
  }, [agentId, supabase])

  const fetchRuns = useCallback(async () => {
    const { data } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('agent_id', agentId)
      .order('started_at', { ascending: false })
      .limit(50)
    if (data) setRuns(data as AgentRun[])
  }, [agentId, supabase])

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setEvents(data as Event[])
  }, [agentId, supabase])

  useEffect(() => {
    fetchAgent()
    fetchRuns()
    fetchEvents()
  }, [fetchAgent, fetchRuns, fetchEvents])

  // Fetch active integrations for multi-select in settings
  useEffect(() => {
    if (!workspace?.id) return
    supabase
      .from('integrations_safe')
      .select('id, provider')
      .eq('status', 'active')
      .then(({ data }) => { if (data) setActiveIntegrations(data) })
  }, [workspace?.id, supabase])

  useRealtimeAgents(workspace?.id, () => fetchAgent())

  async function runNow() {
    if (!agent || !workspace) return
    setActing(true)
    const { error } = await supabase.from('agent_runs').insert({
      agent_id: agent.id,
      workspace_id: workspace.id,
      status: 'running',
      triggered_by: 'manual',
      started_at: new Date().toISOString(),
    })
    if (!error) {
      await supabase.from('agents').update({ status: 'running', last_run_at: new Date().toISOString() }).eq('id', agent.id)
      toastSuccess(`${agent.name} started`)
      fetchAgent()
      fetchRuns()
    } else toastError(error)
    setActing(false)
  }

  async function togglePause() {
    if (!agent) return
    setActing(true)
    const next = agent.status === 'paused' ? 'idle' : 'paused'
    const { error } = await supabase.from('agents').update({ status: next }).eq('id', agent.id)
    if (!error) {
      toastSuccess(`${agent.name} ${next === 'paused' ? 'paused' : 'resumed'}`)
      fetchAgent()
    } else toastError(error)
    setActing(false)
  }

  async function archiveAgent() {
    if (!agent) return
    if (!confirm('Archive this agent? This cannot be undone.')) return
    setActing(true)
    const { error } = await supabase.from('agents').update({ status: 'archived' }).eq('id', agent.id)
    if (!error) {
      toastSuccess(`${agent.name} archived`)
      router.push('/agents')
    } else toastError(error)
    setActing(false)
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault()
    if (!agent) return
    setSettingsSaving(true)
    const { error } = await supabase.from('agents').update({
      name: editName.trim(),
      description: editDescription.trim() || null,
      role: editRole.trim() || null,
      model: editModel,
      trigger_type: editTriggerType,
      trigger_config: Object.keys(editTriggerConfig).length > 0 ? editTriggerConfig : null,
      approval_mode: editApprovalMode,
      approval_threshold: editApprovalMode === 'risk_above' ? editApprovalThreshold : null,
      integrations: editIntegrations.length > 0 ? editIntegrations : null,
      system_prompt: editPrompt.trim() || null,
    }).eq('id', agent.id)
    setSettingsSaving(false)
    if (!error) {
      toastSuccess('Agent settings saved')
      fetchAgent()
    } else toastError(error)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
    </div>
  )
  if (!agent) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <p className="text-text-secondary">Agent not found</p>
      <Link href="/agents" className="text-amber text-sm hover:underline">Back to Agents</Link>
    </div>
  )

  const totalRuns = runs.length
  const successRuns = runs.filter(r => r.status === 'success').length
  const successRate = totalRuns > 0 ? Math.round((successRuns / totalRuns) * 100) : 0

  return (
    <div className="flex flex-col gap-5 p-6">
      <Link href="/agents" className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Agents
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <AgentStatusDot status={agent.status} />
          <div>
            <h1 className="text-xl font-semibold text-text-primary">{agent.name}</h1>
            <p className="text-[13px] text-text-secondary">{agent.description || agent.role || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {agent.status !== 'archived' && (
            <>
              <button onClick={runNow} disabled={acting || agent.status === 'running'}
                className="flex items-center gap-1.5 rounded-md bg-amber px-3 py-1.5 text-[12px] font-semibold text-primary-foreground hover:bg-amber-hover disabled:opacity-50 transition-colors">
                {acting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                Run Now
              </button>
              <button onClick={togglePause} disabled={acting}
                className="flex items-center gap-1.5 rounded-md border border-border-base bg-surface-1 px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors">
                {agent.status === 'paused' ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                {agent.status === 'paused' ? 'Resume' : 'Pause'}
              </button>
            </>
          )}
          <button onClick={archiveAgent} disabled={acting}
            className="flex items-center gap-1.5 rounded-md border border-border-base bg-surface-1 px-3 py-1.5 text-[12px] font-medium text-red-400 hover:text-red-300 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Archive
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border-subtle overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
              tab === t.id ? "border-amber text-amber" : "border-transparent text-text-tertiary hover:text-text-secondary"
            )}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-4">
            <div className="text-[11px] font-medium text-text-tertiary mb-1">Total Runs</div>
            <div className="text-2xl font-bold text-text-primary">{totalRuns}</div>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-4">
            <div className="text-[11px] font-medium text-text-tertiary mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-success">{successRate}%</div>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-4">
            <div className="text-[11px] font-medium text-text-tertiary mb-1">Last Run</div>
            <div className="text-[14px] font-medium text-text-primary">
              {agent.last_run_at ? <TimeAgo date={agent.last_run_at} /> : 'Never'}
            </div>
          </div>

          <div className="md:col-span-3 rounded-lg border border-border-subtle bg-surface-1 p-4 flex flex-col gap-3">
            <h2 className="text-[13px] font-semibold text-text-primary">Details</h2>
            <div className="grid gap-3 md:grid-cols-2 text-[13px]">
              <div className="flex justify-between"><span className="text-text-tertiary">Model</span><span className="text-text-primary font-mono text-[12px]">{agent.model}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Trigger</span><span className="text-text-primary capitalize">{agent.trigger_type}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Approval Mode</span><span className="text-text-primary capitalize">{(agent.approval_mode || 'always').replace('_', ' ')}</span></div>
              {agent.approval_mode === 'risk_above' && agent.approval_threshold && (
                <div className="flex justify-between"><span className="text-text-tertiary">Approval Threshold</span><span className="text-text-primary capitalize">{agent.approval_threshold}</span></div>
              )}
              <div className="flex justify-between"><span className="text-text-tertiary">Status</span><span className="text-text-primary capitalize">{agent.status}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Created</span><span className="text-text-primary"><TimeAgo date={agent.created_at} /></span></div>
              {agent.trigger_type === 'webhook' && (
                <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-text-tertiary">Webhook URL</span>
                  <input type="text" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/${agent.id}`}
                    className="h-8 w-full rounded-md border border-border-base bg-surface-2 px-3 font-mono text-[11px] text-text-tertiary focus:outline-none cursor-text" onClick={e => (e.target as HTMLInputElement).select()} />
                </div>
              )}
              {agent.integrations && (
                <div className="flex justify-between"><span className="text-text-tertiary">Integrations</span><span className="text-text-primary">{(agent.integrations as string[]).join(', ')}</span></div>
              )}
            </div>
          </div>

          <div className="md:col-span-3 rounded-lg border border-border-subtle bg-surface-1 p-4 flex flex-col gap-3">
            <h2 className="text-[13px] font-semibold text-text-primary">Recent Runs</h2>
            {runs.slice(0, 5).length === 0 ? (
              <p className="text-[13px] text-text-tertiary py-4 text-center">No runs yet</p>
            ) : (
              <div className="flex flex-col divide-y divide-border-subtle">
                {runs.slice(0, 5).map(run => (
                  <div key={run.id} className="flex items-center justify-between py-2 text-[13px]">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full",
                        run.status === 'success' ? "bg-success" : run.status === 'failed' ? "bg-red-400" : run.status === 'running' ? "bg-amber animate-pulse" : "bg-text-tertiary"
                      )} />
                      <span className="text-text-primary capitalize">{run.status}</span>
                      <span className="text-text-tertiary capitalize">• {run.triggered_by}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-tertiary">
                      {run.duration_ms && <span>{(run.duration_ms / 1000).toFixed(1)}s</span>}
                      <TimeAgo date={run.started_at} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {runs.length > 5 && (
              <button onClick={() => setTab('runs')} className="text-[12px] text-amber hover:underline self-start">View all {runs.length} runs →</button>
            )}
          </div>
        </div>
      )}

      {tab === 'runs' && (
        <div className="rounded-lg border border-border-subtle bg-surface-1 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-2">
                <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Status</th>
                <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Trigger</th>
                <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Duration</th>
                <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Actions</th>
                <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Cost</th>
                <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Started</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-text-tertiary">No runs recorded</td></tr>
              ) : runs.map(run => (
                <tr key={run.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-2/50 transition-colors">
                  <td className="py-2.5 px-4">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                      run.status === 'success' ? "bg-success/10 text-success" : run.status === 'failed' ? "bg-red-400/10 text-red-400" : run.status === 'running' ? "bg-amber/10 text-amber" : "bg-surface-2 text-text-tertiary"
                    )}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", run.status === 'success' ? "bg-success" : run.status === 'failed' ? "bg-red-400" : run.status === 'running' ? "bg-amber" : "bg-text-tertiary")} />
                      {run.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-text-secondary capitalize">{run.triggered_by}</td>
                  <td className="py-2.5 px-4 font-mono text-text-secondary">{run.duration_ms ? `${(run.duration_ms / 1000).toFixed(1)}s` : '—'}</td>
                  <td className="py-2.5 px-4 font-mono text-text-secondary">{run.action_count ?? '—'}</td>
                  <td className="py-2.5 px-4 font-mono text-text-secondary">{run.cost_usd ? `$${run.cost_usd.toFixed(4)}` : '—'}</td>
                  <td className="py-2.5 px-4 text-text-tertiary"><TimeAgo date={run.started_at} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'events' && (
        <div className="rounded-lg border border-border-subtle bg-surface-1 overflow-hidden">
          {events.length === 0 ? (
            <div className="py-12 text-center text-text-tertiary text-[13px]">No events recorded for this agent</div>
          ) : (
            <div className="flex flex-col divide-y divide-border-subtle">
              {events.map(evt => (
                <div key={evt.id} className="flex items-start justify-between gap-4 p-4 hover:bg-surface-2/50 transition-colors">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {evt.integration && <IntegrationLogo provider={evt.integration} size={16} />}
                      <span className="text-[13px] font-medium text-text-primary truncate">{evt.title || evt.type}</span>
                      {evt.risk_level && <RiskBadge level={evt.risk_level} />}
                    </div>
                    {evt.payload && <div className="mt-1"><JsonViewer data={evt.payload} /></div>}
                  </div>
                  <span className="text-[11px] text-text-tertiary shrink-0"><TimeAgo date={evt.created_at} /></span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <form onSubmit={saveSettings} className="flex flex-col gap-5 max-w-xl">
          <fieldset className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-1 p-4">
            <legend className="text-[13px] font-semibold text-text-primary px-1">Agent Settings</legend>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Description</label>
              <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={2} className="w-full rounded-md border border-border-base bg-surface-1 px-3 py-2 text-[13px] text-text-primary focus:border-amber focus:outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Role</label>
                <input type="text" value={editRole} onChange={e => setEditRole(e.target.value)} className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Model</label>
                <select value={editModel} onChange={e => setEditModel(e.target.value)} className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none">
                  <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
                  <option value="claude-opus-4-6">Claude Opus 4.6</option>
                  <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Approval Mode</label>
              <select value={editApprovalMode} onChange={e => setEditApprovalMode(e.target.value)} className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none">
                <option value="always">Always require</option>
                <option value="never">Never require</option>
                <option value="risk_above">Risk threshold</option>
              </select>
            </div>
            {editApprovalMode === 'risk_above' && (
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Approval Threshold</label>
                <select value={editApprovalThreshold} onChange={e => setEditApprovalThreshold(e.target.value)} className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Trigger Type</label>
              <select value={editTriggerType} onChange={e => { setEditTriggerType(e.target.value); setEditTriggerConfig({}) }} className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none">
                <option value="manual">Manual</option>
                <option value="schedule">Schedule (Cron)</option>
                <option value="webhook">Webhook</option>
                <option value="event">Event-based</option>
              </select>
            </div>
            {editTriggerType === 'schedule' && (
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Cron Expression</label>
                <input type="text" value={(editTriggerConfig as Record<string, string>).cron || ''} onChange={e => setEditTriggerConfig({ cron: e.target.value })}
                  className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 font-mono text-[13px] text-text-primary focus:border-amber focus:outline-none" placeholder="0 */6 * * *" />
              </div>
            )}
            {editTriggerType === 'webhook' && agent && (
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Webhook URL</label>
                <input type="text" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/${agent.id}`}
                  className="h-9 w-full rounded-md border border-border-base bg-surface-2 px-3 font-mono text-[12px] text-text-tertiary focus:outline-none cursor-text" onClick={e => (e.target as HTMLInputElement).select()} />
              </div>
            )}
            {activeIntegrations.length > 0 && (
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Integrations</label>
                <div className="flex flex-wrap gap-2">
                  {activeIntegrations.map(int => (
                    <button key={int.provider} type="button"
                      onClick={() => setEditIntegrations(prev =>
                        prev.includes(int.provider) ? prev.filter(p => p !== int.provider) : [...prev, int.provider]
                      )}
                      className={cn("flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors",
                        editIntegrations.includes(int.provider)
                          ? "border-amber bg-amber-dim text-amber"
                          : "border-border-subtle bg-surface-2 text-text-secondary hover:text-text-primary"
                      )}>
                      {int.provider}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">System Prompt</label>
              <textarea value={editPrompt} onChange={e => setEditPrompt(e.target.value)} rows={6} className="w-full rounded-md border border-border-base bg-surface-1 px-3 py-2 font-mono text-[12px] text-text-primary focus:border-amber focus:outline-none resize-none" />
            </div>
          </fieldset>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={settingsSaving || !editName.trim()} className="flex items-center gap-2 rounded-md bg-amber px-5 py-2 text-[13px] font-semibold text-primary-foreground hover:bg-amber-hover disabled:opacity-50 transition-colors">
              {settingsSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
