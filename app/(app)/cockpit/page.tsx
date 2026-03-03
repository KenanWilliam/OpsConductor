import { CockpitStats } from "@/components/cockpit-stats"
import { ActivityFeed } from "@/components/activity-feed"
import { AgentStatusPanel } from "@/components/agent-status-panel"
import { ApprovalPreview } from "@/components/approval-preview"

export default function CockpitPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Cockpit</h1>
        <p className="text-[13px] text-text-secondary">Your AI operations at a glance</p>
      </div>

      {/* Stat cards */}
      <CockpitStats />

      {/* Middle section — Activity + Agent Status */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <ActivityFeed />
        </div>
        <div className="col-span-2">
          <AgentStatusPanel />
        </div>
      </div>

      {/* Approval preview */}
      <ApprovalPreview />
    </div>
  )
}
