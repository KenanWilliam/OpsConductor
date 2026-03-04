"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { pendingApprovals, recentApprovals, type Approval } from "@/lib/mock-data"
import { EmptyState } from "@/components/empty-state"
import {
  ShieldCheck,
  Check,
  X,
  Pencil,
  Mail,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react"

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-danger/10 text-danger border-danger/20",
  }
  return (
    <span className={cn(
      "inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold capitalize",
      styles[level]
    )}>
      {level} risk
    </span>
  )
}

function StatusBadge({ status }: { status: Approval["status"] }) {
  const config: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    approved: { icon: CheckCircle2, color: "text-success", label: "Approved" },
    rejected: { icon: XCircle, color: "text-danger", label: "Rejected" },
    "auto-executed": { icon: Zap, color: "text-cyan", label: "Auto-executed" },
    pending: { icon: Clock, color: "text-warning", label: "Pending" },
  }
  const c = config[status]
  return (
    <span className={cn("flex items-center gap-1 text-[11px] font-medium", c.color)}>
      <c.icon className="h-3.5 w-3.5" />
      {c.label}
    </span>
  )
}

const appIcons: Record<string, React.ElementType> = {
  Gmail: Mail,
  HubSpot: BarChart3,
  Stripe: CreditCard,
  Slack: MessageSquare,
  Notion: FileText,
}

function ApprovalCard({ approval, showActions = false, onAction }: { approval: Approval; showActions?: boolean; onAction?: (id: string, action: string) => void }) {
  const AppIcon = appIcons[approval.app] || FileText

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4 transition-colors hover:border-border-base">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2">
            <AppIcon className="h-3.5 w-3.5 text-text-secondary" />
          </div>
          <span className="text-[13px] font-medium text-text-primary">{approval.agentName}</span>
          <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] text-text-tertiary">{approval.agentRole}</span>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge level={approval.riskLevel} />
          {!showActions && <StatusBadge status={approval.status} />}
        </div>
      </div>

      {/* Action description */}
      <p className="text-[13px] leading-relaxed text-text-secondary">
        {approval.actionDescription}
      </p>

      {/* Draft preview */}
      {approval.draftSubject && (
        <div className="rounded-md border border-border-subtle bg-surface-2 p-3">
          <p className="mb-1 text-[11px] font-medium text-text-primary">{approval.draftSubject}</p>
          <p className="whitespace-pre-line font-mono text-[11px] leading-relaxed text-text-tertiary">
            {approval.draftContent}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-text-tertiary">{approval.targetEntity}</span>
          <span className="font-mono text-[11px] text-text-tertiary">{approval.timestamp}</span>
        </div>
        {showActions && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => onAction?.(approval.id, "approved")} className="flex items-center gap-1.5 rounded-md bg-success px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-success/90">
              <Check className="h-3.5 w-3.5" />
              Approve
            </button>
            <button onClick={() => onAction?.(approval.id, "edited")} className="flex items-center gap-1.5 rounded-md border border-border-base bg-surface-2 px-3 py-1.5 text-[11px] font-semibold text-text-secondary transition-colors hover:text-text-primary">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button onClick={() => onAction?.(approval.id, "skipped")} className="flex items-center gap-1.5 rounded-md border border-border-base bg-surface-2 px-3 py-1.5 text-[11px] font-semibold text-text-secondary transition-colors hover:text-text-primary">
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

type TabKey = "pending" | "approved" | "rejected" | "auto-executed"

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("pending")
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const allApprovals = [...pendingApprovals, ...recentApprovals]
  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "pending", label: "Pending", count: pendingApprovals.filter(a => !dismissed.has(a.id)).length },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "auto-executed", label: "Auto-executed" },
  ]

  function handleAction(id: string, action: string) {
    setDismissed(prev => new Set(prev).add(id))
  }

  const filteredApprovals = activeTab === "pending"
    ? pendingApprovals.filter(a => !dismissed.has(a.id))
    : allApprovals.filter(a => a.status === activeTab)

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-warning" />
          <h1 className="text-xl font-semibold text-text-primary">Approvals</h1>
        </div>
        <p className="text-[13px] text-text-secondary">Review and approve agent actions before they execute</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border-subtle">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 pb-2.5 pt-1 text-[13px] font-medium transition-colors",
              activeTab === tab.key
                ? "border-cyan text-text-primary"
                : "border-transparent text-text-tertiary hover:text-text-secondary"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warning/20 px-1.5 font-mono text-[11px] font-semibold text-warning">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Approval cards */}
      <div className="flex flex-col gap-3">
        {filteredApprovals.length > 0 ? (
          filteredApprovals.map((approval) => (
            <ApprovalCard
              key={approval.id}
              approval={approval}
              showActions={activeTab === "pending"}
              onAction={handleAction}
            />
          ))
        ) : activeTab === "pending" ? (
          <EmptyState
            headline="You're all caught up"
            description="No agent actions waiting for your review."
          />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border-subtle bg-surface-1 py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
              <ShieldCheck className="h-6 w-6 text-text-tertiary" />
            </div>
            <p className="text-[13px] text-text-secondary">
              No {activeTab} approvals to show.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
