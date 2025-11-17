-- Create pet_analyses table
-- This table stores pet photo analyses linked to users

CREATE TABLE IF NOT EXISTS public.pet_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  pet_name TEXT,
  photo_url TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  is_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pet_analyses_user_id ON public.pet_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_analyses_email ON public.pet_analyses(email);
CREATE INDEX IF NOT EXISTS idx_pet_analyses_created_at ON public.pet_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pet_analyses_is_claimed ON public.pet_analyses(is_claimed);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pet_analyses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own analyses" ON public.pet_analyses;
DROP POLICY IF EXISTS "Users can insert their own analyses" ON public.pet_analyses;
DROP POLICY IF EXISTS "Users can update their own analyses" ON public.pet_analyses;
DROP POLICY IF EXISTS "Users can delete their own analyses" ON public.pet_analyses;
DROP POLICY IF EXISTS "Anonymous users can insert with email" ON public.pet_analyses;
DROP POLICY IF EXISTS "Users can view analyses by email before claiming" ON public.pet_analyses;

-- RLS Policies

-- 1. Users can view their own analyses
CREATE POLICY "Users can view their own analyses"
  ON public.pet_analyses
  FOR SELECT
  USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- 2. Users can insert their own analyses
CREATE POLICY "Users can insert their own analyses"
  ON public.pet_analyses
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL -- Allow anonymous insertions
  );

-- 3. Anonymous users can insert with email (no auth required)
CREATE POLICY "Anonymous users can insert with email"
  ON public.pet_analyses
  FOR INSERT
  WITH CHECK (
    user_id IS NULL AND email IS NOT NULL
  );

-- 4. Users can update their own analyses
CREATE POLICY "Users can update their own analyses"
  ON public.pet_analyses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Users can delete their own analyses
CREATE POLICY "Users can delete their own analyses"
  ON public.pet_analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.pet_analyses;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.pet_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.pet_analyses TO authenticated;
GRANT INSERT ON public.pet_analyses TO anon;
GRANT SELECT ON public.pet_analyses TO anon;

-- Add helpful comments
COMMENT ON TABLE public.pet_analyses IS 'Stores pet photo analyses from Guau Vision Assistant';
COMMENT ON COLUMN public.pet_analyses.id IS 'Unique identifier for the analysis';
COMMENT ON COLUMN public.pet_analyses.user_id IS 'User who owns this analysis (null for anonymous)';
COMMENT ON COLUMN public.pet_analyses.email IS 'Email used for anonymous analyses (for claiming later)';
COMMENT ON COLUMN public.pet_analyses.pet_name IS 'Optional name for the pet (user can set later)';
COMMENT ON COLUMN public.pet_analyses.photo_url IS 'URL to the pet photo in Supabase Storage';
COMMENT ON COLUMN public.pet_analyses.analysis_data IS 'Complete GuauVisionResponse JSON from OpenAI Assistant';
COMMENT ON COLUMN public.pet_analyses.is_claimed IS 'Whether an anonymous analysis was claimed by a registered user';
COMMENT ON COLUMN public.pet_analyses.created_at IS 'Timestamp when analysis was created';
COMMENT ON COLUMN public.pet_analyses.updated_at IS 'Timestamp when analysis was last updated';
