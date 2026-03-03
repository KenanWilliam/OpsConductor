// OpsConductor Mock Data for v1

export type AgentStatus = "running" | "idle" | "paused" | "error"
export type ApprovalStatus = "pending" | "approved" | "rejected" | "auto-executed"
export type RiskLevel = "low" | "medium" | "high"
export type EventStatus = "success" | "failed" | "pending" | "running"

export interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  connectedApps: string[]
  actionsThisWeek: number
  costThisMonth: number
  lastActive: string
  createdAt: string
  totalActions: number
  totalCost: number
  sparklineData: number[]
  nextAction?: string
  nextActionTime?: string
}

export interface Approval {
  id: string
  agentId: string
  agentName: string
  agentRole: string
  riskLevel: RiskLevel
  status: ApprovalStatus
  actionDescription: string
  draftContent?: string
  draftSubject?: string
  targetEntity: string
  targetType: string
  timestamp: string
  app: string
}

export interface ActivityEvent {
  id: string
  agentId: string
  agentName: string
  app: string
  action: string
  target: string
  status: EventStatus
  cost: number
  timestamp: string
  reasoning?: string
}

export interface Integration {
  id: string
  name: string
  icon: string
  category: string
  connected: boolean
  status?: "live" | "expiring" | "disconnected"
  lastSynced?: string
  agentCount?: number
}

export const agents: Agent[] = [
  {
    id: "agent-1",
    name: "Lead Nurturer",
    role: "Lead Nurturer",
    status: "running",
    connectedApps: ["HubSpot", "Gmail", "Slack"],
    actionsThisWeek: 47,
    costThisMonth: 2.34,
    lastActive: "2 min ago",
    createdAt: "2026-01-15",
    totalActions: 1284,
    totalCost: 18.92,
    sparklineData: [5, 8, 12, 7, 9, 15, 11],
    nextAction: "Follow up with Sarah Chen",
    nextActionTime: "In 2 hours",
  },
  {
    id: "agent-2",
    name: "Churn Rescue",
    role: "Churn Rescue",
    status: "running",
    connectedApps: ["Stripe", "HubSpot", "Gmail"],
    actionsThisWeek: 23,
    costThisMonth: 1.87,
    lastActive: "15 min ago",
    createdAt: "2026-01-20",
    totalActions: 567,
    totalCost: 9.45,
    sparklineData: [3, 5, 2, 8, 4, 6, 3],
    nextAction: "Check Acme Corp usage",
    nextActionTime: "In 45 min",
  },
  {
    id: "agent-3",
    name: "Invoice Chaser",
    role: "Invoice Chaser",
    status: "idle",
    connectedApps: ["Stripe", "Gmail", "Slack"],
    actionsThisWeek: 8,
    costThisMonth: 0.56,
    lastActive: "3 hours ago",
    createdAt: "2026-02-01",
    totalActions: 234,
    totalCost: 4.12,
    sparklineData: [1, 2, 1, 0, 3, 1, 0],
    nextAction: "Send reminder to Globex",
    nextActionTime: "Tomorrow 9am",
  },
  {
    id: "agent-4",
    name: "Welcome Bot",
    role: "New User Welcome",
    status: "paused",
    connectedApps: ["Slack", "Notion"],
    actionsThisWeek: 0,
    costThisMonth: 0,
    lastActive: "2 days ago",
    createdAt: "2026-02-10",
    totalActions: 89,
    totalCost: 1.23,
    sparklineData: [4, 2, 0, 0, 0, 0, 0],
  },
  {
    id: "agent-5",
    name: "Deal Nudger",
    role: "Deal Stage Nudge",
    status: "error",
    connectedApps: ["HubSpot", "Slack"],
    actionsThisWeek: 3,
    costThisMonth: 0.12,
    lastActive: "1 hour ago",
    createdAt: "2026-02-15",
    totalActions: 156,
    totalCost: 2.78,
    sparklineData: [2, 4, 6, 3, 1, 0, 3],
  },
]

