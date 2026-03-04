"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { TimeAgo } from "@/components/time-ago"
import { JsonViewer } from "@/components/json-viewer"
import { EmptyState } from "@/components/empty-state"
import type { DbAuditLog } from "@/lib/types"
import {
  FileText, Loader2, ChevronDown, ChevronRight, Filter, ShieldAlert,
} from "lucide-react"

const PAGE_SIZE = 50
const ACTION_OPTIONS = ["INSERT", "UPDATE", "DELETE"]

export default function AuditLogPage() {
  const { workspace, profile } = useWorkspace()
  const supabase = createClient()

  const [logs, setLogs] = useState<DbAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  // Filters
  const [actionFilter, setActionFilter] = useState("")
  const [tableFilter, setTableFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // RBAC: only owner/admin can see this page
  const canAccess = profile?.role === "owner" || profile?.role === "admin"

  const fetchLogs = useCallback(async (pageNum = 0) => {
    if (!canAccess) return

    let query = supabase
      .from("audit_log")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

    if (actionFilter) query = query.eq("action", actionFilter)
    if (tableFilter) query = query.eq("table_name", tableFilter)

    const { data, count } = await query
    if (data) {
      if (pageNum === 0) setLogs(data as DbAuditLog[])
      else setLogs((prev) => [...prev, ...(data as DbAuditLog[])])
      setHasMore(data.length === PAGE_SIZE)
    }
    if (count !== null) setTotal(count)
    setLoading(false)
  }, [supabase, actionFilter, tableFilter, canAccess])

  useEffect(() => {
    if (!workspace?.id) return
    setLoading(true)
    setPage(0)
    fetchLogs(0)
  }, [fetchLogs, workspace?.id])

  function loadMore() {
    const next = page + 1
    setPage(next)
    fetchLogs(next)
  }

  // 403 for non-admins
  if (!loading && !canAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-400/10">
          <ShieldAlert className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">Access Denied</h2>
        <p className="text-[13px] text-text-secondary max-w-xs text-center">
          Only workspace owners and admins can view the audit log.
        </p>
      </div>
    )
  }

  function renderChanges(log: DbAuditLog) {
    if (log.action === "INSERT" && log.new_data) {
      return (
        <div>
          <div className="text-[11px] font-medium text-success mb-1">New Data</div>
          <JsonViewer data={log.new_data} />
        </div>
      )
    }
    if (log.action === "DELETE" && log.old_data) {
      return (
        <div>
          <div className="text-[11px] font-medium text-red-400 mb-1">Deleted Data</div>
          <JsonViewer data={log.old_data} />
        </div>
      )
    }
    if (log.action === "UPDATE") {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {log.old_data && (
            <div>
              <div className="text-[11px] font-medium text-red-400 mb-1">Old Values</div>
              <JsonViewer data={log.old_data} />
            </div>
          )}
          {log.new_data && (
            <div>
              <div className="text-[11px] font-medium text-success mb-1">New Values</div>
              <JsonViewer data={log.new_data} />
            </div>
          )}
        </div>
      )
    }
    return <span className="text-[12px] text-text-tertiary italic">No data available</span>
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber" />
            <h1 className="text-xl font-semibold text-text-primary">Audit Log</h1>
          </div>
          <p className="text-[13px] text-text-secondary">{total.toLocaleString()} entries</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-medium transition-colors",
            showFilters ? "border-amber bg-amber-dim text-amber" : "border-border-base bg-surface-1 text-text-secondary"
          )}
        >
          <Filter className="h-3.5 w-3.5" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="flex items-center gap-3 flex-wrap rounded-lg border border-border-subtle bg-surface-1 p-3">
          <div>
            <label className="mb-1 block text-[10px] font-medium text-text-tertiary">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-8 rounded-md border border-border-base bg-surface-2 px-2 text-[12px] text-text-primary focus:border-amber focus:outline-none"
            >
              <option value="">All</option>
              {ACTION_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-text-tertiary">Table</label>
            <input
              type="text"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="h-8 rounded-md border border-border-base bg-surface-2 px-2 text-[12px] text-text-primary focus:border-amber focus:outline-none"
              placeholder="e.g. agents"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
        </div>
      ) : logs.length === 0 ? (
        <EmptyState icon={FileText} headline="No audit entries" description="Database changes will appear here as they happen." />
      ) : (
        <>
          <div className="rounded-lg border border-border-subtle bg-surface-1 overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-2">
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary w-8"></th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Time</th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Action</th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Table</th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Record ID</th>
                  <th className="py-2 px-4 text-left text-[11px] font-medium text-text-tertiary">Actor</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const isExpanded = expandedId === log.id
                  return (
                    <>
                      <tr
                        key={log.id}
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className={cn(
                          "border-b border-border-subtle last:border-0 cursor-pointer transition-colors",
                          isExpanded ? "bg-amber/5" : "hover:bg-surface-2/50"
                        )}
                      >
                        <td className="py-2.5 px-4">
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-text-tertiary">
                          <TimeAgo timestamp={log.created_at} />
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold",
                              log.action === "INSERT"
                                ? "bg-success/10 text-success"
                                : log.action === "DELETE"
                                ? "bg-red-400/10 text-red-400"
                                : "bg-blue-400/10 text-blue-400"
                            )}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-text-secondary">
                          {log.table_name || "—"}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-text-tertiary max-w-[200px] truncate">
                          {log.record_id || "—"}
                        </td>
                        <td className="py-2.5 px-4 text-text-secondary">
                          {log.actor?.full_name || log.actor_id?.slice(0, 8) || "system"}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${log.id}-detail`} className="border-b border-border-subtle">
                          <td colSpan={6} className="p-4 bg-surface-2/30">
                            {renderChanges(log)}
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <button
              onClick={loadMore}
              className="self-center flex items-center gap-1.5 rounded-md border border-border-base bg-surface-1 px-4 py-2 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  )
}
