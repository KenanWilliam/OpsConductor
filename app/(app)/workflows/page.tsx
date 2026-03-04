"use client"

import { Workflow, Calendar } from "lucide-react"

export default function WorkflowsPage() {
  const templates = [
    { name: "Lead Follow-Up", description: "Automatically follow up with new leads who download content or fill out forms", apps: ["HubSpot", "Gmail"], timeSaved: "4 hrs/week" },
    { name: "Churn Early Warning", description: "Detect at-risk accounts based on usage drops and initiate rescue sequences", apps: ["Stripe", "HubSpot", "Gmail"], timeSaved: "6 hrs/week" },
    { name: "Invoice Recovery", description: "Send polite payment reminders for overdue invoices on a graduated schedule", apps: ["Stripe", "Gmail"], timeSaved: "3 hrs/week" },
    { name: "New User Welcome", description: "Onboard new signups with personalized welcome messages and resource links", apps: ["Slack", "Notion", "Gmail"], timeSaved: "2 hrs/week" },
    { name: "Deal Stage Nudge", description: "Prompt sales reps when deals stall at a specific stage for too long", apps: ["HubSpot", "Slack"], timeSaved: "3 hrs/week" },
    { name: "Slack Digest", description: "Post a daily summary of all agent activity to a designated Slack channel", apps: ["Slack"], timeSaved: "1 hr/week" },
  ]

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-cyan" />
          <h1 className="text-xl font-semibold text-text-primary">Workflows</h1>
        </div>
        <p className="text-[13px] text-text-secondary">Pre-built and custom workflow templates for your agents</p>
      </div>

      {/* Coming soon banner */}
      <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-1 px-4 py-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-cyan" />
          <span className="text-[13px] text-text-secondary">Visual workflow builder shipping <span className="font-medium text-text-primary">Q2 2026</span></span>
        </div>
      </div>

      {/* Template Gallery */}
      <div>
        <h3 className="mb-3 text-[13px] font-semibold text-text-primary">Template Gallery</h3>
        <div className="grid grid-cols-3 gap-3">
          {templates.map((template) => (
            <div key={template.name} className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4 transition-colors hover:border-border-base">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-dim">
                <Workflow className="h-4 w-4 text-cyan" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-text-primary">{template.name}</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-text-tertiary">{template.description}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                <div className="flex items-center gap-1">
                  {template.apps.map((app) => (
                    <span key={app} className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] text-text-tertiary">{app}</span>
                  ))}
                </div>
                <span className="font-mono text-[11px] text-success">{template.timeSaved}</span>
              </div>
              <button onClick={() => alert(`\"${template.name}\" template activated! A new agent will be created from this template.`)} className="rounded-md bg-cyan px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-cyan-muted">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
