"use client"

import { TrendingUp, TrendingDown, DollarSign, ShieldCheck, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  trend?: number
  trendLabel?: string
  icon: React.ElementType
  accentColor?: string
  mono?: boolean
  onClick?: () => void
}

export function StatCard({ label, value, trend, trendLabel, icon: Icon, accentColor, mono, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border-subtle bg-surface-1 p-4 text-left transition-colors hover:bg-surface-2",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-text-secondary">{label}</span>
        <Icon className={cn("h-4 w-4", accentColor || "text-text-tertiary")} />
      </div>
      <div className="flex items-end gap-2">
        <span className={cn(
          "text-2xl font-semibold text-text-primary",
          mono && "font-mono"
        )}>
          {value}
        </span>
        {trend !== undefined && (
          <span className={cn(
            "mb-0.5 flex items-center gap-0.5 text-[11px] font-medium",
            trend >= 0 ? "text-success" : "text-danger"
          )}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend >= 0 ? "+" : ""}{trend}%
            {trendLabel && <span className="ml-0.5 text-text-tertiary">{trendLabel}</span>}
          </span>
        )}
      </div>
    </button>
  )
}

export function CockpitStats() {
  return (
    <div className="grid grid-cols-4 gap-3">
      <StatCard
        label="Actions This Week"
        value="81"
        trend={12}
        trendLabel="vs last week"
        icon={Zap}
        accentColor="text-copper"
      />
      <StatCard
        label="Revenue Influenced"
        value="$14,280"
        trend={8}
        icon={DollarSign}
        accentColor="text-success"
        mono
      />
      <StatCard
        label="Pending Approvals"
        value="3"
        icon={ShieldCheck}
        accentColor="text-warning"
      />
      <StatCard
        label="Agent Cost This Month"
        value="$4.89"
        icon={DollarSign}
        mono
      />
    </div>
  )
}
