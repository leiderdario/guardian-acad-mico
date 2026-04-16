
-- Tighten INSERT/UPDATE policies to require assigned role
DROP POLICY "Authenticated users can insert students" ON public.estudiantes;
DROP POLICY "Authenticated users can update students" ON public.estudiantes;
CREATE POLICY "Role users can insert students" ON public.estudiantes
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'administrador') OR 
    public.has_role(auth.uid(), 'coordinador_academico') OR 
    public.has_role(auth.uid(), 'consejero')
  );
CREATE POLICY "Role users can update students" ON public.estudiantes
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'administrador') OR 
    public.has_role(auth.uid(), 'coordinador_academico')
  );

DROP POLICY "Authenticated users can create uploads" ON public.cargues;
CREATE POLICY "Role users can create uploads" ON public.cargues
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'administrador') OR 
    public.has_role(auth.uid(), 'coordinador_academico')
  );

DROP POLICY "Authenticated users can insert records" ON public.registros_academicos;
DROP POLICY "Authenticated users can update records" ON public.registros_academicos;
CREATE POLICY "Role users can insert records" ON public.registros_academicos
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'administrador') OR 
    public.has_role(auth.uid(), 'coordinador_academico')
  );
CREATE POLICY "Role users can update records" ON public.registros_academicos
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'administrador') OR 
    public.has_role(auth.uid(), 'coordinador_academico') OR 
    public.has_role(auth.uid(), 'consejero')
  );
