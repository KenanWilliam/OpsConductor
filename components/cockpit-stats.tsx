"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, ShieldCheck, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { SkeletonLoader } from "@/components/skeleton-loader"
import type { WorkspaceStats } from "@/lib/types"
import Link from "next/link"

interface StatCardProps {
  label: string
  value: string
  trend?: number
  trendLabel?: string
  icon: React.ElementType
  accentColor?: string
  mono?: boolean
  href?: string
}

function StatCard({ label, value, trend, trendLabel, icon: Icon, accentColor, mono, href }: StatCardProps) {
  const content = (
    <div className={cn(
      "flex flex-col gap-2 rounded-lg border border-border-subtle bg-surface-1 p-4 text-left transition-colors hover:bg-surface-2",
      href && "cursor-pointer"
    )}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-text-secondary">{label}</span>
        <Icon className={cn("h-4 w-4", accentColor || "text-text-tertiary")} />
      </div>
      <div className="flex items-end gap-2">
        <span className={cn("text-2xl font-semibold text-text-primary", mono && "font-mono")}>{value}</span>
        {trend !== undefined && (
          <span className={cn("mb-0.5 flex items-center gap-0.5 text-[11px] font-medium", trend >= 0 ? "text-success" : "text-danger")}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend >= 0 ? "+" : ""}{trend}%
            {trendLabel && <span className="ml-0.5 text-text-tertiary">{trendLabel}</span>}
          </span>
        )}
      </div>
    </div>
  )

  if (href) return <Link href={href}>{content}</Link>
  return content
}

export function CockpitStats() {
  const { workspace } = useWorkspace()
  const [stats, setStats] = useState<WorkspaceStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workspace?.id) return
    const supabase = createClient()

    async function fetchStats() {
      const { data } = await supabase.rpc('workspace_stats')
      if (data) {
        // workspace_stats may return an array with one row or just an object
        const row = Array.isArray(data) ? data[0] : data
        setStats(row)
      }
      setLoading(false)
    }

    fetchStats()
  }, [workspace?.id])

  if (loading) return <SkeletonLoader type="card" />

  const s = stats || {
    agents_total: 0, agents_running: 0, pending_approvals: 0,
    events_this_week: 0, cost_this_week: 0, events_quota: 1000, events_used: 0
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      <StatCard
        label="Actions This Week"
        value={String(s.events_this_week)}
        icon={Zap}
        accentColor="text-amber"
      />
      <StatCard
        label="Pending Approvals"
        value={String(s.pending_approvals)}
        icon={ShieldCheck}
        accentColor="text-warning"
        href="/approvals"
      />
      <StatCard
        label="Agent Cost (Week)"
        value={`$${(s.cost_this_week ?? 0).toFixed(2)}`}
        icon={DollarSign}
        mono
      />
      <StatCard
        label="Quota Used"
        value={`${s.events_used} / ${s.events_quota}`}
        icon={Zap}
        accentColor="text-info"
        mono
      />
    </div>
  )
}
