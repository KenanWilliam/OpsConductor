"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Bot,
  ShieldCheck,
  ArrowRight,
  Check,
  Activity,
  Eye,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Gauge,
  GitBranch,
  Workflow,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

/* ── Staggered word animation ── */
function AnimatedHeadline() {
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
    <h1
      className="text-balance font-extrabold leading-[1.08] tracking-[-0.04em] text-text-primary"
      style={{ fontSize: "clamp(58px, 8vw, 96px)" }}
    >
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

/* ── Nav ── */
function LandingNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isDark = resolvedTheme === "dark"

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
          <img
            src="/brand/wordmark.svg"
            alt="OpsConductor"
            className="h-[22px] hidden dark:block"
          />
          <img
            src="/brand/wordmark-dark.svg"
            alt="OpsConductor"
            className="h-[22px] dark:hidden block"
          />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How it works
          </a>
          <a href="#pricing" className="nav-link">
            Pricing
          </a>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="nav-link">
            Log in
          </Link>
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}
          <Link
            href="/signup"
            className="btn-primary rounded-[7px] px-5 py-2 text-[14px]"
          >
            Get started
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-text-secondary"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-4 border-t border-border-subtle bg-[var(--color-bg-base)] px-6 py-4 md:hidden">
          <a href="#features" className="text-[13px] text-text-secondary">
            Features
          </a>
          <a href="#how-it-works" className="text-[13px] text-text-secondary">
            How it works
          </a>
          <a href="#pricing" className="text-[13px] text-text-secondary">
            Pricing
          </a>
          <Link href="/login" className="text-[13px] text-text-secondary">
            Log in
          </Link>
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex items-center gap-2 text-[13px] text-text-secondary"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {isDark ? "Light mode" : "Dark mode"}
            </button>
          )}
          <Link
            href="/signup"
            className="btn-primary rounded-[7px] px-4 py-2 text-center text-[13px] font-semibold"
          >
            Get started
          </Link>
        </div>
      )}
    </nav>
  )
}

