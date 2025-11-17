-- ================================================
-- Storage Bucket Policies for pet-photos
-- ================================================
-- This allows anonymous users to upload photos and everyone to read them

-- 1. Allow anonymous users to INSERT (upload) photos
CREATE POLICY "Anyone can upload pet photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'pet-photos');

-- 2. Allow everyone to SELECT (read/download) photos
CREATE POLICY "Anyone can view pet photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'pet-photos');

-- 3. Allow authenticated users to UPDATE their own photos
CREATE POLICY "Users can update their own pet photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'pet-photos' AND auth.uid()::text = owner)
WITH CHECK (bucket_id = 'pet-photos');

-- 4. Allow authenticated users to DELETE their own photos
CREATE POLICY "Users can delete their own pet photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pet-photos' AND auth.uid()::text = owner);

-- ================================================
-- Verify policies were created
-- ================================================
-- Run this to check:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
