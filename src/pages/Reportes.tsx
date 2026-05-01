import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, AlertTriangle, Building, TrendingUp, User, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockStudents, evolucionHistorica } from "@/lib/mockData";
import {
  reporteGeneral,
  reporteRiesgoAlto,
  reportePorFacultad,
  reporteEvolucion,
  reporteIndividual,
} from "@/lib/pdfReportes";

type ReporteId = "general" | "riesgo" | "facultad" | "evolucion" | "individual";

const reportes: { id: ReporteId; titulo: string; descripcion: string; icon: typeof FileText }[] = [
  {
    id: "general",
    titulo: "Reporte General del Ultimo Analisis",
    descripcion: "Listado completo de estudiantes con su clasificacion de riesgo",
    icon: FileText,
  },
  {
    id: "riesgo",
    titulo: "Estudiantes en Riesgo Alto y Critico",
    descripcion: "Lista prioritaria para intervencion academica inmediata",
    icon: AlertTriangle,
  },
  {
    id: "facultad",
    titulo: "Reporte por Facultad o Programa",
    descripcion: "Distribucion de riesgo segmentada por unidad academica",
    icon: Building,
  },
  {
    id: "evolucion",
    titulo: "Reporte de Evolucion Historica",
    descripcion: "Tendencias de riesgo a lo largo de los periodos academicos",
    icon: TrendingUp,
  },
  {
    id: "individual",
    titulo: "Reporte Individual de Estudiante",
    descripcion: "Perfil completo con historial de riesgo y factores determinantes",
    icon: User,
  },
];

const Reportes = () => {
  const { toast } = useToast();
  const [individualOpen, setIndividualOpen] = useState(false);
  const [estudianteSel, setEstudianteSel] = useState<string>("");
  const [generando, setGenerando] = useState<ReporteId | null>(null);

  const handleGenerar = async (id: ReporteId) => {
    if (id === "individual") {
      setIndividualOpen(true);
      return;
    }
    try {
      setGenerando(id);
      if (id === "general") await reporteGeneral(mockStudents);
      if (id === "riesgo") await reporteRiesgoAlto(mockStudents);
      if (id === "facultad") await reportePorFacultad(mockStudents);
      if (id === "evolucion") await reporteEvolucion(evolucionHistorica);
      toast({
        title: "Reporte generado",
        description: "El documento PDF se ha descargado con membrete institucional.",
      });
    } catch (e) {
      toast({
        title: "Error al generar el reporte",
        description: "Intente nuevamente en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setGenerando(null);
    }
  };

  const handleGenerarIndividual = async () => {
    const est = mockStudents.find((s) => s.codigo === estudianteSel);
    if (!est) return;
    try {
      setGenerando("individual");
      await reporteIndividual(est);
      setIndividualOpen(false);
      toast({
        title: "Reporte individual generado",
        description: `Documento PDF para ${est.nombre} descargado.`,
      });
    } catch {
      toast({
        title: "Error al generar el reporte",
        description: "Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setGenerando(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-body mb-1">
            Documentos institucionales
          </p>
          <h1 className="font-heading text-2xl font-bold">Reportes</h1>
          <p className="text-sm text-muted-foreground font-body">
            Genere y exporte informes con membrete oficial de la Universidad de Cartagena
          </p>
        </div>

        <div className="bg-muted/50 border-l-2 border-accent rounded-md p-3 text-xs font-body text-muted-foreground">
          Todos los reportes exportados incluyen el escudo institucional, la fecha de generacion,
          el identificador unico del sistema SIPAD y el sello de confidencialidad.
        </div>

        <div className="space-y-3">
          {reportes.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
                  <r.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-semibold">{r.titulo}</h3>
                  <p className="text-xs text-muted-foreground font-body">{r.descripcion}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => handleGenerar(r.id)}
                    disabled={generando === r.id}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    {generando === r.id ? "Generando..." : "Generar PDF"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 text-muted-foreground"
                    disabled
                    title="Disponible cuando se configure el dominio de correo institucional"
                  >
                    <Mail className="mr-1 h-3 w-3" />
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-[11px] font-body text-muted-foreground italic pt-2">
          Envio por correo a las facultades disponible una vez configurado el dominio de correo
          institucional.
        </p>
      </div>

      <Dialog open={individualOpen} onOpenChange={setIndividualOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Reporte Individual de Estudiante</DialogTitle>
            <DialogDescription className="font-body">
              Seleccione el estudiante para generar su perfil completo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select value={estudianteSel} onValueChange={setEstudianteSel}>
              <SelectTrigger>
                <SelectValue placeholder="Buscar estudiante..." />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {mockStudents.map((s) => (
                  <SelectItem key={s.codigo} value={s.codigo}>
                    {s.codigo} - {s.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              onClick={handleGenerarIndividual}
              disabled={!estudianteSel || generando === "individual"}
            >
              <Download className="mr-2 h-4 w-4" />
              {generando === "individual" ? "Generando..." : "Generar PDF"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Reportes;
