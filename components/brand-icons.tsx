"use client"

import { cn } from "@/lib/utils"

/* ── Brand Colors ── */
const brandColors: Record<string, string> = {
  gmail: "#EA4335",
  hubspot: "#FF7A59",
  stripe: "#635BFF",
  slack: "#611F69",
  notion: "currentColor",
  clearbit: "#3A5CCC",
  "google-calendar": "#4285F4",
  salesforce: "#00A1E0",
  outlook: "#0078D4",
  teams: "#6264A7",
  quickbooks: "#2CA01C",
  airtable: "#18BFFF",
  "google-sheets": "#0F9D58",
  calendly: "#006BFF",
  jira: "#0052CC",
  linear: "#5E6AD2",
}

/* ── Gmail ── */
export function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" fill="#F1F3F4" />
      <path d="M2 6l10 7 10-7" stroke="#EA4335" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 6v12h2V8.5l8 5.5 8-5.5V18h2V6l-10 7L2 6z" fill="#EA4335" fillOpacity="0.9" />
      <rect x="2" y="16" width="3" height="4" rx="0" fill="#4285F4" fillOpacity="0.8" />
      <rect x="19" y="16" width="3" height="4" rx="0" fill="#34A853" fillOpacity="0.8" />
    </svg>
  )
}

/* ── HubSpot ── */
export function HubSpotIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <path
        d="M17.5 8.5V6.8a1.5 1.5 0 10-1 0v1.7a3.5 3.5 0 00-2 2.3H9.2a3 3 0 10-.2 2h5.3a3.5 3.5 0 102.2-4.3zM7 14a1 1 0 110-2 1 1 0 010 2zm10 2a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
        fill="#FF7A59"
      />
    </svg>
  )
}

/* ── Stripe ── */
export function StripeIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#635BFF" />
      <path
        d="M11.2 9.6c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1V6.1A11 11 0 0012.7 5C9.8 5 8 6.5 8 8.8c0 3.6 5 3 5 4.6 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.4v3.7c1.7.7 3.3 1 5 1 3 0 5-1.5 5-3.8-.1-3.8-5.2-3.2-5.2-4.5z"
        fill="white"
      />
    </svg>
  )
}

/* ── Slack ── */
export function SlackIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <path d="M6.5 14.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm1 0a1.5 1.5 0 013 0V19a1.5 1.5 0 01-3 0v-4.5z" fill="#E01E5A" />
      <path d="M9.5 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 1a1.5 1.5 0 010 3H5a1.5 1.5 0 010-3h4.5z" fill="#36C5F0" />
      <path d="M17.5 9.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-1 0a1.5 1.5 0 01-3 0V5a1.5 1.5 0 013 0v4.5z" fill="#2EB67D" />
      <path d="M14.5 17.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-1a1.5 1.5 0 010-3H19a1.5 1.5 0 010 3h-4.5z" fill="#ECB22E" />
    </svg>
  )
}

/* ── Notion ── */
export function NotionIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <path
        d="M4.5 4.1l10.2-.7c1.3-.1 1.6 0 2.4.5l3.3 2.3c.5.4.7.5.7 1v12.3c0 .8-.3 1.3-1.3 1.4l-12 .7c-.8 0-1.1-.1-1.5-.5L3.4 18c-.5-.6-.7-1-.7-1.7V5.5c0-.8.3-1.3 1.3-1.4h.5z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M10 8.5v9M14 8l-6 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/* ── Clearbit ── */
export function ClearbitIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1" fill="#3A5CCC" />
      <rect x="13" y="3" width="8" height="8" rx="1" fill="#3A5CCC" fillOpacity="0.5" />
      <rect x="3" y="13" width="8" height="8" rx="1" fill="#3A5CCC" fillOpacity="0.5" />
      <rect x="13" y="13" width="8" height="8" rx="1" fill="#3A5CCC" fillOpacity="0.3" />
    </svg>
  )
}

/* ── Google Calendar ── */
export function GoogleCalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#FFFFFF" stroke="#4285F4" strokeWidth="1.5" />
      <rect x="3" y="5" width="18" height="4" rx="2" fill="#4285F4" />
      <line x1="8" y1="3" x2="8" y2="7" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="3" x2="16" y2="7" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" />
      <text x="12" y="17" textAnchor="middle" fill="#4285F4" fontSize="7" fontWeight="bold" fontFamily="sans-serif">31</text>
    </svg>
  )
}

