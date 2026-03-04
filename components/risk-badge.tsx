'use client'

import { cn } from '@/lib/utils'

const riskStyles = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20',
  critical: 'bg-danger/10 text-danger border-danger/20 animate-pulse',
}

export function RiskBadge({ level }: { level: string | null | undefined }) {
  if (!level) return null
  const style = riskStyles[level as keyof typeof riskStyles] || riskStyles.low
  return (
    <span className={cn(
      'inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold capitalize',
      style
    )}>
      {level} risk
    </span>
  )
}
