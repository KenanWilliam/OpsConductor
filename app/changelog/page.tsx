import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

const entries = [
  {
    version: "v0.4.0",
    date: "February 20, 2026",
    title: "Realtime approval notifications & expiry countdown",
    changes: [
      "Realtime push notifications for pending approval requests via in-app bell and email",
      "Approval expiry countdown — approvals auto-expire after a configurable window (default: 24 hours)",
      "Notification preferences per workspace member (in-app, email, or both)",
      "Improved approval detail view with full agent reasoning trace and cost estimate",
      "Fixed edge case where expired approvals were still actionable in the cockpit",
    ],
  },
  {
    version: "v0.3.0",
    date: "January 28, 2026",
    title: "OAuth integrations: Gmail, Slack, GitHub, HubSpot, Linear, Notion",
    changes: [
      "Added OAuth 2.0 integration support for Gmail, Slack, GitHub, HubSpot, Linear, and Notion",
      "One-click OAuth connect flow from the Integrations hub — no API keys required",
      "Token refresh and revocation handled automatically per provider",
      "Integration health monitoring with status indicators and error surfacing",
      "Scoped permissions per integration to limit agent access to only what is needed",
      "Added integration-specific icons and branding throughout the UI",
    ],
  },
  {
    version: "v0.2.0",
    date: "January 8, 2026",
    title: "Agent runs, manual trigger & activity feed with CSV export",
    changes: [
      "Agent run history with detailed action logs, timestamps, and duration tracking",
      "Manual trigger button — run any agent on demand from the agent detail page",
      "Activity feed with filterable event stream across all agents and actions",
      "CSV export for activity feed data — export filtered results for compliance and reporting",
      "Agent cost tracking per run with cumulative spend displayed on the cockpit",
      "Improved error handling and retry logic for failed agent actions",
    ],
  },
  {
    version: "v0.1.0",
    date: "December 15, 2025",
    title: "Initial release: Agent builder, approval workflows & workspace management",
    changes: [
      "Agent builder with name, description, role assignment, and connected tool configuration",
      "Approval workflow engine with risk-based routing (auto-execute, notify, or require approval)",
      "Workspace creation and management with invite-based team membership",
      "Cockpit dashboard with agent status overview, pending approvals, and live activity",
      "Role-based access control: Admin, Operator, and Viewer roles per workspace",
      "Dark mode UI with OpsConductor design system (Deep Navy + Signal Amber)",
      "Authentication via Supabase Auth with email/password and magic link support",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      <div className="bg-grid" aria-hidden="true" />
      <div className="relative z-10">
        <PublicNav />

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-32 pb-16 text-center md:pt-40 md:pb-20">
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-4 font-mono">
              Product
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
              Changelog
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-[1.7] text-text-secondary">
              New features, improvements, and fixes. Everything we ship, documented.
            </p>
          </div>
        </section>

        {/* Entries */}
        <section className="section-container-narrow pb-24">
          <div className="mx-auto max-w-2xl space-y-12">
            {entries.map((entry) => (
              <article key={entry.version} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center rounded-full bg-amber-dim px-3 py-1 text-[12px] font-bold text-amber font-mono">
                    {entry.version}
                  </span>
                  <span className="text-[13px] text-text-tertiary font-mono">{entry.date}</span>
                </div>
                <h2 className="text-lg font-bold text-text-primary mb-4">{entry.title}</h2>
                <ul className="space-y-2.5">
                  {entry.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      {change}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 h-px bg-border-subtle" />
              </article>
            ))}
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  )
}
