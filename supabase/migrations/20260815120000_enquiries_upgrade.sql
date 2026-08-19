-- DIGITALNYNE: Enquiries Upgrade Migration
-- Migration: 20260815120000_enquiries_upgrade.sql
-- Adds new columns to existing tables, creates unified view, notes, activity tables

-- ─── Add new columns to quote_requests ───────────────────────────────────────
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS assigned_to TEXT,
  ADD COLUMN IF NOT EXISTS next_follow_up_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS estimated_value NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS lost_reason TEXT,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS preferred_contact TEXT,
  ADD COLUMN IF NOT EXISTS referrer_page TEXT,
  ADD COLUMN IF NOT EXISTS privacy_consent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS privacy_policy_version TEXT;

-- ─── Add new columns to contact_submissions ───────────────────────────────────
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS assigned_to TEXT,
  ADD COLUMN IF NOT EXISTS next_follow_up_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS estimated_value NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS lost_reason TEXT,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS business_name TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS preferred_contact TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS budget TEXT,
  ADD COLUMN IF NOT EXISTS service TEXT,
  ADD COLUMN IF NOT EXISTS referrer_page TEXT,
  ADD COLUMN IF NOT EXISTS privacy_consent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS privacy_policy_version TEXT;

-- ─── Enquiry Notes Table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enquiry_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL,
  enquiry_type TEXT NOT NULL CHECK (enquiry_type IN ('quote', 'contact')),
  note_text TEXT NOT NULL,
  author_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiry_notes_enquiry ON public.enquiry_notes(enquiry_id, enquiry_type);
CREATE INDEX IF NOT EXISTS idx_enquiry_notes_created ON public.enquiry_notes(created_at DESC);

ALTER TABLE public.enquiry_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_enquiry_notes" ON public.enquiry_notes;
CREATE POLICY "admin_all_enquiry_notes"
  ON public.enquiry_notes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.active = true
    )
  );

-- ─── Activity Timeline Table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enquiry_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL,
  enquiry_type TEXT NOT NULL CHECK (enquiry_type IN ('quote', 'contact')),
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  actor_email TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiry_activity_enquiry ON public.enquiry_activity(enquiry_id, enquiry_type);
CREATE INDEX IF NOT EXISTS idx_enquiry_activity_created ON public.enquiry_activity(created_at DESC);

ALTER TABLE public.enquiry_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_enquiry_activity" ON public.enquiry_activity;
CREATE POLICY "admin_all_enquiry_activity"
  ON public.enquiry_activity
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.active = true
    )
  );

-- ─── Unified Enquiries View ───────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.unified_enquiries AS
  SELECT
    id,
    'quote'::TEXT                     AS enquiry_type,
    full_name,
    email,
    phone                             AS mobile,
    whatsapp_number,
    business_name,
    city,
    preferred_contact,
    -- enquiry details
    ARRAY_TO_STRING(selected_services, ', ') AS service,
    budget,
    project_description               AS message,
    project_type                      AS timeline,
    -- status & sales
    status,
    is_read,
    priority,
    assigned_to,
    next_follow_up_at,
    estimated_value,
    lost_reason,
    archived_at,
    -- source
    source_page,
    referrer_page,
    utm_source,
    utm_medium,
    utm_campaign,
    -- privacy
    privacy_consent,
    marketing_consent,
    consent_timestamp,
    privacy_policy_version,
    -- timestamps
    created_at,
    updated_at,
    -- original reference
    reference_number                  AS reference,
    NULL::TEXT                        AS subject
  FROM public.quote_requests

UNION ALL

  SELECT
    id,
    'contact'::TEXT                   AS enquiry_type,
    full_name,
    email,
    phone                             AS mobile,
    whatsapp_number,
    business_name,
    city,
    preferred_contact,
    service,
    budget,
    message,
    NULL::TEXT                        AS timeline,
    status,
    is_read,
    priority,
    assigned_to,
    next_follow_up_at,
    estimated_value,
    lost_reason,
    archived_at,
    source_page,
    referrer_page,
    utm_source,
    utm_medium,
    utm_campaign,
    privacy_consent,
    marketing_consent,
    consent_timestamp,
    privacy_policy_version,
    created_at,
    updated_at,
    NULL::TEXT                        AS reference,
    subject
  FROM public.contact_submissions;

-- ─── Indexes for new columns ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_quote_requests_is_read ON public.quote_requests(is_read);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_next_followup ON public.quote_requests(next_follow_up_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_is_read ON public.contact_submissions(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_next_followup ON public.contact_submissions(next_follow_up_at);
