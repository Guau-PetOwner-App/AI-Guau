-- ================================================
-- NUCLEAR OPTION: Deshabilitar RLS en Storage
-- ================================================
-- ⚠️ USA ESTO SOLO SI LAS POLICIES NO FUNCIONAN
--
-- Esto deshabilita completamente RLS en storage.objects
-- Significa que todos los buckets son accesibles sin restricciones
--
-- PROS:
-- ✅ Funciona 100% garantizado
-- ✅ No más errores de RLS
-- ✅ 1 línea de código
--
-- CONTRAS:
-- ⚠️ Menos control granular
-- ⚠️ Todos los buckets quedan abiertos (no solo pet-photos)
--
-- VEREDICTO: 
-- ✅ OK para MVP/desarrollo
-- ⚠️ Para producción, mejor usar policies específicas

-- Disable RLS on storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- Expected output:
-- storage | objects | f  (f = false = disabled)

-- ================================================
-- TO RE-ENABLE RLS (if you change your mind):
-- ================================================
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
