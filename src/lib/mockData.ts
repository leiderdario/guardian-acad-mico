// Mock data for EduAlert demonstration
import { generarCodigoInstitucional, type CondicionEspecial } from "./codificacion";

export interface Estudiante {
  codigo: string;
  nombre: string;
  programa: string;
  facultad: string;
  semestre: number;
  promedioAcumulado: number;
  indiceRiesgo: number;
  clasificacion: "Continuidad Estable" | "Riesgo Moderado" | "Riesgo Alto" | "Riesgo Critico";
  factores: string[];
  condicionEspecial: CondicionEspecial;
  detalleCondicion?: string;
}

export const facultades = [
  "Ingenieria",
  "Ciencias Economicas",
  "Derecho",
  "Medicina",
  "Ciencias Exactas",
  "Ciencias Sociales",
  "Enfermeria",
  "Odontologia",
  "Ciencias Farmaceuticas",
  "Linguistica y Literatura",
];

export const programas: Record<string, string[]> = {
  "Ingenieria": ["Ing. de Sistemas", "Ing. Civil", "Ing. Quimica", "Ing. de Alimentos"],
  "Ciencias Economicas": ["Administracion de Empresas", "Contaduria Publica", "Economia"],
  "Derecho": ["Derecho"],
  "Medicina": ["Medicina"],
  "Ciencias Exactas": ["Matematicas", "Quimica"],
  "Ciencias Sociales": ["Trabajo Social", "Historia"],
  "Enfermeria": ["Enfermeria"],
  "Odontologia": ["Odontologia"],
  "Ciencias Farmaceuticas": ["Quimica Farmaceutica"],
  "Linguistica y Literatura": ["Linguistica y Literatura"],
};

const nombres = [
  "Maria Fernanda Lopez Herrera", "Carlos Andres Martinez Ruiz", "Ana Patricia Gomez Torres",
  "Juan David Rodriguez Perez", "Valentina Morales Castro", "Sebastian Diaz Mendoza",
  "Laura Camila Jimenez Ortiz", "Diego Alejandro Ramirez Vega", "Daniela Restrepo Munoz",
  "Andres Felipe Cardenas Silva", "Isabella Torres Rincon", "Miguel Angel Ospina Correa",
  "Natalia Herrera Pardo", "Santiago Vargas Duran", "Camila Andrea Rojas Beltran",
  "Jose Luis Acosta Navarro", "Paula Alejandra Suarez Leal", "David Esteban Gutierrez Fuentes",
  "Mariana Castillo Rios", "Nicolas Pena Salazar", "Sofia Valentina Aguilar Mejia",
  "Tomas Guerrero Camacho", "Juliana Moreno Sandoval", "Alejandro Cifuentes Arango",
  "Lucia Andrea Bermudez Quintero", "Cristian Camilo Zapata Gil", "Valeria Arias Montoya",
  "Felipe Andres Londono Cano", "Carolina Duque Gallego", "Mateo Rincon Estrada",
];

const factoresPosibles = [
  "Bajo promedio acumulado",
  "Alta tasa de materias reprobadas",
  "Estrato socioeconomico bajo",
  "Jornada laboral extensa",
  "Baja asistencia a clases",
  "Solicitud previa de retiro",
  "Baja satisfaccion con la carrera",
  "Semestres perdidos previos",
  "Materias en segunda matricula",
  "Bajo puntaje Saber 11",
  "Sin red de apoyo familiar",
  "Distancia al campus elevada",
];

function getClasificacion(riesgo: number): Estudiante["clasificacion"] {
  if (riesgo > 80) return "Riesgo Critico";
  if (riesgo > 65) return "Riesgo Alto";
  if (riesgo > 30) return "Riesgo Moderado";
  return "Continuidad Estable";
}

function getRandomFactores(riesgo: number): string[] {
  const count = riesgo > 65 ? 3 : riesgo > 30 ? 2 : 1;
  const shuffled = [...factoresPosibles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const condicionesPosibles: CondicionEspecial[] = [
  "ninguna", "ninguna", "ninguna", "ninguna", "ninguna", "ninguna", "ninguna", "ninguna",
  "visual", "auditiva", "motriz", "cognitiva", "otra",
];

export function generateMockStudents(count: number = 30): Estudiante[] {
  const students: Estudiante[] = [];
  // Consecutivo por facultad para codigos institucionales
  const consecutivos: Record<string, number> = {};
  for (let i = 0; i < count; i++) {
    const facultad = facultades[Math.floor(Math.random() * facultades.length)];
    const progs = programas[facultad];
    const programa = progs[Math.floor(Math.random() * progs.length)];
    const riesgo = Math.floor(Math.random() * 100);
    const promedio = Math.max(0, Math.min(5, 5 - (riesgo / 100) * 3 + (Math.random() - 0.5)));
    consecutivos[facultad] = (consecutivos[facultad] ?? 0) + 1;
    const condicion = condicionesPosibles[Math.floor(Math.random() * condicionesPosibles.length)];

    students.push({
      codigo: generarCodigoInstitucional(programa, consecutivos[facultad]),
      nombre: nombres[i % nombres.length],
      programa,
      facultad,
      semestre: Math.floor(Math.random() * 10) + 1,
      promedioAcumulado: parseFloat(promedio.toFixed(2)),
      indiceRiesgo: riesgo,
      clasificacion: getClasificacion(riesgo),
      factores: getRandomFactores(riesgo),
      condicionEspecial: condicion,
      detalleCondicion: condicion !== "ninguna" ? "Requiere adaptaciones del entorno academico" : undefined,
    });
  }
  return students.sort((a, b) => b.indiceRiesgo - a.indiceRiesgo);
}

export const mockStudents = generateMockStudents(30);

export const riesgoPorFacultad = facultades.map((f) => {
  const fStudents = mockStudents.filter((s) => s.facultad === f);
  const alto = fStudents.filter((s) => s.indiceRiesgo > 65).length;
  const medio = fStudents.filter((s) => s.indiceRiesgo > 30 && s.indiceRiesgo <= 65).length;
  const bajo = fStudents.filter((s) => s.indiceRiesgo <= 30).length;
  return { facultad: f.length > 15 ? f.slice(0, 13) + "..." : f, alto, medio, bajo };
});

export const evolucionHistorica = [
  { periodo: "2023-I", riesgoPromedio: 42 },
  { periodo: "2023-II", riesgoPromedio: 39 },
  { periodo: "2024-I", riesgoPromedio: 44 },
  { periodo: "2024-II", riesgoPromedio: 37 },
  { periodo: "2025-I", riesgoPromedio: 35 },
];
