"use client"

import Link from "next/link"
import { useState } from "react"
import {
  LayoutDashboard,
  Bot,
  ShieldCheck,
  Activity,
  Plug,
  Settings,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Check,
  X as XIcon,
  Play,
  Pause,
  Mail,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  agents,
  pendingApprovals,
  recentApprovals,
  activityEvents,
  cockpitStats,
  type Agent,
  type Approval,
  type ActivityEvent,
} from "@/lib/mock-data"
import { toast, Toaster } from "sonner"

/* ── Demo Banner ── */
function DemoBanner() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 bg-amber/10 border-b border-amber/20 px-4 py-2">
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-1.5 rounded-full bg-amber status-pending" />
        <span className="text-[12px] font-medium text-amber font-mono">
          DEMO MODE — Viewing the Acme Corp workspace with simulated data
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/signup"
          className="rounded-md bg-amber px-3 py-1 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-amber-hover"
          aria-label="Sign up for free"
        >
          Sign up free
        </Link>
        <Link
          href="/demo/enterprise"
          className="rounded-md border border-amber/30 bg-transparent px-3 py-1 text-[11px] font-semibold text-amber transition-colors hover:bg-amber/10"
          aria-label="Request enterprise demo"
        >
          Enterprise demo
        </Link>
      </div>
    </div>
  )
}

/* ── Sidebar ── */
function DemoSidebar() {
  const [activeTab, setActiveTab] = useState("cockpit")
  const navItems = [
    { id: "cockpit", label: "Cockpit", icon: LayoutDashboard },
    { id: "agents", label: "Agents", icon: Bot },
    { id: "approvals", label: "Approvals", icon: ShieldCheck, badge: pendingApprovals.length },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "integrations", label: "Integrations", icon: Plug },
  ]

  return (
    <aside className="flex w-60 flex-col border-r border-border-subtle bg-surface-1">
      <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-4">
        <img src="/icon.svg" alt="OpsConductor" className="h-7 w-7 hidden dark:block" />
        <img src="/icon-light.svg" alt="OpsConductor" className="h-7 w-7 dark:hidden block" />
        <img src="/brand/wordmark.svg" alt="OpsConductor" className="h-[22px] hidden dark:block" />
        <img src="/brand/wordmark-dark.svg" alt="OpsConductor" className="h-[22px] dark:hidden block" />
      </div>

      {/* Workspace */}
      <div className="px-3 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2 rounded-md bg-surface-2 px-2.5 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-amber/20 text-[10px] font-bold text-amber">A</div>
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-text-primary">Acme Corp</span>
            <span className="text-[10px] text-text-tertiary font-mono">Operator plan</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                activeTab === item.id
                  ? "bg-surface-3 text-text-primary"
                  : "text-text-secondary hover:bg-surface-3 hover:text-text-primary"
              )}
              aria-label={item.label}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warning/20 px-1.5 font-mono text-[11px] font-semibold text-warning">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-border-subtle px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber/20 text-[11px] font-semibold text-amber">
            AR
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">Alex Rivera</span>
            <span className="font-mono text-[11px] text-text-tertiary">alex@acme.com</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ── Stat Cards ── */
