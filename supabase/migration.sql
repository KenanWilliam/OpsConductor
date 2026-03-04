-- ============================================================
-- OpsConductor Supabase Migration
-- Fixes the auth dead-end + seeds realistic demo data
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. TABLES
-- ────────────────────────────────────────────────────────────

-- Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
  id         uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  name       text NOT NULL,
  plan       text NOT NULL DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Profiles (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text,
  full_name  text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Workspace Members (many-to-many: users ↔ workspaces)
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id           uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id)  ON DELETE CASCADE,
  role         text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id)
);

-- Agents
CREATE TABLE IF NOT EXISTS public.agents (
  id               uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  workspace_id     uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name             text NOT NULL,
  role             text NOT NULL,
  status           text NOT NULL DEFAULT 'idle' CHECK (status IN ('running', 'idle', 'paused', 'error')),
  connected_apps   text[] NOT NULL DEFAULT '{}',
  actions_this_week int NOT NULL DEFAULT 0,
  cost_this_month  numeric(10,2) NOT NULL DEFAULT 0,
  total_actions    int NOT NULL DEFAULT 0,
  total_cost       numeric(10,2) NOT NULL DEFAULT 0,
  last_active      timestamptz DEFAULT now(),
  next_action      text,
  next_action_time text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Activity Events
CREATE TABLE IF NOT EXISTS public.activity_events (
  id         uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  agent_id   uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  agent_name text NOT NULL,
  app        text NOT NULL,
  action     text NOT NULL,
  target     text NOT NULL,
  status     text NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending', 'running')),
  cost       numeric(10,4) NOT NULL DEFAULT 0,
  reasoning  text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Approvals
CREATE TABLE IF NOT EXISTS public.approvals (
  id                 uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  workspace_id       uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  agent_id           uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  agent_name         text NOT NULL,
  agent_role         text NOT NULL,
  risk_level         text NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  status             text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'auto-executed')),
  action_description text NOT NULL,
  draft_content      text,
  draft_subject      text,
  target_entity      text NOT NULL,
  target_type        text NOT NULL,
  app                text NOT NULL,
  decided_by         uuid REFERENCES auth.users(id),
  decided_at         timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id           uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text NOT NULL,
  body         text,
  type         text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  read         boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
-- 2. RLS HELPER: my_workspace_id()
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.my_workspace_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT workspace_id
  FROM public.workspace_members
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;


-- ────────────────────────────────────────────────────────────
-- 3. handle_new_user() — auto-create workspace on signup
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ws_id uuid;
  ws_name text;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Determine workspace name
  ws_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data ->> 'workspace_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)) || '''s Workspace'
  );

  -- Create workspace
  INSERT INTO public.workspaces (name) VALUES (ws_name) RETURNING id INTO ws_id;

  -- Link user as owner
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (ws_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

-- Workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own workspace" ON public.workspaces;
CREATE POLICY "Users see own workspace" ON public.workspaces
  FOR ALL USING (id = public.my_workspace_id());

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Workspace Members
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Members see workspace" ON public.workspace_members;
CREATE POLICY "Members see workspace" ON public.workspace_members
  FOR SELECT USING (workspace_id = public.my_workspace_id());
DROP POLICY IF EXISTS "Owners manage members" ON public.workspace_members;
CREATE POLICY "Owners manage members" ON public.workspace_members
  FOR ALL USING (workspace_id = public.my_workspace_id());

-- Agents
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Workspace agents" ON public.agents;
CREATE POLICY "Workspace agents" ON public.agents
  FOR ALL USING (workspace_id = public.my_workspace_id());

-- Activity Events
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Workspace events" ON public.activity_events;
CREATE POLICY "Workspace events" ON public.activity_events
  FOR ALL USING (workspace_id = public.my_workspace_id());

-- Approvals
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Workspace approvals" ON public.approvals;
CREATE POLICY "Workspace approvals" ON public.approvals
  FOR ALL USING (workspace_id = public.my_workspace_id());

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User notifications" ON public.notifications;
CREATE POLICY "User notifications" ON public.notifications
  FOR ALL USING (
    workspace_id = public.my_workspace_id()
    AND user_id = auth.uid()
  );


-- ────────────────────────────────────────────────────────────
-- 5. FIX EXISTING USER: kenanallanwilliam@gmail.com
-- ────────────────────────────────────────────────────────────

-- Create Acme Corp workspace if not exists
INSERT INTO public.workspaces (id, name, plan)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Acme Corp', 'operator')
ON CONFLICT (id) DO NOTHING;

-- Link the user
INSERT INTO public.workspace_members (workspace_id, user_id, role)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'cb351c8f-d827-4d67-86fe-24638ee065ac',
  'owner'
)
ON CONFLICT (workspace_id, user_id) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 6. SEED DATA — Agents for Acme Corp
-- ────────────────────────────────────────────────────────────

