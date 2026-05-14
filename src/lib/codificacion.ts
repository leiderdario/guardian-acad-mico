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

// Paleta de color por facultad: dark = chip de Facultad, light = chip de Codigo
export const COLORES_FACULTAD: Record<string, { dark: string; light: string; text: string }> = {
  "Medicina":                       { dark: "#7A1F2B", light: "#F4D7DB", text: "#7A1F2B" },
  "Ingenieria":                     { dark: "#1B3A6B", light: "#D6E1F0", text: "#1B3A6B" },
  "Ciencias de la Salud":           { dark: "#2E7D6B", light: "#D4ECE5", text: "#1F5448" },
  "Enfermeria":                     { dark: "#2E7D6B", light: "#D4ECE5", text: "#1F5448" },
  "Ciencias Farmaceuticas":         { dark: "#5B3A8E", light: "#E2D6F0", text: "#3F2766" },
  "Ciencias Economicas":            { dark: "#8E6B1F", light: "#F0E5C7", text: "#5F4612" },
  "Ciencias Sociales y Educacion":  { dark: "#8E4A1F", light: "#F0DDC7", text: "#5F3214" },
  "Ciencias Sociales":              { dark: "#8E4A1F", light: "#F0DDC7", text: "#5F3214" },
  "Derecho y Ciencias Politicas":   { dark: "#3B3B3B", light: "#DDDDDD", text: "#1F1F1F" },
  "Derecho":                        { dark: "#3B3B3B", light: "#DDDDDD", text: "#1F1F1F" },
  "Ciencias Exactas":               { dark: "#1F5E8E", light: "#D6E5F0", text: "#143E5F" },
  "Odontologia":                    { dark: "#5B7A1F", light: "#E2EFC7", text: "#3D5212" },
  "Linguistica y Literatura":       { dark: "#7A1F5B", light: "#F0D6E5", text: "#52143D" },
};

export function getColorFacultad(f: string | null | undefined) {
  if (!f) return { dark: "#444444", light: "#DDDDDD", text: "#1F1F1F" };
  return COLORES_FACULTAD[f] ?? { dark: "#444444", light: "#DDDDDD", text: "#1F1F1F" };
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
