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
  AlertTriangle,
  EyeOff,
  FileWarning,
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
    el.querySelectorAll("[data-reveal], [data-reveal-slide-left], [data-reveal-slide-right], [data-reveal-scale]").forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])
  return ref
}

/* ── Parallax hook — lerp-smoothed for buttery motion ── */
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const center = rect.top + rect.height / 2
      const fromCenter = center - windowH / 2
      targetRef.current = fromCenter * speed
    }

    // Lerp loop — runs every frame for silk-smooth interpolation
    function tick() {
      const ease = 0.08 // lower = smoother / more lag, higher = snappier
      currentRef.current += (targetRef.current - currentRef.current) * ease
      // Only update state when delta is perceptible (avoid sub-pixel thrash)
      if (Math.abs(currentRef.current - targetRef.current) > 0.05) {
        setOffset(currentRef.current)
      } else if (currentRef.current !== targetRef.current) {
        currentRef.current = targetRef.current
        setOffset(currentRef.current)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [speed])

  return { ref, offset }
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

/* ── Staggered word animation — large stacked headline ── */
function AnimatedHeadline() {
  const line1 = [
    { text: "YOUR", isAccent: false },
    { text: "AGENTS", isAccent: false },
    { text: "RUN.", isAccent: false },
  ]
  const line2 = [
    { text: "YOU", isAccent: false },
    { text: "STAY", isAccent: false },
    { text: "IN", isAccent: false },
    { text: "CONTROL.", isAccent: true },
  ]

  const allLines = [line1, line2]
  let wordIndex = 0

  return (
    <h1
      className="text-balance font-extrabold leading-[0.95] tracking-[-0.04em] text-text-primary uppercase"
      style={{ fontSize: "clamp(36px, 6.5vw, 80px)" }}
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

  useEffect(() => { setMounted(true) }, [])
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
      <div className="mx-auto flex h-16 section-container items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/icon.svg" alt="OpsConductor" className="h-7 w-7 hidden dark:block" />
          <img src="/icon-light.svg" alt="OpsConductor" className="h-7 w-7 dark:hidden block" />
          <img src="/brand/wordmark.svg" alt="OpsConductor" className="h-[22px] hidden dark:block" />
          <img src="/brand/wordmark-dark.svg" alt="OpsConductor" className="h-[22px] dark:hidden block" />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="nav-link">Log in</Link>
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <Link href="/signup" className="btn-primary rounded-[7px] px-5 py-2 text-[14px]">
            Start free
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-text-secondary" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-4 border-t border-border-subtle bg-[var(--color-bg-base)] px-6 py-4 md:hidden">
          <a href="#features" className="text-[13px] text-text-secondary">Features</a>
          <a href="#how-it-works" className="text-[13px] text-text-secondary">How it works</a>
          <a href="#pricing" className="text-[13px] text-text-secondary">Pricing</a>
          <Link href="/login" className="text-[13px] text-text-secondary">Log in</Link>
          <Link href="/signup" className="btn-primary rounded-[7px] px-4 py-2 text-center text-[13px] font-semibold">
            Start free
          </Link>
        </div>
      )}
    </nav>
  )
}

