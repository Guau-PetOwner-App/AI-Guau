-- ================================================
-- Drop Existing Storage Policies
-- ================================================
-- Run this FIRST to remove conflicting policies
-- Then you can create new ones or disable RLS

-- Drop all pet-photos policies (if they exist)
DROP POLICY IF EXISTS "Anyone can upload pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own pet photos" ON storage.objects;

-- Also try alternative names (in case they were created with different names)
DROP POLICY IF EXISTS "Public Access All Operations" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public uploads" ON storage.objects;

-- Verify they were deleted
SELECT policyname 
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%pet%';
-- Should return 0 rows
