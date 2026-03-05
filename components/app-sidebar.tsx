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
  Monitor,
  User,
  CreditCard,
  LogOut,
  FileText,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef, useCallback } from "react"
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

/* ── Mode Toggle (System / Light / Dark) — icon-only ──────── */
function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const modes = [
    { key: "system", icon: Monitor, label: "System" },
    { key: "light", icon: Sun, label: "Light" },
    { key: "dark", icon: Moon, label: "Dark" },
  ] as const

  return (
    <div className="flex items-center gap-0.5 rounded-md bg-surface-2 dark:bg-[#0B1018] p-0.5">
      {modes.map((m) => {
        const active = theme === m.key
        return (
          <button
            key={m.key}
            onClick={() => setTheme(m.key)}
            className={cn(
              "flex items-center justify-center rounded-md p-1.5 transition-all",
              active
                ? "bg-surface-3 dark:bg-[#1C2535] text-text-primary dark:text-white shadow-sm"
                : "text-text-tertiary dark:text-[#9CA3AF] hover:text-text-primary dark:hover:text-white"
            )}
            title={m.label}
          >
            <m.icon className="h-3.5 w-3.5" />
          </button>
        )
      })}
    </div>
  )
}

/* ── App Sidebar ──────────────────────────────────────────── */
export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { workspace, profile, user } = useWorkspace()
  const pendingCount = useRealtimePendingCount()

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  const initials = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
  const email = user?.email || ""

  const used = workspace?.events_used ?? 0
  const limit = workspace?.events_quota ?? 1000
  const pct = limit > 0 ? Math.round((used / limit) * 100) : 0

  // Click-outside handler — closes popover only when clicking outside both trigger and menu
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Escape key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  // Calculate popover position from trigger
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({
    position: "fixed" as const,
    zIndex: 9999,
    minWidth: 260,
    visibility: "hidden" as const,
  })

  const updatePopoverPosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPopoverStyle({
      position: "fixed" as const,
      bottom: window.innerHeight - rect.top + 8,
      left: rect.left,
      zIndex: 9999,
      minWidth: 260,
      visibility: "visible" as const,
    })
  }, [])

  // Calculate position immediately on open and track resize/scroll
  useEffect(() => {
    if (open) {
      // Compute position synchronously on the next frame to avoid displacement
      requestAnimationFrame(updatePopoverPosition)
      window.addEventListener("resize", updatePopoverPosition)
      window.addEventListener("scroll", updatePopoverPosition, true)
      return () => {
        window.removeEventListener("resize", updatePopoverPosition)
        window.removeEventListener("scroll", updatePopoverPosition, true)
      }
    }
  }, [open, updatePopoverPosition])

  async function handleSignOut() {
    setOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2 border-b border-border-subtle py-4 px-4",
        collapsed && "justify-center"
      )}>
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
      <div className="border-t border-border-subtle px-2 py-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn("hidden sm:flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-text-tertiary transition-colors hover:text-text-secondary", collapsed && "justify-center px-2")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>

        <button
          ref={triggerRef}
          onClick={() => setOpen((v) => !v)}
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
      {/* ── Floating popover (portalled to body via fixed positioning) ── */}
      {open && (
        <div ref={menuRef} style={popoverStyle} className="rounded-xl border border-border-base bg-popover p-2 shadow-2xl">
          {/* User info header */}
          <div className="mb-2 flex items-center gap-2.5 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/20 text-xs font-semibold text-amber">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary">{name}</span>
              <span className="font-mono text-[11px] text-text-tertiary">{email}</span>
            </div>
          </div>

          {/* Monthly Events */}
          <div className="mx-1 mb-2 rounded-lg bg-surface-2 p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-text-tertiary">Monthly Events</span>
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

          {/* Divider */}
          <div className="my-1 border-t border-border-subtle" />

          {/* Profile & Settings */}
          <button
            onClick={() => { setOpen(false); router.push("/settings") }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary cursor-pointer"
          >
            <User className="h-4 w-4" />
            Profile & Settings
          </button>

          {/* Billing */}
          <button
            onClick={() => { setOpen(false); router.push("/settings?tab=billing") }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary cursor-pointer"
          >
            <CreditCard className="h-4 w-4" />
            Billing
          </button>

          {/* Mode toggle — Title left, toggles right */}
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-sm text-text-secondary">Theme</span>
            <ModeToggle />
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-border-subtle" />

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}

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