/* ── Cockpit Mockup ── */
function CockpitMockup() {
  const [liveEvent, setLiveEvent] = useState(false)
  const [approvalPulse, setApprovalPulse] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLiveEvent(true), 3400)
    const t2 = setTimeout(() => setApprovalPulse(true), 6000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="animate-mockup-in relative z-10 mx-auto mt-16 w-full max-w-5xl">
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-border-subtle px-3 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-text-disabled" />
          <div className="h-2.5 w-2.5 rounded-full bg-text-disabled" />
          <div className="h-2.5 w-2.5 rounded-full bg-text-disabled" />
          <span className="ml-3 font-mono text-[11px] text-text-tertiary">
            opsconductor.app/cockpit
          </span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-4">
            {[
              {
                label: "Actions This Week",
                value: "81",
                trend: "+12%",
                color: "text-success",
              },
              {
                label: "Revenue Influenced",
                value: "$14,280",
                trend: "+8%",
                color: "text-success",
              },
              {
                label: "Pending Approvals",
                value: "3",
                trend: "",
                color: "text-warning",
              },
              {
                label: "Agent Cost",
                value: "$4.89",
                trend: "",
                color: "text-text-tertiary",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border-subtle bg-surface-2 p-3"
              >
                <p className="text-[10px] text-text-tertiary">{stat.label}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-text-primary font-mono">
                    {stat.value}
                  </span>
                  {stat.trend && (
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        stat.color
                      )}
                    >
                      {stat.trend}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <div className="md:col-span-3 rounded-lg border border-border-subtle bg-surface-2 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-text-primary">
                  Live Activity
                </span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-success status-running" />
                  <span className="text-[9px] text-text-tertiary">
                    Real-time
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                {liveEvent && (
                  <div className="animate-event-flash flex items-center gap-2 rounded-md bg-surface-1 px-2 py-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-[10px] font-medium text-text-primary">
                      Lead Nurturer
                    </span>
                    <span className="flex-1 truncate text-[10px] text-text-tertiary">
                      Follow-up sent to Priya Sharma
                    </span>
                    <span className="font-mono text-[9px] text-text-tertiary">
                      just now
                    </span>
                  </div>
                )}
                {[
                  {
                    agent: "Lead Nurturer",
                    action: "Checked for new trial signups",
                    time: "2m ago",
                  },
                  {
                    agent: "Churn Rescue",
                    action: "Detected MRR drop for Globex Inc",
                    time: "12m ago",
                  },
                  {
                    agent: "Lead Nurturer",
                    action: "Sent follow-up email",
                    time: "1h ago",
                  },
                ].map((evt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-md bg-surface-1 px-2 py-1.5"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-[10px] font-medium text-text-primary">
                      {evt.agent}
                    </span>
                    <span className="flex-1 truncate text-[10px] text-text-tertiary">
                      {evt.action}
                    </span>
                    <span className="font-mono text-[9px] text-text-tertiary">
                      {evt.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <div className="rounded-lg border border-border-subtle bg-surface-2 p-3">
                <span className="text-[10px] font-semibold text-text-primary">
                  Agent Status
                </span>
                <div className="mt-2 space-y-1.5">
                  {[
                    { name: "Lead Nurturer", status: "running" },
                    { name: "Churn Rescue", status: "running" },
                    { name: "Invoice Chaser", status: "idle" },
                  ].map((a) => (
                    <div
                      key={a.name}
                      className="flex items-center gap-2 rounded-md bg-surface-1 px-2 py-1.5"
                    >
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          a.status === "running"
                            ? "bg-success"
                            : "bg-text-disabled"
                        )}
                      />
                      <span className="text-[10px] text-text-primary">
                        {a.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={cn(
                  "rounded-lg border bg-surface-2 p-3 transition-all",
                  approvalPulse
                    ? "approval-pulse border-cyan"
                    : "border-border-subtle"
                )}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="h-3 w-3 text-warning" />
                  <span className="text-[10px] font-semibold text-warning">
                    Pending Approval
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary">
                  Churn Rescue wants to offer 15% discount to Globex Inc
                </p>
                <div className="mt-2 flex gap-1.5">
                  <button className="rounded bg-success/20 px-2 py-0.5 text-[9px] font-medium text-success">
                    Approve
                  </button>
                  <button className="rounded bg-danger/20 px-2 py-0.5 text-[9px] font-medium text-danger">
                    Reject
                  </button>
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
          <span className="text-[11px] font-medium text-text-secondary">
            Now in beta
          </span>
        </div>

        <AnimatedHeadline />

        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-[1.7] text-text-secondary">
          OpsConductor orchestrates your AI agents across Gmail, HubSpot,
          Stripe, and Slack — with full visibility, and your approval before
          anything consequential happens.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="btn-primary btn-link flex items-center gap-2 rounded-[7px] px-6 py-2.5 text-[14px]"
          >
            Start for free{" "}
            <span className="arrow">
              <ArrowRight className="h-4 w-4" />
            </span>
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

/* ── Logo Marquee ── */
function LogoMarquee() {
  const companies = [
    "Acme Corp",
    "Globex",
    "Initech",
    "Soylent",
    "Hooli",
    "Pied Piper",
    "Massive Dynamic",
    "Cyberdyne",
    "Wayne Ent.",
    "Stark Ind.",
    "Umbrella Corp",
    "Tyrell Corp",
  ]

  return (
    <section className="relative border-y border-border-subtle py-12 overflow-hidden">
      <p className="text-center text-[11px] font-medium tracking-[0.2em] uppercase text-text-tertiary mb-8">
        Trusted by forward-thinking teams
      </p>
      <div className="marquee-container">
        <div className="marquee-track">
          {[...companies, ...companies].map((name, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2.5 px-8 text-[14px] font-medium text-text-disabled whitespace-nowrap select-none"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-[11px] font-bold text-text-tertiary border border-border-subtle">
                {name[0]}
              </span>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Bento Features Grid ── */
function BentoFeaturesGrid() {
  const ref = useReveal()

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24" ref={ref}>
      <div className="text-center mb-16" data-reveal>
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-cyan mb-3">
          The control layer for AI ops
        </p>
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          Everything you need to orchestrate
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary">
          Stop wondering what your agents did. Start deciding what they do next.
        </p>
      </div>

      <div
        className="grid gap-3 md:grid-cols-3 md:grid-rows-2"
        data-reveal
        data-reveal-group
      >
        {/* Large card — Command Center */}
        <div className="group md:col-span-2 rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-colors hover:border-border-base">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-dim mb-5">
            <LayoutDashboard className="h-6 w-6 text-cyan" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            AI Command Center
          </h3>
          <p className="text-[14px] leading-relaxed text-text-secondary max-w-md">
            See every agent, every action, every cost in real time. One cockpit
            to monitor your entire AI operations fleet — no more switching
            between dashboards.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Actions/week", value: "180+" },
              { label: "Avg response", value: "<2s" },
              { label: "Cost/action", value: "$0.003" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-surface-2 p-3 border border-border-subtle"
              >
                <p className="font-mono text-lg font-bold text-text-primary">
                  {stat.value}
                </p>
                <p className="text-[11px] text-text-tertiary mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Approvals */}
        <div className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-colors hover:border-border-base">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 mb-5">
            <ShieldCheck className="h-6 w-6 text-warning" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            Smart Approvals
          </h3>
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Set risk-based approval rules per agent. Auto-execute safe actions,
            flag risky ones for review. Graduated trust that scales with
            confidence.
          </p>
          <div className="mt-6 space-y-2">
            {[
              "Low risk: auto-execute",
              "Medium risk: notify",
              "High risk: require approval",
            ].map((rule) => (
              <div
                key={rule}
                className="flex items-center gap-2 text-[12px] text-text-tertiary"
              >
                <Check className="h-3 w-3 text-success shrink-0" />
                {rule}
              </div>
            ))}
          </div>
        </div>

        {/* Activity Trail */}
        <div className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-colors hover:border-border-base">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 mb-5">
            <Activity className="h-6 w-6 text-success" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            Full Audit Trail
          </h3>
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Every action comes with reasoning logs, timestamps, and cost
            tracking. Know exactly why an agent made every decision.
          </p>
        </div>

        {/* Integrations */}
        <div className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-colors hover:border-border-base">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-5">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            16+ Integrations
          </h3>
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Gmail, HubSpot, Stripe, Slack, Notion, Clearbit, and more. One-click
            OAuth — connected in seconds.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["Gmail", "HubSpot", "Stripe", "Slack", "Notion", "+11"].map(
              (app) => (
                <span
                  key={app}
                  className="rounded bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-text-tertiary border border-border-subtle"
                >
                  {app}
                </span>
              )
            )}
          </div>
        </div>

        {/* Cost Tracking */}
        <div className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-colors hover:border-border-base">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/10 mb-5">
            <Gauge className="h-6 w-6 text-chart-5" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            Cost Intelligence
          </h3>
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Track spend per agent, per action. Set budget limits and get alerts
            before costs spike. Know your ROI down to the cent.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Capabilities Grid (clean reveal, no scroll hijacking) ── */
function CapabilitiesGrid() {
  const ref = useReveal()

  const features = [
    {
      icon: Eye,
      title: "Real-time visibility",
      description:
        "See every action, every decision, every cost — the moment it happens. No more wondering what your agents did while you were away.",
      stat: "Live",
      statLabel: "event stream",
    },
    {
      icon: ShieldCheck,
      title: "Human-in-the-loop",
      description:
        "Set approval rules per agent, per action type. Auto-execute low-risk tasks, flag high-risk ones for your review before they fire.",
      stat: "3 tiers",
      statLabel: "of approval",
    },
    {
      icon: GitBranch,
      title: "Smart workflows",
      description:
        "Chain agents together with conditional logic. Build complex multi-step automations that still respect your guardrails at every gate.",
      stat: "∞",
      statLabel: "combinations",
    },
    {
      icon: Bot,
      title: "Agent templates",
      description:
        "Pre-built agents for lead nurturing, churn rescue, invoicing, and more. Deploy in minutes, customize everything, iterate fast.",
      stat: "8+",
      statLabel: "ready to deploy",
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-6 py-24" ref={ref}>
      <div className="mb-12" data-reveal>
        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-cyan mb-3">
          Built for control
        </p>
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          Built for operators who
          <br className="hidden md:inline" /> demand control
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2" data-reveal data-reveal-group>
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-xl border border-border-subtle bg-surface-1 p-8 transition-colors hover:border-border-base"
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-dim">
              <f.icon className="h-5 w-5 text-cyan" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">{f.title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
              {f.description}
            </p>
            <div className="mt-6 flex items-baseline gap-2 border-t border-border-subtle pt-4">
              <span className="font-mono text-2xl font-bold text-cyan">
                {f.stat}
              </span>
              <span className="text-[12px] text-text-tertiary">
                {f.statLabel}
              </span>
            </div>
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
      description:
        "Link Gmail, HubSpot, Stripe, Slack, and more via OAuth. One click per integration.",
    },
    {
      step: "02",
      icon: Bot,
      title: "Deploy AI agents",
      description:
        "Choose from pre-built templates or build custom agents. Each agent gets a role, triggers, and connected apps.",
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Set your guardrails",
      description:
        "Define what runs automatically and what needs your approval. Per agent, per action type. Graduated trust.",
    },
    {
      step: "04",
      icon: LayoutDashboard,
      title: "Conduct from the cockpit",
      description:
        "Monitor everything from one command center. Approve, edit, or skip actions inline. Full reasoning logs for every decision.",
    },
  ]

  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-5xl px-6 py-24"
      ref={ref}
    >
      <div className="text-center" data-reveal>
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          How OpsConductor works
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-[15px] text-text-secondary">
          From zero to full AI operations in under 10 minutes.
        </p>
      </div>
      <div
        className="mt-14 grid gap-6 md:grid-cols-2"
        data-reveal
        data-reveal-group
      >
        {steps.map((item) => (
          <div
            key={item.step}
            className="group flex gap-4 rounded-lg border border-border-subtle bg-surface-1 p-5 transition-colors hover:border-border-base"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-dim text-cyan">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] text-cyan">
                {item.step}
              </span>
              <h3 className="text-[15px] font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-text-tertiary">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Animated Counter ── */
function AnimatedCounter({
  target,
  suffix = "",
  label,
}: {
  target: number
  suffix?: string
  label: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const duration = 2000
          const startTime = performance.now()
          function animate(now: number) {
            const elapsed = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - elapsed, 3)
            setCount(Math.round(eased * target))
            if (elapsed < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-center">
      <p className="font-mono text-4xl font-bold text-text-primary md:text-5xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">{label}</p>
    </div>
  )
}

/* ── Metrics Section ── */
function MetricsSection() {
  const ref = useReveal()

  return (
    <section className="mx-auto max-w-5xl px-6 py-24" ref={ref}>
      <div data-reveal>
        <div className="rounded-2xl border border-border-subtle bg-surface-1 p-12 md:p-16">
          <p className="text-center text-[11px] font-medium tracking-[0.15em] uppercase text-cyan mb-10">
            Platform metrics
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <AnimatedCounter target={10000} suffix="+" label="Actions executed" />
            <AnimatedCounter target={99} suffix="%" label="Uptime SLA" />
            <AnimatedCounter target={85} suffix="%" label="Time saved" />
            <AnimatedCounter target={16} suffix="+" label="Integrations" />
          </div>
        </div>
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
      <div
        className="mt-12 grid gap-4 md:grid-cols-3"
        data-reveal
        data-reveal-group
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-xl border p-6 transition-colors",
              plan.highlight
                ? "border-cyan/40 bg-surface-1 md:scale-[1.03]"
                : "border-border-subtle bg-surface-1"
            )}
          >
            {plan.highlight && (
              <span className="mb-3 inline-flex self-start items-center rounded-full bg-cyan-dim px-2.5 py-0.5 text-[11px] font-medium text-cyan">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-text-primary">
              {plan.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-text-primary font-mono">
                {plan.price}
              </span>
              <span className="text-[13px] text-text-tertiary">
                {plan.period}
              </span>
            </div>
            <p className="mt-2 text-[13px] text-text-secondary">
              {plan.description}
            </p>
            <ul className="mt-6 flex flex-1 flex-col gap-2.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-[13px] text-text-secondary"
                >
                  <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={cn(
                "mt-6 block w-full rounded-[7px] px-4 py-2.5 text-center text-[14px] font-semibold transition-all",
                plan.highlight ? "btn-primary" : "btn-ghost"
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

/* ── Final CTA ── */
function FinalCTA() {
  const ref = useReveal()

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24" ref={ref}>
      <div
        className="relative z-10 overflow-hidden rounded-2xl border border-border-subtle bg-surface-1 p-12 text-center md:p-20"
        data-reveal
      >
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          Ready to take control?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-text-secondary">
          Join the beta and be the first to orchestrate your AI agents with
          confidence. No credit card required.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="btn-primary btn-link flex items-center gap-2 rounded-[7px] px-8 py-3 text-[15px] font-semibold"
          >
            Start for free{" "}
            <span className="arrow">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/cockpit"
            className="btn-ghost flex items-center gap-2 px-6 py-3 text-[14px]"
          >
            View demo <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ── */
function ImmersiveFooter() {
  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
    Resources: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Guides", href: "#" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  }

  return (
    <footer className="relative mt-8 border-t border-border-subtle">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-12 py-16 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/icon.svg" alt="OpsConductor" className="h-7 w-7" />
              <img
                src="/brand/wordmark.svg"
                alt="OpsConductor"
                className="h-[20px] hidden dark:block"
              />
              <img
                src="/brand/wordmark-dark.svg"
                alt="OpsConductor"
                className="h-[20px] dark:hidden block"
              />
            </div>
            <p className="text-[13px] leading-relaxed text-text-secondary max-w-xs">
              The control layer for AI operations. See everything, approve what
              matters, automate the rest.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-1 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-success status-running" />
              <span className="text-[11px] font-medium text-text-secondary">
                All systems operational
              </span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-tertiary mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-subtle py-6 md:flex-row">
          <p className="text-[11px] text-text-tertiary">
            &copy; {new Date().getFullYear()} OpsConductor. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-text-tertiary transition-colors hover:text-text-secondary"
              aria-label="Twitter"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-text-tertiary transition-colors hover:text-text-secondary"
              aria-label="GitHub"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-text-tertiary transition-colors hover:text-text-secondary"
              aria-label="LinkedIn"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  useSmoothAnchors()

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      {/* Background — dot grid only, clean and modern */}
      <div className="bg-dots" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        <LandingNav />
        <HeroSection />
        <LogoMarquee />
        <BentoFeaturesGrid />
        <CapabilitiesGrid />
        <HowItWorksSection />
        <MetricsSection />
        <PricingSection />
        <FinalCTA />
        <ImmersiveFooter />
      </div>
    </div>
  )
}
