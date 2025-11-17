-- Fix: Allow anonymous users to update analyses without user_id
-- This is needed for the Email-First strategy where we update the email before login

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own analyses" ON public.pet_analyses;
DROP POLICY IF EXISTS "Anonymous users can update email" ON public.pet_analyses;

-- 1. Users can update their own analyses (authenticated)
CREATE POLICY "Users can update their own analyses"
  ON public.pet_analyses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Anonymous users can update email on unclaimed analyses
-- This allows updating the email field before the user authenticates
CREATE POLICY "Anonymous users can update email on unclaimed analyses"
  ON public.pet_analyses
  FOR UPDATE
  USING (
    user_id IS NULL -- Only unclaimed analyses
  )
  WITH CHECK (
    user_id IS NULL -- Ensure they can't set user_id
  );

-- Grant UPDATE permission to anon users
GRANT UPDATE ON public.pet_analyses TO anon;

-- Verify policies
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'pet_analyses'
ORDER BY policyname;