INSERT INTO public.agents (workspace_id, name, role, status, connected_apps, actions_this_week, cost_this_month, total_actions, total_cost, next_action, next_action_time) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'Lead Nurturer',    'running', ARRAY['HubSpot','Gmail','Slack'],    47, 2.34, 1284, 18.92, 'Follow up with Sarah Chen',      'In 2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'Churn Rescue',     'running', ARRAY['Stripe','HubSpot','Gmail'],   23, 1.87,  567,  9.45, 'Check Acme Corp usage',          'In 45 min'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Invoice Chaser',   'Invoice Chaser',   'idle',    ARRAY['Stripe','Gmail','Slack'],      11, 0.68,  312,  4.20, 'Send reminder to Globex Corp',   'Tomorrow 9am'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Meeting Prep',     'Meeting Prep',     'paused',  ARRAY['Google Calendar','Notion','Slack'], 0, 0.00, 189,  2.80, NULL, NULL),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',      'Deal Closer',      'running', ARRAY['HubSpot','Gmail','Slack'],     12, 0.95,  234,  5.60, 'Prepare proposal for Widget Labs','In 3 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Support Triage',   'Support Triage',   'error',   ARRAY['Gmail','Slack','Notion'],        5, 0.42,  178,  3.10, NULL, NULL),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Report Generator', 'Report Generator', 'idle',    ARRAY['HubSpot','Notion','Slack'],      3, 0.15,   89,  1.30, 'Weekly pipeline report',         'Monday 8am'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',    'Data Enricher',    'running', ARRAY['Clearbit','HubSpot'],           18, 1.20,  456,  7.80, 'Enrich new inbound leads',       'In 30 min')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 7. SEED DATA — Activity Events (50+)
-- ────────────────────────────────────────────────────────────

