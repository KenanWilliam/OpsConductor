"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function PublicNav() {
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
          <Link href="/features" className="nav-link">Features</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/demo" className="nav-link">Demo</Link>
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
          <Link href="/features" className="text-[13px] text-text-secondary">Features</Link>
          <Link href="/pricing" className="text-[13px] text-text-secondary">Pricing</Link>
          <Link href="/demo" className="text-[13px] text-text-secondary">Demo</Link>
          <Link href="/login" className="text-[13px] text-text-secondary">Log in</Link>
          <Link href="/signup" className="btn-primary rounded-[7px] px-4 py-2 text-center text-[13px] font-semibold">
            Start free
          </Link>
        </div>
      )}
    </nav>
  )
}
