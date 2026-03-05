"use client"

import { useState } from "react"
import { ArrowRight, Mail, Shield } from "lucide-react"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "contact" }),
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

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-32 pb-8 text-center md:pt-40 md:pb-12">
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-4 font-mono">
              Contact
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
              Get in touch
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-[1.7] text-text-secondary">
              Have a question, bug report, or enterprise inquiry? We typically respond within 1 business day.
            </p>
          </div>
        </section>

        {/* Form + Sidebar */}
        <section className="section-container-narrow pb-24">
          <div className="mx-auto max-w-3xl grid gap-8 md:grid-cols-5">
            {/* Form */}
            <div className="md:col-span-3">
              {submitted ? (
                <div className="rounded-2xl border border-border-subtle bg-surface-1 p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 mb-5">
                    <svg className="h-7 w-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-text-primary mb-2">Message sent</h2>
                  <p className="text-[15px] text-text-secondary leading-relaxed">
                    We typically respond within 1 business day. Thank you for reaching out.
                  </p>
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
                      <label htmlFor="email" className="block text-[13px] font-medium text-text-primary mb-1.5">Email</label>
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
                      <label htmlFor="subject" className="block text-[13px] font-medium text-text-primary mb-1.5">Subject</label>
                      <select
                        id="subject"
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full rounded-lg border border-border-base bg-surface-2 px-4 py-2.5 text-[14px] text-text-primary focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none appearance-none"
                      >
                        <option value="" disabled>Select a subject</option>
                        <option value="general">General</option>
                        <option value="bug">Bug Report</option>
                        <option value="enterprise">Enterprise Inquiry</option>
                        <option value="integration">Integration Request</option>
                        <option value="oauth-review">OAuth App Review</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-[13px] font-medium text-text-primary mb-1.5">Message</label>
                      <textarea
                        id="message"
                        rows={5}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full rounded-lg border border-border-base bg-surface-2 px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-tertiary focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none resize-none"
                        placeholder="How can we help?"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary btn-link w-full flex items-center justify-center gap-2 rounded-[7px] px-6 py-3 text-[15px] font-semibold disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Send message"}
                      {!loading && <span className="arrow"><ArrowRight className="h-4 w-4" /></span>}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-2 space-y-4">
              <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-amber" />
                  <h3 className="text-[14px] font-semibold text-text-primary">Support</h3>
                </div>
                <a href="mailto:support@opsconductor.io" className="text-[14px] text-amber hover:text-amber-hover transition-colors">
                  support@opsconductor.io
                </a>
                <p className="mt-2 text-[13px] text-text-tertiary">
                  For general support and product questions.
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-amber" />
                  <h3 className="text-[14px] font-semibold text-text-primary">Privacy & OAuth</h3>
                </div>
                <a href="mailto:privacy@opsconductor.io" className="text-[14px] text-amber hover:text-amber-hover transition-colors">
                  privacy@opsconductor.io
                </a>
                <p className="mt-2 text-[13px] text-text-tertiary">
                  For OAuth app review issues, data requests, and integration privacy concerns.
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  We typically respond within <span className="font-semibold text-text-primary">1 business day</span>. For urgent security issues, email{" "}
                  <a href="mailto:security@opsconductor.io" className="text-amber hover:text-amber-hover transition-colors">security@opsconductor.io</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  )
}
