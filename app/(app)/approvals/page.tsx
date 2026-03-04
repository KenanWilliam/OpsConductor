"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { useRealtimeApprovals } from "@/lib/hooks/use-realtime"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import { RiskBadge } from "@/components/risk-badge"
import { TimeAgo } from "@/components/time-ago"
import { JsonViewer } from "@/components/json-viewer"
import type { DbApproval } from "@/lib/types"
type Approval = DbApproval
import {
  CheckCircle, XCircle, Clock, Filter, Loader2,
  ChevronDown, ChevronRight, Edit3, Eye,
} from "lucide-react"

type TabFilter = "pending" | "reviewed" | "all"

export default function ApprovalsPage() {
  const { workspace, profile } = useWorkspace()
  const supabase = createClient()

  const [approvals, setApprovals] = useState<(Approval & { agent_name?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabFilter>("pending")
  const [actingOn, setActingOn] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [reviewNote, setReviewNote] = useState("")

  const fetchApprovals = useCallback(async () => {
    let query = supabase
      .from('approvals')
      .select('*, agents(name)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (tab === 'pending') query = query.eq('status', 'pending')
    else if (tab === 'reviewed') query = query.in('status', ['approved', 'rejected', 'expired'])

    const { data } = await query
    if (data) {
      setApprovals(data.map((a: Record<string, unknown>) => ({
        ...a,
        agent_name: (a.agents as Record<string, unknown>)?.name as string,
      })) as (Approval & { agent_name?: string })[])
    }
    setLoading(false)
  }, [supabase, tab])

  useEffect(() => {
    setLoading(true)
    fetchApprovals()
  }, [fetchApprovals])

  useRealtimeApprovals(workspace?.id, () => fetchApprovals())

  async function reviewApproval(id: string, decision: 'approved' | 'rejected', note?: string, edited?: string) {
    setActingOn(id)
    const { error } = await supabase.rpc('review_approval', {
      p_approval_id: id,
      p_decision: decision,
      p_note: note || null,
      p_edit_content: edited || null,
    })
    if (error) {
      toastError(error)
    } else {
      toastSuccess(`Approval ${decision}`)
      fetchApprovals()
      setEditingId(null)
      setEditContent("")
      setReviewNote("")
    }
    setActingOn(null)
  }

  async function bulkAction(decision: 'approved' | 'rejected') {
    const pending = approvals.filter(a => a.status === 'pending')
    if (pending.length === 0) return
    if (!confirm(`${decision === 'approved' ? 'Approve' : 'Reject'} all ${pending.length} pending items?`)) return

    for (const a of pending) {
      await supabase.rpc('review_approval', {
        p_approval_id: a.id,
        p_decision: decision,
        p_note: `Bulk ${decision}`,
        p_edit_content: null,
      })
    }
    toastSuccess(`${pending.length} approvals ${decision}`)
    fetchApprovals()
  }

  const pendingCount = approvals.filter(a => a.status === 'pending').length

  function expiryCountdown(expiresAt: string | null) {
    if (!expiresAt) return null
    const diff = new Date(expiresAt).getTime() - Date.now()
    if (diff <= 0) return <span className="text-red-400 text-[11px]">Expired</span>
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    return (
      <span className={cn("text-[11px]", hours < 2 ? "text-red-400" : hours < 12 ? "text-amber" : "text-text-tertiary")}>
        {hours}h {mins}m left
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Approvals</h1>
          <p className="text-[13px] text-text-secondary">
            {pendingCount > 0 ? `${pendingCount} pending review` : 'No pending approvals'}
          </p>
        </div>
        {tab === 'pending' && pendingCount > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={() => bulkAction('approved')}
              className="flex items-center gap-1.5 rounded-md bg-success/10 px-3 py-1.5 text-[12px] font-medium text-success hover:bg-success/20 transition-colors">
              <CheckCircle className="h-3.5 w-3.5" /> Approve All
            </button>
            <button onClick={() => bulkAction('rejected')}
              className="flex items-center gap-1.5 rounded-md bg-red-400/10 px-3 py-1.5 text-[12px] font-medium text-red-400 hover:bg-red-400/20 transition-colors">
              <XCircle className="h-3.5 w-3.5" /> Reject All
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border-subtle">
        {([
          { id: 'pending' as const, label: 'Pending', count: pendingCount },
          { id: 'reviewed' as const, label: 'History', count: null },
          { id: 'all' as const, label: 'All', count: null },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors",
              tab === t.id ? "border-amber text-amber" : "border-transparent text-text-tertiary hover:text-text-secondary"
            )}>
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className="rounded-full bg-amber/15 px-1.5 py-0.5 text-[10px] font-bold text-amber">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border-subtle bg-surface-1 p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-surface-3" />
                <div className="flex-1">
                  <div className="h-4 w-48 rounded bg-surface-3 mb-2" />
                  <div className="h-3 w-32 rounded bg-surface-3" />
                </div>
                <div className="flex gap-1.5">
                  <div className="h-7 w-20 rounded-md bg-surface-3" />
                  <div className="h-7 w-16 rounded-md bg-surface-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : approvals.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border-subtle bg-surface-1 px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <h3 className="text-[15px] font-semibold text-text-primary">
            {tab === 'pending' ? "You're all caught up" : 'No approvals found'}
          </h3>
          <p className="max-w-xs text-[13px] text-text-secondary">
            {tab === 'pending' ? 'No actions waiting for review.' : 'No approvals match your current view.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {approvals.map(approval => {
            const isExpanded = expandedId === approval.id
            const isEditing = editingId === approval.id
            const isPending = approval.status === 'pending'
            const isActing = actingOn === approval.id

            return (
              <div key={approval.id} className="rounded-lg border border-border-subtle bg-surface-1 overflow-hidden">
                {/* Header row */}
                <button onClick={() => setExpandedId(isExpanded ? null : approval.id)}
                  className="flex items-center justify-between gap-3 w-full p-4 text-left hover:bg-surface-2/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-text-tertiary shrink-0" /> : <ChevronRight className="h-4 w-4 text-text-tertiary shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-medium text-text-primary truncate">{approval.title || 'Untitled Action'}</span>
                        <RiskBadge level={approval.risk_level} />
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold",
                          approval.status === 'pending' ? "bg-amber/15 text-amber" :
                          approval.status === 'approved' ? "bg-success/15 text-success" :
                          approval.status === 'rejected' ? "bg-red-400/15 text-red-400" :
                          "bg-surface-2 text-text-tertiary"
                        )}>
                          {approval.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-tertiary">
                        <span>{approval.agent_name}</span>
                        <span>•</span>
                        <TimeAgo date={approval.created_at} />
                        {isPending && expiryCountdown(approval.expires_at)}
                      </div>
                    </div>
                  </div>
                  {isPending && !isActing && (
                    <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => reviewApproval(approval.id, 'approved')}
                        className="flex items-center gap-1 rounded-md bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success hover:bg-success/20 transition-colors">
                        <CheckCircle className="h-3 w-3" /> Approve
                      </button>
                      <button onClick={() => { setEditingId(approval.id); setExpandedId(approval.id); setEditContent(typeof approval.draft_content === 'string' ? approval.draft_content : JSON.stringify(approval.draft_content, null, 2)) }}
                        className="flex items-center gap-1 rounded-md bg-blue-400/10 px-2.5 py-1 text-[11px] font-medium text-blue-400 hover:bg-blue-400/20 transition-colors">
                        <Edit3 className="h-3 w-3" /> Edit
                      </button>
                      <button onClick={() => reviewApproval(approval.id, 'rejected')}
                        className="flex items-center gap-1 rounded-md bg-red-400/10 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:bg-red-400/20 transition-colors">
                        <XCircle className="h-3 w-3" /> Reject
                      </button>
                    </div>
                  )}
                  {isActing && <Loader2 className="h-4 w-4 animate-spin text-amber shrink-0" />}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-border-subtle p-4 flex flex-col gap-3">
                    {approval.draft_content && !isEditing && (
                      <div>
                        <div className="text-[11px] font-medium text-text-tertiary mb-1">Draft Content</div>
                        <div className="rounded-md bg-surface-2 p-3">
                          {typeof approval.draft_content === 'string' ? (
                            <pre className="text-[12px] text-text-primary font-mono whitespace-pre-wrap">{approval.draft_content}</pre>
                          ) : (
                            <JsonViewer data={approval.draft_content} />
                          )}
                        </div>
                      </div>
                    )}
                    {approval.context && (
                      <div>
                        <div className="text-[11px] font-medium text-text-tertiary mb-1">Context</div>
                        <div className="rounded-md bg-surface-2 p-3">
                          <JsonViewer data={approval.context} />
                        </div>
                      </div>
                    )}
                    {approval.reviewed_by && (
                      <div className="text-[12px] text-text-tertiary">
                        Reviewed <TimeAgo date={approval.reviewed_at || ''} /> {approval.review_note && `— "${approval.review_note}"`}
                      </div>
                    )}

                    {/* Editing mode */}
                    {isEditing && (
                      <div className="flex flex-col gap-3 mt-2">
                        <div>
                          <label className="mb-1 block text-[11px] font-medium text-text-secondary">Edit Draft Content</label>
                          <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={8}
                            className="w-full rounded-md border border-border-base bg-surface-2 px-3 py-2 font-mono text-[12px] text-text-primary focus:border-amber focus:outline-none resize-none" />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] font-medium text-text-secondary">Review Note (optional)</label>
                          <input type="text" value={reviewNote} onChange={e => setReviewNote(e.target.value)}
                            className="h-8 w-full rounded-md border border-border-base bg-surface-2 px-3 text-[12px] text-text-primary focus:border-amber focus:outline-none"
                            placeholder="Explain your edits..." />
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => reviewApproval(approval.id, 'approved', reviewNote, editContent)} disabled={isActing}
                            className="flex items-center gap-1.5 rounded-md bg-success/10 px-3 py-1.5 text-[12px] font-medium text-success hover:bg-success/20 transition-colors disabled:opacity-50">
                            {isActing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                            Approve with Edits
                          </button>
                          <button onClick={() => { setEditingId(null); setEditContent(""); setReviewNote("") }}
                            className="text-[12px] text-text-tertiary hover:text-text-secondary transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
