"use client"

import Link from "next/link"
import {
  Bot,
  ShieldCheck,
  Plug,
  Activity,
  Users,
  Bell,
  ArrowRight,
  ChevronRight,
  Check,
} from "lucide-react"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

const features = [
  {
    icon: Bot,
    title: "Agent Builder",
    description:
      "Create AI agents in minutes with pre-built templates or custom configurations. Assign roles, triggers, and connected tools — no code required.",
  },
  {
    icon: ShieldCheck,
    title: "Approval Workflows",
    description:
      "Define risk-based approval rules per agent and action type. Auto-execute safe actions and flag risky ones for human review before they go live.",
  },
  {
    icon: Plug,
    title: "Integration Hub",
    description:
      "Connect Gmail, Slack, HubSpot, GitHub, Stripe, Linear, Notion, and more with one-click OAuth. Your agents work where your team already works.",
  },
  {
    icon: Activity,
    title: "Activity Feed",
    description:
      "Every agent action logged with full reasoning traces, timestamps, and cost tracking. Export to CSV or query via API for compliance audits.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description:
      "Invite team members with granular permissions. Admins configure agents, operators approve actions, and viewers monitor — all within workspace isolation.",
  },
  {
    icon: Bell,
    title: "Realtime Notifications",
    description:
      "Get instant alerts for pending approvals, agent errors, and budget thresholds. Delivered via in-app notifications, email, or Slack webhooks.",
  },
]

const timeline = [
  {
    step: "01",
    title: "Connect",
    description: "Link your tools via OAuth in seconds. Gmail, Slack, HubSpot, Stripe, and 12+ more.",
  },
  {
    step: "02",
    title: "Configure",
    description: "Build agents with roles, triggers, and approval rules. Use templates or go custom.",
  },
  {
    step: "03",
    title: "Automate",
    description: "Agents execute tasks across your connected tools — following the guardrails you set.",
  },
  {
    step: "04",
    title: "Approve",
    description: "Review, edit, or skip any flagged action. Full context and reasoning in every request.",
  },
]

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      <div className="bg-grid" aria-hidden="true" />
      <div className="relative z-10">
        <PublicNav />

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-32 pb-16 text-center md:pt-40 md:pb-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-4 font-mono">
              Product
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
              Everything your ops team needs to automate with confidence
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-[1.7] text-text-secondary">
              From agent creation to approval workflows, OpsConductor gives you full visibility and control over every AI action your team runs.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="section-container pb-24">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-border-base hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-dim mb-5">
                  <feature.icon className="h-6 w-6 text-amber" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Timeline */}
        <section className="section-container-narrow py-24">
          <div className="text-center mb-16">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-3 font-mono">
              How it works
            </p>
            <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
              Four steps to full AI operations
            </h2>
          </div>

          <div className="relative">
            {/* Vertical connector line — desktop */}
            <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border-subtle hidden md:block" aria-hidden="true" />

            <div className="space-y-6 md:space-y-8">
              {timeline.map((item, i) => (
                <div key={item.step} className="relative flex gap-6 md:gap-8">
                  {/* Step badge */}
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber text-primary-foreground font-mono text-sm font-bold">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-bold text-text-primary mb-1">{item.title}</h3>
                    <p className="text-[14px] leading-relaxed text-text-secondary max-w-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-container-narrow pb-24">
          <div className="rounded-2xl border border-border-subtle bg-surface-1 p-12 text-center md:p-20">
            <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
              Ready to automate with confidence?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-text-secondary">
              Create your workspace, connect your tools, and deploy your first agent in under five minutes.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/signup" className="btn-primary btn-link flex items-center gap-2 rounded-[7px] px-8 py-3 text-[15px] font-semibold">
                Start for free <span className="arrow"><ArrowRight className="h-4 w-4" /></span>
              </Link>
              <Link href="/demo" className="btn-ghost flex items-center gap-2 px-6 py-3 text-[14px]">
                See it in action <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  )
}