export const pendingApprovals: Approval[] = [
  {
    id: "appr-1",
    agentId: "agent-1",
    agentName: "Lead Nurturer",
    agentRole: "Lead Nurturer",
    riskLevel: "medium",
    status: "pending",
    actionDescription: "Ready to send a personalized follow-up email to Sarah Chen at Acme Corp, who downloaded our whitepaper 3 days ago",
    draftSubject: "Quick thought on your AI operations, Sarah",
    draftContent: "Hi Sarah,\n\nI noticed you grabbed our guide on scaling AI agents. Most teams we work with find that the hardest part isn't the AI itself — it's the approval bottleneck.\n\nWould 15 minutes this week work to show you how we've solved that?\n\nBest,\nThe OpsConductor Team",
    targetEntity: "Sarah Chen, Acme Corp",
    targetType: "contact",
    timestamp: "5 min ago",
    app: "Gmail",
  },
  {
    id: "appr-2",
    agentId: "agent-2",
    agentName: "Churn Rescue",
    agentRole: "Churn Rescue",
    riskLevel: "high",
    status: "pending",
    actionDescription: "Ready to send a 20% discount offer to Globex Inc, who has been inactive for 60 days and has a $4,800 ARR contract",
    draftSubject: "We miss you, Globex. Here's 20% off.",
    draftContent: "Hi team,\n\nWe noticed your usage has dropped significantly. We'd love to understand what changed and help get you back on track.\n\nAs a gesture, we're offering 20% off your next renewal.\n\nLet's chat?",
    targetEntity: "Globex Inc",
    targetType: "company",
    timestamp: "12 min ago",
    app: "Gmail",
  },
  {
    id: "appr-3",
    agentId: "agent-3",
    agentName: "Invoice Chaser",
    agentRole: "Invoice Chaser",
    riskLevel: "low",
    status: "pending",
    actionDescription: "Ready to send a friendly payment reminder for Invoice #INV-2847 ($1,200) to Initech, overdue by 7 days",
    draftSubject: "Friendly reminder: Invoice #INV-2847",
    draftContent: "Hi there,\n\nJust a quick reminder that Invoice #INV-2847 for $1,200 was due last week. If you've already sent payment, please disregard this note.\n\nThanks!",
    targetEntity: "Initech, Invoice #INV-2847",
    targetType: "invoice",
    timestamp: "28 min ago",
    app: "Gmail",
  },
]

export const recentApprovals: Approval[] = [
  {
    id: "appr-4",
    agentId: "agent-1",
    agentName: "Lead Nurturer",
    agentRole: "Lead Nurturer",
    riskLevel: "low",
    status: "approved",
    actionDescription: "Sent welcome email to Marcus Webb after HubSpot form submission",
    targetEntity: "Marcus Webb",
    targetType: "contact",
    timestamp: "1 hour ago",
    app: "Gmail",
  },
  {
    id: "appr-5",
    agentId: "agent-2",
    agentName: "Churn Rescue",
    agentRole: "Churn Rescue",
    riskLevel: "medium",
    status: "rejected",
    actionDescription: "Proposed Slack message to #sales about at-risk account Vandelay Industries",
    targetEntity: "Vandelay Industries",
    targetType: "company",
    timestamp: "2 hours ago",
    app: "Slack",
  },
  {
    id: "appr-6",
    agentId: "agent-1",
    agentName: "Lead Nurturer",
    agentRole: "Lead Nurturer",
    riskLevel: "low",
    status: "auto-executed",
    actionDescription: "Updated HubSpot contact stage for Priya Sharma to 'Engaged'",
    targetEntity: "Priya Sharma",
    targetType: "contact",
    timestamp: "3 hours ago",
    app: "HubSpot",
  },
]

