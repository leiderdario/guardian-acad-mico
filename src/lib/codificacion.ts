// Codificacion institucional inteligente SIPAD
// Cada facultad genera un prefijo unico para el codigo estudiantil.
// Formato: PREFIJO-AAAA-NNNN  (ej. ING-2025-0001, SAL-2025-0017)

export const PREFIJOS_FACULTAD: Record<string, string> = {
  "Ingenieria": "ING",
  "Ciencias Economicas": "ECO",
  "Derecho": "DER",
  "Medicina": "MED",
  "Ciencias Exactas": "CEX",
  "Ciencias Sociales": "CSO",
  "Enfermeria": "ENF",
  "Odontologia": "ODO",
  "Ciencias Farmaceuticas": "FAR",
  "Linguistica y Literatura": "LIN",
};

// Programas asociados a Ciencias de la Salud (subprefijo SAL para uso en reportes)
const PROGRAMAS_SALUD = ["Medicina", "Enfermeria", "Odontologia", "Ciencias Farmaceuticas"];

export function obtenerPrefijoPrograma(facultad: string | null | undefined): string {
  if (!facultad) return "GEN";
  const f = facultad.trim();
  if (PROGRAMAS_SALUD.includes(f)) return PREFIJOS_FACULTAD[f] ?? "SAL";
  return PREFIJOS_FACULTAD[f] ?? f.slice(0, 3).toUpperCase();
}

export function generarCodigoInstitucional(
  facultad: string | null | undefined,
  consecutivo: number,
  anio: number = new Date().getFullYear(),
): string {
  const prefijo = obtenerPrefijoPrograma(facultad);
  const num = String(consecutivo).padStart(4, "0");
  return `${prefijo}-${anio}-${num}`;
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
