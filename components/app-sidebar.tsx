"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  FileText,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { useRealtimePendingCount } from "@/lib/hooks/use-realtime"
import { createClient } from "@/lib/supabase/client"

const primaryNav = [
  { label: "Cockpit", href: "/cockpit", icon: LayoutDashboard, kbd: "1" },
  { label: "Agents", href: "/agents", icon: Bot, kbd: "2" },
  { label: "Approvals", href: "/approvals", icon: ShieldCheck, kbd: "3" },
  { label: "Workflows", href: "/workflows", icon: Workflow, kbd: "4" },
  { label: "Integrations", href: "/integrations", icon: Plug, kbd: "5" },
  { label: "Activity Log", href: "/activity", icon: Activity, kbd: "6" },
]

const secondaryNav = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Audit Log", href: "/audit", icon: FileText },
]

/* ── User Popover ─────────────────────────────────────────── */
function UserPopover({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const { workspace, profile, user } = useWorkspace()
  const router = useRouter()
  const isDark = theme === "dark"

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  const email = user?.email || ""
  const initials = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)

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

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const used = workspace?.events_used ?? 0
  const limit = workspace?.events_quota ?? 1000
  const pct = limit > 0 ? Math.round((used / limit) * 100) : 0

  return (
    <div
      ref={ref}
      className="user-popover absolute bottom-full left-2 right-2 mb-2 rounded-xl border border-border-subtle bg-surface-2 p-3 shadow-xl z-50"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/20 text-xs font-semibold text-amber">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">{name}</span>
          <span className="font-mono text-[11px] text-text-tertiary">{email}</span>
        </div>
      </div>

      <div className="mb-3 rounded-lg bg-surface-1 p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-text-secondary">Events this month</span>
          <span className="font-mono text-[11px] text-text-tertiary">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
          <div className="h-full rounded-full bg-amber transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-mono text-[10px] text-text-tertiary">{used.toLocaleString()} / {limit.toLocaleString()}</span>
          <span className="text-[10px] text-amber capitalize">{workspace?.plan || 'Free'} Plan</span>
        </div>
      </div>

      <div className="space-y-0.5">
        <Link href="/settings" onClick={onClose} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary">
          <User className="h-3.5 w-3.5" /> Profile
        </Link>
        <Link href="/settings" onClick={onClose} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary">
          <CreditCard className="h-3.5 w-3.5" /> Billing
        </Link>
      </div>

      <div className="my-2 border-t border-border-subtle" />

      <button onClick={() => setTheme(isDark ? "light" : "dark")} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary">
        {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        {isDark ? "Light mode" : "Dark mode"}
      </button>

      <div className="my-2 border-t border-border-subtle" />

      <button onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary">
        <LogOut className="h-3.5 w-3.5" /> Sign out
      </button>
    </div>
  )
}

/* ── App Sidebar ──────────────────────────────────────────── */
export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { workspace, profile, user } = useWorkspace()
  const pendingCount = useRealtimePendingCount()

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  const initials = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn("flex items-center gap-2 border-b border-border-subtle px-4 py-4", collapsed && "justify-center px-2")}>
        <img src="/icon.svg" alt="OpsConductor" className="h-7 w-7 shrink-0 hidden dark:block" />
        <img src="/icon-light.svg" alt="OpsConductor" className="h-7 w-7 shrink-0 dark:hidden block" />
        {!collapsed && (
          <>
            <img src="/brand/wordmark.svg" alt="OpsConductor" className="h-[22px] hidden dark:block" />
            <img src="/brand/wordmark-dark.svg" alt="OpsConductor" className="h-[22px] dark:hidden block" />
          </>
        )}
      </div>

      {/* Workspace name + plan badge */}
      {!collapsed && workspace && (
        <div className="px-4 py-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text-primary truncate">{workspace.name}</span>
            <span className="rounded bg-amber-dim px-1.5 py-0.5 text-[10px] font-medium text-amber capitalize">{workspace.plan}</span>
          </div>
        </div>
      )}

      {/* Primary Nav */}
      <nav className="flex-1 px-2 py-3">
        <div className="space-y-0.5">
          {primaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const badge = item.label === "Approvals" ? pendingCount : undefined
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                data-tour={item.label === 'Integrations' ? 'integrations-nav' : undefined}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-surface-3 text-text-primary" : "text-text-secondary hover:bg-surface-3 hover:text-text-primary",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {badge && badge > 0 ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warning/20 px-1.5 font-mono text-[11px] font-semibold text-warning">{badge}</span>
                    ) : item.kbd ? (
                      <kbd className="hidden rounded border border-border-subtle bg-surface-1 px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary opacity-0 transition-opacity group-hover:block group-hover:opacity-100">{item.kbd}</kbd>
                    ) : null}
                  </>
                )}
                {collapsed && badge && badge > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-warning" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="my-4 border-t border-border-subtle" />

        <div className="space-y-0.5">
          {secondaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href)
            if (item.href === "/audit" && profile?.role === "member") return null
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-surface-3 text-text-primary" : "text-text-secondary hover:bg-surface-3 hover:text-text-primary",
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
        {popoverOpen && !collapsed && <UserPopover onClose={() => setPopoverOpen(false)} />}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn("hidden sm:flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-text-tertiary transition-colors hover:text-text-secondary", collapsed && "justify-center px-2")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>

        <button
          onClick={() => setPopoverOpen((v) => !v)}
          className={cn("mt-2 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-surface-3", collapsed && "justify-center px-2")}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber/20 text-[11px] font-semibold text-amber">{initials}</div>
          {!collapsed && (
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-text-primary">{name}</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] text-text-tertiary capitalize">{workspace?.plan || 'Free'} Plan</span>
                {profile?.role && <span className="rounded bg-surface-3 px-1 py-0.5 text-[10px] text-text-tertiary capitalize">{profile.role}</span>}
              </div>
            </div>
          )}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)} className="fixed left-3 top-3 z-[200] flex h-8 w-8 items-center justify-center rounded-md bg-surface-2 border border-border-subtle sm:hidden">
        <Menu className="h-4 w-4 text-text-secondary" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-[190] bg-black/50 sm:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Mobile sidebar */}
      <aside className={cn("fixed inset-y-0 left-0 z-[200] flex w-60 flex-col border-r border-border-subtle bg-surface-1 transition-transform sm:hidden", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <button onClick={() => setMobileOpen(false)} className="absolute right-2 top-4 rounded p-1 text-text-tertiary hover:text-text-secondary">
          <X className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn("relative hidden sm:flex flex-col border-r border-border-subtle bg-surface-1 transition-all duration-200", collapsed ? "w-14" : "w-60")}>
        {sidebarContent}
      </aside>
    </>
  )
}