/* ── Salesforce ── */
export function SalesforceIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <path
        d="M10 6.5a4 4 0 016.8 1A3.5 3.5 0 0120 11a3.5 3.5 0 01-2.7 3.4 3 3 0 01-4.6 2A3.5 3.5 0 018 18a3.5 3.5 0 01-3.4-2.6A3 3 0 013 12.5a3 3 0 012.1-2.8A4 4 0 0110 6.5z"
        fill="#00A1E0"
      />
    </svg>
  )
}

/* ── Microsoft Outlook ── */
export function OutlookIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="3" width="14" height="18" rx="2" fill="#0078D4" fillOpacity="0.2" />
      <rect x="2" y="5" width="12" height="14" rx="2" fill="#0078D4" />
      <ellipse cx="8" cy="12" rx="3" ry="3.5" fill="none" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

/* ── Microsoft Teams ── */
export function TeamsIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="14" height="14" rx="2" fill="#6264A7" />
      <text x="10" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">T</text>
      <circle cx="19" cy="8" r="3" fill="#6264A7" fillOpacity="0.6" />
    </svg>
  )
}

/* ── QuickBooks ── */
export function QuickBooksIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#2CA01C" />
      <path d="M8 9v6M10 8h-1a2 2 0 000 4h1M16 15V9M14 16h1a2 2 0 000-4h-1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── Airtable ── */
export function AirtableIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <path d="M11.4 3.5L3 7l8.4 3.5c.4.2.8.2 1.2 0L21 7l-8.4-3.5a1.2 1.2 0 00-1.2 0z" fill="#FCB400" />
      <path d="M12.6 12.5L3 8.5V17l9 4 .6-8.5z" fill="#18BFFF" />
      <path d="M11.4 12.5L21 8.5V17l-9 4-.6-8.5z" fill="#F82B60" />
    </svg>
  )
}

/* ── Google Sheets ── */
export function GoogleSheetsIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" fill="#0F9D58" />
      <rect x="7" y="8" width="10" height="10" rx="1" fill="white" />
      <line x1="12" y1="8" x2="12" y2="18" stroke="#0F9D58" strokeWidth="0.8" />
      <line x1="7" y1="11" x2="17" y2="11" stroke="#0F9D58" strokeWidth="0.8" />
      <line x1="7" y1="14.5" x2="17" y2="14.5" stroke="#0F9D58" strokeWidth="0.8" />
    </svg>
  )
}

/* ── Calendly ── */
export function CalendlyIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#006BFF" strokeWidth="1.5" />
      <path d="M12 7v5l3.5 2" stroke="#006BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Jira ── */
export function JiraIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 12l10 10 10-10L12 2zm0 3l7 7-7 7-7-7 7-7z" fill="#0052CC" />
      <path d="M12 8l4 4-4 4-4-4 4-4z" fill="#2684FF" />
    </svg>
  )
}

/* ── Linear ── */
export function LinearIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none">
      <path
        d="M3.4 17.8A10 10 0 016.2 20.6l11-11A10 10 0 003.4 17.8z"
        fill="#5E6AD2"
      />
      <path
        d="M4.7 14A10 10 0 0110 4.7l7.9 7.9A10 10 0 0112 19.3L4.7 14z"
        fill="#5E6AD2"
        fillOpacity="0.7"
      />
    </svg>
  )
}

/* ── Icon Map — resolves brand name to component ── */
const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Gmail: GmailIcon,
  HubSpot: HubSpotIcon,
  Stripe: StripeIcon,
  Slack: SlackIcon,
  Notion: NotionIcon,
  Clearbit: ClearbitIcon,
  "Google Calendar": GoogleCalendarIcon,
  Salesforce: SalesforceIcon,
  Outlook: OutlookIcon,
  Teams: TeamsIcon,
  QuickBooks: QuickBooksIcon,
  Airtable: AirtableIcon,
  "Google Sheets": GoogleSheetsIcon,
  Calendly: CalendlyIcon,
  Jira: JiraIcon,
  Linear: LinearIcon,
}

export function BrandIcon({
  name,
  className,
  fallback,
}: {
  name: string
  className?: string
  fallback?: React.ReactNode
}) {
  const Icon = iconComponents[name]
  if (Icon) return <Icon className={className} />
  if (fallback) return <>{fallback}</>
  // Fallback: colored initial letter
  const color = brandColors[name.toLowerCase().replace(/\s+/g, "-")] || "#666"
  return (
    <div
      className={cn("flex items-center justify-center rounded text-[10px] font-bold text-white", className)}
      style={{ backgroundColor: color, width: "1em", height: "1em" }}
    >
      {name[0]}
    </div>
  )
}

export { iconComponents, brandColors }
