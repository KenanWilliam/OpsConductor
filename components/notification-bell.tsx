"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, X, CheckCircle2, AlertTriangle, XCircle, Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRealtimeNotifications } from "@/lib/hooks/use-realtime"
import { TimeAgo } from "@/components/time-ago"

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; borderColor: string }> = {
  approval: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", borderColor: "border-l-warning" },
  failure: { icon: XCircle, color: "text-danger", bg: "bg-danger/10", borderColor: "border-l-danger" },
  error: { icon: XCircle, color: "text-danger", bg: "bg-danger/10", borderColor: "border-l-danger" },
  success: { icon: CheckCircle2, color: "text-text-tertiary", bg: "bg-success/10", borderColor: "border-l-success" },
  info: { icon: Info, color: "text-info", bg: "bg-info/10", borderColor: "border-l-info" },
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markAllRead, markOneRead } = useRealtimeNotifications()

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    window.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      window.removeEventListener("keydown", handleKey)
    }
  }, [open])

  return (
    <>
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

      {open && (
        <>
          <div className="fixed inset-0 z-[140] bg-black/30" aria-hidden="true" />
          <div ref={drawerRef} className="notification-drawer">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <h2 className="text-sm font-semibold text-text-primary">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] font-medium text-amber transition-colors hover:text-amber-hover">
                    <Check className="h-3 w-3" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="flex h-6 w-6 items-center justify-center rounded text-text-tertiary transition-colors hover:text-text-primary">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-[13px] text-text-tertiary">No notifications</div>
              ) : (
                notifications.map((notification) => {
                  const config = typeConfig[notification.type || 'info'] || typeConfig.info
                  const Icon = config.icon
                  return (
                    <div
                      key={notification.id}
                      onClick={() => !notification.read && markOneRead(notification.id)}
                      role={!notification.read ? 'button' : undefined}
                      tabIndex={!notification.read ? 0 : undefined}
                      onKeyDown={(e) => { if (!notification.read && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); markOneRead(notification.id) } }}
                      className={cn(
                        "flex gap-3 border-b border-border-subtle px-4 py-3 transition-colors border-l-2",
                        !notification.read && "bg-surface-2 cursor-pointer hover:bg-surface-3",
                        config.borderColor
                      )}
                    >
                      <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md", config.bg)}>
                        <Icon className={cn("h-3.5 w-3.5", config.color)} />
                      </div>
                      <div className="flex flex-1 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-text-primary">{notification.title}</span>
                          {!notification.read && <span className="h-1.5 w-1.5 rounded-full bg-amber" />}
                        </div>
                        {notification.body && (
                          <p className="text-[12px] leading-relaxed text-text-secondary">{notification.body}</p>
                        )}
                        <span className="mt-0.5 font-mono text-[11px] text-text-tertiary">
                          <TimeAgo timestamp={notification.created_at} />
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
