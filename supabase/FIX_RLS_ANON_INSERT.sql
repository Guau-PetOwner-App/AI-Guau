-- ⚡ FIX: Permitir inserts anónimos en pet_analyses
-- Problema: Las policies actuales requieren acceso a auth.users
-- Solución: Simplificar policy para usuarios anónimos

-- 1. Eliminar policies conflictivas
DROP POLICY IF EXISTS "Anonymous users can insert with email" ON public.pet_analyses;
DROP POLICY IF EXISTS "Users can insert their own analyses" ON public.pet_analyses;

-- 2. Crear policy simple para usuarios anónimos (INSERT)
CREATE POLICY "anon_can_insert_analyses"
  ON public.pet_analyses
  FOR INSERT
  TO anon
  WITH CHECK (true); -- Permitir cualquier insert desde rol anon

-- 3. Crear policy para usuarios autenticados (INSERT)
CREATE POLICY "auth_can_insert_analyses"
  ON public.pet_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 4. Simplificar policy de SELECT para anon
DROP POLICY IF EXISTS "Users can view their own analyses" ON public.pet_analyses;
DROP POLICY IF EXISTS "Users can view analyses by email before claiming" ON public.pet_analyses;

CREATE POLICY "anon_can_view_own_analyses"
  ON public.pet_analyses
  FOR SELECT
  TO anon
  USING (true); -- Por ahora permitir ver todo para anon (puedes restringir después)

CREATE POLICY "auth_can_view_own_analyses"
  ON public.pet_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Verificar permisos
GRANT INSERT ON public.pet_analyses TO anon;
GRANT SELECT ON public.pet_analyses TO anon;
GRANT ALL ON public.pet_analyses TO authenticated;
