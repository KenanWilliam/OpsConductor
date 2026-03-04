"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Bot,
  ShieldCheck,
  Workflow,
  Plug,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  User,
  CreditCard,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useUser, getUserDisplayInfo } from "@/lib/supabase/hooks"

const primaryNav = [
  { label: "Cockpit", href: "/cockpit", icon: LayoutDashboard, kbd: "1" },
  { label: "Agents", href: "/agents", icon: Bot, kbd: "2" },
  { label: "Approvals", href: "/approvals", icon: ShieldCheck, badge: 3, kbd: "3" },
  { label: "Workflows", href: "/workflows", icon: Workflow, kbd: "4" },
  { label: "Integrations", href: "/integrations", icon: Plug, kbd: "5" },
  { label: "Activity Log", href: "/activity", icon: Activity, kbd: "6" },
]

const secondaryNav = [
  { label: "Settings", href: "/settings", icon: Settings },
]

/* ── User Popover ─────────────────────────────────────────── */
function UserPopover({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useUser()
  const { name, email } = getUserDisplayInfo(user)
  const isDark = theme === "dark"

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [onClose])

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark")
  }

  const used = 2840
  const limit = 10000
  const pct = Math.round((used / limit) * 100)

  return (
    <div
      ref={ref}
      className="user-popover absolute bottom-full left-2 right-2 mb-2 rounded-xl border border-border-subtle bg-surface-2 p-3 shadow-xl"
    >
      {/* Identity */}
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan/20 text-xs font-semibold text-cyan">
          {getUserDisplayInfo(user).initials}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">{name}</span>
          <span className="font-mono text-[11px] text-text-tertiary">{email}</span>
        </div>
      </div>

      {/* Usage meter */}
      <div className="mb-3 rounded-lg bg-surface-1 p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-text-secondary">Events this month</span>
          <span className="font-mono text-[11px] text-text-tertiary">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-cyan transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-mono text-[10px] text-text-tertiary">
            {used.toLocaleString()} / {limit.toLocaleString()}
          </span>
          <span className="text-[10px] text-cyan">Operator Plan</span>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-0.5">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
        >
          <User className="h-3.5 w-3.5" />
          Profile
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
        >
          <CreditCard className="h-3.5 w-3.5" />
          Billing
        </Link>
      </div>

      <div className="my-2 border-t border-border-subtle" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
      >
        {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        {isDark ? "Light mode" : "Dark mode"}
      </button>

      <div className="my-2 border-t border-border-subtle" />

      {/* Sign out */}
      <button onClick={signOut} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary">
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  )
}

/* ── App Sidebar ──────────────────────────────────────────── */
export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { user } = useUser()
  const { initials, name } = getUserDisplayInfo(user)

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border-subtle bg-surface-1 transition-all duration-200",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2 border-b border-border-subtle px-4 py-4",
        collapsed && "justify-center px-2"
      )}>
        <img src="/icon.svg" alt="OpsConductor" className="h-7 w-7 shrink-0" />
        {!collapsed && (
          <img src="/brand/wordmark.svg" alt="OpsConductor" className="h-[22px]" />
        )}
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 px-2 py-3">
        <div className="space-y-0.5">
          {primaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-surface-3 text-text-primary"
                    : "text-text-secondary hover:bg-surface-3 hover:text-text-primary",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warning/20 px-1.5 font-mono text-[11px] font-semibold text-warning">
                        {item.badge}
                      </span>
                    ) : item.kbd ? (
                      <kbd className="hidden rounded border border-border-subtle bg-surface-1 px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
                        {item.kbd}
                      </kbd>
                    ) : null}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-warning" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-border-subtle" />

        {/* Secondary Nav */}
        <div className="space-y-0.5">
          {secondaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-surface-3 text-text-primary"
                    : "text-text-secondary hover:bg-surface-3 hover:text-text-primary",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="relative border-t border-border-subtle px-2 py-3">
        {/* Popover */}
        {popoverOpen && !collapsed && (
          <UserPopover onClose={() => setPopoverOpen(false)} />
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-text-tertiary transition-colors hover:text-text-secondary",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>

        {/* User */}
        <button
          onClick={() => setPopoverOpen((v) => !v)}
          className={cn(
            "mt-2 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-surface-3",
            collapsed && "justify-center px-2"
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan/20 text-[11px] font-semibold text-cyan">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-text-primary">{name}</span>
              <span className="font-mono text-[11px] text-text-tertiary">Operator Plan</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}
