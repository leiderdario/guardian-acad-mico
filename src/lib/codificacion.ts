// Codificacion institucional inteligente EduAlert
// Cada programa academico tiene un prefijo numerico unico de 4 digitos.
// Formato: PREFIJO + NNN  (ej. 8911001, 7567023)

export interface ProgramaCodigo {
  facultad: string;
  programa: string;
  prefijo: string; // 4 digitos
}

export const CATALOGO_PROGRAMAS: ProgramaCodigo[] = [
  { facultad: "Medicina", programa: "Medicina", prefijo: "8911" },
  { facultad: "Ingenieria", programa: "Ingenieria de Sistemas", prefijo: "7567" },
  { facultad: "Ingenieria", programa: "Ingenieria Industrial", prefijo: "7569" },
  { facultad: "Ciencias de la Salud", programa: "Enfermeria", prefijo: "4121" },
  { facultad: "Ciencias Farmaceuticas", programa: "Quimica Farmaceutica", prefijo: "6231" },
  { facultad: "Ciencias Economicas", programa: "Administracion de Empresas", prefijo: "5381" },
  { facultad: "Ciencias Economicas", programa: "Contaduria Publica", prefijo: "5383" },
  { facultad: "Ciencias Sociales y Educacion", programa: "Psicologia", prefijo: "3142" },
  { facultad: "Ciencias Sociales y Educacion", programa: "Trabajo Social", prefijo: "3144" },
  { facultad: "Derecho y Ciencias Politicas", programa: "Derecho", prefijo: "2711" },
];

// Mapa rapido programa -> prefijo
export const PREFIJOS_PROGRAMA: Record<string, string> = Object.fromEntries(
  CATALOGO_PROGRAMAS.map((p) => [p.programa, p.prefijo])
);

// Compatibilidad: mapa de facultades (primer prefijo encontrado)
export const PREFIJOS_FACULTAD: Record<string, string> = CATALOGO_PROGRAMAS.reduce(
  (acc, p) => {
    if (!acc[p.facultad]) acc[p.facultad] = p.prefijo;
    return acc;
  },
  {} as Record<string, string>
);

export function obtenerPrefijoPrograma(
  programaOFacultad: string | null | undefined
): string {
  if (!programaOFacultad) return "0000";
  const v = programaOFacultad.trim();
  return PREFIJOS_PROGRAMA[v] ?? PREFIJOS_FACULTAD[v] ?? "0000";
}

export function generarCodigoInstitucional(
  programaOFacultad: string | null | undefined,
  consecutivo: number,
): string {
  const prefijo = obtenerPrefijoPrograma(programaOFacultad);
  const num = String(consecutivo).padStart(3, "0");
  return `${prefijo}${num}`;
}

// Condiciones especiales declaradas (alineadas con el enum de la BD)
export type CondicionEspecial =
  | "ninguna"
  | "visual"
  | "auditiva"
  | "motriz"
  | "cognitiva"
  | "multiple"
  | "otra";

export const CONDICION_ESPECIAL_LABEL: Record<CondicionEspecial, string> = {
  ninguna: "Sin condicion declarada",
  visual: "Discapacidad visual",
  auditiva: "Discapacidad auditiva",
  motriz: "Discapacidad motriz",
  cognitiva: "Condicion cognitiva",
  multiple: "Condicion multiple",
  otra: "Otra condicion",
};