INSERT INTO public.activity_events (workspace_id, agent_name, app, action, target, status, cost, reasoning, created_at) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'HubSpot', 'Updated deal stage',        'Acme Corp — Enterprise Plan',  'success', 0.02, 'Deal value increased by 40% after demo. Moving to negotiation stage based on email sentiment analysis.', now() - interval '2 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'Gmail',   'Sent follow-up email',      'sarah.chen@acme.com',          'success', 0.03, 'Sarah opened our pricing PDF 3 times in the last 24 hours. Sending a personalized follow-up with ROI calculator.', now() - interval '5 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'Stripe',  'Flagged at-risk account',   'Globex Corp — $2,400/mo',      'success', 0.01, 'Usage dropped 60% in the last 14 days. Last login was 11 days ago. Initiating rescue sequence.', now() - interval '12 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'Gmail',   'Sent win-back email',       'mike@globex.com',              'pending', 0.03, NULL, now() - interval '15 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Invoice Chaser',   'Stripe',  'Checked payment status',    'Invoice #1247 — Widget Labs',  'success', 0.01, 'Invoice is 7 days overdue. Previous reminder sent 3 days ago with no response.', now() - interval '20 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',      'HubSpot', 'Created proposal draft',    'Widget Labs — Growth Plan',    'running', 0.05, 'Analyzing competitor pricing and customer usage patterns to optimize proposal terms.', now() - interval '25 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Support Triage',   'Gmail',   'Classified support ticket', 'Priority: High — API timeout', 'failed',  0.02, 'Failed to classify: Gmail API rate limit exceeded. Will retry in 5 minutes.', now() - interval '30 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',    'HubSpot', 'Enriched contact data',     'New lead: j.martinez@initech.com', 'success', 0.04, 'Added company size (500+), industry (SaaS), revenue ($50M), and tech stack from Clearbit.', now() - interval '35 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'Slack',   'Posted deal alert',         '#sales — New opportunity',     'success', 0.01, NULL, now() - interval '40 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Report Generator', 'Notion',  'Updated weekly report',     'Pipeline Report — Week 24',    'success', 0.03, 'Added 3 new deals, updated 7 stage changes, flagged 2 at-risk accounts.', now() - interval '45 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'HubSpot', 'Scored new lead',           'Emily Park — TechFlow Inc',    'success', 0.02, 'Lead score: 82/100. High intent signals: visited pricing page 5x, downloaded whitepaper.', now() - interval '1 hour'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'Slack',   'Notified CS team',          '#customer-success',            'success', 0.01, NULL, now() - interval '1 hour 15 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Invoice Chaser',   'Gmail',   'Sent payment reminder',     'billing@widgetlabs.io',        'success', 0.03, 'Third reminder for Invoice #1247. Escalating tone per configured policy.', now() - interval '1 hour 30 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',      'Gmail',   'Sent contract',             'cto@widgetlabs.io',            'success', 0.03, NULL, now() - interval '2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',    'HubSpot', 'Updated company record',    'Initech Corp',                 'success', 0.02, NULL, now() - interval '2 hours 15 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'Gmail',   'Sent case study',           'sarah.chen@acme.com',          'success', 0.03, 'Matched case study to industry vertical. Open rate for similar sends: 67%.', now() - interval '3 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'HubSpot', 'Updated account health',    'Globex Corp',                  'success', 0.02, 'Health score dropped from 72 to 34. Triggering executive sponsor outreach.', now() - interval '3 hours 30 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Support Triage',   'Slack',   'Escalated to engineering',  '#eng-oncall — API latency',    'success', 0.01, NULL, now() - interval '4 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Report Generator', 'Slack',   'Shared daily digest',       '#leadership',                  'success', 0.02, NULL, now() - interval '5 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',    'HubSpot', 'Batch enriched 12 contacts', 'Inbound leads batch',         'success', 0.15, NULL, now() - interval '6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'HubSpot', 'Created task for SDR',      'Call Emily Park — TechFlow',   'success', 0.01, NULL, now() - interval '7 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'Gmail',   'Sent executive reach-out',  'vp@globex.com',                'pending', 0.04, 'Drafting personalized email from CEO to VP of Ops. Awaiting approval.', now() - interval '8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Invoice Chaser',   'Slack',   'Notified finance team',     '#finance — Overdue invoices',  'success', 0.01, NULL, now() - interval '9 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',      'HubSpot', 'Updated forecast',          'Q2 Pipeline — $142K',          'success', 0.02, NULL, now() - interval '10 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'Gmail',   'Sent intro sequence',       'new-lead@startup.io',          'success', 0.03, NULL, now() - interval '11 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',    'HubSpot', 'Added technographics',      'TechFlow Inc record',          'success', 0.03, NULL, now() - interval '12 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'Stripe',  'Analyzed payment history',  'Globex Corp — 12 mo trend',    'success', 0.02, NULL, now() - interval '13 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Support Triage',   'Gmail',   'Auto-responded to ticket',  'user@customer.com — FAQ match','success', 0.02, NULL, now() - interval '14 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'HubSpot', 'Moved to MQL',              'Emily Park — score 85+',       'success', 0.01, NULL, now() - interval '15 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Report Generator', 'Notion',  'Generated board deck',      'Monthly Review — June',        'success', 0.08, NULL, now() - interval '1 day'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'Slack',   'Shared win notification',   '#wins — Acme Corp closed!',    'success', 0.01, NULL, now() - interval '1 day 2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',      'Gmail',   'Sent onboarding welcome',   'cfo@acme.com',                 'success', 0.03, NULL, now() - interval '1 day 3 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Invoice Chaser',   'Stripe',  'Verified payment received', 'Invoice #1243 — Acme Corp',    'success', 0.01, NULL, now() - interval '1 day 5 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'HubSpot', 'Logged call notes',         'Globex Corp — retention call',  'success', 0.02, NULL, now() - interval '1 day 6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',    'HubSpot', 'Matched company to ICP',    'Startup.io — 92% ICP fit',     'success', 0.03, NULL, now() - interval '1 day 8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'Gmail',   'Re-engaged cold lead',      'old-prospect@bigco.com',       'success', 0.03, NULL, now() - interval '1 day 10 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Support Triage',   'Notion',  'Updated runbook',           'API Timeout Troubleshooting',  'success', 0.02, NULL, now() - interval '1 day 12 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',      'HubSpot', 'Scheduled demo',            'Widget Labs — Product Demo',   'success', 0.01, NULL, now() - interval '2 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'HubSpot', 'Auto-assigned territory',   'West Coast — 3 new leads',     'success', 0.01, NULL, now() - interval '2 days 3 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'Gmail',   'Sent NPS survey',           'active-accounts@batch',        'success', 0.05, NULL, now() - interval '2 days 6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Invoice Chaser',   'Gmail',   'Sent receipt confirmation', 'billing@acme.com',             'success', 0.02, NULL, now() - interval '2 days 8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',    'HubSpot', 'Deduplicated contacts',     '4 duplicates merged',          'success', 0.02, NULL, now() - interval '2 days 10 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Report Generator', 'Slack',   'Sent forecast alert',       '#leadership — Pipeline dip',   'success', 0.02, NULL, now() - interval '3 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'Gmail',   'Sent webinar invite',       'segment: high-intent leads',   'success', 0.04, NULL, now() - interval '3 days 4 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',     'Stripe',  'Applied retention offer',   'Globex Corp — 20% discount',   'pending', 0.01, 'Discount requires manager approval per policy. Auto-submitted for review.', now() - interval '3 days 6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',      'Gmail',   'Sent negotiation recap',    'cto@widgetlabs.io',            'success', 0.03, NULL, now() - interval '3 days 8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Support Triage',   'Gmail',   'Resolved ticket',           'user@customer.com — Fixed',    'success', 0.02, NULL, now() - interval '4 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',    'HubSpot', 'Rotated lead assignment',   'Round-robin: 5 SDRs',          'success', 0.01, NULL, now() - interval '4 days 2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',    'HubSpot', 'Validated email list',      '23/25 emails verified',        'success', 0.03, NULL, now() - interval '4 days 5 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Report Generator', 'Notion',  'Archived old reports',      'Q1 reports → Archive',         'success', 0.01, NULL, now() - interval '5 days');


