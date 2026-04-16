export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cargues: {
        Row: {
          created_at: string
          fecha: string
          id: string
          nombre_archivo: string | null
          numero_registros: number
          riesgo_promedio: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          fecha?: string
          id?: string
          nombre_archivo?: string | null
          numero_registros?: number
          riesgo_promedio?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          fecha?: string
          id?: string
          nombre_archivo?: string | null
          numero_registros?: number
          riesgo_promedio?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      estudiantes: {
        Row: {
          codigo_estudiantil: string
          correo_institucional: string | null
          created_at: string
          departamento_origen: string | null
          facultad: string | null
          fecha_nacimiento: string | null
          id: string
          municipio_origen: string | null
          nombre_completo: string
          numero_documento: string | null
          programa_academico: string | null
          sexo: string | null
          telefono: string | null
          tipo_documento: string | null
          updated_at: string
        }
        Insert: {
          codigo_estudiantil: string
          correo_institucional?: string | null
          created_at?: string
          departamento_origen?: string | null
          facultad?: string | null
          fecha_nacimiento?: string | null
          id?: string
          municipio_origen?: string | null
          nombre_completo: string
          numero_documento?: string | null
          programa_academico?: string | null
          sexo?: string | null
          telefono?: string | null
          tipo_documento?: string | null
          updated_at?: string
        }
        Update: {
          codigo_estudiantil?: string
          correo_institucional?: string | null
          created_at?: string
          departamento_origen?: string | null
          facultad?: string | null
          fecha_nacimiento?: string | null
          id?: string
          municipio_origen?: string | null
          nombre_completo?: string
          numero_documento?: string | null
          programa_academico?: string | null
          sexo?: string | null
          telefono?: string | null
          tipo_documento?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notas_consejero: {
        Row: {
          contenido: string
          created_at: string
          estudiante_id: string
          id: string
          user_id: string
        }
        Insert: {
          contenido: string
          created_at?: string
          estudiante_id: string
          id?: string
          user_id: string
        }
        Update: {
          contenido?: string
          created_at?: string
          estudiante_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notas_consejero_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_academicos: {
        Row: {
          ano_graduacion_bach: number | null
          ano_ingreso: number | null
          asistencia_clases: number | null
          asistencia_psicologia: boolean | null
          beca_apoyo: boolean | null
          cabeza_hogar: boolean | null
          cancelaciones_materias: number | null
          cargue_id: string
          clasificacion: string | null
          created_at: string
          creditos_aprobados: number | null
          creditos_pendientes: number | null
          distancia_campus: number | null
          en_intervencion: boolean | null
          estado_civil: string | null
          estrato: number | null
          estudiante_id: string
          estudio_previo: boolean | null
          factores_principales: string[] | null
          horas_trabajo: number | null
          id: string
          indice_riesgo: number | null
          ingreso_hogar: string | null
          interrupciones: boolean | null
          jornada: string | null
          materias_aprobadas: number | null
          materias_matriculadas: number | null
          materias_reprobadas: number | null
          materias_segunda_matricula: boolean | null
          num_semestres_perdidos: number | null
          numero_hijos: number | null
          participa_grupos: boolean | null
          personas_hogar: number | null
          practicas_pasantias: boolean | null
          promedio_acumulado: number | null
          promedio_grado11: number | null
          promedio_semestre: number | null
          puntaje_ciencias_naturales: number | null
          puntaje_competencias_ciudadanas: number | null
          puntaje_ingles: number | null
          puntaje_lectura_critica: number | null
          puntaje_pensamiento_critico: number | null
          puntaje_pensamiento_social: number | null
          puntaje_razonamiento_mat: number | null
          puntaje_saber11: number | null
          razon_interrupcion: string | null
          red_apoyo_familiar: boolean | null
          satisfaccion_carrera: number | null
          satisfaccion_universidad: number | null
          semestre_actual: number | null
          semestres_cursados: number | null
          semestres_perdidos_rendimiento: boolean | null
          sisben: boolean | null
          solicitud_retiro: boolean | null
          tiene_hijos: boolean | null
          tipo_beca: string | null
          tipo_colegio: string | null
          trabaja: boolean | null
          transporte: string | null
          trastorno_aprendizaje: boolean | null
          tutorias_solicitadas: number | null
          violencia_acoso: boolean | null
        }
        Insert: {
          ano_graduacion_bach?: number | null
          ano_ingreso?: number | null
          asistencia_clases?: number | null
          asistencia_psicologia?: boolean | null
          beca_apoyo?: boolean | null
          cabeza_hogar?: boolean | null
          cancelaciones_materias?: number | null
          cargue_id: string
          clasificacion?: string | null
          created_at?: string
          creditos_aprobados?: number | null
          creditos_pendientes?: number | null
          distancia_campus?: number | null
          en_intervencion?: boolean | null
          estado_civil?: string | null
          estrato?: number | null
          estudiante_id: string
          estudio_previo?: boolean | null
          factores_principales?: string[] | null
          horas_trabajo?: number | null
          id?: string
          indice_riesgo?: number | null
          ingreso_hogar?: string | null
          interrupciones?: boolean | null
          jornada?: string | null
          materias_aprobadas?: number | null
          materias_matriculadas?: number | null
          materias_reprobadas?: number | null
          materias_segunda_matricula?: boolean | null
          num_semestres_perdidos?: number | null
          numero_hijos?: number | null
          participa_grupos?: boolean | null
          personas_hogar?: number | null
          practicas_pasantias?: boolean | null
          promedio_acumulado?: number | null
          promedio_grado11?: number | null
          promedio_semestre?: number | null
          puntaje_ciencias_naturales?: number | null
          puntaje_competencias_ciudadanas?: number | null
          puntaje_ingles?: number | null
          puntaje_lectura_critica?: number | null
          puntaje_pensamiento_critico?: number | null
          puntaje_pensamiento_social?: number | null
          puntaje_razonamiento_mat?: number | null
          puntaje_saber11?: number | null
          razon_interrupcion?: string | null
          red_apoyo_familiar?: boolean | null
          satisfaccion_carrera?: number | null
          satisfaccion_universidad?: number | null
          semestre_actual?: number | null
          semestres_cursados?: number | null
          semestres_perdidos_rendimiento?: boolean | null
          sisben?: boolean | null
          solicitud_retiro?: boolean | null
          tiene_hijos?: boolean | null
          tipo_beca?: string | null
          tipo_colegio?: string | null
          trabaja?: boolean | null
          transporte?: string | null
          trastorno_aprendizaje?: boolean | null
          tutorias_solicitadas?: number | null
          violencia_acoso?: boolean | null
        }
        Update: {
          ano_graduacion_bach?: number | null
          ano_ingreso?: number | null
          asistencia_clases?: number | null
          asistencia_psicologia?: boolean | null
          beca_apoyo?: boolean | null
          cabeza_hogar?: boolean | null
          cancelaciones_materias?: number | null
          cargue_id?: string
          clasificacion?: string | null
          created_at?: string
          creditos_aprobados?: number | null
          creditos_pendientes?: number | null
          distancia_campus?: number | null
          en_intervencion?: boolean | null
          estado_civil?: string | null
          estrato?: number | null
          estudiante_id?: string
          estudio_previo?: boolean | null
          factores_principales?: string[] | null
          horas_trabajo?: number | null
          id?: string
          indice_riesgo?: number | null
          ingreso_hogar?: string | null
          interrupciones?: boolean | null
          jornada?: string | null
          materias_aprobadas?: number | null
          materias_matriculadas?: number | null
          materias_reprobadas?: number | null
          materias_segunda_matricula?: boolean | null
          num_semestres_perdidos?: number | null
          numero_hijos?: number | null
          participa_grupos?: boolean | null
          personas_hogar?: number | null
          practicas_pasantias?: boolean | null
          promedio_acumulado?: number | null
          promedio_grado11?: number | null
          promedio_semestre?: number | null
          puntaje_ciencias_naturales?: number | null
          puntaje_competencias_ciudadanas?: number | null
          puntaje_ingles?: number | null
          puntaje_lectura_critica?: number | null
          puntaje_pensamiento_critico?: number | null
          puntaje_pensamiento_social?: number | null
          puntaje_razonamiento_mat?: number | null
          puntaje_saber11?: number | null
          razon_interrupcion?: string | null
          red_apoyo_familiar?: boolean | null
          satisfaccion_carrera?: number | null
          satisfaccion_universidad?: number | null
          semestre_actual?: number | null
          semestres_cursados?: number | null
          semestres_perdidos_rendimiento?: boolean | null
          sisben?: boolean | null
          solicitud_retiro?: boolean | null
          tiene_hijos?: boolean | null
          tipo_beca?: string | null
          tipo_colegio?: string | null
          trabaja?: boolean | null
          transporte?: string | null
          trastorno_aprendizaje?: boolean | null
          tutorias_solicitadas?: number | null
          violencia_acoso?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_academicos_cargue_id_fkey"
            columns: ["cargue_id"]
            isOneToOne: false
            referencedRelation: "cargues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_academicos_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "administrador" | "coordinador_academico" | "consejero"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["administrador", "coordinador_academico", "consejero"],
    },
  },
} as const
