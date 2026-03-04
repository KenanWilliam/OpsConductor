"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  LayoutDashboard,
  Bot,
  ShieldCheck,
  Zap,
  ArrowRight,
  Check,
  Activity,
  Eye,
  Workflow,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { BackgroundLayers } from "@/components/background-layers"

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            target.classList.add("in-view")
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    el.querySelectorAll("[data-reveal]").forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])
  return ref
}

/* ── Smooth anchor scrolling ── */
function useSmoothAnchors() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!anchor) return
      e.preventDefault()
      const href = anchor.getAttribute("href")
      if (!href) return
      const target = document.querySelector(href)
      if (!target) return
      const nav = document.querySelector("nav")
      const navHeight = nav ? nav.offsetHeight : 64
      const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 24
      window.scrollTo({ top: targetY, behavior: "smooth" })
      history.pushState(null, "", href)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])
}

/* ── Staggered word animation — Cluely signature ── */
function AnimatedHeadline() {
  // "Every agent. / One cockpit. / You decide."
  const line1 = [
    { text: "Every", isAccent: false },
    { text: "agent.", isAccent: false },
  ]
  const line2 = [
    { text: "One", isAccent: false },
    { text: "cockpit.", isAccent: false },
  ]
  const line3 = [
    { text: "You", isAccent: false },
    { text: "decide.", isAccent: true },
  ]

  const allLines = [line1, line2, line3]
  let wordIndex = 0

  return (
    <h1 className="text-balance font-extrabold leading-[1.08] tracking-[-0.04em] text-text-primary" style={{ fontSize: "clamp(58px, 8vw, 96px)" }}>
      {allLines.map((line, li) => (
        <span key={li} className="block">
          {line.map((word) => {
            const delay = wordIndex * 55
            wordIndex++
            return (
              <span
                key={word.text}
                className={cn("hero-word", word.isAccent && "accent-word")}
                style={{ animationDelay: `${delay}ms` }}
              >
                {word.text}
                {"\u00A0"}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

/* ── Nav — Vercel-quality glassmorphic ── */
function LandingNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("opsc-theme")
    const prefersDark = stored === "dark"
    setIsDark(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
      localStorage.setItem("opsc-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      localStorage.setItem("opsc-theme", "light")
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-transparent transition-all duration-[350ms]",
        scrolled && "nav-scrolled"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/icon.svg" alt="OpsConductor" className="h-7 w-7" />
          <img src="/brand/wordmark.svg" alt="OpsConductor" className="h-[22px] hidden dark:block" />
          <img src="/brand/wordmark-dark.svg" alt="OpsConductor" className="h-[22px] dark:hidden block" />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#problem" className="nav-link">Why</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="nav-link">
            Log in
          </Link>
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            href="/signup"
            className="btn-primary rounded-[7px] px-5 py-2 text-[14px]"
          >
            Get started
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-text-secondary">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-4 border-t border-border-subtle bg-[var(--color-bg-base)] px-6 py-4 md:hidden">
          <a href="#problem" className="text-[13px] text-text-secondary">Why</a>
          <a href="#how-it-works" className="text-[13px] text-text-secondary">How it works</a>
          <a href="#pricing" className="text-[13px] text-text-secondary">Pricing</a>
          <Link href="/login" className="text-[13px] text-text-secondary">Log in</Link>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-[13px] text-text-secondary"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
          <Link href="/signup" className="btn-primary rounded-[7px] px-4 py-2 text-center text-[13px] font-semibold">Get started</Link>
        </div>
      )}
    </nav>
  )
}

/* ── Cockpit Mockup — fully interactive HTML ── */
function CockpitMockup() {
  const [liveEvent, setLiveEvent] = useState(false)
  const [approvalPulse, setApprovalPulse] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLiveEvent(true), 3400)
    const t2 = setTimeout(() => setApprovalPulse(true), 6000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="animate-mockup-in relative z-10 mx-auto mt-16 w-full max-w-5xl">
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-border-subtle px-3 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-text-disabled" />
          <div className="h-2.5 w-2.5 rounded-full bg-text-disabled" />
          <div className="h-2.5 w-2.5 rounded-full bg-text-disabled" />
          <span className="ml-3 font-mono text-[11px] text-text-tertiary">opsconductor.app/cockpit</span>
        </div>
        <div className="p-4">
          {/* Mini stat cards */}
          <div className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-4">
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
          {/* Activity feed + agents */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <div className="md:col-span-3 rounded-lg border border-border-subtle bg-surface-2 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-text-primary">Live Activity</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-success status-running" />
                  <span className="text-[9px] text-text-tertiary">Real-time</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {liveEvent && (
                  <div className="animate-event-flash flex items-center gap-2 rounded-md bg-surface-1 px-2 py-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-[10px] font-medium text-text-primary">Lead Nurturer</span>
                    <span className="flex-1 truncate text-[10px] text-text-tertiary">Follow-up sent to Priya Sharma</span>
                    <span className="font-mono text-[9px] text-text-tertiary">just now</span>
                  </div>
                )}
                {[
                  { agent: "Lead Nurturer", action: "Checked for new trial signups", time: "2m ago" },
                  { agent: "Churn Rescue", action: "Detected MRR drop for Globex Inc", time: "12m ago" },
                  { agent: "Lead Nurturer", action: "Sent follow-up email", time: "1h ago" },
                ].map((evt, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-md bg-surface-1 px-2 py-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-[10px] font-medium text-text-primary">{evt.agent}</span>
                    <span className="flex-1 truncate text-[10px] text-text-tertiary">{evt.action}</span>
                    <span className="font-mono text-[9px] text-text-tertiary">{evt.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <div className="rounded-lg border border-border-subtle bg-surface-2 p-3">
                <span className="text-[10px] font-semibold text-text-primary">Agent Status</span>
                <div className="mt-2 space-y-1.5">
                  {[
                    { name: "Lead Nurturer", status: "running" },
                    { name: "Churn Rescue", status: "running" },
                    { name: "Invoice Chaser", status: "idle" },
                  ].map((a) => (
                    <div key={a.name} className="flex items-center gap-2 rounded-md bg-surface-1 px-2 py-1.5">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        a.status === "running" ? "bg-success" : "bg-text-disabled"
                      )} />
                      <span className="text-[10px] text-text-primary">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Approval card */}
              <div className={cn(
                "rounded-lg border bg-surface-2 p-3 transition-all",
                approvalPulse ? "approval-pulse border-cyan" : "border-border-subtle"
              )}>
                <div className="flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="h-3 w-3 text-warning" />
                  <span className="text-[10px] font-semibold text-warning">Pending Approval</span>
                </div>
                <p className="text-[10px] text-text-secondary">Churn Rescue wants to offer 15% discount to Globex Inc</p>
                <div className="mt-2 flex gap-1.5">
                  <button className="rounded bg-success/20 px-2 py-0.5 text-[9px] font-medium text-success">Approve</button>
                  <button className="rounded bg-danger/20 px-2 py-0.5 text-[9px] font-medium text-danger">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Hero ── */
function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-32 pb-20 text-center md:pt-40 md:pb-28 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-1 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-success status-running" />
          <span className="text-[11px] font-medium text-text-secondary">Now in beta</span>
        </div>

        <AnimatedHeadline />

        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-[1.7] text-text-secondary">
          OpsConductor orchestrates your AI agents across Gmail, HubSpot,
          Stripe, and Slack — with full visibility, and your approval
          before anything consequential happens.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="btn-primary btn-link flex items-center gap-2 rounded-[7px] px-6 py-2.5 text-[14px]"
          >
            Start for free <span className="arrow"><ArrowRight className="h-4 w-4" /></span>
          </Link>
          <Link
            href="/cockpit"
            className="btn-ghost flex items-center gap-2 px-6 py-2.5 text-[14px]"
          >
            View demo <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <CockpitMockup />
    </section>
  )
}

/* ── Problem Section ── */
function ProblemSection() {
  const ref = useReveal()
  return (
    <section id="problem" className="mx-auto max-w-4xl px-6 py-24 text-center" ref={ref}>
      <div data-reveal>
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          96% of operators don&apos;t trust their AI agents
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary">
          You built AI agents to save time. But now you spend your time wondering what they did,
          whether they sent the right email, or if they just offered a 20% discount to the wrong customer.
          The problem isn&apos;t AI. The problem is control.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3" data-reveal data-reveal-group>
        {[
          {
            icon: Eye,
            title: "No visibility",
            description: "Your agents run in the dark. You find out what happened after the damage is done.",
          },
          {
            icon: ShieldCheck,
            title: "No guardrails",
            description: "Every action is auto-executed. No approval layer, no risk scoring, no way to say \u2018wait.\u2019",
          },
          {
            icon: Activity,
            title: "No accountability",
            description: "You can\u2019t trace why an agent took an action. No reasoning logs, no audit trail.",
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

/* ── How It Works ── */
function HowItWorksSection() {
  const ref = useReveal()
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
    <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-24" ref={ref}>
      <div className="text-center" data-reveal>
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          How OpsConductor works
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-[15px] text-text-secondary">
          From zero to full AI operations in under 10 minutes.
        </p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2" data-reveal data-reveal-group>
        {steps.map((item) => (
          <div
            key={item.step}
            className="group flex gap-4 rounded-lg border border-border-subtle bg-surface-1 p-5 transition-colors hover:border-border-base"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-dim text-cyan">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] text-cyan">{item.step}</span>
              <h3 className="text-[15px] font-semibold text-text-primary">{item.title}</h3>
              <p className="text-[13px] leading-relaxed text-text-tertiary">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Pricing ── */
function PricingSection() {
  const ref = useReveal()
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
      href: "/signup",
      highlight: false,
    },
    {
      name: "Operator",
      price: "$79",
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
      href: "/signup",
      highlight: true,
    },
    {
      name: "Team",
      price: "$249",
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
      href: "/signup",
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-24" ref={ref}>
      <div className="text-center" data-reveal>
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-[15px] text-text-secondary">
          Start free. Upgrade when your agents prove their value.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3" data-reveal data-reveal-group>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-xl border p-6 transition-all",
              plan.highlight
                ? "pricing-featured border-cyan/40 bg-surface-1 shadow-[0_0_40px_rgba(0,194,255,0.06)] md:scale-[1.03]"
                : "border-border-subtle bg-surface-1"
            )}
          >
            {plan.highlight && (
              <span className="mb-3 inline-flex self-start items-center rounded-full bg-cyan-dim px-2.5 py-0.5 text-[11px] font-medium text-cyan">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-text-primary font-mono">{plan.price}</span>
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
            <Link
              href={plan.href}
              className={cn(
                "mt-6 block w-full rounded-[7px] px-4 py-2.5 text-center text-[14px] font-semibold transition-all",
                plan.highlight
                  ? "btn-primary"
                  : "btn-ghost"
              )}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── CTA / Waitlist ── */
function WaitlistSection() {
  const ref = useReveal()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="cta-glow mx-auto max-w-3xl px-6 py-24 text-center" ref={ref}>
      <div className="relative z-10 rounded-xl border border-border-subtle bg-surface-1 p-10 md:p-16" data-reveal>
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          Ready to take control?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-[15px] text-text-secondary">
          Join the beta and be the first to orchestrate your AI agents with confidence.
        </p>
        {submitted ? (
          <div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-2">
            <CheckCircle className="h-8 w-8 text-success" />
            <p className="text-[15px] font-medium text-text-primary">You&apos;re on the list!</p>
            <p className="text-[13px] text-text-secondary">We&apos;ll reach out when your seat is ready.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-10 flex-1 rounded-[7px] border border-border-base bg-surface-2 px-3 text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-cyan focus:shadow-[0_0_0_3px_rgba(0,194,255,0.12)] focus:outline-none"
            />
            <button type="submit" className="btn-primary h-10 rounded-[7px] px-6 text-[14px]">
              Join waitlist
            </button>
          </form>
        )}
        <p className="mt-4 text-[11px] text-text-tertiary">
          Free during beta. No credit card required.
        </p>
      </div>
    </section>
  )
}

/* ── Footer ── */
function LandingFooter() {
  return (
    <footer className="border-t border-border-subtle px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="OpsConductor" className="h-6 w-6" />
          <img src="/brand/wordmark.svg" alt="OpsConductor" className="h-5 hidden dark:block" />
          <img src="/brand/wordmark-dark.svg" alt="OpsConductor" className="h-5 dark:hidden block" />
        </div>
        <div className="flex items-center gap-6">
          <a href="#pricing" className="nav-link">Pricing</a>
          <Link href="/cockpit" className="nav-link">Demo</Link>
          <Link href="/login" className="nav-link">Log in</Link>
        </div>
        <p className="text-[11px] text-text-tertiary">&copy; 2026 OpsConductor. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  useSmoothAnchors()

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("opsc-theme")
    if (saved === "light") {
      document.documentElement.classList.add("light")
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      {/* Background layers — dot grid, aurora, grain */}
      <BackgroundLayers />

      {/* Content */}
      <div className="relative z-10">
        <LandingNav />
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <PricingSection />
        <WaitlistSection />
        <LandingFooter />
      </div>
    </div>
  )
}