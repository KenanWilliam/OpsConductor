"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { RiskBadge } from "@/components/risk-badge"
import { TimeAgo } from "@/components/time-ago"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import Link from "next/link"
import { ShieldCheck, ArrowRight, Check, Loader2 } from "lucide-react"
import type { DbApproval } from "@/lib/types"

export function ApprovalPreview() {
  const { workspace } = useWorkspace()
  const [approvals, setApprovals] = useState<DbApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!workspace?.id) return
    const supabase = createClient()

    async function fetch() {
      const { data } = await supabase
        .from('approvals')
        .select('*, agent:agents!agent_id(id, name, role)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(3)
      if (data) setApprovals(data as DbApproval[])
      setLoading(false)
    }
    fetch()
  }, [workspace?.id])

  async function handleApprove(id: string) {
    setActionLoading(id)
    const res = await fetch(`/api/approvals/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'approved' }),
    })
    if (res.ok) {
      toastSuccess('Action approved')
      setApprovals(prev => prev.filter(a => a.id !== id))
    } else {
      toastError('Failed to approve')
    }
    setActionLoading(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1 animate-pulse">
        <div className="border-b border-border-subtle px-3 py-2.5"><div className="h-3 w-32 rounded bg-surface-3" /></div>
        <div className="p-4 h-24" />
      </div>
    )
  }

  if (approvals.length === 0) return null

  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-surface-1">
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-warning" />
          <h3 className="text-[13px] font-semibold text-text-primary">Pending Approvals</h3>
        </div>
        <Link href="/approvals" className="flex items-center gap-1 text-[11px] font-medium text-amber transition-colors hover:text-amber-hover">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border-subtle">
        {approvals.map((approval) => (
          <div key={approval.id} className="flex items-center gap-3 px-3 py-3">
            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-text-primary">{approval.agent?.name || 'Unknown Agent'}</span>
                <RiskBadge level={approval.risk_level} />
              </div>
              <p className="truncate text-[13px] text-text-secondary">{approval.title}</p>
              <span className="text-[11px] text-text-tertiary"><TimeAgo timestamp={approval.created_at} /></span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => handleApprove(approval.id)}
                disabled={actionLoading === approval.id}
                className="flex items-center gap-1.5 rounded-md bg-success px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-success/90 disabled:opacity-50"
              >
                {actionLoading === approval.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
