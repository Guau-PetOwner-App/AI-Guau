-- ================================================
-- FIX: Allow Anonymous Uploads to pet-photos
-- ================================================
-- This allows users who are NOT logged in (role: anon)
-- to upload photos to the pet-photos bucket
--
-- SAFE: Only affects pet-photos bucket
-- RECOMMENDED: Best practice for your use case

-- Create policy for anonymous uploads
CREATE POLICY "Allow anonymous uploads to pet-photos"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'pet-photos');

-- Also allow anonymous users to read (if not already allowed)
CREATE POLICY "Allow anonymous reads from pet-photos"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'pet-photos');

-- Verify policies were created
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%anonymous%pet%'
ORDER BY policyname;

-- Expected output:
-- Allow anonymous reads from pet-photos    | SELECT | {anon} | ...
-- Allow anonymous uploads to pet-photos    | INSERT | {anon} | ...
