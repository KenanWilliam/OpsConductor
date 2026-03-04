"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { pendingApprovals } from "@/lib/mock-data"
import Link from "next/link"
import { ShieldCheck, ArrowRight } from "lucide-react"

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
    high: "bg-danger/10 text-danger",
  }
  return (
    <span className={cn(
      "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-medium capitalize",
      styles[level] || "bg-surface-2 text-text-secondary"
    )}>
      {level}
    </span>
  )
}

export function ApprovalPreview() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const topApprovals = pendingApprovals.filter(a => !dismissed.has(a.id)).slice(0, 3)

  function handleAction(id: string) {
    setDismissed(prev => new Set(prev).add(id))
  }

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-warning" />
          <h3 className="text-[13px] font-semibold text-text-primary">Pending Approvals</h3>
        </div>
        <Link href="/approvals" className="flex items-center gap-1 text-[11px] font-medium text-copper transition-colors hover:text-copper-muted">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border-subtle">
        {topApprovals.map((approval) => (
          <div key={approval.id} className="flex items-center gap-3 px-3 py-3">
            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-text-primary">{approval.agentName}</span>
                <RiskBadge level={approval.riskLevel} />
              </div>
              <p className="truncate text-[13px] text-text-secondary">
                {approval.actionDescription}
              </p>
              <span className="text-[11px] text-text-tertiary">{approval.targetEntity}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button onClick={() => handleAction(approval.id)} className="rounded-md bg-success px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-success/90">
                Approve
              </button>
              <button onClick={() => handleAction(approval.id)} className="rounded-md border border-border-base bg-surface-2 px-3 py-1.5 text-[11px] font-semibold text-text-secondary transition-colors hover:text-text-primary">
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
