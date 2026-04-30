-- Tipo enumerado para condición especial declarada
DO $$ BEGIN
  CREATE TYPE public.condicion_especial AS ENUM ('ninguna', 'visual', 'auditiva', 'motriz', 'cognitiva', 'multiple', 'otra');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.estudiantes
  ADD COLUMN IF NOT EXISTS prefijo_programa text,
  ADD COLUMN IF NOT EXISTS condicion_especial public.condicion_especial NOT NULL DEFAULT 'ninguna',
  ADD COLUMN IF NOT EXISTS detalle_condicion_especial text;

CREATE INDEX IF NOT EXISTS idx_estudiantes_codigo ON public.estudiantes (codigo_estudiantil);
CREATE INDEX IF NOT EXISTS idx_estudiantes_condicion ON public.estudiantes (condicion_especial) WHERE condicion_especial <> 'ninguna';
CREATE INDEX IF NOT EXISTS idx_estudiantes_prefijo ON public.estudiantes (prefijo_programa);