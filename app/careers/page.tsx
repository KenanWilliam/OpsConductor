import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { MapPin, Clock, ArrowRight } from "lucide-react"

const roles = [
  {
    title: "Senior Full-Stack Engineer",
    location: "Remote",
    type: "Full-time",
    description:
      "Own major features end-to-end across the Next.js frontend and Supabase backend. You'll build the agent execution engine, approval workflows, and integration framework that powers OpsConductor.",
  },
  {
    title: "AI/ML Engineer",
    location: "Remote",
    type: "Full-time",
    description:
      "Design and implement the AI agent orchestration layer. Work on agent reasoning, action planning, tool-use chains, and risk scoring. Experience with LLM APIs and structured outputs preferred.",
  },
  {
    title: "Growth & Partnerships",
    location: "Remote",
    type: "Full-time",
    description:
      "Drive adoption among RevOps, DevOps, and GTM teams. Build integration partnerships with SaaS platforms. Own lifecycle marketing, product-led growth loops, and community engagement.",
  },
]

export default function CareersPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      <div className="bg-grid" aria-hidden="true" />
      <div className="relative z-10">
        <PublicNav />

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-32 pb-16 text-center md:pt-40 md:pb-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-4 font-mono">
              Careers
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
              We&rsquo;re building the control layer for AI operations
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-[1.7] text-text-secondary">
              We&rsquo;re a small team moving fast. If you want to work on hard problems at the intersection of AI and ops tooling, we&rsquo;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Open Roles */}
        <section className="section-container-narrow pb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-text-primary md:text-3xl">
              Open roles
            </h2>
          </div>
          <div className="mx-auto max-w-2xl space-y-4">
            {roles.map((role) => (
              <div key={role.title} className="rounded-2xl border border-border-subtle bg-surface-1 p-8 transition-all hover:border-border-base">
                <h3 className="text-lg font-bold text-text-primary mb-2">{role.title}</h3>
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-[13px] text-text-tertiary">
                    <MapPin className="h-3.5 w-3.5" /> {role.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] text-text-tertiary">
                    <Clock className="h-3.5 w-3.5" /> {role.type}
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-text-secondary mb-6">{role.description}</p>
                <a
                  href="mailto:careers@opsconductor.io"
                  className="btn-primary btn-link inline-flex items-center gap-2 rounded-[7px] px-5 py-2 text-[14px] font-semibold"
                >
                  Apply <span className="arrow"><ArrowRight className="h-4 w-4" /></span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Catch-all */}
        <section className="section-container-narrow pb-24">
          <div className="rounded-2xl border border-border-subtle bg-surface-1 p-10 text-center">
            <h3 className="text-lg font-bold text-text-primary mb-2">Don&rsquo;t see your role?</h3>
            <p className="text-[14px] text-text-secondary mb-5">
              Send us a note anyway. We&rsquo;re always looking for exceptional people.
            </p>
            <a
              href="mailto:careers@opsconductor.io"
              className="btn-ghost inline-flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium"
            >
              careers@opsconductor.io
            </a>
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  )
}