/* ── Cockpit Mockup — near-full-width live dashboard ── */
function CockpitMockup() {
  const [liveEvent, setLiveEvent] = useState(false)
  const [approvalPulse, setApprovalPulse] = useState(false)
  const [eventIdx, setEventIdx] = useState(0)

  const liveEvents = [
    { agent: "Lead Nurturer", action: "Sent follow-up to Sarah Chen at Vercel", time: "just now", status: "running" },
    { agent: "Churn Rescue", action: "Detected payment failure for Acme trial", time: "2s ago", status: "running" },
    { agent: "Data Enricher", action: "Enriched 12 contacts from HubSpot", time: "8s ago", status: "running" },
    { agent: "Invoice Chaser", action: "Reminder sent to Globex — INV-2847", time: "15s ago", status: "idle" },
  ]

  useEffect(() => {
    const t1 = setTimeout(() => setLiveEvent(true), 2500)
    const t2 = setTimeout(() => setApprovalPulse(true), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (!liveEvent) return
    const interval = setInterval(() => {
      setEventIdx((i) => (i + 1) % liveEvents.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [liveEvent])

  return (
    <div className="animate-mockup-in relative z-10 mx-auto mt-12 w-full section-container">
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-1 shadow-[0_8px_60px_rgba(0,0,0,0.4)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-border-subtle px-3 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-danger/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-warning/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-success/50" />
          <span className="ml-3 font-mono text-[11px] text-text-tertiary">
            opsconductor.app/cockpit
          </span>
          <div className="ml-auto flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-success status-running" />
            <span className="font-mono text-[9px] text-text-tertiary">LIVE</span>
          </div>
        </div>
        <div className="p-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-4">
            {[
              { label: "Actions This Week", value: "247", trend: "+18%", color: "text-success" },
              { label: "Revenue Influenced", value: "$28,750", trend: "+12%", color: "text-success" },
              { label: "Pending Approvals", value: "5", trend: "", color: "text-warning" },
              { label: "Agent Cost", value: "$10.74", trend: "", color: "text-text-tertiary" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border-subtle bg-surface-2 p-3">
                <p className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider">{stat.label}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-text-primary font-mono">{stat.value}</span>
                  {stat.trend && (
                    <span className={cn("text-[10px] font-medium", stat.color)}>{stat.trend}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {/* Live Activity */}
            <div className="md:col-span-3 rounded-lg border border-border-subtle bg-surface-2 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-text-primary font-mono uppercase tracking-wider">Live Activity</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-success status-running" />
                  <span className="text-[9px] text-text-tertiary font-mono">Real-time</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {liveEvent && (
                  <div className="animate-event-flash flex items-center gap-2 rounded-md bg-surface-1 px-2 py-1.5 border border-amber/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-success status-running" />
                    <span className="text-[10px] font-medium text-text-primary">{liveEvents[eventIdx].agent}</span>
                    <span className="flex-1 truncate text-[10px] text-text-tertiary">{liveEvents[eventIdx].action}</span>
                    <span className="font-mono text-[9px] text-amber">{liveEvents[eventIdx].time}</span>
                  </div>
                )}
                {[
                  { agent: "Lead Nurturer", action: "Checked for new trial signups", time: "2m ago" },
                  { agent: "Churn Rescue", action: "Detected MRR drop for Globex Inc", time: "12m ago" },
                  { agent: "Content Writer", action: "Published blog post draft to Notion", time: "28m ago" },
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
            {/* Right panels */}
            <div className="md:col-span-2 space-y-3">
              <div className="rounded-lg border border-border-subtle bg-surface-2 p-3">
                <span className="text-[10px] font-semibold text-text-primary font-mono uppercase tracking-wider">Agent Status</span>
                <div className="mt-2 space-y-1.5">
                  {[
                    { name: "Lead Nurturer", status: "running", actions: "47/wk" },
                    { name: "Churn Rescue", status: "running", actions: "23/wk" },
                    { name: "Data Enricher", status: "running", actions: "56/wk" },
                    { name: "Deal Nudger", status: "error", actions: "3/wk" },
                  ].map((a) => (
                    <div key={a.name} className="flex items-center gap-2 rounded-md bg-surface-1 px-2 py-1.5">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        a.status === "running" ? "bg-success status-running" :
                        a.status === "error" ? "bg-danger status-error" : "bg-text-disabled"
                      )} />
                      <span className="text-[10px] text-text-primary flex-1">{a.name}</span>
                      <span className="font-mono text-[9px] text-text-tertiary">{a.actions}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={cn(
                "rounded-lg border bg-surface-2 p-3 transition-all",
                approvalPulse ? "approval-pulse border-amber" : "border-border-subtle"
              )}>
                <div className="flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="h-3 w-3 text-warning" />
                  <span className="text-[10px] font-semibold text-warning font-mono uppercase">Pending Approval</span>
                </div>
                <p className="text-[10px] text-text-secondary">
                  Churn Rescue wants to offer 20% discount to Globex Inc ($4,800 ARR)
                </p>
                <div className="mt-2 flex gap-1.5">
                  <button className="rounded bg-success/20 px-2 py-0.5 text-[9px] font-medium text-success" aria-label="Approve action">Approve</button>
                  <button className="rounded bg-surface-3 px-2 py-0.5 text-[9px] font-medium text-text-secondary" aria-label="Edit and approve">Edit</button>
                  <button className="rounded bg-danger/20 px-2 py-0.5 text-[9px] font-medium text-danger" aria-label="Reject action">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── SVG Radar/Grid Background ── */
function RadarGrid({ parallaxOffset = 0 }: { parallaxOffset?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{ transform: `translate3d(0, ${parallaxOffset * 0.3}px, 0)`, willChange: "transform" }}>
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-amber" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="50%" cy="50%" r="300" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-amber" opacity="0.5" />
        <circle cx="50%" cy="50%" r="500" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-amber" opacity="0.3" />
        <circle cx="50%" cy="50%" r="700" fill="none" stroke="currentColor" strokeWidth="0.15" className="text-amber" opacity="0.2" />
      </svg>
    </div>
  )
}

/* ── Hero ── */
function HeroSection() {
  const { ref: parallaxRef, offset: heroParallax } = useParallax(0.15)

  return (
    <section ref={parallaxRef} className="relative flex flex-col items-center px-6 pt-28 pb-16 text-center md:pt-36 md:pb-24 overflow-hidden min-h-screen">
      <RadarGrid parallaxOffset={heroParallax} />
      <div className="bg-grain" aria-hidden="true" />
      <div
        className="relative z-10 mx-auto max-w-5xl"
        style={{ transform: `translate3d(0, ${heroParallax * 0.4}px, 0)`, willChange: "transform" }}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-1/80 backdrop-blur-sm px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-success status-running" />
          <span className="text-[11px] font-medium text-text-secondary font-mono">
            Now in beta — 10 agents active
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
            href="/demo"
            className="btn-primary btn-link flex items-center gap-2 rounded-[7px] px-7 py-3 text-[15px]"
            aria-label="Enter the demo dashboard"
          >
            Enter Demo
            <span className="arrow"><ArrowRight className="h-4 w-4" /></span>
          </Link>
          <Link
            href="/signup"
            className="btn-ghost flex items-center gap-2 px-7 py-3 text-[15px]"
            aria-label="Sign up for free"
          >
            Start free <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <CockpitMockup />
    </section>
  )
}

/* ── Section 1: The Problem — Horror cards ── */
function ProblemSection() {
  const ref = useReveal()
  const { ref: parallaxRef, offset } = useParallax(0.08)

  const problems = [
    {
      icon: EyeOff,
      title: "No visibility",
      description: "Your agents ran 47 actions last night. You have no idea what they did, to whom, or what it cost.",
    },
    {
      icon: AlertTriangle,
      title: "No guardrails",
      description: "An AI agent just emailed your biggest client a 40% discount. Nobody approved it. Nobody knew.",
    },
    {
      icon: FileWarning,
      title: "No audit trail",
      description: "Compliance asks what your agents did last month. You open 6 dashboards and still can't answer.",
    },
  ]

  return (
    <section className="section-container py-24" ref={(el) => {
      (ref as any).current = el;
      (parallaxRef as any).current = el;
    }}>
      <div className="text-center mb-16" data-reveal style={{ transform: `translate3d(0, ${offset * 0.5}px, 0)`, willChange: "transform" }}>
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-danger mb-3 font-mono">
          The problem
        </p>
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          AI agents without oversight<br className="hidden md:inline" /> are a liability
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3" data-reveal data-reveal-group>
        {problems.map((p, i) => (
          <div
            key={p.title}
            className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-danger/30 hover:-translate-y-1 hover:shadow-lg"
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 mb-5 relative">
              <p.icon className="h-6 w-6 text-danger" />
              <div className="absolute inset-0 rounded-xl bg-danger/20 red-pulse" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">{p.title}</h3>
            <p className="text-[14px] leading-relaxed text-text-secondary">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Section 2: How It Works — Stacking cards ── */
function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      step: "01",
      icon: Workflow,
      title: "Connect your tools",
      description: "Link Gmail, HubSpot, Stripe, Slack, and more via OAuth. One click per integration — connected in seconds.",
      detail: "16+ integrations ready to go",
    },
    {
      step: "02",
      icon: Bot,
      title: "Deploy AI agents",
      description: "Choose from pre-built templates or build custom agents. Each agent gets a role, triggers, and connected apps.",
      detail: "Templates for sales, CS, ops & more",
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Set your guardrails",
      description: "Define what runs automatically and what needs approval. Per agent, per action type. Graduated trust that scales.",
      detail: "Risk-based approval policies",
    },
    {
      step: "04",
      icon: LayoutDashboard,
      title: "Conduct from the cockpit",
      description: "Monitor everything from one command center. Approve, edit, or skip actions inline. Full reasoning logs.",
      detail: "Real-time visibility & cost tracking",
    },
  ]

  useEffect(() => {
    function handleScroll() {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalScroll = containerRef.current.scrollHeight - window.innerHeight
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll))
      setActiveStep(Math.min(3, Math.floor(progress * 4)))
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="how-it-works" ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="section-container w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: header + step list */}
            <div>
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-3 font-mono">
                How it works
              </p>
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl mb-10">
                From zero to full<br />AI operations
              </h2>

              <div className="space-y-1">
                {steps.map((item, i) => (
                  <button
                    key={item.step}
                    onClick={() => setActiveStep(i)}
                    className={cn(
                      "w-full text-left rounded-xl px-5 py-4 border",
                      i === activeStep
                        ? "bg-surface-1 border-amber/30 shadow-[0_0_20px_rgba(245,158,11,0.06)]"
                        : "bg-transparent border-transparent hover:bg-surface-1/50"
                    )}
                    style={{
                      transition: "background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg",
                        i === activeStep ? "bg-amber text-primary-foreground" : "bg-surface-2 text-text-tertiary"
                      )} style={{ transition: "background-color 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-mono text-[10px]",
                            i === activeStep ? "text-amber" : "text-text-disabled"
                          )} style={{ transition: "color 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}>{item.step}</span>
                          <h3 className={cn(
                            "text-[14px] font-semibold",
                            i === activeStep ? "text-text-primary" : "text-text-tertiary"
                          )} style={{ transition: "color 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}>{item.title}</h3>
                        </div>
                        <div className={cn(
                          "overflow-hidden",
                          i === activeStep ? "max-h-20 opacity-100 mt-1.5" : "max-h-0 opacity-0"
                        )} style={{ transition: "max-height 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), margin 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                          <p className="text-[13px] leading-relaxed text-text-secondary">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: stacking card showcase */}
            <div className="relative hidden md:block h-[420px]" style={{ perspective: "1200px" }}>
              {steps.map((item, i) => {
                const offset = i - activeStep
                const isActive = i === activeStep
                const isPast = i < activeStep

                return (
                  <div
                    key={item.step}
                    className={cn(
                      "absolute inset-0 rounded-2xl border p-8",
                      isActive
                        ? "border-amber/40 bg-surface-1 z-30 shadow-[0_8px_40px_rgba(245,158,11,0.1)]"
                        : isPast
                          ? "border-border-subtle bg-surface-1/80 z-10"
                          : "border-border-subtle bg-surface-1/60 z-20"
                    )}
                    style={{
                      willChange: "transform, opacity",
                      transition: "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.5s ease, box-shadow 0.5s ease",
                      transform: isActive
                        ? "translateY(0) scale(1) rotateX(0deg)"
                        : isPast
                          ? `translateY(-${Math.abs(offset) * 20}px) scale(${1 - Math.abs(offset) * 0.04}) rotateX(2deg)`
                          : `translateY(${offset * 14}px) scale(${1 - offset * 0.03}) rotateX(-1deg)`,
                      opacity: isActive ? 1 : isPast ? 0.35 : 0.55,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-6" style={{ transition: "opacity 0.5s ease", opacity: isActive ? 1 : 0.6 }}>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-dim text-amber">
                        <item.icon className="h-7 w-7" />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-amber block">{item.step}</span>
                        <h3 className="text-xl font-bold text-text-primary">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-[15px] leading-relaxed text-text-secondary mb-6" style={{ transition: "opacity 0.5s ease 0.05s", opacity: isActive ? 1 : 0.4 }}>{item.description}</p>
                    <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-4 py-3 border border-border-subtle" style={{ transition: "opacity 0.5s ease 0.1s", opacity: isActive ? 1 : 0.3 }}>
                      <Check className="h-4 w-4 text-success shrink-0" />
                      <span className="text-[13px] text-text-secondary font-mono">{item.detail}</span>
                    </div>

                    {/* Decorative connector line to next step */}
                    {i < steps.length - 1 && isActive && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-amber/40 to-transparent" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Mobile: simple cards */}
            <div className="md:hidden space-y-4">
              {steps.map((item, i) => (
                <div
                  key={item.step}
                  className={cn(
                    "rounded-xl border p-6 transition-all duration-500",
                    i === activeStep
                      ? "border-amber/40 bg-surface-1 shadow-[0_0_20px_rgba(245,158,11,0.06)]"
                      : "border-border-subtle bg-surface-1/50 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-dim text-amber">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-amber">{item.step}</span>
                      <h3 className="text-[15px] font-semibold text-text-primary">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-text-tertiary">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section 3: Live Agent Ticker ── */
function LiveAgentTicker() {
  const events = [
    "Lead Nurturer → Sent follow-up to Sarah Chen at Vercel",
    "Churn Rescue → Detected payment failure for Acme trial account",
    "Invoice Chaser → Reminder sent for INV-2847 ($1,200)",
    "Data Enricher → Enriched 23 contacts from Clearbit",
    "Content Writer → Published blog post to Notion",
    "Meeting Scheduler → Scheduled demo for Thursday 3pm with Stripe team",
    "Lead Nurturer → Moved David Park to MQL stage",
    "Churn Rescue → Posted weekly churn risk report to #cs-alerts",
    "Deal Nudger → Stale deal alert: Pied Piper (15 days)",
    "Invoice Chaser → Payment confirmed: Cyberdyne $2,850",
  ]

  return (
    <section className="relative border-y border-border-subtle py-6 overflow-hidden">
      <div className="mb-3 flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-success status-running" />
        <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-text-tertiary">
          Live agent feed
        </span>
      </div>
      <div className="marquee-container">
        <div className="ticker-track">
          {[...events, ...events].map((evt, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-3 px-6 text-[13px] text-text-secondary whitespace-nowrap font-mono"
            >
              <span className="h-1 w-1 rounded-full bg-amber" />
              {evt}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Features Grid ── */
function BentoFeaturesGrid() {
  const ref = useReveal()
  const { ref: parallaxRef, offset } = useParallax(0.06)

  return (
    <section id="features" className="section-container py-24" ref={(el) => {
      (ref as any).current = el;
      (parallaxRef as any).current = el;
    }}>
      <div className="text-center mb-16" data-reveal style={{ transform: `translate3d(0, ${offset * 0.3}px, 0)`, willChange: "transform" }}>
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-3 font-mono">
          The control layer for AI ops
        </p>
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          Everything you need to orchestrate
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3 md:grid-rows-2" data-reveal data-reveal-group>
        <div className="group md:col-span-2 rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-border-base hover:-translate-y-1 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-dim mb-5">
            <LayoutDashboard className="h-6 w-6 text-amber" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">AI Command Center</h3>
          <p className="text-[14px] leading-relaxed text-text-secondary max-w-md">
            See every agent, every action, every cost in real time. One cockpit to monitor your entire AI operations fleet.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Actions/week", value: "247" },
              { label: "Avg response", value: "<2s" },
              { label: "Cost/action", value: "$0.003" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-surface-2 p-3 border border-border-subtle">
                <p className="font-mono text-lg font-bold text-text-primary">{stat.value}</p>
                <p className="text-[11px] text-text-tertiary mt-1 font-mono">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-border-base hover:-translate-y-1 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 mb-5">
            <ShieldCheck className="h-6 w-6 text-warning" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Smart Approvals</h3>
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Risk-based approval rules per agent. Auto-execute safe actions, flag risky ones for review.
          </p>
          <div className="mt-6 space-y-2">
            {["Low risk: auto-execute", "Medium risk: notify", "High risk: require approval"].map((rule) => (
              <div key={rule} className="flex items-center gap-2 text-[12px] text-text-tertiary">
                <Check className="h-3 w-3 text-success shrink-0" />
                {rule}
              </div>
            ))}
          </div>
        </div>

        <div className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-border-base hover:-translate-y-1 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 mb-5">
            <Activity className="h-6 w-6 text-success" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Full Audit Trail</h3>
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Every action with reasoning logs, timestamps, and cost tracking. Know exactly why an agent made every decision.
          </p>
        </div>

        <div className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-border-base hover:-translate-y-1 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10 mb-5">
            <Globe className="h-6 w-6 text-info" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">16+ Integrations</h3>
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Gmail, HubSpot, Stripe, Slack, Notion, Clearbit, and more. One-click OAuth.
          </p>
        </div>

        <div className="group rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-border-base hover:-translate-y-1 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/10 mb-5">
            <Gauge className="h-6 w-6 text-chart-5" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Cost Intelligence</h3>
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Track spend per agent, per action. Set budget limits and get alerts before costs spike.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
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
        {count.toLocaleString()}{suffix}
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">{label}</p>
    </div>
  )
}

function MetricsSection() {
  const ref = useReveal()
  return (
    <section className="section-container-narrow py-24" ref={ref}>
      <div data-reveal>
        <div className="rounded-2xl border border-border-subtle bg-surface-1 p-12 md:p-16">
          <p className="text-center text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-10 font-mono">
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

/* ── Pricing — Glassmorphism ── */
function PricingSection() {
  const ref = useReveal()
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      price: annual ? "$0" : "$0",
      period: "forever",
      description: "Try it out with limited agents",
      features: ["2 agents", "100 events/month", "3 integrations", "Manual approvals only", "7-day activity log"],
      cta: "Start free",
      href: "/signup",
      highlight: false,
    },
    {
      name: "Operator",
      price: annual ? "$63" : "$79",
      period: annual ? "/mo (billed annually)" : "/month",
      description: "For teams running real AI operations",
      features: ["10 agents", "Unlimited events", "Unlimited integrations", "Auto + manual approvals", "90-day activity log", "Priority support"],
      cta: "Start free trial",
      href: "/signup",
      highlight: true,
    },
    {
      name: "Team",
      price: annual ? "$199" : "$249",
      period: annual ? "/mo (billed annually)" : "/month",
      description: "For growing organizations",
      features: ["Unlimited agents", "Unlimited events", "Unlimited integrations", "Advanced approval rules", "365-day activity log", "5 team seats", "API access", "Audit log"],
      cta: "Talk to us",
      href: "/signup",
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="section-container-narrow py-24" ref={ref}>
      <div className="text-center" data-reveal>
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-[15px] text-text-secondary">
          Start free. Upgrade when your agents prove their value.
        </p>

        {/* Monthly/Annual toggle */}
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border-subtle bg-surface-1 p-1">
          <button
            onClick={() => setAnnual(false)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all",
              !annual ? "bg-amber text-primary-foreground" : "text-text-secondary hover:text-text-primary"
            )}
            aria-label="Monthly pricing"
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all",
              annual ? "bg-amber text-primary-foreground" : "text-text-secondary hover:text-text-primary"
            )}
            aria-label="Annual pricing"
          >
            Annual
            <span className="ml-1.5 text-[10px] opacity-80">save 20%</span>
          </button>
        </div>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3" data-reveal data-reveal-group>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-xl border p-6 transition-all",
              plan.highlight
                ? "glass-card border-amber/40 md:scale-[1.03] shadow-[0_0_40px_rgba(245,158,11,0.08)]"
                : "border-border-subtle bg-surface-1"
            )}
          >
            {plan.highlight && (
              <span className="mb-3 inline-flex self-start items-center rounded-full bg-amber-dim px-2.5 py-0.5 text-[11px] font-medium text-amber font-mono">
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
  const { ref: parallaxRef, offset } = useParallax(0.1)
  return (
    <section className="relative section-container-narrow py-24" ref={(el) => {
      (ref as any).current = el;
      (parallaxRef as any).current = el;
    }}>
      {/* Floating decorative orbs */}
      <div className="absolute top-8 left-[10%] w-32 h-32 rounded-full bg-amber/5 blur-3xl animate-float pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-12 right-[15%] w-24 h-24 rounded-full bg-amber/5 blur-2xl animate-float-delayed pointer-events-none" aria-hidden="true" />

      <div
        className="relative z-10 overflow-hidden rounded-2xl border border-border-subtle bg-surface-1 p-12 text-center md:p-20"
        data-reveal-scale
        style={{ transform: `translate3d(0, ${offset * 0.3}px, 0)`, willChange: "transform" }}
      >
        <h2 className="text-balance text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl lg:text-4xl">
          Ready to take control?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-text-secondary">
          Join the beta and be the first to orchestrate your AI agents with
          confidence. No credit card required.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/demo" className="btn-primary btn-link flex items-center gap-2 rounded-[7px] px-8 py-3 text-[15px] font-semibold" aria-label="Enter the demo">
            Enter Demo <span className="arrow"><ArrowRight className="h-4 w-4" /></span>
          </Link>
          <Link href="/signup" className="btn-ghost flex items-center gap-2 px-6 py-3 text-[14px]" aria-label="Sign up for free">
            Start free <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Footer — Cinematic stencil ── */
function ImmersiveFooter() {
  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Demo", href: "/demo" },
      { label: "Changelog", href: "#" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
    Legal: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
    Connect: [
      { label: "Twitter", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  }

  return (
    <footer className="relative mt-8 border-t border-border-subtle overflow-hidden">
      {/* Stencil wordmark background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
        <span
          className="font-mono font-bold uppercase tracking-[0.15em] text-text-disabled/30 whitespace-nowrap select-none"
          style={{ fontSize: "clamp(60px, 12vw, 180px)" }}
        >
          OPSCONDUCTOR
        </span>
      </div>
      <div className="bg-scanlines" aria-hidden="true" />

      <div className="relative z-10 section-container">
        <div className="grid gap-12 py-16 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/icon.svg" alt="OpsConductor" className="h-7 w-7 hidden dark:block" />
              <img src="/icon-light.svg" alt="OpsConductor" className="h-7 w-7 dark:hidden block" />
            </div>
            <p className="text-[13px] leading-relaxed text-text-secondary max-w-xs">
              The control layer for AI operations.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text-tertiary mb-4 font-mono">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[13px] text-text-secondary transition-colors hover:text-text-primary">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-subtle py-6 md:flex-row">
          <p className="text-[11px] text-text-tertiary font-mono">
            &copy; {new Date().getFullYear()} OpsConductor. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-text-tertiary transition-colors hover:text-text-secondary" aria-label="Twitter">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#" className="text-text-tertiary transition-colors hover:text-text-secondary" aria-label="GitHub">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
            </a>
            <a href="#" className="text-text-tertiary transition-colors hover:text-text-secondary" aria-label="LinkedIn">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
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
      {/* Background layers */}
      <div className="bg-grid" aria-hidden="true" />

      <div className="relative z-10">
        <LandingNav />
        <HeroSection />
        <LiveAgentTicker />
        <ProblemSection />
        <HowItWorksSection />
        <BentoFeaturesGrid />
        <MetricsSection />
        <PricingSection />
        <FinalCTA />
        <ImmersiveFooter />
      </div>
    </div>
  )
}
