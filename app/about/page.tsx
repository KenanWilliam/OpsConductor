import Link from "next/link"
import { ArrowRight, Plug, Bot, ShieldCheck, BarChart3, Code2, Megaphone } from "lucide-react"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

const steps = [
  {
    step: "01",
    title: "Connect your tools",
    description: "Link Gmail, Slack, HubSpot, Stripe, GitHub, Linear, Notion, and more via one-click OAuth.",
  },
  {
    step: "02",
    title: "Deploy agents",
    description: "Build or choose from templates. Each agent gets a role, triggers, and connected apps.",
  },
  {
    step: "03",
    title: "Approve or let them run",
    description: "Set risk-based guardrails. Safe actions auto-execute. Risky ones wait for your call.",
  },
]

const audiences = [
  {
    icon: BarChart3,
    title: "RevOps",
    description:
      "Automate lead scoring, pipeline nudges, churn detection, and invoice follow-ups. Keep humans in the loop for discounts, escalations, and outbound campaigns.",
  },
  {
    icon: Code2,
    title: "DevOps",
    description:
      "Trigger deployments, monitor CI/CD pipelines, manage issue triage across GitHub and Linear. Approve infrastructure changes before they go live.",
  },
  {
    icon: Megaphone,
    title: "GTM Teams",
    description:
      "Coordinate outreach across email and Slack, enrich contact data, and automate reporting. Approval workflows ensure nothing goes out without a review.",
  },
]

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      <div className="bg-grid" aria-hidden="true" />
      <div className="relative z-10">
        <PublicNav />

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-32 pb-16 text-center md:pt-40 md:pb-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-4 font-mono">
              Company
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
              Built for teams that run on automation
            </h1>
          </div>
        </section>

        {/* Mission */}
        <section className="section-container-narrow pb-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold text-text-primary mb-4">Our mission</h2>
            <p className="text-[16px] leading-[1.8] text-text-secondary">
              We believe ops teams shouldn&rsquo;t babysit software. Agents handle the routine. Humans handle the judgment calls.
              OpsConductor is the control layer that makes that possible — giving teams full visibility, approval authority, and audit trails over every AI action.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="section-container-narrow pb-20">
          <div className="text-center mb-12">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-3 font-mono">
              How it works
            </p>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
              Three steps to AI operations
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="rounded-2xl border border-border-subtle bg-surface-1 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber text-primary-foreground font-mono text-sm font-bold mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-[14px] leading-relaxed text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="section-container-narrow pb-20">
          <div className="text-center mb-12">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-3 font-mono">
              Who it&rsquo;s for
            </p>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
              Built for teams across the stack
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-border-base hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-dim mb-5">
                  <a.icon className="h-6 w-6 text-amber" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{a.title}</h3>
                <p className="text-[14px] leading-relaxed text-text-secondary">{a.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section-container-narrow pb-24">
          <div className="rounded-2xl border border-border-subtle bg-surface-1 p-12 text-center md:p-20">
            <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
              Ready to automate?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-text-secondary">
              Create your workspace and deploy your first agent in under five minutes. No credit card required.
            </p>
            <div className="mt-8">
              <Link href="/signup" className="btn-primary btn-link inline-flex items-center gap-2 rounded-[7px] px-8 py-3 text-[15px] font-semibold">
                Start automating <span className="arrow"><ArrowRight className="h-4 w-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  )
}
