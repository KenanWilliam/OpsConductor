"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import { IntegrationLogo } from "@/components/integration-logo"
import { TimeAgo } from "@/components/time-ago"
import type { DbIntegration } from "@/lib/types"
type Integration = DbIntegration
import {
  Plug, CheckCircle, Plus, Loader2, Trash2, ExternalLink,
} from "lucide-react"

const ALL_PROVIDERS = [
  { provider: "slack", label: "Slack", category: "Communication", description: "Send messages, create channels, post agent updates" },
  { provider: "gmail", label: "Gmail", category: "Communication", description: "Send and draft emails on behalf of agents" },
  { provider: "hubspot", label: "HubSpot", category: "CRM", description: "Manage contacts, deals, and sales pipelines" },
  { provider: "salesforce", label: "Salesforce", category: "CRM", description: "Sync leads, opportunities, and account data" },
  { provider: "stripe", label: "Stripe", category: "Billing", description: "Monitor payments, invoices, and subscriptions" },
  { provider: "notion", label: "Notion", category: "Productivity", description: "Create and update docs, databases, and wikis" },
  { provider: "linear", label: "Linear", category: "Engineering", description: "Create issues, track projects, sync sprints" },
  { provider: "github", label: "GitHub", category: "Engineering", description: "Manage repos, PRs, issues, and deployments" },
  { provider: "jira", label: "Jira", category: "Engineering", description: "Track tickets, epics, and sprint boards" },
  { provider: "calendly", label: "Calendly", category: "Productivity", description: "Book meetings, read availability, cancel events" },
  { provider: "intercom", label: "Intercom", category: "Support", description: "Chat with customers and manage conversations" },
  { provider: "google_calendar", label: "Google Calendar", category: "Productivity", description: "Schedule meetings and manage events" },
  { provider: "google_sheets", label: "Google Sheets", category: "Productivity", description: "Read and write spreadsheet data" },
  { provider: "airtable", label: "Airtable", category: "Productivity", description: "Manage structured data and automations" },
  { provider: "clearbit", label: "Clearbit", category: "Data", description: "Enrich contact data, company lookups" },
  { provider: "zapier", label: "Zapier", category: "Automation", description: "Trigger zaps, pass data to 5000+ apps" },
  { provider: "sendgrid", label: "SendGrid", category: "Communication", description: "Send transactional and marketing emails" },
]

type ViewFilter = "all" | "connected" | "available"

export default function IntegrationsPage() {
  const { workspace } = useWorkspace()
  const supabase = createClient()

  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewFilter>("all")
  const [connecting, setConnecting] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  const fetchIntegrations = useCallback(async () => {
    const { data } = await supabase
      .from('integrations_safe')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setIntegrations(data as Integration[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchIntegrations() }, [fetchIntegrations])

  const connectedProviders = new Set(integrations.filter(i => i.status === 'active').map(i => i.provider))

  async function connectProvider(provider: string) {
    if (!workspace?.id) return
    setConnecting(provider)

    // Simulated OAuth flow — inserts integration record
    const { error } = await supabase.from('integrations').insert({
      workspace_id: workspace.id,
      provider,
      status: 'active',
      account_label: `demo@${provider}.com`,
      scopes: ['read', 'write'],
      connected_by: workspace.id,
    })

    if (error) {
      toastError(error)
    } else {
      toastSuccess(`${provider} connected successfully`)
      fetchIntegrations()
    }
    setConnecting(null)
  }

  async function disconnectIntegration(id: string, provider: string) {
    if (!confirm(`Disconnect ${provider}? Agents using this integration will stop working.`)) return
    setDisconnecting(id)
    const { error } = await supabase.from('integrations').update({ status: 'disconnected' }).eq('id', id)
    if (error) {
      toastError(error)
    } else {
      toastSuccess(`${provider} disconnected`)
      fetchIntegrations()
    }
    setDisconnecting(null)
  }

  const filteredProviders = ALL_PROVIDERS.filter(p => {
    if (view === 'connected') return connectedProviders.has(p.provider)
    if (view === 'available') return !connectedProviders.has(p.provider)
    return true
  })

  const categories = [...new Set(filteredProviders.map(p => p.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-amber" />
            <h1 className="text-xl font-semibold text-text-primary">Integrations</h1>
          </div>
          <p className="text-[13px] text-text-secondary">
            {connectedProviders.size} connected · {ALL_PROVIDERS.length - connectedProviders.size} available
          </p>
        </div>
      </div>

      {/* View filters */}
      <div className="flex gap-1 border-b border-border-subtle">
        {([
          { id: 'all' as const, label: 'All' },
          { id: 'connected' as const, label: `Connected (${connectedProviders.size})` },
          { id: 'available' as const, label: 'Available' },
        ]).map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={cn("px-3 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors",
              view === t.id ? "border-amber text-amber" : "border-transparent text-text-tertiary hover:text-text-secondary"
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Integration grid by category */}
      {categories.map(category => {
        const providers = filteredProviders.filter(p => p.category === category)
        if (providers.length === 0) return null
        return (
          <div key={category}>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">{category}</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {providers.map(p => {
                const isConnected = connectedProviders.has(p.provider)
                const integration = integrations.find(i => i.provider === p.provider && i.status === 'active')
                const isConnecting = connecting === p.provider
                const isDisconnecting = disconnecting === integration?.id

                return (
                  <div key={p.provider}
                    className={cn("flex flex-col gap-3 rounded-lg border bg-surface-1 p-4 transition-colors",
                      isConnected ? "border-success/30" : "border-border-subtle hover:border-border-base"
                    )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <IntegrationLogo provider={p.provider} size={28} />
                        <div>
                          <div className="text-[13px] font-semibold text-text-primary">{p.label}</div>
                          {isConnected && (
                            <div className="flex items-center gap-1 text-[10px] text-success">
                              <CheckCircle className="h-3 w-3" /> Connected
                            </div>
                          )}
                        </div>
                      </div>
                      {isConnected && integration ? (
                        <button onClick={() => disconnectIntegration(integration.id, p.provider)} disabled={isDisconnecting}
                          className="flex items-center gap-1 rounded-md border border-border-base bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
                          {isDisconnecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                          Disconnect
                        </button>
                      ) : (
                        <button onClick={() => connectProvider(p.provider)} disabled={isConnecting}
                          className="flex items-center gap-1 rounded-md bg-amber px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-amber-hover transition-colors disabled:opacity-50">
                          {isConnecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                          Connect
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-text-tertiary">{p.description}</p>
                    {isConnected && integration && (
                      <div className="text-[10px] text-text-tertiary border-t border-border-subtle pt-2">
                        Connected <TimeAgo date={integration.connected_at || integration.last_used_at} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
