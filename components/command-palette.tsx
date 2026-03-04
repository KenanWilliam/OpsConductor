"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Bot, LayoutDashboard, ShieldCheck, Workflow, Plug, Activity,
  Settings, Search, ArrowRight, FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  category: string
  href?: string
  action?: () => void
}

const staticCommands: CommandItem[] = [
  { id: "nav-cockpit", label: "Go to Cockpit", icon: LayoutDashboard, category: "Navigation", href: "/cockpit" },
  { id: "nav-agents", label: "Go to Agents", icon: Bot, category: "Navigation", href: "/agents" },
  { id: "nav-approvals", label: "Go to Approvals", icon: ShieldCheck, category: "Navigation", href: "/approvals" },
  { id: "nav-workflows", label: "Go to Workflows", icon: Workflow, category: "Navigation", href: "/workflows" },
  { id: "nav-integrations", label: "Go to Integrations", icon: Plug, category: "Navigation", href: "/integrations" },
  { id: "nav-activity", label: "Go to Activity Log", icon: Activity, category: "Navigation", href: "/activity" },
  { id: "nav-settings", label: "Go to Settings", icon: Settings, category: "Navigation", href: "/settings" },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [agentCommands, setAgentCommands] = useState<CommandItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Fetch agents dynamically when palette opens
  useEffect(() => {
    if (!open) return
    const supabase = createClient()
    supabase
      .from('agents')
      .select('id, name, role')
      .neq('status', 'archived')
      .order('name')
      .then(({ data }) => {
        if (data) {
          setAgentCommands(
            data.map((agent) => ({
              id: `agent-${agent.id}`,
              label: agent.name,
              description: agent.role || undefined,
              icon: Bot,
              category: "Agents",
              href: `/agents/${agent.id}`,
            }))
          )
        }
      })
  }, [open])

  // Build full command list including agents
  const allCommands: CommandItem[] = [
    ...agentCommands,
    ...staticCommands,
  ]

  const filtered = query.trim()
    ? allCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          (cmd.description && cmd.description.toLowerCase().includes(query.toLowerCase()))
      )
    : allCommands

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  const flatFiltered = Object.values(grouped).flat()

  const executeCommand = useCallback(
    (cmd: CommandItem) => {
      setOpen(false)
      setQuery("")
      if (cmd.href) router.push(cmd.href)
      else if (cmd.action) cmd.action()
    },
    [router]
  )

  // ⌘K / Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
        setQuery("")
        setSelectedIndex(0)
      }
      if (e.key === "Escape") {
        setOpen(false)
        setQuery("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    function handleNav(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (flatFiltered[selectedIndex]) executeCommand(flatFiltered[selectedIndex])
      }
    }
    window.addEventListener("keydown", handleNav)
    return () => window.removeEventListener("keydown", handleNav)
  }, [open, selectedIndex, flatFiltered, executeCommand])

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!open) return null

  let globalIndex = -1

  return (
    <>
      {/* Backdrop */}
      <div
        className="cmd-palette-backdrop"
        onClick={() => {
          setOpen(false)
          setQuery("")
        }}
      />

      {/* Palette */}
      <div className="cmd-palette">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--color-border-base)] px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, pages, actions…"
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
          />
          <kbd>Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto p-2">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-2 last:mb-0">
              <p className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                {category}
              </p>
              {items.map((cmd) => {
                globalIndex++
                const idx = globalIndex
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      idx === selectedIndex
                        ? "bg-[var(--color-accent-dim)] text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-3)]"
                    )}
                  >
                    <cmd.icon className="h-4 w-4 shrink-0" />
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium">{cmd.label}</span>
                      {cmd.description && (
                        <span className="text-[11px] text-[var(--color-text-tertiary)]">{cmd.description}</span>
                      )}
                    </div>
                    {idx === selectedIndex && <ArrowRight className="h-3.5 w-3.5 text-[var(--color-accent-amber)]" />}
                  </button>
                )
              })}
            </div>
          ))}
          {flatFiltered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <FileText className="h-8 w-8 text-[var(--color-text-disabled)]" />
              <p className="text-sm text-[var(--color-text-tertiary)]">No results found</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
