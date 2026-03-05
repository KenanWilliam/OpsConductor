"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "For individuals exploring AI agent automation",
    features: [
      "2 agents",
      "500 events/mo",
      "1 workspace member",
      "3 integrations",
      "Community support",
      "7-day activity log",
    ],
    cta: "Start free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For teams running real AI operations",
    features: [
      "10 agents",
      "10,000 events/mo",
      "5 workspace members",
      "All integrations",
      "Email support",
      "90-day activity log",
      "Auto + manual approvals",
      "CSV export",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations that need full control and compliance",
    features: [
      "Unlimited agents",
      "Unlimited events",
      "Unlimited workspace members",
      "All integrations",
      "SSO / SAML",
      "SLA guarantee",
      "Dedicated support",
      "365-day activity log",
      "Audit log & API access",
      "Custom approval policies",
    ],
    cta: "Contact us",
    href: "/contact",
    highlight: false,
  },
]

const faqs = [
  {
    question: "What is an agent and how does it work?",
    answer:
      "An agent is an AI-powered automation that connects to your tools (like Gmail, HubSpot, or Slack) and performs tasks on your behalf. Each agent has a defined role, triggers, and a set of actions it can execute. You configure what it does, and OpsConductor handles execution, logging, and approval routing.",
  },
  {
    question: "Which integrations are supported?",
    answer:
      "OpsConductor supports 16+ integrations including Gmail, Slack, HubSpot, GitHub, Stripe, Linear, Notion, Clearbit, and more. All connections use secure OAuth flows — no API keys pasted into forms. New integrations are added regularly based on user feedback.",
  },
  {
    question: "How do approval workflows work?",
    answer:
      "You set risk-based rules per agent and action type. Low-risk actions (like logging data) can auto-execute. High-risk actions (like sending an email to a customer or issuing a discount) get routed for human review. You approve, edit, or reject directly from the cockpit with full context and reasoning traces.",
  },
  {
    question: "How is my data secured?",
    answer:
      "All data is encrypted in transit via TLS 1.3 and at rest via AES-256 encryption through Supabase. OAuth tokens are stored with row-level security policies and are never exposed client-side. We do not sell or share your data with third parties. See our Security page for full details.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes. You can downgrade or cancel your plan at any time from your workspace settings. When you cancel, you retain access to your current plan until the end of the billing period. Your data remains available for 30 days after cancellation, and you can export it at any time.",
  },
]

function FAQItem({ faq }: { faq: { question: string; answer: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-text-primary pr-4">{faq.question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-text-tertiary" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-text-tertiary" />
        )}
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-[14px] leading-relaxed text-text-secondary">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      <div className="bg-grid" aria-hidden="true" />
      <div className="relative z-10">
        <PublicNav />

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-32 pb-16 text-center md:pt-40 md:pb-20">
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-4 font-mono">
              Pricing
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-[1.7] text-text-secondary">
              Start free. Upgrade when your agents prove their value. No credit card required.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="section-container-narrow pb-24">
          <div className="grid gap-4 md:grid-cols-3">
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
                    Recommended
                  </span>
                )}
                <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-text-primary font-mono">{plan.price}</span>
                  {plan.period && (
                    <span className="text-[13px] text-text-tertiary">{plan.period}</span>
                  )}
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

        {/* FAQ */}
        <section className="section-container-narrow pb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="mx-auto max-w-2xl">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} faq={faq} />
            ))}
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  )
}
