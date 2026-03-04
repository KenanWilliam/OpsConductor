'use client'

import { cn } from '@/lib/utils'

const dotStyles: Record<string, string> = {
  running: 'bg-success status-running',
  idle: 'bg-amber',
  paused: 'bg-[#6b7280]',
  error: 'bg-danger animate-pulse',
  archived: 'bg-[#374151]',
}

const labelStyles: Record<string, { text: string; color: string }> = {
  running: { text: 'Running', color: 'text-success' },
  idle: { text: 'Idle', color: 'text-amber' },
  paused: { text: 'Paused', color: 'text-[#6b7280]' },
  error: { text: 'Error', color: 'text-danger' },
  archived: { text: 'Archived', color: 'text-[#374151]' },
}

export function AgentStatusDot({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'h-2.5 w-2.5' : 'h-2 w-2'
  return <div className={cn('rounded-full', sizeClass, dotStyles[status] || dotStyles.idle)} />
}

export function AgentStatusLabel({ status }: { status: string }) {
  const s = labelStyles[status] || labelStyles.idle
  return <span className={cn('text-[11px] font-medium', s.color)}>{s.text}</span>
}
