"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, ArrowLeft, Building2, ShieldCheck, Users } from "lucide-react"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

export default function EnterpriseDemoPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    message: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "enterprise" }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      <div className="bg-grid" aria-hidden="true" />
      <div className="relative z-10">
        <PublicNav />

        {/* Back link */}
        <div className="section-container pt-24 md:pt-28">
          <Link href="/demo" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to interactive demo
          </Link>
        </div>

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-6 pb-8 text-center md:pb-12">
          <div className="mx-auto max-w-2xl">
            <span className="mb-4 inline-flex items-center rounded-full bg-amber-dim px-3 py-1 text-[11px] font-medium text-amber font-mono">
              Enterprise
            </span>
            <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
              Get a personalized walkthrough
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-[1.7] text-text-secondary">
              For teams that need SSO, custom approval policies, SLA guarantees, and dedicated support. We&rsquo;ll tailor the demo to your stack and workflows.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="section-container-narrow pb-16">
          <div className="mx-auto max-w-lg">
            {submitted ? (
              <div className="rounded-2xl border border-border-subtle bg-surface-1 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 mb-5">
                  <svg className="h-7 w-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Request received</h2>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  We&rsquo;ll be in touch within 1 business day to schedule your personalized enterprise demo.
                </p>
                <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                  <Link href="/demo" className="text-[14px] font-medium text-amber hover:text-amber-hover transition-colors">
                    Explore the interactive demo &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-border-subtle bg-surface-1 p-8 md:p-10">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-[13px] font-medium text-text-primary mb-1.5">Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-border-base bg-surface-2 px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-medium text-text-primary mb-1.5">Work email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-border-base bg-surface-2 px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none"
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-[13px] font-medium text-text-primary mb-1.5">Company</label>
                    <input
                      id="company"
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full rounded-lg border border-border-base bg-surface-2 px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <label htmlFor="teamSize" className="block text-[13px] font-medium text-text-primary mb-1.5">Team size</label>
                    <select
                      id="teamSize"
                      required
                      value={form.teamSize}
                      onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                      className="w-full rounded-lg border border-border-base bg-surface-2 px-4 py-2.5 text-[14px] text-text-primary focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none appearance-none"
                    >
                      <option value="" disabled>Select team size</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="200+">200+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-[13px] font-medium text-text-primary mb-1.5">What are you trying to automate?</label>
                    <textarea
                      id="message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-lg border border-border-base bg-surface-2 px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none resize-none"
                      placeholder="e.g. We need SSO, custom approval policies for our compliance team, and agents connected to Salesforce and Jira..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary btn-link w-full flex items-center justify-center gap-2 rounded-[7px] px-6 py-3 text-[15px] font-semibold disabled:opacity-60"
                  >
                    {loading ? "Submitting..." : "Request enterprise demo"}
                    {!loading && <span className="arrow"><ArrowRight className="h-4 w-4" /></span>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Enterprise Benefits */}
        <section className="section-container-narrow pb-24">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Building2, title: "Dedicated onboarding", description: "A solutions engineer will configure your workspace, integrations, and approval policies with you" },
              { icon: ShieldCheck, title: "SSO & compliance", description: "SAML SSO, custom data retention, audit log API access, and SLA guarantees included" },
              { icon: Users, title: "Unlimited scale", description: "Unlimited agents, events, and workspace members with priority support and a dedicated Slack channel" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border-subtle bg-surface-1 p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-amber-dim mb-3">
                  <item.icon className="h-5 w-5 text-amber" />
                </div>
                <p className="text-[15px] font-bold text-text-primary mb-1">{item.title}</p>
                <p className="text-[13px] text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  )
}