-- ────────────────────────────────────────────────────────────
-- 8. SEED DATA — Approvals (20+)
-- ────────────────────────────────────────────────────────────

INSERT INTO public.approvals (workspace_id, agent_name, agent_role, risk_level, status, action_description, draft_content, draft_subject, target_entity, target_type, app, created_at) VALUES
  -- Pending (5)
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',  'Lead Nurturer',  'medium', 'pending', 'Send follow-up email with custom pricing',  'Hi Sarah,\n\nThank you for your time on the demo yesterday. Based on your team size of 50, I''ve put together a custom pricing proposal:\n\n- Growth Plan: $89/seat/mo (15% volume discount)\n- Annual commitment: additional 10% off\n\nWould love to schedule a call this week to walk through the details.\n\nBest,\nAlex', 'Custom pricing for Acme Corp', 'sarah.chen@acme.com', 'contact', 'Gmail', now() - interval '10 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',   'Churn Rescue',   'high',   'pending', 'Apply 20% retention discount for 3 months', NULL, NULL, 'Globex Corp — $2,400/mo', 'account', 'Stripe', now() - interval '30 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',    'Deal Closer',    'medium', 'pending', 'Send contract with non-standard payment terms (Net-60)', NULL, NULL, 'Widget Labs — Growth Plan', 'deal', 'Gmail', now() - interval '1 hour'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',   'Churn Rescue',   'high',   'pending', 'Send executive escalation email from CEO', 'Dear VP Martinez,\n\nI noticed your team''s usage has decreased recently. As CEO, I wanted to personally reach out and understand how we can better support your operations.\n\nWould you have 15 minutes this week for a quick call?\n\nWarm regards', 'Personal note from our CEO', 'vp@globex.com', 'contact', 'Gmail', now() - interval '2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',  'Lead Nurturer',  'low',    'pending', 'Add 12 new leads to nurture sequence',      NULL, NULL, 'Inbound batch — June Week 3', 'batch', 'HubSpot', now() - interval '3 hours'),
  -- Approved (10)
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',  'Lead Nurturer',  'low',    'approved', 'Sent personalized case study',              NULL, NULL, 'sarah.chen@acme.com', 'contact', 'Gmail', now() - interval '4 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Invoice Chaser', 'Invoice Chaser', 'medium', 'approved', 'Sent 3rd payment reminder with escalation warning', NULL, NULL, 'billing@widgetlabs.io', 'contact', 'Gmail', now() - interval '6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',    'Deal Closer',    'low',    'approved', 'Updated deal stage to Negotiation',         NULL, NULL, 'Widget Labs — Growth Plan', 'deal', 'HubSpot', now() - interval '8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',   'Churn Rescue',   'medium', 'approved', 'Sent 1-month free extension offer',         NULL, NULL, 'Initech Corp — $800/mo', 'account', 'Stripe', now() - interval '1 day'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',  'Lead Nurturer',  'low',    'approved', 'Enrolled in drip campaign',                 NULL, NULL, 'emily.park@techflow.io', 'contact', 'HubSpot', now() - interval '1 day 2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',  'Data Enricher',  'low',    'approved', 'Batch enriched 25 contacts',                NULL, NULL, 'Inbound batch — June Week 2', 'batch', 'HubSpot', now() - interval '1 day 5 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Support Triage', 'Support Triage', 'medium', 'approved', 'Escalated P1 ticket to engineering',        NULL, NULL, '#eng-oncall', 'channel', 'Slack', now() - interval '2 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',    'Deal Closer',    'low',    'approved', 'Sent demo recording and summary',           NULL, NULL, 'cto@widgetlabs.io', 'contact', 'Gmail', now() - interval '2 days 3 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',  'Lead Nurturer',  'low',    'approved', 'Created follow-up task for SDR',            NULL, NULL, 'Alex Rivera — Call Emily Park', 'task', 'HubSpot', now() - interval '3 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',   'Churn Rescue',   'medium', 'approved', 'Scheduled QBR with at-risk account',        NULL, NULL, 'Globex Corp', 'account', 'Google Calendar', now() - interval '3 days 4 hours'),
  -- Rejected (3)
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',  'Lead Nurturer',  'high',   'rejected', 'Send bulk cold outreach to purchased list', NULL, NULL, '500 contacts — external list', 'batch', 'Gmail', now() - interval '4 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Churn Rescue',   'Churn Rescue',   'high',   'rejected', 'Apply 50% discount without approval chain', NULL, NULL, 'Globex Corp — $2,400/mo', 'account', 'Stripe', now() - interval '4 days 6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deal Closer',    'Deal Closer',    'medium', 'rejected', 'Extend trial by 30 days',                   NULL, NULL, 'Startup.io — Free trial', 'account', 'Stripe', now() - interval '5 days'),
  -- Auto-executed (5)
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lead Nurturer',  'Lead Nurturer',  'low',    'auto-executed', 'Sent standard welcome email',          NULL, NULL, 'new-signup@startup.io', 'contact', 'Gmail', now() - interval '5 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Data Enricher',  'Data Enricher',  'low',    'auto-executed', 'Enriched new lead profile',            NULL, NULL, 'j.martinez@initech.com', 'contact', 'HubSpot', now() - interval '10 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Report Generator','Report Generator','low',  'auto-executed', 'Generated daily activity digest',      NULL, NULL, '#leadership channel', 'channel', 'Slack', now() - interval '1 day'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Support Triage', 'Support Triage', 'low',    'auto-executed', 'Auto-responded with FAQ article',      NULL, NULL, 'user@customer.com', 'contact', 'Gmail', now() - interval '1 day 8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Invoice Chaser', 'Invoice Chaser', 'low',    'auto-executed', 'Sent payment receipt confirmation',    NULL, NULL, 'billing@acme.com', 'contact', 'Gmail', now() - interval '2 days 4 hours')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 9. SEED DATA — Notifications (30+)
-- ────────────────────────────────────────────────────────────

