import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Users, AlertTriangle, Building, TrendingUp, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const reportes = [
  {
    titulo: "Reporte General del Ultimo Analisis",
    descripcion: "Listado completo de estudiantes con su clasificacion de riesgo",
    icon: FileText,
  },
  {
    titulo: "Estudiantes en Riesgo Alto y Critico",
    descripcion: "Lista prioritaria para intervencion academica inmediata",
    icon: AlertTriangle,
  },
  {
    titulo: "Reporte por Facultad o Programa",
    descripcion: "Distribucion de riesgo segmentada por unidad academica",
    icon: Building,
  },
  {
    titulo: "Reporte de Evolucion Historica",
    descripcion: "Tendencias de riesgo a lo largo de los periodos academicos",
    icon: TrendingUp,
  },
  {
    titulo: "Reporte Individual de Estudiante",
    descripcion: "Perfil completo con historial de riesgo y factores determinantes",
    icon: User,
  },
];

const Reportes = () => {
  const { toast } = useToast();

  const handleExport = (titulo: string, formato: string) => {
    toast({
      title: "Generando reporte",
      description: `${titulo} en formato ${formato.toUpperCase()}. El archivo se descargara en breve.`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-heading text-2xl font-bold">Reportes</h1>
          <p className="text-sm text-muted-foreground font-body">Genere y exporte informes institucionales</p>
        </div>

        <div className="bg-muted/50 rounded-md p-3 text-xs font-body text-muted-foreground">
          Todos los reportes exportados incluyen el membrete de la Universidad de Cartagena,
          la fecha de generacion y el identificador del sistema SIPAD.
        </div>

        <div className="space-y-3">
          {reportes.map((r) => (
            <Card key={r.titulo}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
                  <r.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-semibold">{r.titulo}</h3>
                  <p className="text-xs text-muted-foreground font-body">{r.descripcion}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => handleExport(r.titulo, "pdf")}>
                    <Download className="mr-1 h-3 w-3" /> PDF
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => handleExport(r.titulo, "xlsx")}>
                    <Download className="mr-1 h-3 w-3" /> Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Reportes;
