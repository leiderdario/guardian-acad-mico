// Generador de reportes institucionales EduAlert - Universidad de Cartagena
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import escudoUrl from "@/assets/escudo-udec-placeholder.png";
import type { Estudiante } from "./mockData";

// Colores institucionales (RGB)
const AZUL: [number, number, number] = [10, 35, 66];     // #0A2342
const DORADO: [number, number, number] = [201, 168, 76]; // #C9A84C
const GRIS: [number, number, number] = [90, 90, 95];

const SIPAD_ID = () =>
  "EDUALERT-" +
  new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);

async function loadEscudo(): Promise<string> {
  const res = await fetch(escudoUrl);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function fechaLarga(): string {
  return new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function membrete(doc: jsPDF, titulo: string, subtitulo: string) {
  const escudo = await loadEscudo();
  const pageW = doc.internal.pageSize.getWidth();

  // Banda superior dorada
  doc.setFillColor(...DORADO);
  doc.rect(0, 0, pageW, 3, "F");

  // Escudo
  doc.addImage(escudo, "PNG", 14, 10, 18, 18);

  // Encabezado institucional
  doc.setTextColor(...AZUL);
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("UNIVERSIDAD DE CARTAGENA", 36, 17);

  doc.setFont("times", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...GRIS);
  doc.text("Vicerrectoria Academica  -  Sistema EduAlert", 36, 22);
  doc.text(
    "Sistema de Prediccion y Analisis de Desercion Estudiantil con Inteligencia Artificial",
    36,
    26
  );

  // Linea divisoria
  doc.setDrawColor(...DORADO);
  doc.setLineWidth(0.4);
  doc.line(14, 32, pageW - 14, 32);

  // Titulo del reporte
  doc.setTextColor(...AZUL);
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.text(titulo, 14, 42);

  doc.setFont("times", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(...GRIS);
  doc.text(subtitulo, 14, 48);
  doc.text(`Generado el ${fechaLarga()}`, 14, 53);
}

function pieDePagina(doc: jsPDF, idReporte: string) {
  const pageCount = doc.getNumberOfPages();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...DORADO);
    doc.setLineWidth(0.3);
    doc.line(14, pageH - 16, pageW - 14, pageH - 16);

    doc.setFont("times", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRIS);
    doc.text(
      "Universidad de Cartagena  -  Documento institucional confidencial  -  EduAlert",
      14,
      pageH - 11
    );
    doc.text(`ID: ${idReporte}`, 14, pageH - 7);
    doc.text(
      `Pagina ${i} de ${pageCount}`,
      pageW - 14,
      pageH - 7,
      { align: "right" }
    );
  }
}

function setupDoc(): jsPDF {
  return new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
}

async function tablaEstudiantes(
  doc: jsPDF,
  estudiantes: Estudiante[],
  startY = 60
) {
  autoTable(doc, {
    startY,
    head: [["Codigo", "Nombre", "Programa", "Sem.", "Prom.", "Riesgo", "Clasificacion"]],
    body: estudiantes.map((e) => [
      e.codigo,
      e.nombre,
      e.programa,
      String(e.semestre),
      e.promedioAcumulado.toFixed(2),
      `${e.indiceRiesgo}%`,
      e.clasificacion,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: AZUL,
      textColor: 255,
      font: "times",
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { font: "times", fontSize: 8.5, textColor: [40, 40, 45] },
    alternateRowStyles: { fillColor: [247, 245, 240] },
    margin: { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 26 },
      3: { halign: "center", cellWidth: 12 },
      4: { halign: "center", cellWidth: 14 },
      5: { halign: "center", cellWidth: 16 },
    },
  });
}

// ============ Reportes especificos ============

export async function reporteGeneral(estudiantes: Estudiante[]) {
  const doc = setupDoc();
  const id = SIPAD_ID();
  await membrete(
    doc,
    "Reporte General del Ultimo Analisis",
    `Total de estudiantes analizados: ${estudiantes.length}`
  );
  await tablaEstudiantes(doc, estudiantes);
  pieDePagina(doc, id);
  doc.save(`SIPAD_Reporte_General_${id}.pdf`);
}

export async function reporteRiesgoAlto(estudiantes: Estudiante[]) {
  const doc = setupDoc();
  const id = SIPAD_ID();
  const criticos = estudiantes.filter(
    (e) => e.clasificacion === "Riesgo Alto" || e.clasificacion === "Riesgo Critico"
  );
  await membrete(
    doc,
    "Estudiantes en Riesgo Alto y Critico",
    `Lista prioritaria para intervencion - ${criticos.length} casos identificados`
  );
  await tablaEstudiantes(doc, criticos);
  pieDePagina(doc, id);
  doc.save(`SIPAD_Riesgo_Alto_${id}.pdf`);
}

export async function reportePorFacultad(estudiantes: Estudiante[]) {
  const doc = setupDoc();
  const id = SIPAD_ID();
  await membrete(
    doc,
    "Reporte por Facultad",
    "Distribucion de riesgo segmentada por unidad academica"
  );

  const facultades = Array.from(new Set(estudiantes.map((e) => e.facultad)));
  const filas = facultades.map((f) => {
    const fs = estudiantes.filter((e) => e.facultad === f);
    const critico = fs.filter((e) => e.clasificacion === "Riesgo Critico").length;
    const alto = fs.filter((e) => e.clasificacion === "Riesgo Alto").length;
    const moderado = fs.filter((e) => e.clasificacion === "Riesgo Moderado").length;
    const estable = fs.filter((e) => e.clasificacion === "Continuidad Estable").length;
    return [f, String(fs.length), String(critico), String(alto), String(moderado), String(estable)];
  });

  autoTable(doc, {
    startY: 60,
    head: [["Facultad", "Total", "Critico", "Alto", "Moderado", "Estable"]],
    body: filas,
    theme: "grid",
    headStyles: { fillColor: AZUL, textColor: 255, font: "times", fontStyle: "bold", fontSize: 9 },
    bodyStyles: { font: "times", fontSize: 9, textColor: [40, 40, 45] },
    alternateRowStyles: { fillColor: [247, 245, 240] },
    margin: { left: 14, right: 14 },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
      5: { halign: "center" },
    },
  });

  pieDePagina(doc, id);
  doc.save(`SIPAD_Por_Facultad_${id}.pdf`);
}

export async function reporteEvolucion(
  evolucion: { periodo: string; riesgoPromedio: number }[]
) {
  const doc = setupDoc();
  const id = SIPAD_ID();
  await membrete(
    doc,
    "Reporte de Evolucion Historica",
    "Tendencias de riesgo a lo largo de los periodos academicos"
  );

  autoTable(doc, {
    startY: 60,
    head: [["Periodo academico", "Indice de riesgo promedio"]],
    body: evolucion.map((e) => [e.periodo, `${e.riesgoPromedio}%`]),
    theme: "grid",
    headStyles: { fillColor: AZUL, textColor: 255, font: "times", fontStyle: "bold", fontSize: 9 },
    bodyStyles: { font: "times", fontSize: 10, textColor: [40, 40, 45] },
    alternateRowStyles: { fillColor: [247, 245, 240] },
    margin: { left: 14, right: 14 },
    columnStyles: { 1: { halign: "center" } },
  });

  pieDePagina(doc, id);
  doc.save(`SIPAD_Evolucion_${id}.pdf`);
}

export async function reporteIndividual(estudiante: Estudiante) {
  const doc = setupDoc();
  const id = SIPAD_ID();
  await membrete(
    doc,
    "Reporte Individual de Estudiante",
    `Codigo institucional: ${estudiante.codigo}`
  );

  const datos: [string, string][] = [
    ["Nombre completo", estudiante.nombre],
    ["Codigo institucional", estudiante.codigo],
    ["Programa", estudiante.programa],
    ["Facultad", estudiante.facultad],
    ["Semestre", String(estudiante.semestre)],
    ["Promedio acumulado", estudiante.promedioAcumulado.toFixed(2)],
    ["Indice de riesgo", `${estudiante.indiceRiesgo}%`],
    ["Clasificacion", estudiante.clasificacion],
    [
      "Condicion especial declarada",
      estudiante.condicionEspecial === "ninguna"
        ? "Ninguna"
        : estudiante.condicionEspecial.charAt(0).toUpperCase() +
          estudiante.condicionEspecial.slice(1),
    ],
  ];

  autoTable(doc, {
    startY: 60,
    body: datos,
    theme: "plain",
    bodyStyles: { font: "times", fontSize: 10, textColor: [40, 40, 45] },
    columnStyles: {
      0: { fontStyle: "bold", textColor: AZUL, cellWidth: 60 },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...AZUL);
  doc.text("Factores determinantes identificados", 14, finalY);

  autoTable(doc, {
    startY: finalY + 3,
    body: estudiante.factores.map((f) => [f]),
    theme: "grid",
    bodyStyles: { font: "times", fontSize: 9.5, textColor: [40, 40, 45] },
    headStyles: { fillColor: AZUL, textColor: 255 },
    margin: { left: 14, right: 14 },
  });

  if (estudiante.detalleCondicion) {
    const y2 = (doc as any).lastAutoTable.finalY + 8;
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...AZUL);
    doc.text("Notas sobre condicion especial", 14, y2);
    doc.setFont("times", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(...GRIS);
    doc.text(estudiante.detalleCondicion, 14, y2 + 6, {
      maxWidth: doc.internal.pageSize.getWidth() - 28,
    });
  }

  pieDePagina(doc, id);
  doc.save(`SIPAD_Individual_${estudiante.codigo}_${id}.pdf`);
}
