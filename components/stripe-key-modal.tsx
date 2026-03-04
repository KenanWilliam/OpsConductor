"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import { Key, X, Loader2 } from "lucide-react"

interface StripeKeyModalProps {
  open: boolean
  onClose: () => void
  onConnected: () => void
}

export function StripeKeyModal({ open, onClose, onConnected }: StripeKeyModalProps) {
  const { workspace, user } = useWorkspace()
  const supabase = createClient()
  const [apiKey, setApiKey] = useState("")
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setApiKey("")
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  async function connectStripe(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = apiKey.trim()

    // Validate it starts with sk_test_ or sk_live_
    if (!trimmed.match(/^sk_(test|live)_/)) {
      toastError('Invalid Stripe key. Must start with sk_test_ or sk_live_')
      return
    }

    if (!workspace?.id || !user?.id) return
    setSaving(true)

    const { error } = await supabase.from('integrations').upsert({
      workspace_id: workspace.id,
      provider: 'stripe',
      status: 'active',
      access_token: trimmed,
      account_label: trimmed.startsWith('sk_test_') ? 'Stripe (Test mode)' : 'Stripe (Live)',
      scopes: ['charges:read', 'customers:write', 'invoices:write'],
      connected_by: user.id,
      connected_at: new Date().toISOString(),
    }, { onConflict: 'workspace_id,provider' })

    setSaving(false)

    if (error) {
      toastError(error)
    } else {
      toastSuccess('Stripe connected')
      await supabase.rpc('complete_setup_step', { p_step: 'integration_connected' })
      onConnected()
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-xl border border-border-subtle bg-surface-1 p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded p-1 text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10">
              <Key className="h-5 w-5 text-amber" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-text-primary">Connect Stripe</h2>
              <p className="text-[12px] text-text-secondary">
                Enter your Stripe API secret key
              </p>
            </div>
          </div>

          <form onSubmit={connectStripe} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">
                Secret Key
              </label>
              <input
                ref={inputRef}
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk_test_... or sk_live_..."
                required
                className="h-9 w-full rounded-md border border-border-base bg-surface-2 px-3 font-mono text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-amber focus:outline-none"
              />
              <p className="mt-1.5 text-[10px] text-text-tertiary">
                Find your key in{" "}
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber hover:underline"
                >
                  Stripe Dashboard → API Keys
                </a>
                . We recommend using a restricted key with only the permissions your agents need.
              </p>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border-base bg-surface-2 px-4 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !apiKey.trim()}
                className="flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-[13px] font-semibold text-primary-foreground hover:bg-amber-hover disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                Connect Stripe
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
