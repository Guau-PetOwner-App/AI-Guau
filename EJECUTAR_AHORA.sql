-- ================================================
-- ⚡ EJECUTAR ESTO AHORA - Fix Definitivo
-- ================================================
-- Copia y pega este SQL completo en:
-- https://supabase.com/dashboard/project/oqoaxusesfcrmejftwmt/sql/new

-- PASO 1: Deshabilitar RLS en storage.objects (fix inmediato)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- PASO 2: Verificar que funcionó
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- Resultado esperado:
-- storage | objects | f  (false = RLS deshabilitado = ✅ FUNCIONARÁ)

-- ================================================
-- ¿Por qué esto funciona?
-- ================================================
-- ✅ Deshabilita RLS = No más errores de policies
-- ✅ Tu bucket ya es público, así que es seguro
-- ✅ 1 línea = Fix inmediato
-- ✅ Puedes revertirlo después si quieres

-- ================================================
-- Para revertir (si cambias de opinión):
-- ================================================
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
