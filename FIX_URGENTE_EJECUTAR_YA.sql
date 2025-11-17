-- ============================================================================
-- 🚨 EJECUTAR ESTE SQL INMEDIATAMENTE EN SUPABASE
-- ============================================================================
-- 
-- COPIA DESDE AQUÍ ↓↓↓

-- Paso 1: Eliminar política de UPDATE anterior (si existe)
DROP POLICY IF EXISTS "Users can update their own analyses" ON public.pet_analyses;

-- Paso 2: Eliminar cualquier versión de la política anónima (si existe)
DROP POLICY IF EXISTS "Anonymous users can update email" ON public.pet_analyses;
DROP POLICY IF EXISTS "Anonymous users can update email on unclaimed analyses" ON public.pet_analyses;

-- Paso 3: Crear política para usuarios autenticados (RECREAR)
CREATE POLICY "Users can update their own analyses"
  ON public.pet_analyses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Paso 4: ⚡ NUEVA POLÍTICA - Usuarios anónimos pueden actualizar email
CREATE POLICY "Anonymous users can update email on unclaimed analyses"
  ON public.pet_analyses
  FOR UPDATE
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- Paso 5: Dar permiso UPDATE al rol anon
GRANT UPDATE ON public.pet_analyses TO anon;

-- ↑↑↑ COPIAR HASTA AQUÍ
-- ============================================================================

-- ============================================================================
-- ✅ VERIFICAR QUE FUNCIONÓ (Ejecutar después)
-- ============================================================================

-- Ver políticas creadas
SELECT 
  policyname,
  cmd,
  ARRAY_AGG(roles) as roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'pet_analyses'
GROUP BY policyname, cmd
ORDER BY cmd, policyname;

-- Resultado esperado:
-- Debe aparecer: "Anonymous users can update email on unclaimed analyses" | UPDATE | {anon}

-- ============================================================================
-- 🧪 TEST (Opcional - para verificar que funciona)
-- ============================================================================

-- 1. Ver análisis sin email
SELECT id, user_id, email, created_at 
FROM public.pet_analyses 
WHERE user_id IS NULL 
AND (email IS NULL OR email = '')
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Si hay alguno, prueba actualizar el email (copia uno de los IDs de arriba)
-- Reemplaza 'PEGAR-ID-AQUI' con un ID real:
-- UPDATE public.pet_analyses 
-- SET email = 'test-fix@guau.app'
-- WHERE id = 'PEGAR-ID-AQUI'
-- AND user_id IS NULL
-- RETURNING id, email, user_id;

-- Si retorna el registro con email actualizado = ✅ FUNCIONA!

-- ============================================================================
-- 📱 AHORA PRUEBA EN LA APP
-- ============================================================================
-- 1. Subir foto de mascota
-- 2. Click "Guardar"
-- 3. Ingresar email
-- 4. Debe ver en console: "✅ Analysis email updated"
-- 5. NO debe ver error PGRST116
-- ============================================================================
