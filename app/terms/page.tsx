import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)]">
      <div className="bg-grid" aria-hidden="true" />
      <div className="relative z-10">
        <PublicNav />

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-32 pb-16 text-center md:pt-40 md:pb-20">
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber mb-4 font-mono">
              Legal
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-text-primary md:text-4xl lg:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-[14px] text-text-tertiary font-mono">
              Effective date: March 5, 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="section-container-narrow pb-24">
          <div className="mx-auto max-w-2xl space-y-10">
            <div className="rounded-2xl border border-border-subtle bg-surface-1 p-8 md:p-10 space-y-8">

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">1. Acceptance of Terms</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  By accessing or using OpsConductor (the &ldquo;Service&rdquo;), operated by OpsConductor (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you may not use the Service. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">2. Description of Service</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  OpsConductor is an AI agent orchestration platform that allows users to create, configure, and manage AI agents connected to third-party services (including but not limited to Gmail, Slack, HubSpot, GitHub, Stripe, Linear, and Notion). The Service provides agent execution, approval workflows, activity logging, and workspace management capabilities. The Service is provided via web application at opsconductor.kenanwilliam.dev and related APIs.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">3. User Accounts</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  You must create an account to use the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You must notify us immediately of any unauthorized use of your account.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">4. User Responsibilities</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary mb-3">
                  When using the Service, you agree to the following:
                </p>
                <ul className="space-y-2">
                  {[
                    "You will not use the Service for any illegal, fraudulent, or unauthorized purpose.",
                    "You will not use AI agents to send spam, phishing messages, or any form of unsolicited communication.",
                    "You will not use the Service to automate actions that violate the terms of service of any connected third-party platform.",
                    "You will not share, expose, or redistribute API keys, OAuth tokens, or access credentials obtained through the Service.",
                    "You will not attempt to gain unauthorized access to the Service, other user accounts, or any systems or networks connected to the Service.",
                    "You will not reverse engineer, decompile, or disassemble any part of the Service.",
                    "You are solely responsible for the actions your configured AI agents take. You must review and configure approval workflows appropriately for your use case.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">5. Intellectual Property</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  The Service, including its design, code, features, documentation, and branding, is owned by OpsConductor and protected by intellectual property laws. You retain ownership of all data you submit to the Service, including agent configurations, workspace settings, and content generated through your use of the Service. We do not claim ownership of your data. You grant us a limited license to use your data solely to operate and provide the Service to you.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">6. Beta and Prototype Disclaimer</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  The Service is currently in beta. Features, pricing, integrations, and APIs may change without notice. The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; during the beta period. We make no guarantees regarding uptime, data durability, or feature availability during the beta phase. We will make reasonable efforts to notify you of material changes that affect your use of the Service.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">7. Payment and Billing</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  Certain features of the Service require a paid subscription. By selecting a paid plan, you agree to pay the applicable fees as described on our Pricing page. Fees are billed in advance on a monthly or annual basis. All fees are non-refundable except where required by law. We reserve the right to change our pricing with 30 days&rsquo; advance notice.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">8. Limitation of Liability</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  To the maximum extent permitted by applicable law, OpsConductor and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, business opportunities, or goodwill, arising out of or in connection with your use of the Service, even if we have been advised of the possibility of such damages. Our total liability for any claim arising from or related to these Terms or the Service shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">9. Indemnification</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  You agree to indemnify and hold harmless OpsConductor and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorney&rsquo;s fees) arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any rights of a third party.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">10. Termination</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice. You may terminate your account at any time by contacting us or through your account settings. Upon termination, your right to use the Service will immediately cease. We will retain your data for 30 days following termination, after which it will be permanently deleted. Provisions of these Terms that by their nature should survive termination shall survive, including ownership, warranty disclaimers, limitation of liability, and indemnification.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">11. Governing Law</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  These Terms shall be governed by and construed in accordance with the laws of the State of [GOVERNING LAW STATE], without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in [GOVERNING LAW STATE].
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">12. Changes to Terms</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms on this page and updating the effective date. Your continued use of the Service after such changes constitutes your acceptance of the revised Terms.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">13. Contact</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  If you have any questions about these Terms, please contact us at{" "}
                  <a href="mailto:legal@opsconductor.io" className="text-amber hover:text-amber-hover transition-colors">legal@opsconductor.io</a>.
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
