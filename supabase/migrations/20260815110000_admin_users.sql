-- DIGITALNYNE: Admin Users Table
-- Migration: 20260815110000_admin_users.sql

-- ─── Admin Users Table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'viewer')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Index ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(active);

-- ─── Updated At Trigger ───────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Enable RLS ───────────────────────────────────────────────────────────────
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ─── RLS: Admin can read their own record ────────────────────────────────────
DROP POLICY IF EXISTS "admin_users_read_own" ON public.admin_users;
CREATE POLICY "admin_users_read_own"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ─── RLS: No public access ───────────────────────────────────────────────────
-- Only authenticated users can read their own row (no INSERT/UPDATE/DELETE from client)

-- ─── Insert the authorised administrator ─────────────────────────────────────
-- UID: 1c6d67de-7a46-4b80-a416-09d29a33a27d  email: info@digitalnyne.com
DO $$
BEGIN
  INSERT INTO public.admin_users (user_id, email, role, active)
  VALUES (
    '1c6d67de-7a46-4b80-a416-09d29a33a27d'::UUID,
    'info@digitalnyne.com',
    'admin',
    true
  )
  ON CONFLICT (user_id) DO UPDATE
    SET email  = EXCLUDED.email,
        role   = EXCLUDED.role,
        active = EXCLUDED.active,
        updated_at = NOW();
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Admin user insert failed: %', SQLERRM;
END $$;

-- ─── Update RLS on existing tables to use admin_users check ──────────────────
-- Replace the broad "authenticated" policies with admin-only policies

-- Quote Requests: admin read/manage
DROP POLICY IF EXISTS "admin_all_quote_requests" ON public.quote_requests;
CREATE POLICY "admin_all_quote_requests"
  ON public.quote_requests
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

-- Contact Submissions: admin read/manage
DROP POLICY IF EXISTS "admin_all_contact_submissions" ON public.contact_submissions;
CREATE POLICY "admin_all_contact_submissions"
  ON public.contact_submissions
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
