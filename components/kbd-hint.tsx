"use client"

import { cn } from "@/lib/utils"

interface KbdHintProps {
  keys: string[]
  className?: string
}

/**
 * Keyboard shortcut hint badges.
 * Usage: <KbdHint keys={["⌘", "K"]} />
 */
export function KbdHint({ keys, className }: KbdHintProps) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {keys.map((key, i) => (
        <kbd key={i}>{key}</kbd>
      ))}
    </span>
  )
}

/**
 * Wrapper: shows a tooltip with a keyboard shortcut on hover.
 */
interface KbdTooltipProps {
  keys: string[]
  children: React.ReactNode
  className?: string
}

export function KbdTooltip({ keys, children, className }: KbdTooltipProps) {
  return (
    <span className={cn("group relative inline-flex items-center", className)}>
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <KbdHint keys={keys} />
      </span>
    </span>
  )
}
