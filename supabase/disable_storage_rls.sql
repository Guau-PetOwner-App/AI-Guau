-- ================================================
-- OPCIÓN RÁPIDA: Deshabilitar RLS en Storage
-- ================================================
-- Esto hace el bucket completamente público (sin restricciones)
-- Recomendado para desarrollo/testing

-- Verificar RLS actual
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Deshabilitar RLS en storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Verificar que se deshabilitó
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';
-- rowsecurity debe ser FALSE ahora
