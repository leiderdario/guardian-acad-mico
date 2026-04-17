import { useState, useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

// Encabezados oficiales SIPAD (67 columnas, identicos a la plantilla institucional)
const plantillaColumnas = [
  "Codigo Estudiantil", "Tipo de Documento", "Numero de Documento", "Nombre Completo",
  "Fecha de Nacimiento", "Edad", "Sexo", "Municipio de Origen", "Departamento de Origen",
  "Telefono de Contacto", "Correo Institucional", "Programa Academico", "Facultad",
  "Semestre Actual", "Anio de Ingreso", "Jornada",
  "Promedio Semestre Actual", "Promedio Acumulado Total",
  "Materias Matriculadas Semestre", "Materias Aprobadas Historico",
  "Materias Reprobadas Historico", "Semestres Cursados", "Cancelaciones de Materias",
  "Creditos Aprobados", "Creditos Pendientes para Graduarse",
  "Razonamiento Matematico (0-100)", "Pensamiento Critico (0-100)",
  "Pensamiento Social (0-100)", "Lectura Critica (0-100)",
  "Competencias Ciudadanas (0-100)", "Ingles (0-100)", "Ciencias Naturales (0-100)",
  "Segunda Matricula (Si/No)", "Semestres Perdidos Por Bajo Rendimiento (Si/No)",
  "Numero de Semestres Perdidos",
  "Estrato Socioeconomico", "Sisben (Si/No)", "Recibe Beca o Apoyo (Si/No)",
  "Tipo de Beca o Apoyo", "Trabaja Actualmente (Si/No)", "Horas de Trabajo Semanal",
  "Ingreso Mensual del Hogar", "Numero de Personas en el Hogar",
  "Cabeza de Hogar (Si/No)", "Distancia Hogar-Universidad (km)", "Modalidad de Transporte",
  "Tipo de Colegio", "Promedio Grado 11", "Puntaje Global ICFES Saber 11",
  "Anio Graduacion Bachillerato", "Estudio Antes de la Universidad (Si/No)",
  "Ha Tenido Interrupciones en Estudios (Si/No)", "Razon de Interrupcion Anterior",
  "Asistio a Psicologia o Bienestar (Si/No)",
  "Diagnostico Trastorno Aprendizaje/Salud Mental (Si/No)",
  "Ha Reportado Violencia o Acoso (Si/No)",
  "Satisfaccion con la Carrera (1-5)", "Satisfaccion con la Universidad (1-5)",
  "Red de Apoyo Familiar (Si/No)", "Estado Civil",
  "Tiene Hijos (Si/No)", "Numero de Hijos",
  "Participa en Grupos Estudiantiles o Semilleros (Si/No)",
  "Ha Realizado Practicas o Pasantias (Si/No)",
  "Tutorias Solicitadas en el Semestre", "Asistencia Promedio a Clases (%)",
  "Ha Solicitado Retiro de Semestre (Si/No)",
];

const NUM_COLUMNAS_OFICIALES = 67;

const CargaDatos = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[][] | null>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [totalCols, setTotalCols] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/Plantilla_SIPAD_UniCartagena.xlsx";
    link.download = "Plantilla_SIPAD_UniCartagena.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setErrors([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const sheetName = wb.SheetNames.find((n) => n.toLowerCase().includes("datos")) || wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        // La plantilla oficial: filas 1-2 titulos, fila 3 categorias, fila 4 encabezados, fila 5+ datos
        let headerRowIdx = json.findIndex((r) =>
          r?.some((c) => typeof c === "string" && c.trim().toLowerCase().startsWith("codigo estudiantil"))
        );
        if (headerRowIdx === -1) headerRowIdx = 0;

        const headers = (json[headerRowIdx] || []).filter((c) => c != null && c !== "");
        const dataRows = json
          .slice(headerRowIdx + 1)
          .filter((r) => r && r.some((c) => c != null && c !== ""));

        setTotalRows(dataRows.length);
        setTotalCols(headers.length);
        setPreview([headers, ...dataRows.slice(0, 5)]);

        const errs: string[] = [];
        if (dataRows.length < 1) errs.push("El archivo no contiene registros de datos.");
        if (headers.length < NUM_COLUMNAS_OFICIALES - 5) {
          errs.push(`El archivo tiene ${headers.length} columnas. La plantilla oficial requiere ${NUM_COLUMNAS_OFICIALES} columnas. Verifique que utiliza la plantilla SIPAD.`);
        }
        setErrors(errs);
      } catch {
        setErrors(["No se pudo leer el archivo. Asegurese de que es un archivo Excel valido (.xlsx)."]);
      }
    };
    reader.readAsArrayBuffer(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleRunAnalysis = () => {
    setProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setProcessing(false);
          toast({ title: "Analisis completado", description: `Se procesaron ${totalRows} registros exitosamente.` });
          navigate("/analisis");
          return 100;
        }
        return p + 2;
      });
    }, 80);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-heading text-2xl font-bold">Carga de Datos</h1>
          <p className="text-sm text-muted-foreground font-body">Importe archivos Excel con datos academicos de los estudiantes</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-accent" />
                <span className="font-body font-medium">Plantilla oficial del sistema</span>
              </div>
              <Button variant="outline" onClick={downloadTemplate} className="text-sm">
                <Download className="mr-2 h-4 w-4" />
                Descargar Plantilla
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              El archivo debe seguir la estructura de la plantilla oficial con {plantillaColumnas.length} columnas organizadas por categorias:
              Identificacion, Rendimiento Academico, Situacion Socioeconomica, Antecedentes, Factores Psicosociales y Participacion Institucional.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-accent/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-body text-sm text-foreground mb-1">
                Arrastre su archivo aqui o haga clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">Formatos aceptados: .xlsx, .csv</p>
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>

            {file && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium font-body">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{totalRows} registros detectados | {totalCols} columnas</p>
                </div>
                {errors.length === 0 && <CheckCircle className="h-5 w-5 text-success" />}
              </div>
            )}

            {errors.length > 0 && (
              <div className="mt-3 space-y-1">
                {errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-danger">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span className="font-body">{err}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {preview && preview.length > 1 && errors.length === 0 && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base">Previsualizacion de registros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="border-b">
                        {preview[0]?.slice(0, 8).map((col: any, i: number) => (
                          <th key={i} className="pb-2 pr-3 text-left text-muted-foreground whitespace-nowrap">{String(col)}</th>
                        ))}
                        <th className="pb-2 text-muted-foreground">...</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(1).map((row, ri) => (
                        <tr key={ri} className="border-b border-border/50">
                          {row.slice(0, 8).map((cell: any, ci: number) => (
                            <td key={ci} className="py-1.5 pr-3 whitespace-nowrap">{String(cell ?? "")}</td>
                          ))}
                          <td className="py-1.5 text-muted-foreground">...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {processing && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground font-body flex items-center gap-2">
                    <Brain className="h-3.5 w-3.5 animate-pulse" />
                    Procesando registros con el modelo de prediccion...
                  </p>
                </div>
              )}
              <Button
                onClick={handleRunAnalysis}
                disabled={processing}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Brain className="mr-2 h-4 w-4" />
                Ejecutar Analisis de IA
              </Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default CargaDatos;
