-- ============================================================
-- OpsConductor — Schema Alignment Migration
-- Aligns ALL tables/RPCs/views with app-layer expectations
-- Safe to run on existing data (all IF NOT EXISTS / IF EXISTS)
-- Run in the Supabase SQL Editor
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. WORKSPACES — add missing columns
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.workspaces
  ADD COLUMN IF NOT EXISTS slug              text,
  ADD COLUMN IF NOT EXISTS events_quota      int          NOT NULL DEFAULT 1000,
  ADD COLUMN IF NOT EXISTS events_used       int          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stripe_id         text,
  ADD COLUMN IF NOT EXISTS setup_completed   boolean      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS setup_steps_done  text[]       NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at        timestamptz  NOT NULL DEFAULT now();


-- ────────────────────────────────────────────────────────────
-- 2. PROFILES — add missing columns
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS workspace_id          uuid REFERENCES public.workspaces(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS role                  text NOT NULL DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS onboarding_completed  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_step       int     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onboarding_dismissed  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at            timestamptz NOT NULL DEFAULT now();


-- ────────────────────────────────────────────────────────────
-- 3. AGENTS — add missing columns for new schema
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS description          text,
  ADD COLUMN IF NOT EXISTS trigger_type         text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS trigger_config       jsonb,
  ADD COLUMN IF NOT EXISTS approval_mode        text NOT NULL DEFAULT 'always',
  ADD COLUMN IF NOT EXISTS approval_threshold   text,
  ADD COLUMN IF NOT EXISTS integrations         text[],
  ADD COLUMN IF NOT EXISTS model                text DEFAULT 'claude-sonnet-4-6',
  ADD COLUMN IF NOT EXISTS system_prompt        text,
  ADD COLUMN IF NOT EXISTS webhook_secret       text,
  ADD COLUMN IF NOT EXISTS run_count            int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_run_at          timestamptz,
  ADD COLUMN IF NOT EXISTS created_by           uuid,
  ADD COLUMN IF NOT EXISTS updated_at           timestamptz NOT NULL DEFAULT now();

-- Add 'archived' to status CHECK if missing (drop old, add new)
ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS agents_status_check;
ALTER TABLE public.agents ADD CONSTRAINT agents_status_check
  CHECK (status IN ('running', 'idle', 'paused', 'error', 'archived'));

ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS chk_agents_trigger_type;
ALTER TABLE public.agents ADD CONSTRAINT chk_agents_trigger_type
  CHECK (trigger_type IN ('manual', 'schedule', 'webhook', 'event'));

ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS chk_agents_approval_mode;
ALTER TABLE public.agents ADD CONSTRAINT chk_agents_approval_mode
  CHECK (approval_mode IN ('always', 'never', 'risk_above'));

ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS chk_agents_approval_threshold;
ALTER TABLE public.agents ADD CONSTRAINT chk_agents_approval_threshold
  CHECK (approval_threshold IS NULL OR approval_threshold IN ('low', 'medium', 'high', 'critical'));


-- ────────────────────────────────────────────────────────────
-- 4. EVENTS TABLE (new — replaces activity_events)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.events (
  id            uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  workspace_id  uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  agent_id      uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  run_id        uuid,
  type          text,
  status        text DEFAULT 'success',
  title         text NOT NULL,
  description   text,
  target_type   text,
  target_id     text,
  target_name   text,
  integration   text,
  risk_level    text,
  payload       jsonb,
  cost_usd      numeric(10,4) DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS chk_events_status;
ALTER TABLE public.events ADD CONSTRAINT chk_events_status
  CHECK (status IS NULL OR status IN ('success', 'error', 'pending', 'skipped', 'running'));

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS chk_events_risk_level;
ALTER TABLE public.events ADD CONSTRAINT chk_events_risk_level
  CHECK (risk_level IS NULL OR risk_level IN ('low', 'medium', 'high', 'critical'));

CREATE INDEX IF NOT EXISTS idx_events_workspace_id   ON public.events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_agent_id       ON public.events(agent_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at     ON public.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_status         ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_risk_level     ON public.events(risk_level);
CREATE INDEX IF NOT EXISTS idx_events_integration    ON public.events(integration);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Workspace events policy" ON public.events;
CREATE POLICY "Workspace events policy" ON public.events
  FOR ALL USING (workspace_id = public.my_workspace_id());


-- ────────────────────────────────────────────────────────────
-- 5. AGENT_RUNS TABLE (new)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.agent_runs (
  id             uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  agent_id       uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  workspace_id   uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  status         text NOT NULL DEFAULT 'running',
  triggered_by   text,
  started_at     timestamptz NOT NULL DEFAULT now(),
  completed_at   timestamptz,
  duration_ms    int,
  action_count   int DEFAULT 0,
  approval_count int DEFAULT 0,
  cost_usd       numeric(10,4) DEFAULT 0,
  error          text,
  log            jsonb DEFAULT '[]',
  metadata       jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_runs DROP CONSTRAINT IF EXISTS chk_agent_runs_status;
ALTER TABLE public.agent_runs ADD CONSTRAINT chk_agent_runs_status
  CHECK (status IN ('running', 'completed', 'success', 'failed', 'timeout', 'cancelled'));

CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_id     ON public.agent_runs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_workspace_id ON public.agent_runs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_started_at   ON public.agent_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status       ON public.agent_runs(status);

ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Workspace agent runs" ON public.agent_runs;
CREATE POLICY "Workspace agent runs" ON public.agent_runs
  FOR ALL USING (workspace_id = public.my_workspace_id());


-- ────────────────────────────────────────────────────────────
-- 6. APPROVALS — add missing columns
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.approvals
  ADD COLUMN IF NOT EXISTS event_id       uuid,
  ADD COLUMN IF NOT EXISTS run_id         uuid,
  ADD COLUMN IF NOT EXISTS title          text,
  ADD COLUMN IF NOT EXISTS description    text,
  ADD COLUMN IF NOT EXISTS context        jsonb,
  ADD COLUMN IF NOT EXISTS reviewed_by    uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at    timestamptz,
  ADD COLUMN IF NOT EXISTS review_note    text,
  ADD COLUMN IF NOT EXISTS edit_content   jsonb,
  ADD COLUMN IF NOT EXISTS expires_at     timestamptz;

-- Update status constraint to include 'expired' and 'cancelled'
ALTER TABLE public.approvals DROP CONSTRAINT IF EXISTS approvals_status_check;
ALTER TABLE public.approvals ADD CONSTRAINT approvals_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'cancelled', 'auto-executed'));

-- Update risk_level constraint
ALTER TABLE public.approvals DROP CONSTRAINT IF EXISTS approvals_risk_level_check;
ALTER TABLE public.approvals ADD CONSTRAINT approvals_risk_level_check
  CHECK (risk_level IN ('low', 'medium', 'high', 'critical'));

-- Make draft_content jsonb if it's currently text (can fail silently if already jsonb)
DO $$ BEGIN
  ALTER TABLE public.approvals ALTER COLUMN draft_content TYPE jsonb USING
    CASE WHEN draft_content IS NULL THEN NULL
         ELSE to_jsonb(draft_content)
    END;
EXCEPTION WHEN others THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_approvals_workspace_id ON public.approvals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status       ON public.approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_agent_id     ON public.approvals(agent_id);
CREATE INDEX IF NOT EXISTS idx_approvals_created_at   ON public.approvals(created_at DESC);


-- ────────────────────────────────────────────────────────────
-- 7. NOTIFICATIONS — add missing columns
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS profile_id   uuid,
  ADD COLUMN IF NOT EXISTS link         text,
  ADD COLUMN IF NOT EXISTS related_id   text;

-- Update type constraint
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('info', 'warning', 'error', 'success', 'approval', 'failure'));

CREATE INDEX IF NOT EXISTS idx_notifications_workspace_id ON public.notifications(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read         ON public.notifications(read) WHERE NOT read;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at   ON public.notifications(created_at DESC);


-- ────────────────────────────────────────────────────────────
-- 8. AUDIT LOG TABLE (if not exists)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.audit_log (
  id            uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  workspace_id  uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  actor_id      uuid,
  action        text NOT NULL,
  table_name    text,
  record_id     text,
  old_data      jsonb,
  new_data      jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_workspace_id ON public.audit_log(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at   ON public.audit_log(created_at DESC);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Workspace audit log" ON public.audit_log;
CREATE POLICY "Workspace audit log" ON public.audit_log
  FOR ALL USING (workspace_id = public.my_workspace_id());


-- ────────────────────────────────────────────────────────────
-- 9. VIEWS
-- ────────────────────────────────────────────────────────────

-- integrations_safe: strips tokens so client can read safely
CREATE OR REPLACE VIEW public.integrations_safe AS
SELECT
  id, workspace_id, provider, status,
  provider_user_id, provider_email, provider_workspace,
  account_label, scopes, error_message,
  last_used_at, last_synced_at, metadata,
  connected_by, connected_at, disconnected_at,
  created_at, updated_at,
  -- Expose whether token exists (not the token itself)
  (access_token IS NOT NULL)  AS has_access_token,
  (refresh_token IS NOT NULL) AS has_refresh_token,
  token_expires_at
FROM public.integrations;

-- Grant access to the view
GRANT SELECT ON public.integrations_safe TO authenticated;


-- ────────────────────────────────────────────────────────────
-- 10. RPC: workspace_stats()
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.workspace_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ws_id uuid := my_workspace_id();
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_agents',            (SELECT count(*) FROM agents WHERE workspace_id = ws_id AND status != 'archived'),
    'active_runs',             (SELECT count(*) FROM agent_runs WHERE workspace_id = ws_id AND status = 'running'),
    'pending_approvals',       (SELECT count(*) FROM approvals WHERE workspace_id = ws_id AND status = 'pending'),
    'events_today',            (SELECT count(*) FROM events WHERE workspace_id = ws_id AND created_at >= date_trunc('day', now())),
    'integrations_connected',  (SELECT count(*) FROM integrations WHERE workspace_id = ws_id AND status = 'active'),
    -- Legacy fields for backward compatibility
    'agents_total',            (SELECT count(*) FROM agents WHERE workspace_id = ws_id AND status != 'archived'),
    'agents_running',          (SELECT count(*) FROM agents WHERE workspace_id = ws_id AND status = 'running'),
    'events_this_week',        (SELECT count(*) FROM events WHERE workspace_id = ws_id AND created_at >= date_trunc('week', now())),
    'cost_this_week',          COALESCE((SELECT sum(cost_usd) FROM events WHERE workspace_id = ws_id AND created_at >= date_trunc('week', now())), 0),
    'events_quota',            (SELECT events_quota FROM workspaces WHERE id = ws_id),
    'events_used',             (SELECT events_used FROM workspaces WHERE id = ws_id)
  ) INTO result;
  RETURN result;
END;
$$;


-- ────────────────────────────────────────────────────────────
-- 11. RPC: review_approval()
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.review_approval(
  p_approval_id uuid,
  p_decision    text,
  p_note        text DEFAULT NULL,
  p_edit_content text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_approval approvals%ROWTYPE;
  v_user_id  uuid := auth.uid();
BEGIN
  -- Validate decision
  IF p_decision NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid decision value.' USING ERRCODE = 'P0002';
  END IF;

  -- Validate note length
  IF p_note IS NOT NULL AND length(p_note) > 2000 THEN
    RAISE EXCEPTION 'Review note too long (max 2000 characters).' USING ERRCODE = 'P0003';
  END IF;

  -- Check auth
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated.' USING ERRCODE = 'P0004';
  END IF;

  -- Lock and fetch
  SELECT * INTO v_approval
    FROM approvals
    WHERE id = p_approval_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Approval record not found.' USING ERRCODE = 'P0005';
  END IF;

  -- Already resolved?
  IF v_approval.status != 'pending' THEN
    RAISE EXCEPTION 'This approval has already been resolved.' USING ERRCODE = 'P0006';
  END IF;

  -- Expired?
  IF v_approval.expires_at IS NOT NULL AND v_approval.expires_at < now() THEN
    UPDATE approvals SET status = 'expired' WHERE id = p_approval_id;
    RAISE EXCEPTION 'This approval has expired.' USING ERRCODE = 'P0007';
  END IF;

  -- Validate edit content size
  IF p_edit_content IS NOT NULL AND octet_length(p_edit_content) > 102400 THEN
    RAISE EXCEPTION 'Content too large (max 100KB).' USING ERRCODE = 'P0008';
  END IF;

  -- Apply the review
  UPDATE approvals SET
    status       = p_decision,
    reviewed_by  = v_user_id,
    reviewed_at  = now(),
    review_note  = p_note,
    edit_content = CASE WHEN p_edit_content IS NOT NULL THEN to_jsonb(p_edit_content) ELSE NULL END
  WHERE id = p_approval_id;
END;
$$;


-- ────────────────────────────────────────────────────────────
-- 12. RPC: complete_setup_step()
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.complete_setup_step(p_step text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ws_id uuid := my_workspace_id();
BEGIN
  UPDATE workspaces
  SET setup_steps_done = array_append(
    CASE WHEN p_step = ANY(setup_steps_done) THEN setup_steps_done ELSE setup_steps_done END,
    CASE WHEN p_step = ANY(setup_steps_done) THEN NULL ELSE p_step END
  ),
  setup_completed = (
    CASE WHEN array_length(setup_steps_done, 1) >= 3 THEN true
    ELSE setup_completed END
  )
  WHERE id = ws_id;
END;
$$;


-- ────────────────────────────────────────────────────────────
-- 13. INDEXES on agents
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_agents_workspace_id ON public.agents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_agents_status       ON public.agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_trigger_type ON public.agents(trigger_type);
CREATE INDEX IF NOT EXISTS idx_agents_created_at   ON public.agents(created_at DESC);


-- ────────────────────────────────────────────────────────────
-- 14. ENABLE REALTIME for key tables
-- ────────────────────────────────────────────────────────────

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.approvals;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_runs;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ────────────────────────────────────────────────────────────
-- 15. UPDATED_AT TRIGGERS
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  CREATE TRIGGER trg_agents_updated_at BEFORE UPDATE ON public.agents
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_workspaces_updated_at BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_integrations_updated_at BEFORE UPDATE ON public.integrations
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- Done! Schema is now aligned with the app layer.
