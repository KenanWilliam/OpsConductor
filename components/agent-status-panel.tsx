"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { agents, type Agent } from "@/lib/mock-data"

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 60
    const y = 20 - (v / max) * 18
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width="60" height="22" viewBox="0 0 60 22" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-indigo"
      />
    </svg>
  )
}

function StatusDot({ status }: { status: Agent["status"] }) {
  const styles: Record<string, string> = {
    running: "bg-success status-running",
    idle: "bg-[#27272a]",
    paused: "bg-warning",
    error: "bg-danger",
  }
  return <div className={cn("h-2 w-2 rounded-full", styles[status])} />
}

export function AgentStatusPanel() {
  const activeAgents = agents.filter(a => a.status === "running" || a.status === "idle" || a.status === "error")

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
      <div className="border-b border-border-subtle px-3 py-2.5">
        <h3 className="text-[13px] font-semibold text-text-primary">Agent Status</h3>
      </div>
      <div className="space-y-0.5 p-1.5">
        {activeAgents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="flex flex-col gap-2 rounded-md p-2.5 transition-colors hover:bg-surface-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusDot status={agent.status} />
                <span className="text-[13px] font-medium text-text-primary">{agent.name}</span>
              </div>
              <Sparkline data={agent.sparklineData} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-tertiary">{agent.role}</span>
              <span className="font-mono text-[11px] text-text-tertiary">{agent.lastActive}</span>
            </div>
            {agent.nextAction && (
              <div className="flex items-center gap-1.5 rounded bg-surface-2 px-2 py-1">
                <span className="text-[11px] text-text-tertiary">Next:</span>
                <span className="truncate text-[11px] text-text-secondary">{agent.nextAction}</span>
                <span className="shrink-0 font-mono text-[11px] text-text-tertiary">{agent.nextActionTime}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
