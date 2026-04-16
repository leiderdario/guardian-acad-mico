
-- Roles de usuario
CREATE TYPE public.app_role AS ENUM ('administrador', 'coordinador_academico', 'consejero');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'administrador'));

-- Estudiantes
CREATE TABLE public.estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_estudiantil TEXT NOT NULL UNIQUE,
  tipo_documento TEXT,
  numero_documento TEXT,
  nombre_completo TEXT NOT NULL,
  fecha_nacimiento DATE,
  sexo TEXT,
  municipio_origen TEXT,
  departamento_origen TEXT,
  telefono TEXT,
  correo_institucional TEXT,
  programa_academico TEXT,
  facultad TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view students" ON public.estudiantes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert students" ON public.estudiantes
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update students" ON public.estudiantes
  FOR UPDATE TO authenticated USING (true);

-- Cargues
CREATE TABLE public.cargues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
  nombre_archivo TEXT,
  numero_registros INTEGER NOT NULL DEFAULT 0,
  riesgo_promedio NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cargues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view uploads" ON public.cargues
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create uploads" ON public.cargues
  FOR INSERT TO authenticated WITH CHECK (true);

-- Registros academicos (snapshot por cargue)
CREATE TABLE public.registros_academicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cargue_id UUID REFERENCES public.cargues(id) ON DELETE CASCADE NOT NULL,
  estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE NOT NULL,
  semestre_actual INTEGER,
  ano_ingreso INTEGER,
  jornada TEXT,
  promedio_semestre NUMERIC(4,2),
  promedio_acumulado NUMERIC(4,2),
  materias_matriculadas INTEGER,
  materias_aprobadas INTEGER,
  materias_reprobadas INTEGER,
  semestres_cursados INTEGER,
  cancelaciones_materias INTEGER,
  creditos_aprobados INTEGER,
  creditos_pendientes INTEGER,
  puntaje_razonamiento_mat NUMERIC(5,2),
  puntaje_pensamiento_critico NUMERIC(5,2),
  puntaje_pensamiento_social NUMERIC(5,2),
  puntaje_lectura_critica NUMERIC(5,2),
  puntaje_competencias_ciudadanas NUMERIC(5,2),
  puntaje_ingles NUMERIC(5,2),
  puntaje_ciencias_naturales NUMERIC(5,2),
  materias_segunda_matricula BOOLEAN DEFAULT false,
  semestres_perdidos_rendimiento BOOLEAN DEFAULT false,
  num_semestres_perdidos INTEGER DEFAULT 0,
  estrato INTEGER,
  sisben BOOLEAN DEFAULT false,
  beca_apoyo BOOLEAN DEFAULT false,
  tipo_beca TEXT,
  trabaja BOOLEAN DEFAULT false,
  horas_trabajo INTEGER,
  ingreso_hogar TEXT,
  personas_hogar INTEGER,
  cabeza_hogar BOOLEAN DEFAULT false,
  distancia_campus NUMERIC(6,2),
  transporte TEXT,
  tipo_colegio TEXT,
  promedio_grado11 NUMERIC(5,2),
  puntaje_saber11 NUMERIC(6,2),
  ano_graduacion_bach INTEGER,
  estudio_previo BOOLEAN DEFAULT false,
  interrupciones BOOLEAN DEFAULT false,
  razon_interrupcion TEXT,
  asistencia_psicologia BOOLEAN DEFAULT false,
  trastorno_aprendizaje BOOLEAN DEFAULT false,
  violencia_acoso BOOLEAN DEFAULT false,
  satisfaccion_carrera INTEGER,
  satisfaccion_universidad INTEGER,
  red_apoyo_familiar BOOLEAN DEFAULT false,
  estado_civil TEXT,
  tiene_hijos BOOLEAN DEFAULT false,
  numero_hijos INTEGER DEFAULT 0,
  participa_grupos BOOLEAN DEFAULT false,
  practicas_pasantias BOOLEAN DEFAULT false,
  tutorias_solicitadas INTEGER DEFAULT 0,
  asistencia_clases NUMERIC(5,2),
  solicitud_retiro BOOLEAN DEFAULT false,
  indice_riesgo NUMERIC(5,2),
  clasificacion TEXT,
  factores_principales TEXT[],
  en_intervencion BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.registros_academicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view records" ON public.registros_academicos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert records" ON public.registros_academicos
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update records" ON public.registros_academicos
  FOR UPDATE TO authenticated USING (true);

-- Notas del consejero
CREATE TABLE public.notas_consejero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  contenido TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notas_consejero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notes" ON public.notas_consejero
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create notes" ON public.notas_consejero
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_registros_cargue ON public.registros_academicos(cargue_id);
CREATE INDEX idx_registros_estudiante ON public.registros_academicos(estudiante_id);
CREATE INDEX idx_estudiantes_codigo ON public.estudiantes(codigo_estudiantil);
CREATE INDEX idx_estudiantes_facultad ON public.estudiantes(facultad);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_estudiantes_updated_at
  BEFORE UPDATE ON public.estudiantes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
