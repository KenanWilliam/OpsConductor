-- ============================================================
-- OpsConductor — Integration Schema Migration
-- Safe to run on existing data (all IF NOT EXISTS / IF EXISTS)
-- Run in the Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. CREATE TABLE (if not exists)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.integrations (
  id               uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  workspace_id     uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  provider         text NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 2. ADD COLUMNS (all IF NOT EXISTS — safe for reruns)
-- ────────────────────────────────────────────────────────────

ALTER TABLE integrations
  ADD COLUMN IF NOT EXISTS provider_user_id    text,
  ADD COLUMN IF NOT EXISTS provider_email       text,
  ADD COLUMN IF NOT EXISTS provider_workspace   text,
  ADD COLUMN IF NOT EXISTS access_token         text,
  ADD COLUMN IF NOT EXISTS refresh_token        text,
  ADD COLUMN IF NOT EXISTS token_expires_at     timestamptz,
  ADD COLUMN IF NOT EXISTS scopes               text[]      DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS account_label        text,
  ADD COLUMN IF NOT EXISTS status               text        NOT NULL DEFAULT 'disconnected',
  ADD COLUMN IF NOT EXISTS error_message        text,
  ADD COLUMN IF NOT EXISTS last_used_at         timestamptz,
  ADD COLUMN IF NOT EXISTS last_synced_at       timestamptz,
  ADD COLUMN IF NOT EXISTS metadata             jsonb       DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS connected_by         uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS connected_at         timestamptz,
  ADD COLUMN IF NOT EXISTS disconnected_at      timestamptz;


-- ────────────────────────────────────────────────────────────
-- 3. CONSTRAINTS
-- ────────────────────────────────────────────────────────────

-- Status constraint
ALTER TABLE integrations DROP CONSTRAINT IF EXISTS chk_integrations_status;
ALTER TABLE integrations ADD CONSTRAINT chk_integrations_status
  CHECK (status IN ('active', 'disconnected', 'error', 'expired', 'pending'));

-- All 17 providers shown in the UI
ALTER TABLE integrations DROP CONSTRAINT IF EXISTS chk_integrations_provider;
ALTER TABLE integrations ADD CONSTRAINT chk_integrations_provider
  CHECK (provider IN (
    'slack', 'gmail', 'sendgrid',
    'hubspot', 'salesforce',
    'stripe',
    'notion', 'calendly', 'google_calendar', 'google_sheets', 'airtable',
    'linear', 'github', 'jira',
    'intercom',
    'clearbit',
    'zapier'
  ));

-- One per provider per workspace
ALTER TABLE integrations DROP CONSTRAINT IF EXISTS integrations_workspace_provider_unique;
ALTER TABLE integrations ADD CONSTRAINT integrations_workspace_provider_unique
  UNIQUE (workspace_id, provider);


-- ────────────────────────────────────────────────────────────
-- 4. INDEXES
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_integrations_workspace_id  ON integrations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_integrations_status        ON integrations(status);
CREATE INDEX IF NOT EXISTS idx_integrations_provider      ON integrations(provider);
CREATE INDEX IF NOT EXISTS idx_integrations_token_expiry  ON integrations(token_expires_at) WHERE token_expires_at IS NOT NULL;


-- ────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "workspace members can view integrations"   ON integrations;
DROP POLICY IF EXISTS "workspace members can insert integrations" ON integrations;
DROP POLICY IF EXISTS "workspace members can update integrations" ON integrations;
DROP POLICY IF EXISTS "workspace members can delete integrations" ON integrations;

CREATE POLICY "workspace members can view integrations"   ON integrations FOR SELECT USING  (workspace_id = my_workspace_id());
CREATE POLICY "workspace members can insert integrations" ON integrations FOR INSERT WITH CHECK (workspace_id = my_workspace_id());
CREATE POLICY "workspace members can update integrations" ON integrations FOR UPDATE USING  (workspace_id = my_workspace_id());
CREATE POLICY "workspace members can delete integrations" ON integrations FOR DELETE USING  (workspace_id = my_workspace_id());


-- ────────────────────────────────────────────────────────────
-- 6. RPC FUNCTIONS
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_workspace_integrations()
RETURNS SETOF integrations LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM integrations WHERE workspace_id = my_workspace_id() ORDER BY connected_at DESC NULLS LAST;
$$;

CREATE OR REPLACE FUNCTION touch_integration(p_provider text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE integrations SET last_used_at = now()
  WHERE workspace_id = my_workspace_id() AND provider = p_provider;
$$;

CREATE OR REPLACE FUNCTION expire_integration(p_provider text, p_error text DEFAULT NULL)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE integrations
  SET status = CASE WHEN p_error IS NOT NULL THEN 'error' ELSE 'expired' END,
      error_message = p_error,
      disconnected_at = now()
  WHERE workspace_id = my_workspace_id() AND provider = p_provider;
$$;
