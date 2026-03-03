"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { integrations } from "@/lib/mock-data"
import {
  Plug,
  Mail,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText,
  Cloud,
  Calculator,
  Table,
  Sheet,
  Calendar,
  CalendarClock,
  Check,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  Mail, BarChart3, CreditCard, MessageSquare, FileText,
  Cloud, Calculator, Table, Sheet, Calendar, CalendarClock,
}

function ConnectionStatusDot({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    live: "bg-success",
    expiring: "bg-warning",
    disconnected: "bg-danger",
  }
  return <div className={cn("h-2 w-2 rounded-full", styles[status || "live"])} />
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<"connected" | "available">("connected")

  const connected = integrations.filter(i => i.connected)
  const available = integrations.filter(i => !i.connected)

  const categories = Array.from(new Set(available.map(i => i.category)))

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-indigo" />
          <h1 className="text-xl font-semibold text-text-primary">Integrations</h1>
        </div>
        <p className="text-[13px] text-text-secondary">Connect your tools to power your AI agents</p>
      </div>

      {/* MCP banner */}
      <div className="flex items-center justify-between rounded-lg border border-indigo-dim bg-indigo-dim px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo status-running" />
          <span className="text-[13px] font-medium text-text-primary">Powered by MCP Protocol</span>
          <span className="text-[13px] text-text-secondary">-- 10,000+ integrations available</span>
        </div>
        <button className="flex items-center gap-1 text-[11px] font-medium text-indigo hover:text-indigo/80">
          Request integration <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border-subtle">
        {(["connected", "available"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "border-b-2 px-3 pb-2.5 pt-1 text-[13px] font-medium capitalize transition-colors",
              activeTab === tab
                ? "border-indigo text-text-primary"
                : "border-transparent text-text-tertiary hover:text-text-secondary"
            )}
          >
            {tab} {tab === "connected" && `(${connected.length})`}
          </button>
        ))}
      </div>

      {/* Connected Grid */}
      {activeTab === "connected" && (
        <div className="grid grid-cols-3 gap-3">
          {connected.map((integration) => {
            const Icon = iconMap[integration.icon] || FileText
            return (
              <div key={integration.id} className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
                      <Icon className="h-4.5 w-4.5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{integration.name}</p>
                      <p className="text-[11px] text-text-tertiary">{integration.category}</p>
                    </div>
                  </div>
                  <ConnectionStatusDot status={integration.status} />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-tertiary">Last synced: {integration.lastSynced}</span>
                  <span className="text-text-tertiary">{integration.agentCount} agents</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-border-subtle">
                  {integration.status === "expiring" ? (
                    <button className="flex items-center gap-1 rounded-md bg-warning/10 px-2.5 py-1.5 text-[11px] font-medium text-warning hover:bg-warning/20">
                      <AlertTriangle className="h-3 w-3" /> Reconnect
                    </button>
                  ) : (
                    <button className="rounded-md px-2.5 py-1.5 text-[11px] font-medium text-text-tertiary hover:text-text-secondary">
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Available Grid */}
      {activeTab === "available" && (
        <div className="flex flex-col gap-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="mb-3 text-[13px] font-semibold text-text-primary">{category}</h3>
              <div className="grid grid-cols-3 gap-3">
                {available.filter(i => i.category === category).map((integration) => {
                  const Icon = iconMap[integration.icon] || FileText
                  return (
                    <div key={integration.id} className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-1 p-4 transition-colors hover:border-border-base">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
                          <Icon className="h-4.5 w-4.5 text-text-secondary" />
                        </div>
                        <p className="text-[13px] font-medium text-text-primary">{integration.name}</p>
                      </div>
                      <button className="rounded-md bg-indigo px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-indigo/90 hover:shadow-[0_0_12px_rgba(99,102,241,0.25)]">
                        Connect
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