INSERT INTO public.notifications (workspace_id, user_id, title, body, type, read, created_at) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'New approval required',        'Lead Nurturer wants to send custom pricing to sarah.chen@acme.com', 'warning', false, now() - interval '10 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Churn risk detected',          'Globex Corp usage dropped 60% — Churn Rescue initiated sequence', 'warning', false, now() - interval '30 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Agent error: Support Triage',  'Gmail API rate limit exceeded. Agent paused automatically.', 'error', false, now() - interval '45 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Deal stage updated',           'Acme Corp moved to Negotiation — Lead Nurturer', 'success', false, now() - interval '1 hour'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'High-risk approval pending',   'Churn Rescue wants to apply 20% discount to Globex Corp', 'warning', false, now() - interval '2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Weekly digest ready',          'Report Generator compiled your weekly pipeline summary', 'info', true, now() - interval '3 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Lead scored 82/100',           'Emily Park from TechFlow Inc — high buying intent detected', 'success', true, now() - interval '4 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Invoice #1247 still overdue',  'Widget Labs has not responded to 3 reminders — 7 days overdue', 'warning', true, now() - interval '5 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'New deal created',             'Deal Closer opened Widget Labs — Growth Plan opportunity', 'info', true, now() - interval '6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Approval auto-executed',       'Lead Nurturer sent standard welcome to new-signup@startup.io', 'info', true, now() - interval '8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Enrichment complete',          'Data Enricher updated 12 contacts with company data', 'success', true, now() - interval '10 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Agent resumed',                'Support Triage re-connected to Gmail API', 'success', true, now() - interval '12 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Pipeline alert',               'Q2 pipeline dipped 8% — Report Generator flagged this', 'warning', true, now() - interval '1 day'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Approval rejected',            'Bulk cold outreach to purchased list — rejected by you', 'info', true, now() - interval '1 day 2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'NPS survey sent',              'Churn Rescue sent NPS survey to 42 active accounts', 'info', true, now() - interval '1 day 4 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Retention offer applied',      'Initech Corp received 1-month free extension', 'success', true, now() - interval '1 day 6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Monthly cost report',          'Total agent cost: $4.89 across 8 agents for June', 'info', true, now() - interval '2 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'New integration connected',    'Google Calendar successfully connected', 'success', true, now() - interval '2 days 4 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Agent created',                'Report Generator is now active in your workspace', 'info', true, now() - interval '3 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Welcome to OpsConductor!',     'Your Acme Corp workspace is ready. Start by connecting your first integration.', 'success', true, now() - interval '7 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Win! Acme Corp closed',        'Deal Closer confirmed: Acme Corp signed Enterprise Plan — $14,280 ARR', 'success', true, now() - interval '1 day 1 hour'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'QBR scheduled',                'Churn Rescue set up quarterly review with Globex Corp for next Tuesday', 'info', true, now() - interval '3 days 2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Duplicate contacts merged',    'Data Enricher found and merged 4 duplicate contact records', 'info', true, now() - interval '2 days 8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Email deliverability check',   'All agent emails passed SPF/DKIM — 98.5% inbox rate', 'success', true, now() - interval '4 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Territory assignment updated', 'Lead Nurturer rotated West Coast leads across 5 SDRs', 'info', true, now() - interval '4 days 2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Board deck generated',         'Report Generator created June Monthly Review in Notion', 'success', true, now() - interval '5 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'P1 ticket resolved',           'Support Triage: API timeout issue resolved by engineering', 'success', true, now() - interval '3 days 8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Onboarding tip',               'Pro tip: Set risk thresholds per agent in Settings → Guardrails', 'info', true, now() - interval '6 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Usage milestone',              'Your agents have completed 2,000+ actions this month!', 'success', true, now() - interval '5 days 6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cb351c8f-d827-4d67-86fe-24638ee065ac', 'Email list validated',         'Data Enricher verified 23/25 emails — 2 bounced removed', 'info', true, now() - interval '4 days 4 hours')
ON CONFLICT DO NOTHING;


-- Done! 🎉
-- Run this migration in your Supabase SQL Editor.
-- After running, your existing user will have access to the
-- Acme Corp workspace with full demo data.
