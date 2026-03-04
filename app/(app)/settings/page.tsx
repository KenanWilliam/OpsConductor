"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  CreditCard,
  Bot,
  Bell,
  Shield,
  AlertTriangle,
} from "lucide-react"

const settingsSections = [
  { id: "general", label: "General", icon: Building2 },
  { id: "members", label: "Members", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "defaults", label: "Agent Defaults", icon: Bot },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general")
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState([
    { label: "Approval needed", description: "When an agent needs your approval", enabled: true },
    { label: "Agent failed", description: "When an agent encounters an error", enabled: true },
    { label: "Weekly summary", description: "Weekly digest of all agent activity", enabled: false },
  ])

  function toggleNotification(index: number) {
    setNotifications(prev => prev.map((n, i) => i === index ? { ...n, enabled: !n.enabled } : n))
  }

  return (
    <div className="flex h-full">
      {/* Settings Sidebar */}
      <div className="w-52 shrink-0 border-r border-border-subtle bg-surface-1 p-3">
        <div className="mb-4 flex items-center gap-2 px-2">
          <SettingsIcon className="h-4 w-4 text-text-tertiary" />
          <span className="text-[13px] font-semibold text-text-primary">Settings</span>
        </div>
        <nav className="space-y-0.5">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
                activeSection === section.id
                  ? "bg-surface-3 text-text-primary"
                  : "text-text-secondary hover:bg-surface-3 hover:text-text-primary",
                section.id === "danger" && "text-danger hover:text-danger"
              )}
            >
              <section.icon className="h-3.5 w-3.5" />
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeSection === "general" && (
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-text-primary">General</h2>
            <p className="mb-6 text-[13px] text-text-secondary">Manage your workspace settings</p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Workspace Name</label>
                <input
                  type="text"
                  defaultValue="Acme Operations"
                  className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-cyan focus:shadow-[0_0_0_3px_var(--color-accent-dim)] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-text-secondary">Timezone</label>
                <select className="h-9 w-full rounded-md border border-border-base bg-surface-1 px-3 text-[13px] text-text-primary focus:border-cyan focus:outline-none">
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Asia/Tokyo (JST)</option>
                </select>
              </div>
              <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} className="rounded-md bg-cyan px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-cyan-muted">
                {saved ? "Saved ✓" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {activeSection === "members" && (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Members</h2>
                <p className="text-[13px] text-text-secondary">Manage who has access to this workspace</p>
              </div>
              <button onClick={() => alert("Invite link copied to clipboard!")} className="rounded-md bg-cyan px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-cyan-muted">
                Invite Member
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-border-subtle bg-surface-1">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Name</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Email</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Role</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-text-tertiary">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  <tr className="hover:bg-surface-3">
                    <td className="px-3 py-3 text-[13px] font-medium text-text-primary">Jane Doe</td>
                    <td className="px-3 py-3 text-[13px] text-text-secondary">jane@acme.com</td>
                    <td className="px-3 py-3"><span className="rounded bg-cyan-dim px-1.5 py-0.5 text-[11px] font-medium text-cyan">Admin</span></td>
                    <td className="px-3 py-3 font-mono text-[11px] text-text-tertiary">Just now</td>
                  </tr>
                  <tr className="hover:bg-surface-3">
                    <td className="px-3 py-3 text-[13px] font-medium text-text-primary">John Smith</td>
                    <td className="px-3 py-3 text-[13px] text-text-secondary">john@acme.com</td>
                    <td className="px-3 py-3"><span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-text-secondary">Member</span></td>
                    <td className="px-3 py-3 font-mono text-[11px] text-text-tertiary">2 hours ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "billing" && (
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-text-primary">Billing</h2>
            <p className="mb-6 text-[13px] text-text-secondary">Manage your plan and billing</p>
            <div className="rounded-lg border border-cyan bg-cyan-dim p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-text-primary">Operator Plan</p>
                  <p className="text-[11px] text-text-secondary">$79/mo -- 10 agents, unlimited events</p>
                </div>
                <button onClick={() => alert("Redirecting to billing portal...")} className="rounded-md border border-border-base bg-surface-2 px-3 py-1.5 text-[11px] font-medium text-text-secondary hover:text-text-primary">
                  Manage Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "defaults" && (
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-text-primary">Agent Defaults</h2>
            <p className="mb-6 text-[13px] text-text-secondary">Default approval rules applied to new agents</p>
            <div className="space-y-3">
              {["Send email", "Update CRM", "Create deal", "Post to Slack", "Send invoice"].map((action) => (
                <div key={action} className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-1 px-3 py-2.5">
                  <span className="text-[13px] text-text-primary">{action}</span>
                  <select className="rounded border border-border-base bg-surface-2 px-2 py-1 text-[11px] text-text-secondary focus:outline-none">
                    <option>Ask me</option>
                    <option>Auto</option>
                    <option>Always ask</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
            <p className="mb-6 text-[13px] text-text-secondary">Configure when and how you receive notifications</p>
            <div className="space-y-3">
              {notifications.map((pref, index) => (
                <div key={pref.label} className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-1 px-3 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{pref.label}</p>
                    <p className="text-[11px] text-text-tertiary">{pref.description}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(index)}
                    className={cn(
                      "h-5 w-9 rounded-full transition-colors relative cursor-pointer",
                      pref.enabled ? "bg-cyan" : "bg-surface-3"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                      pref.enabled ? "translate-x-4" : "translate-x-0.5"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "security" && (
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-text-primary">Security</h2>
            <p className="mb-6 text-[13px] text-text-secondary">API keys and audit log settings</p>
            <div className="space-y-4">
              <div className="rounded-lg border border-border-subtle bg-surface-1 p-4">
                <h3 className="mb-2 text-[13px] font-semibold text-text-primary">API Keys</h3>
                <p className="mb-3 text-[11px] text-text-tertiary">Generate keys for programmatic access</p>
                <button onClick={() => alert("API Key: ops_sk_demo_" + Math.random().toString(36).slice(2, 14))} className="rounded-md bg-cyan px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-cyan-muted">
                  Generate New Key
                </button>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface-1 p-4">
                <h3 className="mb-2 text-[13px] font-semibold text-text-primary">Data Retention</h3>
                <select className="h-9 w-full rounded-md border border-border-base bg-surface-2 px-3 text-[13px] text-text-secondary focus:outline-none">
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>365 days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === "danger" && (
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-danger">Danger Zone</h2>
            <p className="mb-6 text-[13px] text-text-secondary">Irreversible actions for your workspace</p>
            <div className="space-y-3">
              <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
                <h3 className="text-[13px] font-semibold text-text-primary">Transfer Ownership</h3>
                <p className="mb-3 text-[11px] text-text-tertiary">Transfer this workspace to another member</p>
                <button onClick={() => { if (confirm("Are you sure you want to transfer workspace ownership?")) alert("Transfer initiated.") }} className="rounded-md border border-danger bg-danger/10 px-3 py-1.5 text-[11px] font-semibold text-danger hover:bg-danger/20">
                  Transfer Workspace
                </button>
              </div>
              <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
                <h3 className="text-[13px] font-semibold text-text-primary">Delete Workspace</h3>
                <p className="mb-3 text-[11px] text-text-tertiary">Permanently delete this workspace and all data</p>
                <button onClick={() => { if (confirm("This action is irreversible. Delete this workspace and all data?")) alert("Workspace deleted.") }} className="rounded-md bg-danger px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-danger/90">
                  Delete Workspace
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
