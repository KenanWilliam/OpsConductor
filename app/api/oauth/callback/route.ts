import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const TOKEN_ENDPOINTS: Record<string, string> = {
  gmail: 'https://oauth2.googleapis.com/token',
  google_calendar: 'https://oauth2.googleapis.com/token',
  google_sheets: 'https://oauth2.googleapis.com/token',
  slack: 'https://slack.com/api/oauth.v2.access',
  hubspot: 'https://api.hubapi.com/oauth/v1/token',
  github: 'https://github.com/login/oauth/access_token',
  salesforce: 'https://login.salesforce.com/services/oauth2/token',
  notion: 'https://api.notion.com/v1/oauth/token',
  linear: 'https://api.linear.app/oauth/token',
  jira: 'https://auth.atlassian.com/oauth/token',
  intercom: 'https://api.intercom.io/auth/eagle/token',
  airtable: 'https://airtable.com/oauth2/v1/token',
  calendly: 'https://auth.calendly.com/oauth/token',
}

const CLIENT_CREDENTIALS: Record<string, { id: string; secret: string }> = {
  gmail: { id: process.env.GOOGLE_CLIENT_ID!, secret: process.env.GOOGLE_CLIENT_SECRET! },
  google_calendar: { id: process.env.GOOGLE_CLIENT_ID!, secret: process.env.GOOGLE_CLIENT_SECRET! },
  google_sheets: { id: process.env.GOOGLE_CLIENT_ID!, secret: process.env.GOOGLE_CLIENT_SECRET! },
  slack: { id: process.env.SLACK_CLIENT_ID!, secret: process.env.SLACK_CLIENT_SECRET! },
  hubspot: { id: process.env.HUBSPOT_CLIENT_ID!, secret: process.env.HUBSPOT_CLIENT_SECRET! },
  github: { id: process.env.GITHUB_CLIENT_ID!, secret: process.env.GITHUB_CLIENT_SECRET! },
  salesforce: { id: process.env.SALESFORCE_CLIENT_ID!, secret: process.env.SALESFORCE_CLIENT_SECRET! },
  notion: { id: process.env.NOTION_CLIENT_ID!, secret: process.env.NOTION_CLIENT_SECRET! },
  linear: { id: process.env.LINEAR_CLIENT_ID!, secret: process.env.LINEAR_CLIENT_SECRET! },
  jira: { id: process.env.JIRA_CLIENT_ID!, secret: process.env.JIRA_CLIENT_SECRET! },
  intercom: { id: process.env.INTERCOM_CLIENT_ID!, secret: process.env.INTERCOM_CLIENT_SECRET! },
  airtable: { id: process.env.AIRTABLE_CLIENT_ID!, secret: process.env.AIRTABLE_CLIENT_SECRET! },
  calendly: { id: process.env.CALENDLY_CLIENT_ID!, secret: process.env.CALENDLY_CLIENT_SECRET! },
}

/* Providers that use Basic auth header for token exchange */
const BASIC_AUTH_PROVIDERS = new Set(['notion', 'airtable'])

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const provider = searchParams.get('provider')!
  const code = searchParams.get('code')!
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  if (!code || !provider) {
    return NextResponse.redirect(`${appUrl}/integrations?error=oauth_failed`)
  }

  const creds = CLIENT_CREDENTIALS[provider]
  const tokenEndpoint = TOKEN_ENDPOINTS[provider]

  if (!creds || !tokenEndpoint) {
    return NextResponse.redirect(`${appUrl}/integrations?error=oauth_failed&provider=${provider}`)
  }

  try {
    // Exchange code for tokens
    const useBasicAuth = BASIC_AUTH_PROVIDERS.has(provider)
    const tokenRes = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        // Notion and Airtable require Basic auth
        ...(useBasicAuth ? {
          'Authorization': `Basic ${Buffer.from(`${creds.id}:${creds.secret}`).toString('base64')}`
        } : {}),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${appUrl}/api/oauth/callback?provider=${provider}`,
        ...(useBasicAuth ? {} : { client_id: creds.id, client_secret: creds.secret }),
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token && !tokenData.authed_user?.access_token) {
      throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`)
    }

    const accessToken = tokenData.access_token ?? tokenData.authed_user?.access_token
    const refreshToken = tokenData.refresh_token ?? null
    const expiresIn = tokenData.expires_in ?? null
    const accountLabel = await getAccountLabel(provider, accessToken, tokenData)

    // Save to Supabase
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(`${appUrl}/login`)
    }

    const { data: workspaceId } = await supabase.rpc('my_workspace_id')

    await supabase.from('integrations').upsert({
      workspace_id: workspaceId,
      provider,
      status: 'active',
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: expiresIn
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
        : null,
      account_label: accountLabel,
      scopes: extractScopes(provider, tokenData),
      connected_by: user.id,
      connected_at: new Date().toISOString(),
      metadata: { raw: tokenData },
    }, { onConflict: 'workspace_id,provider' })

    return NextResponse.redirect(
      `${appUrl}/integrations?connected=${provider}`
    )
  } catch (err) {
    console.error(`OAuth callback error for ${provider}:`, err)
    return NextResponse.redirect(
      `${appUrl}/integrations?error=oauth_failed&provider=${provider}`
    )
  }
}

async function getAccountLabel(provider: string, token: string, data: Record<string, unknown>): Promise<string> {
  try {
    if (provider === 'gmail' || provider === 'google_calendar' || provider === 'google_sheets') {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const user = await res.json()
      return user.email ?? 'Connected account'
    }
    if (provider === 'slack') {
      const team = data.team as Record<string, unknown> | undefined
      const authedUser = data.authed_user as Record<string, unknown> | undefined
      return (team?.name as string) ?? (authedUser?.id as string) ?? 'Slack workspace'
    }
    if (provider === 'github') {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'OpsConductor' },
      })
      const user = await res.json()
      return user.login ?? 'GitHub account'
    }
    if (provider === 'notion') {
      const owner = data.owner as Record<string, unknown> | undefined
      const ownerUser = owner?.user as Record<string, unknown> | undefined
      return (ownerUser?.name as string) ?? (data.workspace_name as string) ?? 'Notion workspace'
    }
    if (provider === 'linear') {
      const res = await fetch('https://api.linear.app/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ viewer { name email } }' }),
      })
      const { data: d } = await res.json()
      return d?.viewer?.email ?? 'Linear account'
    }
    if (provider === 'salesforce') {
      const instanceUrl = data.instance_url as string | undefined
      if (instanceUrl) {
        const res = await fetch(`${instanceUrl}/services/oauth2/userinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const user = await res.json()
        return user.email ?? 'Salesforce account'
      }
    }
    if (provider === 'jira') {
      const res = await fetch('https://api.atlassian.com/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const user = await res.json()
      return user.email ?? user.name ?? 'Jira account'
    }
    if (provider === 'intercom') {
      return 'Intercom account'
    }
    if (provider === 'airtable') {
      const res = await fetch('https://api.airtable.com/v0/meta/whoami', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const user = await res.json()
      return user.email ?? 'Airtable account'
    }
    if (provider === 'calendly') {
      const res = await fetch('https://api.calendly.com/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const { resource } = await res.json()
      return resource?.email ?? 'Calendly account'
    }
  } catch {
    // Fall through to default
  }
  return `${provider} account`
}

function extractScopes(provider: string, data: Record<string, unknown>): string[] {
  if (provider === 'slack') return (data.scope as string)?.split(',') ?? []
  if (provider === 'github') return (data.scope as string)?.split(',') ?? []
  return []
}
