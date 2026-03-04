"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import { ArrowLeft, Loader2 } from "lucide-react"

const MODEL_OPTIONS = [
  { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
  { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
]

export default function NewAgentPage() {
  const router = useRouter()
  const { workspace, user } = useWorkspace()
  const [saving, setSaving] = useState(false)
  const [activeIntegrations, setActiveIntegrations] = useState<{ id: string; provider: string }[]>([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [role, setRole] = useState("")
  const [model, setModel] = useState("claude-sonnet-4-6")
  const [triggerType, setTriggerType] = useState<"manual" | "schedule" | "webhook" | "event">("manual")
  const [triggerConfig, setTriggerConfig] = useState<Record<string, unknown>>({})
  const [approvalMode, setApprovalMode] = useState<"always" | "never" | "risk_above">("always")
  const [approvalThreshold, setApprovalThreshold] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [systemPrompt, setSystemPrompt] = useState("")

  useEffect(() => {
    if (!workspace?.id) return
    const supabase = createClient()
    supabase
      .from('integrations_safe')
      .select('id, provider')
      .eq('status', 'active')
      .then(({ data }) => { if (data) setActiveIntegrations(data) })
  }, [workspace?.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toastError("Name is required"); return }
    if (!workspace?.id || !user?.id) return

    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('agents')
      .insert({
        workspace_id: workspace.id,
        name: name.trim(),
        description: description.trim() || null,
        role: role.trim() || null,
        model,
        trigger_type: triggerType,
        trigger_config: Object.keys(triggerConfig).length > 0 ? triggerConfig : null,
        approval_mode: approvalMode,
        approval_threshold: approvalMode === 'risk_above' ? approvalThreshold : null,
        integrations: selectedIntegrations.length > 0 ? selectedIntegrations : null,
        system_prompt: systemPrompt.trim() || null,
        created_by: user.id,
      })
      .select()
      .single()

    setSaving(false)
    if (error) {
      toastError(error)
    } else {
      toastSuccess(`Agent ${name} created successfully`)
      router.push(`/agents/${data.id}`)
    }
  }

  return (
    <div className="flex flex-col gap-5 p-6 max-w-2xl">
      <Link href="/agents" className="flex items-center gap-1.5 text-[13px] text-text-tertiary transition-colors hover:text-text-secondary">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Agents
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-text-primary">Create Agent</h1>
        <p className="text-[13px] text-text-secondary">Configure a new AI agent for your workspace</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Info */}
        <fieldset className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-1 p-4">
          <legend className="text-[13px] font-semibold text-text-primary px-1">Basic Info</legend>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={100} required
              className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none" placeholder="e.g. Lead Qualifier" />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              className="w-full rounded-md border border-border-base bg-surface-1 px-3 py-2 text-[13px] text-text-primary focus:border-amber focus:outline-none resize-none" placeholder="What does this agent do?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Role</label>
              <input type="text" value={role} onChange={e => setRole(e.target.value)}
                className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none" placeholder="e.g. Revenue Recovery" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Model</label>
              <select value={model} onChange={e => setModel(e.target.value)}
                className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none">
                {MODEL_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Trigger Config */}
        <fieldset className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-1 p-4">
          <legend className="text-[13px] font-semibold text-text-primary px-1">Trigger</legend>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Trigger Type</label>
            <select value={triggerType} onChange={e => { setTriggerType(e.target.value as typeof triggerType); setTriggerConfig({}) }}
              className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none">
              <option value="manual">Manual</option>
              <option value="schedule">Schedule (Cron)</option>
              <option value="webhook">Webhook</option>
              <option value="event">Event-based</option>
            </select>
          </div>
          {triggerType === 'schedule' && (
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Cron Expression</label>
              <input type="text" value={(triggerConfig as Record<string, string>).cron || ''} onChange={e => setTriggerConfig({ cron: e.target.value })}
                className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 font-mono text-[13px] text-text-primary focus:border-amber focus:outline-none" placeholder="0 */6 * * *" />
              <p className="mt-1 text-[11px] text-text-tertiary">e.g. "0 9 * * 1-5" = weekdays at 9am</p>
            </div>
          )}
          {triggerType === 'webhook' && (
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Webhook URL</label>
              <input type="text" readOnly value={`https://opsconductor.kenanwilliam.dev/api/webhooks/[agent-id]`}
                className="h-9 w-full rounded-md border border-border-base bg-surface-2 px-3 font-mono text-[12px] text-text-tertiary focus:outline-none" />
              <p className="mt-1 text-[11px] text-text-tertiary">URL will be generated after creation</p>
            </div>
          )}
        </fieldset>

        {/* Approval Settings */}
        <fieldset data-tour="approval-mode-field" className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-1 p-4">
          <legend className="text-[13px] font-semibold text-text-primary px-1">Approval Settings</legend>
          <div className="flex flex-col gap-2">
            {[
              { value: 'always' as const, label: 'Always require approval' },
              { value: 'never' as const, label: 'Never require approval' },
              { value: 'risk_above' as const, label: 'Require above risk threshold' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="approval" value={opt.value} checked={approvalMode === opt.value}
                  onChange={() => setApprovalMode(opt.value)} className="accent-amber" />
                <span className="text-[13px] text-text-primary">{opt.label}</span>
              </label>
            ))}
          </div>
          {approvalMode === 'risk_above' && (
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Threshold</label>
              <select value={approvalThreshold} onChange={e => setApprovalThreshold(e.target.value as typeof approvalThreshold)}
                className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          )}
        </fieldset>

        {/* Integrations */}
        {activeIntegrations.length > 0 && (
          <fieldset className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4">
            <legend className="text-[13px] font-semibold text-text-primary px-1">Integrations</legend>
            <div className="flex flex-wrap gap-2">
              {activeIntegrations.map(int => (
                <button key={int.provider} type="button"
                  onClick={() => setSelectedIntegrations(prev =>
                    prev.includes(int.provider) ? prev.filter(p => p !== int.provider) : [...prev, int.provider]
                  )}
                  className={cn("flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors",
                    selectedIntegrations.includes(int.provider)
                      ? "border-amber bg-amber-dim text-amber"
                      : "border-border-subtle bg-surface-2 text-text-secondary hover:text-text-primary"
                  )}>
                  {int.provider}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* System Prompt */}
        <fieldset className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4">
          <legend className="text-[13px] font-semibold text-text-primary px-1">System Prompt</legend>
          <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={6} maxLength={16384}
            className="w-full rounded-md border border-border-base bg-surface-1 px-3 py-2 font-mono text-[12px] text-text-primary focus:border-amber focus:outline-none resize-none"
            placeholder={`You are a ${role || '[role]'} agent. Your job is to...`} />
          <div className="text-right text-[11px] text-text-tertiary">{systemPrompt.length} / 16,384</div>
        </fieldset>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving || !name.trim()}
            className="flex items-center gap-2 rounded-md bg-amber px-6 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-amber-hover disabled:opacity-50">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Agent
          </button>
          <Link href="/agents" className="text-[13px] text-text-tertiary hover:text-text-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
