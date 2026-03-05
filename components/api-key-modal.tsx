"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import { Key, X, Loader2 } from "lucide-react"

/** Configuration for API key validation per provider */
const PROVIDER_CONFIG: Record<string, {
  label: string
  placeholder: string
  validate?: (key: string) => string | null
  helpText?: string
  helpUrl?: string
  helpUrlLabel?: string
  accountLabel: (key: string) => string
}> = {
  stripe: {
    label: "Stripe",
    placeholder: "sk_test_... or sk_live_...",
    validate: (key) => key.match(/^sk_(test|live)_/) ? null : "Must start with sk_test_ or sk_live_",
    helpText: "Find your key in",
    helpUrl: "https://dashboard.stripe.com/apikeys",
    helpUrlLabel: "Stripe Dashboard → API Keys",
    accountLabel: (key) => key.startsWith("sk_test_") ? "Stripe (Test mode)" : "Stripe (Live)",
  },
  sendgrid: {
    label: "SendGrid",
    placeholder: "SG.xxxxxxxxxx...",
    validate: (key) => key.startsWith("SG.") ? null : "Must start with SG.",
    helpText: "Find your API key in",
    helpUrl: "https://app.sendgrid.com/settings/api_keys",
    helpUrlLabel: "SendGrid Settings → API Keys",
    accountLabel: () => "SendGrid",
  },
  clearbit: {
    label: "Clearbit",
    placeholder: "sk_xxxxxxxxxx...",
    helpText: "Find your API key in",
    helpUrl: "https://dashboard.clearbit.com/api",
    helpUrlLabel: "Clearbit Dashboard → API",
    accountLabel: () => "Clearbit",
  },
  zapier: {
    label: "Zapier",
    placeholder: "Your Zapier API key...",
    helpText: "Find your API key in",
    helpUrl: "https://zapier.com/app/settings/developer",
    helpUrlLabel: "Zapier Developer Settings",
    accountLabel: () => "Zapier",
  },
}

interface ApiKeyModalProps {
  open: boolean
  provider: string
  onClose: () => void
  onConnected: () => void
}

export function ApiKeyModal({ open, provider, onClose, onConnected }: ApiKeyModalProps) {
  const { workspace, user } = useWorkspace()
  const supabase = createClient()
  const [apiKey, setApiKey] = useState("")
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const config = PROVIDER_CONFIG[provider] || {
    label: provider,
    placeholder: "Enter API key...",
    accountLabel: () => `${provider} account`,
  }

  useEffect(() => {
    if (open) {
      setApiKey("")
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = apiKey.trim()

    if (config.validate) {
      const err = config.validate(trimmed)
      if (err) {
        toastError(err)
        return
      }
    }

    if (!trimmed) {
      toastError("API key is required")
      return
    }

    if (!workspace?.id || !user?.id) return
    setSaving(true)

    const { error } = await supabase.from("integrations").upsert({
      workspace_id: workspace.id,
      provider,
      status: "active",
      access_token: trimmed,
      account_label: config.accountLabel(trimmed),
      scopes: ["api"],
      connected_by: user.id,
      connected_at: new Date().toISOString(),
    }, { onConflict: "workspace_id,provider" })

    setSaving(false)

    if (error) {
      toastError(error)
    } else {
      toastSuccess(`${config.label} connected`)
      await supabase.rpc("complete_setup_step", { p_step: "integration_connected" })
      onConnected()
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-xl border border-border-subtle bg-surface-1 p-6 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded p-1 text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10">
              <Key className="h-5 w-5 text-amber" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-text-primary">Connect {config.label}</h2>
              <p className="text-[12px] text-text-secondary">
                Enter your {config.label} API key
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">
                API Key
              </label>
              <input
                ref={inputRef}
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder={config.placeholder}
                required
                className="h-9 w-full rounded-md border border-border-base bg-surface-2 px-3 font-mono text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-amber focus:outline-none"
              />
              {config.helpText && config.helpUrl && (
                <p className="mt-1.5 text-[10px] text-text-tertiary">
                  {config.helpText}{" "}
                  <a href={config.helpUrl} target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">
                    {config.helpUrlLabel}
                  </a>
                  . We recommend using a restricted key with only the permissions your agents need.
                </p>
              )}
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
                Connect {config.label}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