function StatCards() {
  const stats = [
    { label: "Actions This Week", value: cockpitStats.totalActionsThisWeek.toString(), trend: cockpitStats.actionsTrend, icon: Zap, accentColor: "text-amber" },
    { label: "Revenue Influenced", value: `$${cockpitStats.revenueInfluenced.toLocaleString()}`, trend: 12, icon: DollarSign, accentColor: "text-success" },
    { label: "Pending Approvals", value: cockpitStats.pendingApprovals.toString(), icon: ShieldCheck, accentColor: "text-warning" },
    { label: "Agent Cost This Month", value: `$${cockpitStats.agentCostThisMonth.toFixed(2)}`, icon: DollarSign, accentColor: "text-text-tertiary" },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-2 rounded-lg border border-border-subtle bg-surface-1 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-text-secondary">{stat.label}</span>
            <stat.icon className={cn("h-4 w-4", stat.accentColor)} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-semibold text-text-primary font-mono">{stat.value}</span>
            {stat.trend !== undefined && (
              <span className={cn(
                "mb-0.5 flex items-center gap-0.5 text-[11px] font-medium",
                stat.trend >= 0 ? "text-success" : "text-danger"
              )}>
                {stat.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.trend >= 0 ? "+" : ""}{stat.trend}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Activity Feed ── */
const appIcons: Record<string, { icon: React.ElementType; color: string }> = {
  Gmail: { icon: Mail, color: "text-danger" },
  HubSpot: { icon: BarChart3, color: "text-warning" },
  Stripe: { icon: CreditCard, color: "text-info" },
  Slack: { icon: MessageSquare, color: "text-info" },
  Notion: { icon: FileText, color: "text-text-secondary" },
  Clearbit: { icon: Search, color: "text-chart-5" },
  "Google Calendar": { icon: Activity, color: "text-success" },
}

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: "bg-success/10 text-success",
    failed: "bg-danger/10 text-danger",
    pending: "bg-warning/10 text-warning",
    running: "bg-amber-dim text-amber",
  }
  return (
    <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-medium", styles[status] || "bg-surface-2 text-text-secondary")}>
      {status}
    </span>
  )
}

function DemoActivityFeed() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const displayed = activityEvents.slice(0, 15)

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
        <h3 className="text-[13px] font-semibold text-text-primary">Live Activity</h3>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-success status-running" />
          <span className="text-[11px] text-text-tertiary font-mono">Real-time</span>
        </div>
      </div>
      <div className="max-h-[480px] overflow-y-auto">
        {displayed.map((event) => {
          const appInfo = appIcons[event.app] || { icon: FileText, color: "text-text-tertiary" }
          const AppIcon = appInfo.icon
          const isExpanded = expandedId === event.id
          return (
            <div key={event.id} className="border-b border-border-subtle last:border-0">
              <button
                onClick={() => event.reasoning && setExpandedId(isExpanded ? null : event.id)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-3"
                aria-label={`${event.agentName}: ${event.action}`}
              >
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-2", appInfo.color)}>
                  <AppIcon className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-text-primary">{event.agentName}</span>
                    <span className="text-[13px] text-text-secondary truncate">{event.action}</span>
                  </div>
                  <span className="text-[11px] text-text-tertiary">{event.target}</span>
                </div>
                <StatusChip status={event.status} />
                <span className="shrink-0 font-mono text-[11px] text-text-tertiary">{event.timestamp}</span>
                {event.reasoning && (isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-text-tertiary" /> : <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />)}
              </button>
              {isExpanded && event.reasoning && (
                <div className="bg-surface-2 px-4 py-3 text-[13px] leading-relaxed text-text-secondary font-mono">
                  {event.reasoning}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Agent Status Panel ── */
function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 60
    const y = 20 - (v / max) * 18
    return `${x},${y}`
  }).join(" ")
  return (
    <svg width="60" height="22" viewBox="0 0 60 22" className="overflow-visible" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber" />
    </svg>
  )
}

function StatusDot({ status }: { status: Agent["status"] }) {
  const styles: Record<string, string> = {
    running: "bg-success status-running",
    idle: "bg-surface-3",
    paused: "bg-warning",
    error: "bg-danger status-error",
  }
  return <div className={cn("h-2 w-2 rounded-full", styles[status])} />
}

function DemoAgentStatusPanel() {
  const activeAgents = agents.filter(a => a.status !== "paused")

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
      <div className="border-b border-border-subtle px-3 py-2.5">
        <h3 className="text-[13px] font-semibold text-text-primary">Agent Status</h3>
      </div>
      <div className="space-y-0.5 p-1.5">
        {activeAgents.map((agent) => (
          <div key={agent.id} className="flex flex-col gap-2 rounded-md p-2.5 transition-colors hover:bg-surface-3 cursor-pointer">
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
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-text-tertiary">
                {agent.actionsThisWeek} actions/wk · ${agent.costThisMonth.toFixed(2)}
              </span>
              <div className="flex-1" />
              {agent.status === "running" && (
                <button onClick={() => toast.info(`Pausing ${agent.name}...`)} className="rounded bg-surface-3 px-2 py-0.5 text-[9px] font-medium text-text-secondary hover:text-text-primary transition-colors" aria-label={`Pause ${agent.name}`}>
                  <Pause className="h-3 w-3 inline mr-0.5" /> Pause
                </button>
              )}
              {(agent.status === "idle" || agent.status === "error") && (
                <button onClick={() => toast.success(`Running ${agent.name}...`)} className="rounded bg-success/10 px-2 py-0.5 text-[9px] font-medium text-success hover:bg-success/20 transition-colors" aria-label={`Run ${agent.name}`}>
                  <Play className="h-3 w-3 inline mr-0.5" /> Run
                </button>
              )}
            </div>
            {agent.nextAction && (
              <div className="flex items-center gap-1.5 rounded bg-surface-2 px-2 py-1">
                <span className="text-[11px] text-text-tertiary">Next:</span>
                <span className="truncate text-[11px] text-text-secondary">{agent.nextAction}</span>
                <span className="shrink-0 font-mono text-[11px] text-text-tertiary">{agent.nextActionTime}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Approval Preview ── */
function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
    high: "bg-danger/10 text-danger",
    critical: "bg-danger/20 text-danger",
  }
  return (
    <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-medium capitalize", styles[level])}>
      {level}
    </span>
  )
}

function DemoApprovalPreview() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const topApprovals = pendingApprovals.filter(a => !dismissed.has(a.id)).slice(0, 4)

  function handleApprove(approval: Approval) {
    setDismissed(prev => new Set(prev).add(approval.id))
    toast.success(`Approved: ${approval.agentName} → ${approval.targetEntity}`)
  }

  function handleReject(approval: Approval) {
    setDismissed(prev => new Set(prev).add(approval.id))
    toast.error(`Rejected: ${approval.agentName} → ${approval.targetEntity}`)
  }

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-warning" />
          <h3 className="text-[13px] font-semibold text-text-primary">Pending Approvals</h3>
        </div>
        <span className="font-mono text-[11px] text-text-tertiary">{topApprovals.length} pending</span>
      </div>
      <div className="divide-y divide-border-subtle">
        {topApprovals.map((approval) => (
          <div key={approval.id} className="px-3 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] font-medium text-text-primary">{approval.agentName}</span>
              <RiskBadge level={approval.riskLevel} />
              <span className="font-mono text-[11px] text-text-tertiary ml-auto">{approval.timestamp}</span>
            </div>
            <p className="text-[13px] text-text-secondary mb-1">{approval.actionDescription}</p>
            {approval.draftContent && (
              <div className="rounded bg-surface-2 p-2 mb-2 font-mono text-[11px] text-text-tertiary whitespace-pre-line max-h-20 overflow-y-auto">
                {approval.draftContent.slice(0, 150)}...
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <button onClick={() => handleApprove(approval)} className="rounded-md bg-success px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-success/90" aria-label={`Approve ${approval.agentName} action`}>
                Approve
              </button>
              <button onClick={() => toast.info("Opening editor...")} className="rounded-md border border-border-base bg-surface-2 px-3 py-1.5 text-[11px] font-semibold text-text-secondary transition-colors hover:text-text-primary" aria-label="Edit and approve">
                Edit & Approve
              </button>
              <button onClick={() => handleReject(approval)} className="rounded-md border border-danger/30 px-3 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-danger/10" aria-label={`Reject ${approval.agentName} action`}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Demo Page ── */
export default function DemoPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <DemoBanner />
      <div className="flex flex-1 overflow-hidden">
        <DemoSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 p-6">
            {/* Header */}
            <div>
              <h1 className="text-xl font-semibold text-text-primary">Cockpit</h1>
              <p className="text-[13px] text-text-secondary">Your AI operations at a glance — Acme Corp workspace</p>
            </div>

            {/* Stats */}
            <StatCards />

            {/* Activity + Agents */}
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3">
                <DemoActivityFeed />
              </div>
              <div className="col-span-2">
                <DemoAgentStatusPanel />
              </div>
            </div>

            {/* Approvals */}
            <DemoApprovalPreview />
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" theme="dark" richColors />
    </div>
  )
}
