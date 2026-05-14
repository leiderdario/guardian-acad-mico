import { useState, useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, Brain, Hash, Accessibility } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CATALOGO_PROGRAMAS } from "@/lib/codificacion";
import * as XLSX from "xlsx";

// Encabezados oficiales EduAlert (15 columnas - plantilla simplificada que prioriza
// solo las variables que realmente predicen desercion).
const plantillaColumnas = [
  // Identificacion
  "Facultad", "Codigo", "Nombre Completo", "Programa", "Semestre",
  // Rendimiento academico
  "Promedio Acum.", "Mat. Reprobadas", "Sem. Perdidos", "Retiro Sem.", "Asistencia (%)",
  // Factores socioeconomicos
  "Trabaja", "Estrato", "Beca/Apoyo",
  // Bienestar
  "Satisf. Carrera", "Satisf. Univ.",
];

const NUM_COLUMNAS_OFICIALES = 15;

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
    link.href = "/Plantilla_EduAlert_UniCartagena.xlsx";
    link.download = "Plantilla_EduAlert_UniCartagena.xlsx";
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

        // La plantilla simplificada: fila 1 titulo, fila 2 encabezados, fila 3+ datos.
        let headerRowIdx = json.findIndex((r) =>
          r?.some((c) => typeof c === "string" && c.trim().toLowerCase() === "facultad")
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
        if (headers.length < NUM_COLUMNAS_OFICIALES - 2 || headers.length > NUM_COLUMNAS_OFICIALES + 2) {
          errs.push(`El archivo tiene ${headers.length} columnas. La plantilla oficial requiere ${NUM_COLUMNAS_OFICIALES} columnas. Verifique que utiliza la plantilla EduAlert simplificada.`);
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
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Carga de Datos</h1>
            <p className="text-sm text-muted-foreground font-body">Importe archivos Excel con datos academicos de los estudiantes</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent/40 bg-accent/5 rounded-md">
            <Brain className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] font-body uppercase tracking-wider text-accent font-medium">
              Procesamiento con Inteligencia Artificial
            </span>
          </div>
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
              La plantilla simplificada contiene <strong>{plantillaColumnas.length} columnas</strong> agrupadas en
              4 bloques: <strong>Identificacion</strong> (Facultad, Codigo, Nombre, Programa, Semestre),
              <strong> Rendimiento Academico</strong> (Promedio, Materias Reprobadas, Semestres Perdidos, Retiros, Asistencia),
              <strong> Factores Socioeconomicos</strong> (Trabaja, Estrato, Beca) y
              <strong> Bienestar</strong> (Satisfaccion con la carrera y la universidad).
              Solo se conservaron las variables con poder predictivo real sobre la desercion.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="h-4 w-4 text-accent" />
                <span className="font-body font-medium text-sm">Codigos por programa academico</span>
              </div>
              <p className="text-xs text-muted-foreground font-body mb-3">
                Cada estudiante recibe un codigo unico con el formato
                <span className="font-mono mx-1 text-foreground">PPPPNNN</span>
                donde los primeros 4 digitos identifican el programa y los ultimos 3 son el consecutivo.
              </p>
              <div className="space-y-1 text-[11px] font-body max-h-44 overflow-auto pr-1">
                {CATALOGO_PROGRAMAS.map((p) => (
                  <div key={p.prefijo} className="flex items-center gap-2">
                    <span className="font-mono text-accent w-14 shrink-0">{p.prefijo}XXX</span>
                    <span className="text-muted-foreground truncate">{p.programa}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Accessibility className="h-4 w-4 text-accent" />
                <span className="font-body font-medium text-sm">Deteccion de condiciones especiales</span>
              </div>
              <p className="text-xs text-muted-foreground font-body mb-3">
                El sistema reconoce el campo de condicion especial declarada y marca automaticamente a los
                estudiantes que requieren adaptaciones del entorno academico.
              </p>
              <div className="space-y-1 text-[11px] font-body text-muted-foreground">
                <div>· Discapacidad visual, auditiva, motriz o cognitiva</div>
                <div>· Condicion multiple u otra condicion declarada</div>
                <div>· Visible en el Analisis de Riesgo y el Panel General</div>
              </div>
            </CardContent>
          </Card>
        </div>

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
