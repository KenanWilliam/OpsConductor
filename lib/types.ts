// Database types matching Supabase schema

export interface Workspace {
  id: string
  name: string
  slug: string
  plan: string
  events_quota: number
  events_used: number
  stripe_id: string | null
  setup_completed: boolean
  setup_steps_done: string[]
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  workspace_id: string
  full_name: string
  avatar_url: string | null
  role: 'owner' | 'admin' | 'member'
  onboarding_completed: boolean
  onboarding_step: number
  onboarding_dismissed: boolean
  created_at: string
  updated_at: string
}

export interface DbAgent {
  id: string
  workspace_id: string
  name: string
  description: string | null
  role: string | null
  status: 'idle' | 'running' | 'paused' | 'error' | 'archived'
  trigger_type: 'manual' | 'schedule' | 'webhook' | 'event'
  trigger_config: Record<string, unknown> | null
  approval_mode: 'always' | 'never' | 'risk_above'
  approval_threshold: 'low' | 'medium' | 'high' | 'critical' | null
  integrations: string[] | null
  model: string | null
  system_prompt: string | null
  webhook_secret: string | null
  run_count: number
  last_run_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface AgentRun {
  id: string
  agent_id: string
  workspace_id: string
  status: 'running' | 'completed' | 'success' | 'failed' | 'timeout' | 'cancelled'
  triggered_by: string | null
  started_at: string
  completed_at: string | null
  duration_ms: number | null
  action_count: number | null
  approval_count: number | null
  cost_usd: number | null
  error: string | null
  log: Record<string, unknown>[]
  metadata: Record<string, unknown> | null
}

export interface DbApproval {
  id: string
  workspace_id: string
  event_id: string | null
  agent_id: string | null
  run_id: string | null
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled'
  title: string
  description: string | null
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  draft_content: Record<string, unknown> | null
  context: Record<string, unknown> | null
  reviewed_by: string | null
  reviewed_at: string | null
  review_note: string | null
  edit_content: Record<string, unknown> | null
  expires_at: string | null
  created_at: string
  // Joined fields
  agent?: DbAgent
}

export interface DbEvent {
  id: string
  workspace_id: string
  agent_id: string | null
  run_id: string | null
  type: string | null
  status: string | null
  title: string
  description: string | null
  target_type: string | null
  target_id: string | null
  target_name: string | null
  integration: string | null
  risk_level: string | null
  payload: Record<string, unknown> | null
  cost_usd: number | null
  created_at: string
  // Joined fields
  agent?: Pick<DbAgent, 'id' | 'name' | 'role'>
}

export interface DbIntegration {
  id: string
  workspace_id: string
  provider: string
  status: 'active' | 'disconnected' | 'error' | 'expired' | 'pending'
  provider_user_id: string | null
  provider_email: string | null
  provider_workspace: string | null
  account_label: string | null
  scopes: string[] | null
  access_token: string | null
  refresh_token: string | null
  token_expires_at: string | null
  error_message: string | null
  last_used_at: string | null
  last_synced_at: string | null
  metadata: Record<string, unknown> | null
  connected_by: string | null
  connected_at: string | null
  disconnected_at: string | null
  created_at: string
  updated_at: string
}

export interface DbNotification {
  id: string
  workspace_id: string
  profile_id: string | null
  type: string | null
  title: string
  body: string | null
  link: string | null
  read: boolean
  related_id: string | null
  created_at: string
}

export interface DbAuditLog {
  id: string
  workspace_id: string
  actor_id: string | null
  action: string
  table_name: string | null
  record_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  created_at: string
  // Joined
  actor?: Pick<Profile, 'id' | 'full_name'>
}

export interface WorkspaceStats {
  // New 5-metric schema from workspace_stats() RPC
  total_agents: number
  active_runs: number
  pending_approvals: number
  events_today: number
  integrations_connected: number
  // Legacy fields (backward compatibility)
  agents_total: number
  agents_running: number
  events_this_week: number
  cost_this_week: number
  events_quota: number
  events_used: number
}

// Integration catalog for the integrations page
export interface IntegrationCatalogItem {
  provider: string
  logoUrl: string
  description: string
  defaultScopes: string[]
}

export const INTEGRATION_CATALOG: IntegrationCatalogItem[] = [
  { provider: 'Gmail', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg', description: 'Send emails, read inbox, create drafts', defaultScopes: ['gmail.send', 'gmail.readonly'] },
  { provider: 'HubSpot', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg', description: 'Create/update contacts, deals, notes, tasks', defaultScopes: ['crm.objects.contacts.write', 'crm.objects.deals.write'] },
  { provider: 'Stripe', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg', description: 'Retry payments, issue refunds, create coupons', defaultScopes: ['payments.read', 'payments.write'] },
  { provider: 'Slack', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg', description: 'Send messages, create channels, post alerts', defaultScopes: ['chat:write', 'channels:manage'] },
  { provider: 'Notion', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png', description: 'Create/update pages, databases, generate reports', defaultScopes: ['read_content', 'insert_content'] },
  { provider: 'Calendly', logoUrl: 'https://asset.brandfetch.io/idZDOWkDCh/idFbHPL8e2.png', description: 'Book meetings, read availability, cancel events', defaultScopes: ['scheduling.read', 'scheduling.write'] },
  { provider: 'Clearbit', logoUrl: 'https://asset.brandfetch.io/idcafd_YBz/id0BDi_ypk.png', description: 'Enrich contact data, company lookups', defaultScopes: ['enrichment.read'] },
  { provider: 'Salesforce', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg', description: 'Manage leads, opportunities, contacts', defaultScopes: ['api', 'full'] },
  { provider: 'GitHub', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg', description: 'Create issues, PRs, review code, manage repos', defaultScopes: ['repo', 'issues'] },
  { provider: 'Linear', logoUrl: 'https://asset.brandfetch.io/idxqq0Yqz1/idYRkCxSOJ.svg', description: 'Create issues, update status, manage sprints', defaultScopes: ['issues:create', 'issues:write'] },
  { provider: 'Jira', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Jira_Logo.svg', description: 'Create tickets, update status, assign issues', defaultScopes: ['read:jira-work', 'write:jira-work'] },
  { provider: 'Intercom', logoUrl: 'https://asset.brandfetch.io/idvCB3RVNP/idLtpHFt5k.png', description: 'Send messages, close conversations, tag users', defaultScopes: ['conversations.read', 'conversations.write'] },
  { provider: 'Google Sheets', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg', description: 'Read/write data, generate reports', defaultScopes: ['spreadsheets'] },
  { provider: 'Airtable', logoUrl: 'https://asset.brandfetch.io/idCHxH6eT6/idrdIqxijD.png', description: 'Create/update records, query bases', defaultScopes: ['data.records:read', 'data.records:write'] },
  { provider: 'Zapier', logoUrl: 'https://asset.brandfetch.io/idE4uvKVFV/idLkr_OoM0.png', description: 'Trigger zaps, pass data to 5000+ apps', defaultScopes: ['zaps.write'] },
  { provider: 'SendGrid', logoUrl: 'https://asset.brandfetch.io/idJZYMY7Po/id2qBZWJPQ.png', description: 'Send transactional emails, manage lists', defaultScopes: ['mail.send'] },
]
