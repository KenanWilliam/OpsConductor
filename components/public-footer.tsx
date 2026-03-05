import Link from "next/link"

export function PublicFooter() {
  const footerLinks = {
    Product: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Demo", href: "/demo" },
      { label: "Changelog", href: "/changelog" },
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    Legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  }

  return (
    <footer className="relative mt-8 border-t border-border-subtle overflow-hidden">
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
                    <Link href={link.href} className="text-[13px] text-text-secondary transition-colors hover:text-text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text-tertiary mb-4 font-mono">
              Connect
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://twitter.com/opsconductor" target="_blank" rel="noopener noreferrer" className="text-[13px] text-text-secondary transition-colors hover:text-text-primary">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/opsconductor" target="_blank" rel="noopener noreferrer" className="text-[13px] text-text-secondary transition-colors hover:text-text-primary">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/company/opsconductor" target="_blank" rel="noopener noreferrer" className="text-[13px] text-text-secondary transition-colors hover:text-text-primary">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-subtle py-6 md:flex-row">
          <p className="text-[11px] text-text-tertiary font-mono">
            &copy; {new Date().getFullYear()} OpsConductor. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com/opsconductor" target="_blank" rel="noopener noreferrer" className="text-text-tertiary transition-colors hover:text-text-secondary" aria-label="Twitter">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://github.com/opsconductor" target="_blank" rel="noopener noreferrer" className="text-text-tertiary transition-colors hover:text-text-secondary" aria-label="GitHub">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
            </a>
            <a href="https://linkedin.com/company/opsconductor" target="_blank" rel="noopener noreferrer" className="text-text-tertiary transition-colors hover:text-text-secondary" aria-label="LinkedIn">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
