"use client"

import { use, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { agents, activityEvents } from "@/lib/mock-data"
import { ActivityFeed } from "@/components/activity-feed"
import { BrandIcon } from "@/components/brand-icons"
import {
  ArrowLeft,
  Clock,
  Pause,
  Play,
  Settings,
  MoreHorizontal,
} from "lucide-react"

function StatusDot({ status }: { status: string }) {
  const styles: Record<string, string> = {
    running: "bg-success status-running",
    idle: "bg-[#27272a]",
    paused: "bg-warning",
    error: "bg-danger",
  }
  return <div className={cn("h-2.5 w-2.5 rounded-full", styles[status])} />
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const agent = agents.find(a => a.id === id) || agents[0]
  const agentEvents = activityEvents.filter(e => e.agentId === agent.id)
  const [agentStatus, setAgentStatus] = useState(agent.status)

  const approvalRules = [
    { action: "Send email", level: "Ask me" },
    { action: "Update CRM", level: "Auto" },
    { action: "Create deal", level: "Always ask" },
    { action: "Post to Slack", level: "Auto" },
  ]

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Back nav */}
      <Link href="/agents" className="flex items-center gap-1.5 text-[13px] text-text-tertiary transition-colors hover:text-text-secondary">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Agents
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusDot status={agentStatus} />
          <div>
            <h1 className="text-xl font-semibold text-text-primary">{agent.name}</h1>
            <p className="text-[13px] text-text-secondary">{agent.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {agentStatus === "running" ? (
            <button onClick={() => setAgentStatus("paused")} className="flex items-center gap-1.5 rounded-md border border-border-base bg-surface-2 px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary">
              <Pause className="h-3.5 w-3.5" /> Pause
            </button>
          ) : (
            <button onClick={() => setAgentStatus("running")} className="flex items-center gap-1.5 rounded-md bg-success px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-success/90">
              <Play className="h-3.5 w-3.5" /> Resume
            </button>
          )}
          <button onClick={() => alert("Agent settings would open here.")} className="flex items-center gap-1.5 rounded-md border border-border-base bg-surface-2 px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary">
            <Settings className="h-3.5 w-3.5" /> Edit
          </button>
          <button className="rounded-md border border-border-base bg-surface-2 p-1.5 text-text-tertiary transition-colors hover:text-text-secondary">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content: Timeline + Sidebar */}
      <div className="grid grid-cols-10 gap-5">
        {/* Activity Timeline - 70% */}
        <div className="col-span-7">
          <ActivityFeed events={agentEvents.length > 0 ? agentEvents : activityEvents.slice(0, 4)} />
        </div>

        {/* Metadata Sidebar - 30% */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Agent Info Card */}
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-4">
            <h3 className="mb-3 text-[13px] font-semibold text-text-primary">Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-tertiary">Status</span>
                <span className={cn(
                  "text-[11px] font-medium capitalize",
                  agentStatus === "running" ? "text-success" :
                  agentStatus === "error" ? "text-danger" :
                  agentStatus === "paused" ? "text-warning" : "text-text-tertiary"
                )}>
                  {agentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-tertiary">Created</span>
                <span className="font-mono text-[11px] text-text-secondary">{agent.createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-tertiary">Total Actions</span>
                <span className="font-mono text-[11px] text-text-secondary">{agent.totalActions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-tertiary">Total Cost</span>
                <span className="font-mono text-[11px] text-text-secondary">${agent.totalCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-border-subtle pt-3">
                <span className="mb-2 block text-[11px] text-text-tertiary">Connected Apps</span>
                <div className="flex flex-wrap gap-1.5">
                  {agent.connectedApps.map((app) => (
                    <div key={app} className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-2 px-2 py-1">
                      <BrandIcon name={app} className="h-3.5 w-3.5" />
                      <span className="text-[11px] text-text-secondary">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Approval Rules Card */}
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-text-primary">Approval Rules</h3>
              <button onClick={() => alert("Approval rules editor would open here.")} className="text-[11px] text-amber hover:text-amber-hover">Edit</button>
            </div>
            <div className="space-y-2">
              {approvalRules.map((rule) => (
                <div key={rule.action} className="flex items-center justify-between rounded-md bg-surface-2 px-2.5 py-2">
                  <span className="text-[11px] text-text-secondary">{rule.action}</span>
                  <span className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[11px] font-medium",
                    rule.level === "Auto" ? "bg-success/10 text-success" :
                    rule.level === "Ask me" ? "bg-warning/10 text-warning" :
                    "bg-danger/10 text-danger"
                  )}>
                    {rule.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Actions Card */}
          {agent.nextAction && (
            <div className="rounded-lg border border-border-subtle bg-surface-1 p-4">
              <h3 className="mb-3 text-[13px] font-semibold text-text-primary">Upcoming</h3>
              <div className="flex items-start gap-2 rounded-md bg-surface-2 p-2.5">
                <Clock className="mt-0.5 h-3.5 w-3.5 text-text-tertiary" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-text-secondary">{agent.nextAction}</span>
                  <span className="font-mono text-[11px] text-text-tertiary">{agent.nextActionTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
