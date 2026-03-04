"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/lib/hooks/use-workspace"
import { toastSuccess, toastError } from "@/lib/supabase/errors"
import {
  User, Building2, Shield, Loader2, Save, Trash2,
} from "lucide-react"

type SettingsTab = "profile" | "workspace" | "security"

export default function SettingsPage() {
  const { workspace, profile, refetch: refreshWorkspace } = useWorkspace()
  const supabase = createClient()

  const [tab, setTab] = useState<SettingsTab>("profile")
  const [saving, setSaving] = useState(false)

  // Profile form
  const [displayName, setDisplayName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  // Workspace form
  const [wsName, setWsName] = useState("")
  const [wsSlug, setWsSlug] = useState("")

  // Security form
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.full_name || "")
      setAvatarUrl(profile.avatar_url || "")
    }
    if (workspace) {
      setWsName(workspace.name || "")
      setWsSlug(workspace.slug || "")
    }
  }, [profile, workspace])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: displayName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq('id', profile.id)
    setSaving(false)
    if (error) toastError(error)
    else {
      toastSuccess('Profile updated')
      refreshWorkspace()
    }
  }

  async function saveWorkspace(e: React.FormEvent) {
    e.preventDefault()
    if (!workspace) return
    setSaving(true)
    const { error } = await supabase
      .from('workspaces')
      .update({
        name: wsName.trim(),
        slug: wsSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      })
      .eq('id', workspace.id)
    setSaving(false)
    if (error) toastError(error)
    else {
      toastSuccess('Workspace updated')
      refreshWorkspace()
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toastError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toastError('Password must be at least 8 characters')
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)
    if (error) toastError(error)
    else {
      toastSuccess('Password updated')
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  const TABS = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "workspace" as const, label: "Workspace", icon: Building2 },
    { id: "security" as const, label: "Security", icon: Shield },
  ]

  return (
    <div className="flex flex-col gap-5 p-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Settings</h1>
        <p className="text-[13px] text-text-secondary">Manage your profile and workspace</p>
      </div>

      <div className="flex gap-1 border-b border-border-subtle">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors",
              tab === t.id ? "border-amber text-amber" : "border-transparent text-text-tertiary hover:text-text-secondary"
            )}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <form onSubmit={saveProfile} className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-1 p-4">
            <legend className="text-[13px] font-semibold text-text-primary px-1">Profile Information</legend>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Email</label>
              <input type="text" readOnly value={profile?.id ? '' : ''}
                className="h-9 w-full rounded-md border border-border-base bg-surface-2 px-3 text-[13px] text-text-tertiary cursor-not-allowed"
                placeholder="Managed by authentication provider" />
              <p className="mt-1 text-[10px] text-text-tertiary">Email cannot be changed here</p>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Display Name</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none"
                placeholder="Your display name" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Avatar URL</label>
              <input type="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)}
                className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none"
                placeholder="https://..." />
              {avatarUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={avatarUrl} alt="Avatar preview" className="h-8 w-8 rounded-full object-cover border border-border-subtle" onError={e => (e.currentTarget.style.display = 'none')} />
                  <span className="text-[11px] text-text-tertiary">Preview</span>
                </div>
              )}
            </div>
          </fieldset>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 rounded-md bg-amber px-5 py-2 text-[13px] font-semibold text-primary-foreground hover:bg-amber-hover disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Workspace Tab */}
      {tab === 'workspace' && (
        <div className="flex flex-col gap-5">
          <form onSubmit={saveWorkspace} className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-1 p-4">
              <legend className="text-[13px] font-semibold text-text-primary px-1">Workspace Settings</legend>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Workspace Name</label>
                <input type="text" value={wsName} onChange={e => setWsName(e.target.value)} required
                  className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Slug</label>
                <input type="text" value={wsSlug} onChange={e => setWsSlug(e.target.value)}
                  className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 font-mono text-[13px] text-text-primary focus:border-amber focus:outline-none"
                  placeholder="my-workspace" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Plan</label>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                    workspace?.plan === 'scale' ? "bg-amber/15 text-amber" :
                    workspace?.plan === 'pro' ? "bg-blue-400/15 text-blue-400" :
                    "bg-surface-2 text-text-tertiary"
                  )}>
                    {workspace?.plan || 'free'}
                  </span>
                </div>
              </div>
            </fieldset>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving || !wsName.trim()}
                className="flex items-center gap-2 rounded-md bg-amber px-5 py-2 text-[13px] font-semibold text-primary-foreground hover:bg-amber-hover disabled:opacity-50 transition-colors">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Workspace
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <fieldset className="flex flex-col gap-3 rounded-lg border border-red-400/30 bg-red-400/5 p-4">
            <legend className="text-[13px] font-semibold text-red-400 px-1">Danger Zone</legend>
            <p className="text-[12px] text-text-secondary">Deleting your workspace is permanent and cannot be undone. All agents, integrations, and data will be destroyed.</p>
            <button disabled
              className="flex items-center gap-1.5 self-start rounded-md border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-[12px] font-medium text-red-400 opacity-60 cursor-not-allowed">
              <Trash2 className="h-3.5 w-3.5" /> Delete Workspace
            </button>
            <p className="text-[10px] text-text-tertiary">Contact support to delete your workspace</p>
          </fieldset>
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <form onSubmit={changePassword} className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-1 p-4">
            <legend className="text-[13px] font-semibold text-text-primary px-1">Change Password</legend>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={8} required
                className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-amber focus:outline-none"
                placeholder="Minimum 8 characters" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={8} required
                className={cn("h-9 w-full rounded-md border bg-surface-1 px-3 text-[13px] text-text-primary focus:outline-none",
                  confirmPassword && confirmPassword !== newPassword ? "border-red-400 focus:border-red-400" : "border-border-base focus:border-amber"
                )} />
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="mt-1 text-[10px] text-red-400">Passwords do not match</p>
              )}
            </div>
          </fieldset>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving || !newPassword || newPassword !== confirmPassword}
              className="flex items-center gap-2 rounded-md bg-amber px-5 py-2 text-[13px] font-semibold text-primary-foreground hover:bg-amber-hover disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              Update Password
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
