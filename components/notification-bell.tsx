"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, X, CheckCircle2, AlertTriangle, XCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "approval" | "failure" | "success"
  agentName: string
  action: string
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "approval",
    agentName: "Churn Rescue",
    action: "Wants to offer 15% discount to Globex Inc",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "approval",
    agentName: "Lead Nurturer",
    action: "Ready to send follow-up to Sarah Chen",
    timestamp: "5 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "failure",
    agentName: "Deal Nudger",
    action: "Failed to update HubSpot deal stage — API timeout",
    timestamp: "12 min ago",
    read: false,
  },
  {
    id: "n4",
    type: "success",
    agentName: "Lead Nurturer",
    action: "Successfully sent welcome email to Marcus Webb",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: "n5",
    type: "success",
    agentName: "Invoice Chaser",
    action: "Payment reminder sent to Initech",
    timestamp: "2 hours ago",
    read: true,
  },
]

const typeConfig = {
  approval: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    borderColor: "border-l-warning",
  },
  failure: {
    icon: XCircle,
    color: "text-danger",
    bg: "bg-danger/10",
    borderColor: "border-l-danger",
  },
  success: {
    icon: CheckCircle2,
    color: "text-text-tertiary",
    bg: "bg-success/10",
    borderColor: "border-l-success",
  },
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const drawerRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open])

  return (
    <>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-surface-3"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4 text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-[#07070A]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[140] bg-black/30" aria-hidden="true" />

          {/* Drawer panel */}
          <div ref={drawerRef} className="notification-drawer">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <h2 className="text-sm font-semibold text-text-primary">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] font-medium text-amber transition-colors hover:text-amber-hover"
                  >
                    <Check className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-6 w-6 items-center justify-center rounded text-text-tertiary transition-colors hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 border-b border-border-subtle px-4 py-3 transition-colors",
                      !notification.read && "bg-surface-2",
                      "border-l-2",
                      config.borderColor
                    )}
                  >
                    <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md", config.bg)}>
                      <Icon className={cn("h-3.5 w-3.5", config.color)} />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-text-primary">{notification.agentName}</span>
                        {!notification.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                        )}
                      </div>
                      <p className="text-[12px] leading-relaxed text-text-secondary">{notification.action}</p>
                      <span className="mt-0.5 font-mono text-[11px] text-text-tertiary">{notification.timestamp}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
