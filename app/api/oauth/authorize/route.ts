import { NextResponse } from 'next/server'

const OAUTH_CONFIGS: Record<string, {
  authUrl: string
  clientId: string
  scope: string
  extraParams?: Record<string, string>
}> = {
  gmail: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: process.env.GOOGLE_CLIENT_ID!,
    scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
    extraParams: { access_type: 'offline', prompt: 'consent' },
  },
  google_calendar: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: process.env.GOOGLE_CLIENT_ID!,
    scope: 'https://www.googleapis.com/auth/calendar',
    extraParams: { access_type: 'offline', prompt: 'consent' },
  },
  google_sheets: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: process.env.GOOGLE_CLIENT_ID!,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    extraParams: { access_type: 'offline', prompt: 'consent' },
  },
  slack: {
    authUrl: 'https://slack.com/oauth/v2/authorize',
    clientId: process.env.SLACK_CLIENT_ID!,
    scope: 'channels:read,chat:write,files:write,users:read',
  },
  hubspot: {
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    clientId: process.env.HUBSPOT_CLIENT_ID!,
    scope: 'crm.objects.contacts.read crm.objects.contacts.write crm.objects.deals.read crm.objects.deals.write',
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    clientId: process.env.GITHUB_CLIENT_ID!,
    scope: 'repo issues:write',
  },
  salesforce: {
    authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
    clientId: process.env.SALESFORCE_CLIENT_ID!,
    scope: 'api refresh_token',
  },
  notion: {
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    clientId: process.env.NOTION_CLIENT_ID!,
    scope: '',
    extraParams: { response_type: 'code', owner: 'user' },
  },
  linear: {
    authUrl: 'https://linear.app/oauth/authorize',
    clientId: process.env.LINEAR_CLIENT_ID!,
    scope: 'read write',
  },
  jira: {
    authUrl: 'https://auth.atlassian.com/authorize',
    clientId: process.env.JIRA_CLIENT_ID!,
    scope: 'read:jira-work write:jira-work offline_access',
    extraParams: { audience: 'api.atlassian.com', prompt: 'consent' },
  },
  intercom: {
    authUrl: 'https://app.intercom.com/oauth',
    clientId: process.env.INTERCOM_CLIENT_ID!,
    scope: '',
  },
  airtable: {
    authUrl: 'https://airtable.com/oauth2/v1/authorize',
    clientId: process.env.AIRTABLE_CLIENT_ID!,
    scope: 'data.records:read data.records:write',
  },
  calendly: {
    authUrl: 'https://auth.calendly.com/oauth/authorize',
    clientId: process.env.CALENDLY_CLIENT_ID!,
    scope: ''
    scope: 'repo issues:write',
  },
  salesforce: {
    authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
    clientId: process.env.SALESFORCE_CLIENT_ID!,
    scope: 'api refresh_token',
  },
  notion: {
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    clientId: process.env.NOTION_CLIENT_ID!,
    scope: '',
    extraParams: { response_type: 'code', owner: 'user' },
  },
  linear: {
    authUrl: 'https://linear.app/oauth/authorize',
    clientId: process.env.LINEAR_CLIENT_ID!,
    scope: 'read write',
  },
  jira: {
    authUrl: 'https://auth.atlassian.com/authorize',
    clientId: process.env.JIRA_CLIENT_ID!,
    scope: 'read:jira-work write:jira-work offline_access',
    extraParams: { audience: 'api.atlassian.com', prompt: 'consent' },
  },
  intercom: {
    authUrl: 'https://app.intercom.com/oauth',
    clientId: process.env.INTERCOM_CLIENT_ID!,
    scope: '',
  },
  airtable: {
    authUrl: 'https://airtable.com/oauth2/v1/authorize',
    clientId: process.env.AIRTABLE_CLIENT_ID!,
    scope: 'data.records:read data.records:write',
  },
  calendly: {
    authUrl: 'https://auth.calendly.com/oauth/authorize',
    clientId: process.env.CALENDLY_CLIENT_ID!,
    scope: '',
  },
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const provider = searchParams.get('provider')
  if (!provider || !OAUTH_CONFIGS[provider]) {
    return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
  }

  const config = OAUTH_CONFIGS[provider]
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback?provider=${provider}`,
    scope: config.scope,
    response_type: 'code',
    state: provider, // In production: sign this with a secret + store session
    ...config.extraParams,
  })

  return NextResponse.redirect(`${config.authUrl}?${params}`)
}
