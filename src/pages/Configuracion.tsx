import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Sliders, Activity, Brain, Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const usuarios = [
  { nombre: "Dr. Ricardo Perez", rol: "Administrador", correo: "rperez@unicartagena.edu.co" },
  { nombre: "Lic. Martha Gomez", rol: "Coordinador Academico", correo: "mgomez@unicartagena.edu.co" },
  { nombre: "Ps. Luisa Herrera", rol: "Consejero", correo: "lherrera@unicartagena.edu.co" },
];

const actividad = [
  { fecha: "2025-04-15 09:32", accion: "Cargue de datos realizado", usuario: "Dr. Ricardo Perez" },
  { fecha: "2025-04-15 09:35", accion: "Analisis de IA ejecutado", usuario: "Dr. Ricardo Perez" },
  { fecha: "2025-04-14 16:20", accion: "Reporte exportado (PDF)", usuario: "Lic. Martha Gomez" },
  { fecha: "2025-04-13 10:15", accion: "Nota registrada - T60010001", usuario: "Ps. Luisa Herrera" },
];

const Configuracion = () => {
  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-heading text-2xl font-bold">Configuracion del Sistema</h1>
          <p className="text-sm text-muted-foreground font-body">Administracion de usuarios, umbrales y parametros del sistema</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Gestion de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b text-xs text-muted-foreground text-left">
                  <th className="pb-2 pr-3">Nombre</th>
                  <th className="pb-2 pr-3">Correo</th>
                  <th className="pb-2">Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.correo} className="border-b border-border/50">
                    <td className="py-2 pr-3">{u.nombre}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{u.correo}</td>
                    <td className="py-2">
                      <Badge variant="outline" className="text-[10px]">{u.rol}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <Sliders className="h-4 w-4" /> Umbrales de Clasificacion de Riesgo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-body">Continuidad Estable (max)</Label>
                <Input type="number" defaultValue={30} className="font-body" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-body">Riesgo Moderado (max)</Label>
                <Input type="number" defaultValue={65} className="font-body" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-body">Riesgo Alto (max)</Label>
                <Input type="number" defaultValue={80} className="font-body" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-body">Riesgo Critico (desde)</Label>
                <Input type="number" defaultValue={81} className="font-body" />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              Guardar Umbrales
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <Activity className="h-4 w-4" /> Historial de Actividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {actividad.map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-body py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground w-36 shrink-0">{a.fecha}</span>
                  <span className="flex-1">{a.accion}</span>
                  <span className="text-muted-foreground">{a.usuario}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <Brain className="h-4 w-4" /> Informacion del Modelo de IA
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm font-body space-y-2">
            <p>
              El modelo de prediccion de SIPAD utiliza un algoritmo de ponderacion multifactorial
              que evalua variables academicas, socioeconomicas y psicosociales para generar un indice
              de riesgo de desercion entre 0 y 100 para cada estudiante.
            </p>
            <p className="text-xs text-muted-foreground">
              Las variables con mayor peso incluyen: promedio acumulado, materias reprobadas,
              asistencia a clases y semestres perdidos. La precision actual del modelo es del 87.3%
              basada en la validacion cruzada con datos historicos de la institucion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <Database className="h-4 w-4" /> Respaldo de Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-body mb-3">
              Genere un respaldo completo de la base de datos del sistema.
            </p>
            <Button variant="outline" className="text-sm">
              <Database className="mr-2 h-4 w-4" /> Generar Respaldo
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Configuracion;
