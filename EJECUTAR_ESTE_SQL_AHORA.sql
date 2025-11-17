-- ============================================================================
-- 🔧 FIX URGENTE: Permitir UPDATE de email para usuarios anónimos
-- ============================================================================
-- 
-- PROBLEMA: 
-- Error PGRST116 cuando usuarios anónimos intentan actualizar email
-- 
-- CAUSA: 
-- RLS policy no permite UPDATE a usuarios anónimos
--
-- SOLUCIÓN:
-- Agregar política que permita actualizar email en análisis sin reclamar
--
-- ============================================================================

-- Paso 1: Eliminar políticas existentes de UPDATE
DROP POLICY IF EXISTS "Users can update their own analyses" ON public.pet_analyses;
DROP POLICY IF EXISTS "Anonymous users can update email" ON public.pet_analyses;
DROP POLICY IF EXISTS "Anonymous users can update email on unclaimed analyses" ON public.pet_analyses;

-- Paso 2: Crear política para usuarios autenticados
CREATE POLICY "Users can update their own analyses"
  ON public.pet_analyses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Paso 3: Crear política para usuarios anónimos (⚡ NUEVO)
CREATE POLICY "Anonymous users can update email on unclaimed analyses"
  ON public.pet_analyses
  FOR UPDATE
  USING (
    user_id IS NULL -- Solo análisis sin reclamar
  )
  WITH CHECK (
    user_id IS NULL -- No pueden asignar user_id
  );

-- Paso 4: Dar permiso UPDATE a rol anon
GRANT UPDATE ON public.pet_analyses TO anon;

-- ============================================================================
-- ✅ VERIFICACIÓN
-- ============================================================================

-- Ver todas las políticas de pet_analyses
SELECT 
  policyname,
  cmd,
  roles,
  permissive
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'pet_analyses'
ORDER BY cmd, policyname;

-- Ver permisos de la tabla
SELECT 
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name = 'pet_analyses'
AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- ============================================================================
-- 📝 RESULTADO ESPERADO
-- ============================================================================
--
-- Políticas (6 total):
-- ✅ Anonymous users can insert with email (INSERT, anon)
-- ✅ Anonymous users can update email on unclaimed analyses (UPDATE, anon) ⚡ NUEVO
-- ✅ Users can delete their own analyses (DELETE, authenticated)
-- ✅ Users can insert their own analyses (INSERT, authenticated)
-- ✅ Users can update their own analyses (UPDATE, authenticated)
-- ✅ Users can view their own analyses (SELECT, authenticated+anon)
--
-- Permisos:
-- ✅ anon: INSERT, SELECT, UPDATE ⚡ UPDATE es nuevo
-- ✅ authenticated: INSERT, SELECT, UPDATE, DELETE
--
-- ============================================================================

-- ============================================================================
-- 🧪 TEST MANUAL (Opcional)
-- ============================================================================

-- 1. Crear análisis anónimo de prueba
INSERT INTO public.pet_analyses (id, user_id, email, photo_url, analysis_data)
VALUES (
  gen_random_uuid(),
  NULL,
  NULL,
  'https://example.com/test.jpg',
  '{"species": "Perro"}'::jsonb
)
RETURNING id, user_id, email;
-- Guardar el ID retornado

-- 2. Intentar actualizar email (como usuario anónimo)
-- Copia el ID del paso anterior y úsalo aquí:
UPDATE public.pet_analyses 
SET email = 'test@guau.app'
WHERE id = 'PEGAR-ID-AQUI'
AND user_id IS NULL
RETURNING id, email, user_id;
-- Debería funcionar y retornar el análisis con email actualizado ✅

-- 3. Limpiar test
DELETE FROM public.pet_analyses WHERE email = 'test@guau.app';

-- ============================================================================
-- 🎉 LISTO!
-- ============================================================================
-- Ahora los usuarios anónimos pueden actualizar el email de sus análisis
-- antes de hacer login, permitiendo que el claim funcione correctamente.
-- ============================================================================
