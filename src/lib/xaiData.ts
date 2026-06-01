// Datos sinteticos para explicacion del modelo (SHAP-style) y simulaciones

import type { Estudiante } from "./mockData";

export interface FactorXAI {
  nombre: string;
  contribucion: number; // -100 a +100 (positivo = aumenta riesgo, negativo = lo reduce)
  valor: string;
  categoria: "academico" | "socioeconomico" | "psicosocial" | "demografico";
}

const semilla = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export function generarFactoresXAI(estudiante: Estudiante): FactorXAI[] {
  const s = semilla(estudiante.codigo);
  const r = estudiante.indiceRiesgo;
  const escala = r / 100;

  const factores: FactorXAI[] = [
    {
      nombre: "Promedio acumulado",
      contribucion: estudiante.promedioAcumulado < 3.2 ? +18 * escala : -10,
      valor: estudiante.promedioAcumulado.toFixed(2),
      categoria: "academico",
    },
    {
      nombre: "Materias reprobadas",
      contribucion: r > 60 ? +15 : 3 - escala * 8,
      valor: r > 60 ? "3 materias" : "0 materias",
      categoria: "academico",
    },
    {
      nombre: "Asistencia a clases",
      contribucion: r > 50 ? +12 : -8,
      valor: r > 50 ? "62%" : "91%",
      categoria: "academico",
    },
    {
      nombre: "Estrato socioeconomico",
      contribucion: ((s % 3) + 1 <= 2 ? +10 : -3),
      valor: `Estrato ${(s % 3) + 1}`,
      categoria: "socioeconomico",
    },
    {
      nombre: "Horas de trabajo semanal",
      contribucion: r > 55 ? +9 : -2,
      valor: r > 55 ? "32 h/sem" : "0 h/sem",
      categoria: "socioeconomico",
    },
    {
      nombre: "Beca o apoyo",
      contribucion: (s % 4 === 0) ? -7 : 2,
      valor: (s % 4 === 0) ? "Si" : "No",
      categoria: "socioeconomico",
    },
    {
      nombre: "Satisfaccion con la carrera",
      contribucion: r > 65 ? +11 : -6,
      valor: r > 65 ? "Baja (2/5)" : "Alta (4/5)",
      categoria: "psicosocial",
    },
    {
      nombre: "Red de apoyo familiar",
      contribucion: r > 70 ? +8 : -5,
      valor: r > 70 ? "Debil" : "Solida",
      categoria: "psicosocial",
    },
    {
      nombre: "Distancia al campus",
      contribucion: ((s % 5) > 2 ? +4 : -1),
      valor: `${5 + (s % 18)} km`,
      categoria: "demografico",
    },
    {
      nombre: "Puntaje Saber 11",
      contribucion: estudiante.promedioAcumulado < 3.5 ? +6 : -7,
      valor: estudiante.promedioAcumulado < 3.5 ? "245" : "320",
      categoria: "demografico",
    },
  ];

  return factores.sort((a, b) => Math.abs(b.contribucion) - Math.abs(a.contribucion));
}

// Proyeccion del "digital twin" durante 4 semestres
export function generarProyeccionDigitalTwin(riesgoActual: number) {
  const data = [];
  let sinIntervencion = riesgoActual;
  let conIntervencion = riesgoActual;
  for (let i = 0; i <= 4; i++) {
    data.push({
      semestre: i === 0 ? "Actual" : `+${i} sem`,
      sinIntervencion: Math.min(100, Math.round(sinIntervencion)),
      conIntervencion: Math.max(8, Math.round(conIntervencion)),
    });
    sinIntervencion = Math.min(100, sinIntervencion + 6 + Math.random() * 4);
    conIntervencion = Math.max(8, conIntervencion - 7 - Math.random() * 3);
  }
  return data;
}

// Metricas comparativas de modelos
export const metricasModelos = [
  { modelo: "Regresion Logistica", accuracy: 78.4, precision: 74.1, recall: 71.2, f1: 72.6, auc: 0.82, tiempo: "0.4s" },
  { modelo: "Random Forest", accuracy: 87.3, precision: 85.6, recall: 83.9, f1: 84.7, auc: 0.91, tiempo: "1.8s" },
  { modelo: "XGBoost", accuracy: 89.1, precision: 87.4, recall: 86.2, f1: 86.8, auc: 0.93, tiempo: "2.3s" },
  { modelo: "Red Neuronal MLP", accuracy: 85.7, precision: 84.2, recall: 81.5, f1: 82.8, auc: 0.89, tiempo: "5.1s" },
];

// Curva ROC sintetica
export function curvaROC(auc: number) {
  const data = [];
  for (let i = 0; i <= 20; i++) {
    const fpr = i / 20;
    const tpr = Math.min(1, Math.pow(fpr, 1 - auc) + (auc - 0.5) * 0.6);
    data.push({ fpr: parseFloat(fpr.toFixed(2)), tpr: parseFloat(tpr.toFixed(3)) });
  }
  return data;
}

// Datos de barrios de Cartagena con riesgo
export const barriosCartagena = [
  { nombre: "Centro Historico", lat: 10.4236, lng: -75.5519, estudiantes: 42, riesgoPromedio: 38, estratoPromedio: 4 },
  { nombre: "Getsemani", lat: 10.4220, lng: -75.5470, estudiantes: 28, riesgoPromedio: 45, estratoPromedio: 3 },
  { nombre: "Manga", lat: 10.4090, lng: -75.5410, estudiantes: 55, riesgoPromedio: 32, estratoPromedio: 4 },
  { nombre: "Bocagrande", lat: 10.4050, lng: -75.5570, estudiantes: 34, riesgoPromedio: 28, estratoPromedio: 5 },
  { nombre: "Crespo", lat: 10.4520, lng: -75.5210, estudiantes: 67, riesgoPromedio: 52, estratoPromedio: 3 },
  { nombre: "La Boquilla", lat: 10.4720, lng: -75.4980, estudiantes: 89, riesgoPromedio: 71, estratoPromedio: 1 },
  { nombre: "Olaya Herrera", lat: 10.4180, lng: -75.5050, estudiantes: 112, riesgoPromedio: 76, estratoPromedio: 1 },
  { nombre: "Pasacaballos", lat: 10.3010, lng: -75.5160, estudiantes: 78, riesgoPromedio: 81, estratoPromedio: 1 },
  { nombre: "El Pozon", lat: 10.4310, lng: -75.4750, estudiantes: 134, riesgoPromedio: 79, estratoPromedio: 1 },
  { nombre: "Nelson Mandela", lat: 10.3850, lng: -75.4920, estudiantes: 95, riesgoPromedio: 73, estratoPromedio: 1 },
  { nombre: "Torices", lat: 10.4380, lng: -75.5320, estudiantes: 58, riesgoPromedio: 48, estratoPromedio: 2 },
  { nombre: "San Fernando", lat: 10.3950, lng: -75.4820, estudiantes: 71, riesgoPromedio: 64, estratoPromedio: 2 },
  { nombre: "Turbaco", lat: 10.3300, lng: -75.4110, estudiantes: 64, riesgoPromedio: 58, estratoPromedio: 2 },
  { nombre: "La Popa", lat: 10.4290, lng: -75.5390, estudiantes: 38, riesgoPromedio: 67, estratoPromedio: 2 },
];

export const colorRiesgo = (r: number) => {
  if (r >= 70) return "hsl(var(--danger))";
  if (r >= 50) return "hsl(var(--warning))";
  if (r >= 30) return "hsl(var(--gold))";
  return "hsl(var(--success))";
};
