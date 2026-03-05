import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"

export default function PrivacyPage() {
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
              Privacy Policy
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
                <h2 className="text-lg font-bold text-text-primary mb-3">1. Introduction</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  OpsConductor (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the OpsConductor platform, accessible at opsconductor.kenanwilliam.dev and related services (collectively, the &ldquo;Service&rdquo;). This Privacy Policy describes how we collect, use, store, and protect your personal information when you use our Service. By using OpsConductor, you agree to the collection and use of information in accordance with this policy.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">2. Data We Collect</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary mb-3">
                  We collect the following categories of data in connection with the Service:
                </p>
                <ul className="space-y-2.5">
                  {[
                    { title: "Account Information", desc: "When you sign up, we collect your name, email address, and password hash. If you sign up via a third-party OAuth provider, we receive your name and email from that provider." },
                    { title: "Workspace Data", desc: "Information you provide when creating and configuring workspaces, including workspace names, member invitations, and role assignments." },
                    { title: "Usage Data", desc: "We collect information about how you interact with the Service, including pages visited, features used, agent configurations created, and actions taken within the cockpit." },
                    { title: "OAuth Tokens", desc: "When you connect third-party integrations (e.g., Gmail, Slack, HubSpot, GitHub, Stripe, Linear, Notion), we store encrypted OAuth access tokens and refresh tokens necessary to maintain those integrations on your behalf." },
                    { title: "Agent Run Logs", desc: "We store logs of all agent actions, including timestamps, action types, reasoning traces, input/output data, cost metrics, and approval decisions. These logs enable audit trails and activity feed functionality." },
                    { title: "Device and Browser Data", desc: "We automatically collect IP address, browser type, operating system, device identifiers, and referral URLs when you access the Service. This data is used for security, analytics, and service improvement." },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      <span><span className="font-semibold text-text-primary">{item.title}:</span> {item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">3. How We Use Your Data</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary mb-3">
                  We use the data we collect solely to operate, maintain, and improve the Service. Specifically:
                </p>
                <ul className="space-y-2">
                  {[
                    "To create and manage your account and workspaces",
                    "To execute AI agent actions on your behalf using connected integrations",
                    "To provide the approval workflow, activity feed, and audit trail features",
                    "To authenticate your identity and maintain session security",
                    "To send transactional emails (e.g., approval notifications, password resets)",
                    "To monitor and improve Service performance, reliability, and security",
                    "To respond to support requests and communicate with you about the Service",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[14px] leading-relaxed text-text-secondary font-semibold">
                  We do not sell, rent, or share your personal data with third parties for their marketing purposes. We do not use your data to train AI models.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">4. Third-Party Data Processors</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary mb-3">
                  We use the following third-party services to operate the platform. Each processor handles data in accordance with their own privacy policies:
                </p>
                <ul className="space-y-2">
                  {[
                    { name: "Supabase", desc: "Database hosting, authentication, and row-level security. Data stored on Supabase infrastructure with AES-256 encryption at rest." },
                    { name: "Vercel", desc: "Application hosting, serverless functions, and edge delivery. Processes request metadata for routing and performance." },
                    { name: "OAuth Providers", desc: "Google (Gmail), Slack, GitHub, HubSpot, Stripe, Linear, and Notion. We use their OAuth 2.0 APIs to authenticate integrations and execute agent actions. We only request the minimum scopes necessary." },
                  ].map((item) => (
                    <li key={item.name} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      <span><span className="font-semibold text-text-primary">{item.name}:</span> {item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">5. Data Retention and Deletion</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  We retain your personal data for as long as your account is active or as needed to provide you the Service. Agent run logs are retained according to your plan tier (7 days for Free, 90 days for Pro, 365 days for Enterprise). When you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required by law to retain certain records. OAuth tokens for disconnected integrations are deleted immediately upon disconnection.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">6. Your Rights</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary mb-3">
                  Depending on your jurisdiction, you may have the following rights regarding your personal data:
                </p>
                <ul className="space-y-2">
                  {[
                    { title: "Right of Access", desc: "You may request a copy of the personal data we hold about you." },
                    { title: "Right to Export", desc: "You may export your agent configurations, activity logs, and workspace data at any time from your account settings." },
                    { title: "Right to Deletion", desc: "You may request deletion of your account and all associated personal data. We will process deletion requests within 30 days." },
                    { title: "Right to Rectification", desc: "You may update or correct your personal information through your account settings." },
                    { title: "Right to Object", desc: "You may object to certain processing activities. Contact us at privacy@opsconductor.io to exercise this right." },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      <span><span className="font-semibold text-text-primary">{item.title}:</span> {item.desc}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:privacy@opsconductor.io" className="text-amber hover:text-amber-hover transition-colors">privacy@opsconductor.io</a>.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">7. Cookie Usage</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  OpsConductor uses strictly necessary cookies to maintain your authentication session and store your theme preference. We do not use advertising cookies, tracking pixels, or third-party analytics cookies. Session cookies expire when you close your browser or after 7 days of inactivity. The theme preference cookie is stored locally and does not transmit data to our servers.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">8. Data Security</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  We implement industry-standard security measures to protect your data, including TLS 1.3 encryption for all data in transit, AES-256 encryption at rest via Supabase, row-level security (RLS) policies for workspace isolation, JWT-based session authentication, and secure storage of OAuth tokens with database-level encryption. For more details, see our{" "}
                  <a href="/security" className="text-amber hover:text-amber-hover transition-colors">Security page</a>.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">9. Children&rsquo;s Privacy</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  The Service is not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If we become aware that we have collected personal data from a child without parental consent, we will take steps to delete that information.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">10. Changes to This Policy</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the effective date. We encourage you to review this page periodically for the latest information on our privacy practices.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary mb-3">11. Contact Us</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:{" "}
                  <a href="mailto:privacy@opsconductor.io" className="text-amber hover:text-amber-hover transition-colors">privacy@opsconductor.io</a>
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
