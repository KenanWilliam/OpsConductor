"use client"

import Link from "next/link"
import { useState } from "react"
import {
  LayoutDashboard,
  Bot,
  ShieldCheck,
  Zap,
  ArrowRight,
  Check,
  Mail,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText,
  Activity,
  Eye,
  Workflow,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

function LandingNav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#ffffff08] bg-[#080809]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo text-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-text-primary">OpsConductor</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#problem" className="text-[13px] text-text-secondary transition-colors hover:text-text-primary">Why</a>
          <a href="#how-it-works" className="text-[13px] text-text-secondary transition-colors hover:text-text-primary">How it works</a>
          <a href="#pricing" className="text-[13px] text-text-secondary transition-colors hover:text-text-primary">Pricing</a>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-indigo px-4 py-2 text-[13px] font-semibold text-white shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all hover:bg-indigo/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]"
          >
            Get started
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-text-secondary">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-4 border-t border-[#ffffff08] bg-[#080809] px-6 py-4 md:hidden">
          <a href="#problem" className="text-[13px] text-text-secondary">Why</a>
          <a href="#how-it-works" className="text-[13px] text-text-secondary">How it works</a>
          <a href="#pricing" className="text-[13px] text-text-secondary">Pricing</a>
          <Link href="/login" className="text-[13px] text-text-secondary">Log in</Link>
          <Link href="/signup" className="rounded-md bg-indigo px-4 py-2 text-center text-[13px] font-semibold text-white">Get started</Link>
        </div>
      )}
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-32 pb-20 text-center md:pt-40 md:pb-28">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffffff08] bg-surface-1 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-success status-running" />
          <span className="text-[11px] font-medium text-text-secondary">Now in beta</span>
        </div>
        <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-text-primary md:text-6xl lg:text-7xl">
          The command center for<br className="hidden md:block" /> AI-powered operations
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
          Monitor, approve, and orchestrate your AI agents from one cockpit.
          Your agents do the work. You keep control.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="flex items-center gap-2 rounded-md bg-indigo px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo/90 hover:shadow-[0_0_24px_rgba(99,102,241,0.4)]"
          >
            Start for free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/cockpit"
            className="flex items-center gap-2 rounded-md border border-border-base bg-surface-2 px-6 py-2.5 text-[13px] font-semibold text-text-secondary transition-colors hover:text-text-primary"
          >
            View demo <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Cockpit mockup */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-5xl">
        <div className="rounded-xl border border-border-subtle bg-surface-1 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-1.5 border-b border-border-subtle px-3 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#27272a]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#27272a]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#27272a]" />
            <span className="ml-3 font-mono text-[11px] text-text-tertiary">opsconductor.app/cockpit</span>
          </div>
          <div className="p-4">
            {/* Mini stat cards */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: "Actions This Week", value: "81", trend: "+12%", color: "text-success" },
                { label: "Revenue Influenced", value: "$14,280", trend: "+8%", color: "text-success" },
                { label: "Pending Approvals", value: "3", trend: "", color: "text-warning" },
                { label: "Agent Cost", value: "$4.89", trend: "", color: "text-text-tertiary" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border-subtle bg-surface-2 p-3">
                  <p className="text-[10px] text-text-tertiary">{stat.label}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-text-primary font-mono">{stat.value}</span>
                    {stat.trend && <span className={cn("text-[10px] font-medium", stat.color)}>{stat.trend}</span>}
                  </div>
                </div>
              ))}
            </div>
            {/* Mini activity lines */}
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3 rounded-lg border border-border-subtle bg-surface-2 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-text-primary">Live Activity</span>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-success status-running" />
                    <span className="text-[9px] text-text-tertiary">Real-time</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {[
                    { agent: "Lead Nurturer", action: "Checked for new trial signups", time: "2m ago" },
                    { agent: "Churn Rescue", action: "Detected MRR drop for Globex Inc", time: "12m ago" },
                    { agent: "Lead Nurturer", action: "Sent follow-up email", time: "1h ago" },
                  ].map((evt, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md bg-[#0f0f11] px-2 py-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-success" />
                      <span className="text-[10px] font-medium text-text-primary">{evt.agent}</span>
                      <span className="flex-1 truncate text-[10px] text-text-tertiary">{evt.action}</span>
                      <span className="font-mono text-[9px] text-text-tertiary">{evt.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 rounded-lg border border-border-subtle bg-surface-2 p-3">
                <span className="text-[10px] font-semibold text-text-primary">Agent Status</span>
                <div className="mt-2 space-y-1.5">
                  {[
                    { name: "Lead Nurturer", status: "running" },
                    { name: "Churn Rescue", status: "running" },
                    { name: "Invoice Chaser", status: "idle" },
                  ].map((a) => (
                    <div key={a.name} className="flex items-center gap-2 rounded-md bg-[#0f0f11] px-2 py-1.5">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        a.status === "running" ? "bg-success" : "bg-[#27272a]"
                      )} />
                      <span className="text-[10px] text-text-primary">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <section id="problem" className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
        96% of operators don&apos;t trust their AI agents
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary">
        You built AI agents to save time. But now you spend your time wondering what they did,
        whether they sent the right email, or if they just offered a 20% discount to the wrong customer.
        The problem isn&apos;t AI. The problem is control.
      </p>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Eye,
            title: "No visibility",
            description: "Your agents run in the dark. You find out what happened after the damage is done.",
          },
          {
            icon: ShieldCheck,
            title: "No guardrails",
            description: "Every action is auto-executed. No approval layer, no risk scoring, no way to say 'wait.'",
          },
          {
            icon: Activity,
            title: "No accountability",
            description: "You can't trace why an agent took an action. No reasoning logs, no audit trail.",
          },
        ].map((item) => (
          <div key={item.title} className="flex flex-col items-center gap-3 rounded-lg border border-border-subtle bg-surface-1 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10">
              <item.icon className="h-5 w-5 text-danger" />
            </div>
            <h3 className="text-[15px] font-semibold text-text-primary">{item.title}</h3>
            <p className="text-[13px] leading-relaxed text-text-tertiary">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: Workflow,
      title: "Connect your tools",
      description: "Link Gmail, HubSpot, Stripe, Slack, and more via OAuth. One click per integration.",
    },
    {
      step: "02",
      icon: Bot,
      title: "Deploy AI agents",
      description: "Choose from pre-built templates or build custom agents. Each agent gets a role, triggers, and connected apps.",
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Set your guardrails",
      description: "Define what runs automatically and what needs your approval. Per agent, per action type. Graduated trust.",
    },
    {
      step: "04",
      icon: LayoutDashboard,
      title: "Conduct from the cockpit",
      description: "Monitor everything from one command center. Approve, edit, or skip actions inline. Full reasoning logs for every decision.",
    },
  ]

  return (
    <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
          How OpsConductor works
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-[15px] text-text-secondary">
          From zero to full AI operations in under 10 minutes.
        </p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {steps.map((item) => (
          <div
            key={item.step}
            className="group flex gap-4 rounded-lg border border-border-subtle bg-surface-1 p-5 transition-colors hover:border-border-base"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-dim text-indigo">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] text-indigo">{item.step}</span>
              <h3 className="text-[15px] font-semibold text-text-primary">{item.title}</h3>
              <p className="text-[13px] leading-relaxed text-text-tertiary">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Try it out with limited agents",
      features: [
        "2 agents",
        "100 events/month",
        "3 integrations",
        "Manual approvals only",
        "7-day activity log",
      ],
      cta: "Start free",
      ctaStyle: "border border-border-base bg-surface-2 text-text-primary hover:bg-surface-3",
      highlight: false,
    },
    {
      name: "Operator",
      price: "$49",
      period: "/month",
      description: "For teams running real AI operations",
      features: [
        "10 agents",
        "Unlimited events",
        "Unlimited integrations",
        "Auto + manual approvals",
        "90-day activity log",
        "Priority support",
      ],
      cta: "Start free trial",
      ctaStyle: "bg-indigo text-white shadow-[0_0_12px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]",
      highlight: true,
    },
    {
      name: "Team",
      price: "$149",
      period: "/month",
      description: "For growing organizations",
      features: [
        "Unlimited agents",
        "Unlimited events",
        "Unlimited integrations",
        "Advanced approval rules",
        "365-day activity log",
        "5 team seats",
        "API access",
        "Audit log",
      ],
      cta: "Talk to us",
      ctaStyle: "border border-border-base bg-surface-2 text-text-primary hover:bg-surface-3",
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-[15px] text-text-secondary">
          Start free. Upgrade when your agents prove their value.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-xl border p-6 transition-colors",
              plan.highlight
                ? "border-indigo bg-surface-1 shadow-[0_0_32px_rgba(99,102,241,0.08)]"
                : "border-border-subtle bg-surface-1"
            )}
          >
            {plan.highlight && (
              <span className="mb-3 inline-flex self-start items-center rounded-full bg-indigo-dim px-2.5 py-0.5 text-[11px] font-medium text-indigo">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
              <span className="text-[13px] text-text-tertiary">{plan.period}</span>
            </div>
            <p className="mt-2 text-[13px] text-text-secondary">{plan.description}</p>
            <ul className="mt-6 flex flex-1 flex-col gap-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-[13px] text-text-secondary">
                  <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={cn(
                "mt-6 w-full rounded-md px-4 py-2.5 text-[13px] font-semibold transition-all",
                plan.ctaStyle
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function WaitlistSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-10 md:p-16">
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
          Ready to take control?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-[15px] text-text-secondary">
          Join the beta and be the first to orchestrate your AI agents with confidence.
        </p>
        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="you@company.com"
            className="h-10 flex-1 rounded-md border border-border-base bg-surface-2 px-3 text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-indigo focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] focus:outline-none"
          />
          <button className="h-10 rounded-md bg-indigo px-6 text-[13px] font-semibold text-white shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all hover:bg-indigo/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]">
            Join waitlist
          </button>
        </div>
        <p className="mt-4 text-[11px] text-text-tertiary">
          Free during beta. No credit card required.
        </p>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t border-border-subtle px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo text-white">
            <LayoutDashboard className="h-3.5 w-3.5" />
          </div>
          <span className="text-[13px] font-semibold text-text-secondary">OpsConductor</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#pricing" className="text-[13px] text-text-tertiary transition-colors hover:text-text-secondary">Pricing</a>
          <Link href="/cockpit" className="text-[13px] text-text-tertiary transition-colors hover:text-text-secondary">Demo</Link>
          <Link href="/login" className="text-[13px] text-text-tertiary transition-colors hover:text-text-secondary">Log in</Link>
        </div>
        <p className="text-[11px] text-text-tertiary">2026 OpsConductor. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <PricingSection />
      <WaitlistSection />
      <LandingFooter />
    </div>
  )
}
