"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { IntegrationLogo } from "@/components/integration-logo"
import { RiskBadge } from "@/components/risk-badge"
import { TimeAgo } from "@/components/time-ago"
import { JsonViewer } from "@/components/json-viewer"
import type { DbEvent } from "@/lib/types"
import {
  Search, Filter, Download, Loader2, ChevronDown, ChevronRight,
  Radio, CircleOff, X,
} from "lucide-react"

const PAGE_SIZE = 50
const STATUS_OPTIONS = ['success', 'error', 'pending', 'skipped']
const RISK_OPTIONS = ['low', 'medium', 'high', 'critical']

export default function ActivityPage() {
  const { workspace } = useWorkspace()
  const supabase = createClient()

  const [events, setEvents] = useState<(DbEvent & { agent_name?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [riskFilter, setRiskFilter] = useState<string>("")
  const [integrationFilter, setIntegrationFilter] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [realtimeOn, setRealtimeOn] = useState(true)

  // Drawer
  const [selectedEvent, setSelectedEvent] = useState<(DbEvent & { agent_name?: string }) | null>(null)

  const fetchEvents = useCallback(async (pageNum = 0) => {
    let query = supabase
      .from('events')
      .select('*, agents(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

    if (search.trim()) query = query.or(`title.ilike.%${search.trim()}%,type.ilike.%${search.trim()}%`)
    if (statusFilter) query = query.eq('status', statusFilter)
    if (riskFilter) query = query.eq('risk_level', riskFilter)
    if (integrationFilter) query = query.eq('integration', integrationFilter)

    const { data, count } = await query
    if (data) {
      const mapped = data.map((e: Record<string, unknown>) => ({
        ...e,
        agent_name: (e.agents as Record<string, unknown>)?.name as string,
      })) as (DbEvent & { agent_name?: string })[]
      if (pageNum === 0) setEvents(mapped)
      else setEvents(prev => [...prev, ...mapped])
      setHasMore(data.length === PAGE_SIZE)
    }
    if (count !== null) setTotal(count)
    setLoading(false)
  }, [supabase, search, statusFilter, riskFilter, integrationFilter])

  useEffect(() => {
    setLoading(true)
    setPage(0)
    fetchEvents(0)
  }, [fetchEvents])

  // Realtime subscription for live events
  useEffect(() => {
    if (!realtimeOn || !workspace?.id) return
    const sb = createClient()
    const channel = sb
      .channel('activity-live')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
          filter: `workspace_id=eq.${workspace.id}`,
        },
        (payload) => {
          const evt = payload.new as DbEvent & { agent_name?: string }
          setEvents((prev) => [evt, ...prev])
          setTotal((t) => t + 1)
        }
      )
      .subscribe()

    return () => { sb.removeChannel(channel) }
  }, [realtimeOn, workspace?.id])

  function loadMore() {
    const next = page + 1
    setPage(next)
    fetchEvents(next)
  }

  function exportCSV() {
    const header = 'Time,Agent,Type,Integration,Status,Risk,Title'
    const rows = events.map(e =>
      `"${e.created_at}","${e.agent_name || ''}","${e.type}","${e.integration || ''}","${e.status}","${e.risk_level}","${(e.title || '').replace(/"/g, '""')}"`
    )
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function clearFilters() {
    setSearch("")
    setStatusFilter("")
    setRiskFilter("")
    setIntegrationFilter("")
  }

  const hasActiveFilters = search || statusFilter || riskFilter || integrationFilter

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Activity Log</h1>
          <p className="text-[13px] text-text-secondary">{total.toLocaleString()} events</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setRealtimeOn(!realtimeOn)}
            className={cn("flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors",
              realtimeOn ? "border-success/30 bg-success/10 text-success" : "border-border-base bg-surface-1 text-text-tertiary"
            )}>
            {realtimeOn ? <Radio className="h-3.5 w-3.5" /> : <CircleOff className="h-3.5 w-3.5" />}
            {realtimeOn ? 'Live' : 'Paused'}
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-md border border-border-base bg-surface-1 px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            className="h-9 w-full rounded-md border border-border-base bg-surface-1 pl-9 pr-3 text-[13px] text-text-primary focus:border-amber focus:outline-none" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={cn("flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-medium transition-colors",
            showFilters || hasActiveFilters ? "border-amber bg-amber-dim text-amber" : "border-border-base bg-surface-1 text-text-secondary"
          )}>
          <Filter className="h-3.5 w-3.5" /> Filters
          {hasActiveFilters && <span className="rounded-full bg-amber px-1.5 text-[10px] text-primary-foreground font-bold">!</span>}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-[12px] text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex items-center gap-3 flex-wrap rounded-lg border border-border-subtle bg-surface-1 p-3">
          <div>
            <label className="mb-1 block text-[10px] font-medium text-text-tertiary">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-8 rounded-md border border-border-base bg-surface-2 px-2 text-[12px] text-text-primary focus:border-amber focus:outline-none">
              <option value="">All</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-text-tertiary">Risk</label>
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
              className="h-8 rounded-md border border-border-base bg-surface-2 px-2 text-[12px] text-text-primary focus:border-amber focus:outline-none">
              <option value="">All</option>
              {RISK_OPTIONS.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-text-tertiary">Integration</label>
            <input type="text" value={integrationFilter} onChange={e => setIntegrationFilter(e.target.value)}
              className="h-8 rounded-md border border-border-base bg-surface-2 px-2 text-[12px] text-text-primary focus:border-amber focus:outline-none"
              placeholder="e.g. slack" />
          </div>
        </div>
      )}

      {/* Event table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-text-tertiary" /></div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p className="text-text-secondary text-[13px]">No events found</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border-subtle bg-surface-1 overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-2">
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary w-8"></th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Event</th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Agent</th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Integration</th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Status</th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Risk</th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Time</th>
                </tr>
              </thead>
              <tbody>
                {events.map(evt => (
                  <tr key={evt.id}
                    onClick={() => setSelectedEvent(selectedEvent?.id === evt.id ? null : evt)}
                    className={cn("border-b border-border-subtle last:border-0 cursor-pointer transition-colors",
                      selectedEvent?.id === evt.id ? "bg-amber/5" : "hover:bg-surface-2/50"
                    )}>
                    <td className="py-2.5 px-4">
                      {evt.integration && <IntegrationLogo provider={evt.integration} size={16} />}
                    </td>
                    <td className="py-2.5 px-4 text-text-primary truncate max-w-[300px]">{evt.title || evt.type}</td>
                    <td className="py-2.5 px-4 text-text-secondary">{evt.agent_name || '—'}</td>
                    <td className="py-2.5 px-4 text-text-secondary capitalize">{evt.integration || '—'}</td>
                    <td className="py-2.5 px-4">
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold",
                        evt.status === 'success' ? "bg-success/10 text-success" :
                        evt.status === 'error' ? "bg-red-400/10 text-red-400" :
                        "bg-surface-2 text-text-tertiary"
                      )}>{evt.status}</span>
                    </td>
                    <td className="py-2.5 px-4">{evt.risk_level && <RiskBadge level={evt.risk_level} />}</td>
                    <td className="py-2.5 px-4 text-text-tertiary"><TimeAgo date={evt.created_at} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <button onClick={loadMore}
              className="self-center flex items-center gap-1.5 rounded-md border border-border-base bg-surface-1 px-4 py-2 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors">
              Load more
            </button>
          )}
        </>
      )}

      {/* Side drawer */}
      {selectedEvent && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-surface-1 border-l border-border-subtle shadow-lg z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border-subtle">
            <h2 className="text-[14px] font-semibold text-text-primary">Event Details</h2>
            <button onClick={() => setSelectedEvent(null)} className="text-text-tertiary hover:text-text-primary transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="grid gap-3 text-[13px]">
              <div className="flex justify-between"><span className="text-text-tertiary">Type</span><span className="text-text-primary">{selectedEvent.type}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Agent</span><span className="text-text-primary">{selectedEvent.agent_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Integration</span><span className="text-text-primary capitalize">{selectedEvent.integration || '—'}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Status</span><span className="text-text-primary">{selectedEvent.status}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Risk</span>{selectedEvent.risk_level ? <RiskBadge level={selectedEvent.risk_level} /> : <span className="text-text-primary">—</span>}</div>
              <div className="flex justify-between"><span className="text-text-tertiary">Created</span><span className="text-text-primary"><TimeAgo date={selectedEvent.created_at} /></span></div>
              {selectedEvent.cost_usd && <div className="flex justify-between"><span className="text-text-tertiary">Cost</span><span className="text-text-primary">${selectedEvent.cost_usd.toFixed(4)}</span></div>}
            </div>
            {selectedEvent.description && (
              <div>
                <div className="text-[11px] font-medium text-text-tertiary mb-1">Description</div>
                <p className="text-[13px] text-text-primary">{selectedEvent.description}</p>
              </div>
            )}
            {selectedEvent.payload && (
              <div>
                <div className="text-[11px] font-medium text-text-tertiary mb-1">Payload</div>
                <div className="rounded-md bg-surface-2 p-3">
                  <JsonViewer data={selectedEvent.payload} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
