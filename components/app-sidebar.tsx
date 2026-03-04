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
  FileText,
  Newspaper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const primaryNav = [
  { label: "Cockpit", href: "/cockpit", icon: LayoutDashboard },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Approvals", href: "/approvals", icon: ShieldCheck, badge: 3 },
  { label: "Workflows", href: "/workflows", icon: Workflow },
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Activity Log", href: "/activity", icon: Activity },
]

const secondaryNav = [
  { label: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border-subtle bg-surface-1 transition-all duration-200",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2 border-b border-border-subtle px-4 py-4",
        collapsed && "justify-center px-2"
      )}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-copper text-primary-foreground">
          <LayoutDashboard className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-text-primary">
            OpsConductor
          </span>
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
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
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
                    {item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warning/20 px-1.5 font-mono text-[11px] font-semibold text-warning">
                        {item.badge}
                      </span>
                    )}
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
      <div className="border-t border-border-subtle px-2 py-3">
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
        {!collapsed && (
          <div className="mt-2 flex items-center gap-2.5 rounded-md px-2.5 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-3 text-[11px] font-semibold text-text-primary">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary">Jane Doe</span>
              <span className="font-mono text-[11px] text-text-tertiary">Operator Plan</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mt-2 flex justify-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-3 text-[11px] font-semibold text-text-primary">
              JD
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
