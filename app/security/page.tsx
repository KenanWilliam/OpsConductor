import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { Shield, Lock, KeyRound, Users, AlertTriangle } from "lucide-react"

const sections = [
  {
    icon: Lock,
    title: "Data Encryption",
    description:
      "All data transmitted between your browser and OpsConductor is encrypted using TLS 1.3. Data at rest is encrypted using AES-256 encryption via Supabase managed infrastructure. This includes account data, agent configurations, OAuth tokens, and activity logs.",
  },
  {
    icon: Shield,
    title: "Authentication",
    description:
      "OpsConductor uses Supabase Auth for user authentication. Sessions are managed via short-lived JWT tokens with automatic refresh. Passwords are hashed using bcrypt and are never stored in plaintext. Magic link and OAuth-based login flows are supported for passwordless access.",
  },
  {
    icon: KeyRound,
    title: "OAuth Token Storage",
    description:
      "OAuth tokens for connected integrations (Gmail, Slack, HubSpot, GitHub, Stripe, Linear, Notion) are stored in the database with row-level security (RLS) policies. Tokens are never exposed to the client-side application. Token refresh is handled server-side, and tokens are immediately deleted when an integration is disconnected.",
  },
  {
    icon: Users,
    title: "Access Control",
    description:
      "All database tables are protected by row-level security (RLS) policies. Workspace isolation ensures that users can only access data within their own workspace. Role-based access control (Admin, Operator, Viewer) restricts what actions each team member can perform. Cross-workspace data access is not possible by design.",
  },
  {
    icon: AlertTriangle,
    title: "Responsible Disclosure",
    description:
      "If you discover a security vulnerability in OpsConductor, we ask that you disclose it responsibly. Please report any security issues directly to security@opsconductor.io. Do not disclose vulnerabilities publicly until we have had a reasonable opportunity to address them. We commit to acknowledging reports within 48 hours and providing a timeline for resolution.",
  },
]

const badges = [
  { label: "SOC 2 In Progress", mono: true },
  { label: "TLS 1.3", mono: true },
  { label: "RLS Enforced", mono: true },
  { label: "No plaintext secrets", mono: true },
]

export default function SecurityPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      <div className="bg-grid" aria-hidden="true" />
      <div className="relative z-10">
        <PublicNav />

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-32 pb-16 text-center md:pt-40 md:pb-20">
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-4 font-mono">
              Security
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
              Security is core to how we build
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-[1.7] text-text-secondary">
              Every layer of OpsConductor is designed with security and data protection in mind — from encryption to access control to responsible disclosure.
            </p>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="section-container-narrow pb-16">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {badges.map((badge) => (
              <div key={badge.label} className="rounded-xl border border-border-subtle bg-surface-1 p-4 text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 mb-2">
                  <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[13px] font-semibold text-text-primary font-mono">{badge.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Sections */}
        <section className="section-container-narrow pb-24">
          <div className="mx-auto max-w-2xl space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-border-base">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-dim">
                    <section.icon className="h-5 w-5 text-amber" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary">{section.title}</h2>
                </div>
                <p className="text-[14px] leading-relaxed text-text-secondary">{section.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="section-container-narrow pb-24">
          <div className="rounded-2xl border border-border-subtle bg-surface-1 p-10 text-center">
            <h3 className="text-lg font-bold text-text-primary mb-2">Report a vulnerability</h3>
            <p className="text-[14px] text-text-secondary mb-5">
              Found a security issue? We take every report seriously and will respond within 48 hours.
            </p>
            <a
              href="mailto:security@opsconductor.io"
              className="btn-primary inline-flex items-center gap-2 rounded-[7px] px-6 py-2.5 text-[14px] font-semibold"
            >
              security@opsconductor.io
            </a>
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  )
}
