-- DIGITALNYNE: Quote Requests and Contact Submissions
-- Migration: 20260807125205_digitalnyne_forms.sql

-- ─── Quote Requests Table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  selected_services TEXT[] NOT NULL DEFAULT '{}',
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website_url TEXT,
  project_description TEXT NOT NULL,
  preferred_start_date DATE,
  project_type TEXT NOT NULL,
  budget TEXT NOT NULL,
  reference_link TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Contact Submissions Table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON public.quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON public.quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_reference ON public.quote_requests(reference_number);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- ─── Updated At Trigger Function ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_quote_requests_updated_at ON public.quote_requests;
CREATE TRIGGER set_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER set_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Enable RLS ───────────────────────────────────────────────────────────────
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies: Quote Requests ────────────────────────────────────────────
-- Public visitors may INSERT only
DROP POLICY IF EXISTS "public_insert_quote_requests" ON public.quote_requests;
CREATE POLICY "public_insert_quote_requests"
  ON public.quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated admins may read and manage all records
DROP POLICY IF EXISTS "admin_all_quote_requests" ON public.quote_requests;
CREATE POLICY "admin_all_quote_requests"
  ON public.quote_requests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── RLS Policies: Contact Submissions ───────────────────────────────────────
DROP POLICY IF EXISTS "public_insert_contact_submissions" ON public.contact_submissions;
CREATE POLICY "public_insert_contact_submissions"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_contact_submissions" ON public.contact_submissions;
CREATE POLICY "admin_all_contact_submissions"
  ON public.contact_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