export const activityEvents: ActivityEvent[] = [
  {
    id: "evt-1",
    agentId: "agent-1",
    agentName: "Lead Nurturer",
    app: "HubSpot",
    action: "Checked for new trial signups",
    target: "HubSpot Contacts",
    status: "success",
    cost: 0.001,
    timestamp: "2 min ago",
    reasoning: "Agent checked HubSpot for contacts in Trial stage inactive > 5 days. Found 3 contacts. Queued follow-up emails for Sarah Chen, Marcus Webb, Priya Sharma. Estimated cost: $0.004.",
  },
  {
    id: "evt-2",
    agentId: "agent-2",
    agentName: "Churn Rescue",
    app: "Stripe",
    action: "Detected MRR drop for Globex Inc",
    target: "Globex Inc",
    status: "success",
    cost: 0.002,
    timestamp: "12 min ago",
    reasoning: "Agent monitored Stripe MRR data. Detected 35% usage drop for Globex Inc over the past 30 days. Flagged as high churn risk. Queued discount offer for approval.",
  },
  {
    id: "evt-3",
    agentId: "agent-1",
    agentName: "Lead Nurturer",
    app: "Gmail",
    action: "Sent follow-up email",
    target: "Marcus Webb",
    status: "success",
    cost: 0.003,
    timestamp: "1 hour ago",
  },
  {
    id: "evt-4",
    agentId: "agent-3",
    agentName: "Invoice Chaser",
    app: "Stripe",
    action: "Checked overdue invoices",
    target: "Stripe Invoices",
    status: "success",
    cost: 0.001,
    timestamp: "3 hours ago",
    reasoning: "Agent queried Stripe for invoices overdue > 7 days. Found 1 invoice: #INV-2847 for Initech ($1,200). Queued payment reminder email for approval.",
  },
  {
    id: "evt-5",
    agentId: "agent-5",
    agentName: "Deal Nudger",
    app: "HubSpot",
    action: "Failed to update deal stage",
    target: "Vandelay Industries Deal",
    status: "failed",
    cost: 0.001,
    timestamp: "1 hour ago",
    reasoning: "Agent attempted to update deal stage for Vandelay Industries from 'Proposal' to 'Negotiation'. HubSpot API returned 403 Forbidden. OAuth token may have expired.",
  },
  {
    id: "evt-6",
    agentId: "agent-2",
    agentName: "Churn Rescue",
    app: "HubSpot",
    action: "Updated contact risk score",
    target: "Acme Corp",
    status: "success",
    cost: 0.001,
    timestamp: "2 hours ago",
  },
  {
    id: "evt-7",
    agentId: "agent-1",
    agentName: "Lead Nurturer",
    app: "Slack",
    action: "Posted daily lead summary to #sales",
    target: "#sales channel",
    status: "success",
    cost: 0.002,
    timestamp: "4 hours ago",
  },
  {
    id: "evt-8",
    agentId: "agent-1",
    agentName: "Lead Nurturer",
    app: "HubSpot",
    action: "Updated contact stage to Engaged",
    target: "Priya Sharma",
    status: "success",
    cost: 0.001,
    timestamp: "5 hours ago",
  },
  {
    id: "evt-9",
    agentId: "agent-2",
    agentName: "Churn Rescue",
    app: "Gmail",
    action: "Sent check-in email",
    target: "Soylent Corp",
    status: "success",
    cost: 0.003,
    timestamp: "6 hours ago",
  },
  {
    id: "evt-10",
    agentId: "agent-3",
    agentName: "Invoice Chaser",
    app: "Gmail",
    action: "Sent payment reminder",
    target: "Hooli, Invoice #INV-2801",
    status: "success",
    cost: 0.003,
    timestamp: "Yesterday",
  },
]

export const integrations: Integration[] = [
  { id: "int-1", name: "Gmail", icon: "Mail", category: "Email", connected: true, status: "live", lastSynced: "2 min ago", agentCount: 3 },
  { id: "int-2", name: "HubSpot", icon: "BarChart3", category: "CRM", connected: true, status: "live", lastSynced: "5 min ago", agentCount: 3 },
  { id: "int-3", name: "Stripe", icon: "CreditCard", category: "Finance", connected: true, status: "live", lastSynced: "12 min ago", agentCount: 2 },
  { id: "int-4", name: "Slack", icon: "MessageSquare", category: "Messaging", connected: true, status: "live", lastSynced: "1 min ago", agentCount: 4 },
  { id: "int-5", name: "Notion", icon: "FileText", category: "Productivity", connected: true, status: "expiring", lastSynced: "1 hour ago", agentCount: 1 },
  { id: "int-6", name: "Salesforce", icon: "Cloud", category: "CRM", connected: false },
  { id: "int-7", name: "Outlook", icon: "Mail", category: "Email", connected: false },
  { id: "int-8", name: "Teams", icon: "MessageSquare", category: "Messaging", connected: false },
  { id: "int-9", name: "QuickBooks", icon: "Calculator", category: "Finance", connected: false },
  { id: "int-10", name: "Airtable", icon: "Table", category: "Productivity", connected: false },
  { id: "int-11", name: "Google Sheets", icon: "Sheet", category: "Productivity", connected: false },
  { id: "int-12", name: "Google Calendar", icon: "Calendar", category: "Calendar", connected: false },
  { id: "int-13", name: "Calendly", icon: "CalendarClock", category: "Calendar", connected: false },
]

export const cockpitStats = {
  totalActionsThisWeek: 81,
  actionsTrend: +12,
  revenueInfluenced: 14280,
  pendingApprovals: 3,
  agentCostThisMonth: 4.89,
}
