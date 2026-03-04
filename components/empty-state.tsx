"use client"

import { CheckCircle } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ElementType
  iconColor?: string
  headline: string
  description: string
}

export function EmptyState({
  icon: Icon = CheckCircle,
  iconColor = "text-success",
  headline,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border-subtle bg-surface-1 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <h3 className="text-[15px] font-semibold text-text-primary">{headline}</h3>
      <p className="max-w-xs text-[13px] text-text-secondary">{description}</p>
    </div>
  )
}
