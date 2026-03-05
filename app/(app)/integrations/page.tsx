"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import { IntegrationLogo } from "@/components/integration-logo"
import { TimeAgo } from "@/components/time-ago"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { EmptyState } from "@/components/empty-state"
import { ApiKeyModal } from "@/components/api-key-modal"
import type { DbIntegration } from "@/lib/types"
type Integration = DbIntegration
import {
  Plug, CheckCircle, Plus, Loader2, Trash2, ExternalLink, Key,
} from "lucide-react"

/* OAuth-capable providers that redirect to /api/oauth/authorize */
const OAUTH_PROVIDERS = new Set([
  'gmail', 'slack', 'hubspot', 'github', 'linear', 'notion',
  'google_calendar', 'google_sheets', 'salesforce', 'jira',
  'intercom', 'airtable', 'calendly',
])

/* Providers that use an API-key modal instead of OAuth */
const API_KEY_PROVIDERS = new Set(['stripe', 'sendgrid', 'clearbit', 'zapier'])

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

/** Wrapper with Suspense boundary for useSearchParams */
export default function IntegrationsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-amber" />
          <h1 className="text-xl font-semibold text-text-primary">Integrations</h1>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border-subtle bg-surface-1 p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-7 w-7 rounded-md bg-surface-3" />
                <div className="h-4 w-24 rounded bg-surface-3" />
              </div>
              <div className="h-3 w-3/4 rounded bg-surface-3 mb-2" />
              <div className="h-3 w-1/2 rounded bg-surface-3" />
            </div>
          ))}
        </div>
      </div>
    }>
      <IntegrationsContent />
    </Suspense>
  )
}

function IntegrationsContent() {
  const { workspace } = useWorkspace()
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewFilter>("all")
  const [connecting, setConnecting] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false)
  const [apiKeyProvider, setApiKeyProvider] = useState<string>("stripe")

  // Handle OAuth success / error query params
  useEffect(() => {
    const connected = searchParams.get('connected')
    const error = searchParams.get('error')
    if (connected) toastSuccess(`${connected} connected successfully`)
    if (error === 'oauth_failed') toastError('OAuth connection failed. Try again.')
  }, [searchParams])

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

    // OAuth providers → redirect to authorization endpoint
    if (OAUTH_PROVIDERS.has(provider)) {
      setConnecting(provider)
      window.location.href = `/api/oauth/authorize?provider=${provider}`
      return
    }

    // Stripe, SendGrid, Clearbit, Zapier → open API key modal
    if (API_KEY_PROVIDERS.has(provider)) {
      setApiKeyProvider(provider)
      setApiKeyModalOpen(true)
      return
    }

    // Fallback for providers without OAuth yet (demo connect)
    setConnecting(provider)
    const { error } = await supabase.from('integrations').upsert({
      workspace_id: workspace.id,
      provider,
      status: 'active',
      account_label: `demo@${provider}.com`,
      scopes: ['read', 'write'],
      connected_by: workspace.id,
      connected_at: new Date().toISOString(),
    }, {
      onConflict: 'workspace_id,provider',
    })

    if (error) {
      toastError(error)
    } else {
      toastSuccess(`${provider} connected successfully`)
      fetchIntegrations()
      await supabase.rpc('complete_setup_step', { p_step: 'integration_connected' })
    }
    setConnecting(null)
  }

  async function disconnectIntegration(id: string, provider: string) {
    if (!confirm(`Disconnect ${provider}? Agents using this integration will stop working.`)) return
    setDisconnecting(id)
    const { error } = await supabase.from('integrations').update({
      status: 'disconnected',
      disconnected_at: new Date().toISOString(),
      access_token: null,
      refresh_token: null,
    }).eq('id', id)
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
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-amber" />
          <h1 className="text-xl font-semibold text-text-primary">Integrations</h1>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border-subtle bg-surface-1 p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-7 w-7 rounded-md bg-surface-3" />
                <div className="h-4 w-24 rounded bg-surface-3" />
              </div>
              <div className="h-3 w-3/4 rounded bg-surface-3 mb-2" />
              <div className="h-3 w-1/2 rounded bg-surface-3" />
            </div>
          ))}
        </div>
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

      {/* Empty state when no integrations connected yet (on the connected tab) */}
      {view === 'connected' && connectedProviders.size === 0 && (
        <EmptyState
          icon={Plug}
          iconColor="text-amber"
          headline="No integrations connected"
          description="Connect your first tool to give agents access to your apps."
        />
      )}

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
                const isOAuth = OAUTH_PROVIDERS.has(p.provider)
                const isApiKey = API_KEY_PROVIDERS.has(p.provider)

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
                          {integration?.status === 'error' && integration.error_message && (
                            <div className="flex items-center gap-1 text-[10px] text-red-400" title={integration.error_message}>
                              Error: {integration.error_message.slice(0, 40)}{integration.error_message.length > 40 ? '…' : ''}
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
                          {isConnecting ? <Loader2 className="h-3 w-3 animate-spin" /> : isApiKey ? <Key className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                          {isApiKey ? 'Add Key' : 'Connect'}
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-text-tertiary">{p.description}</p>
                    {isConnected && integration && (
                      <div className="text-[10px] text-text-tertiary border-t border-border-subtle pt-2">
                        {integration.account_label && (
                          <span className="text-text-secondary">{integration.account_label} · </span>
                        )}
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

      {/* API Key Modal (Stripe, SendGrid, Clearbit, Zapier) */}
      <ApiKeyModal
        open={apiKeyModalOpen}
        provider={apiKeyProvider}
        onClose={() => setApiKeyModalOpen(false)}
        onConnected={() => {
          setApiKeyModalOpen(false)
          fetchIntegrations()
        }}
      />
    </div>
  )
}
