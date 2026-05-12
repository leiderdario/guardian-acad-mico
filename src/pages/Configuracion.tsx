import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, Sliders, Activity, Brain, Database, ChevronDown, UserPlus, Trash2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Usuario = { nombre: string; rol: string; correo: string };

const usuariosIniciales: Usuario[] = [
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

function Section({ title, icon: Icon, children, defaultOpen = true }: any) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <Card>
        <CollapsibleTrigger className="w-full group">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-base flex items-center gap-2 text-primary">
              <Icon className="h-4 w-4" /> {title}
            </CardTitle>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

const Configuracion = () => {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [umbrales, setUmbrales] = useState({ estable: 30, moderado: 65, alto: 80, critico: 81 });
  const [notif, setNotif] = useState({ correo: true, riesgoCritico: true, semanal: false });
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre: "", correo: "", rol: "Consejero" });

  const guardarUmbrales = () => {
    toast({ title: "Umbrales guardados", description: "Los nuevos umbrales se aplicaran al proximo analisis." });
  };

  const agregarUsuario = () => {
    if (!nuevo.nombre || !nuevo.correo) {
      toast({ title: "Datos incompletos", description: "Nombre y correo son obligatorios.", variant: "destructive" });
      return;
    }
    setUsuarios((u) => [...u, nuevo]);
    setNuevo({ nombre: "", correo: "", rol: "Consejero" });
    setNuevoOpen(false);
    toast({ title: "Usuario agregado", description: `${nuevo.nombre} ha sido registrado.` });
  };

  const eliminarUsuario = (correo: string) => {
    setUsuarios((u) => u.filter((x) => x.correo !== correo));
    toast({ title: "Usuario eliminado" });
  };

  const generarRespaldo = () => {
    toast({ title: "Respaldo en proceso", description: "Recibira un correo cuando este listo." });
  };

  return (
    <AppLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="rounded-lg border border-border bg-gradient-to-r from-primary to-[hsl(var(--teal))] text-primary-foreground p-5 shadow-md">
          <h1 className="font-heading text-2xl font-bold">Configuracion del Sistema</h1>
          <p className="text-sm font-body text-primary-foreground/80">
            Administracion de usuarios, umbrales y parametros del sistema
          </p>
        </div>

        <Section title="Gestion de Usuarios" icon={Users}>
          <div className="flex justify-end mb-3">
            <Dialog open={nuevoOpen} onOpenChange={setNuevoOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <UserPlus className="h-4 w-4 mr-2" /> Nuevo usuario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-heading">Registrar nuevo usuario</DialogTitle>
                  <DialogDescription className="font-body">
                    Asigne un rol institucional y datos de contacto.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div>
                    <Label className="text-xs font-body">Nombre completo</Label>
                    <Input value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs font-body">Correo institucional</Label>
                    <Input type="email" value={nuevo.correo} onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs font-body">Rol</Label>
                    <Select value={nuevo.rol} onValueChange={(v) => setNuevo({ ...nuevo, rol: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Coordinador Academico">Coordinador Academico</SelectItem>
                        <SelectItem value="Consejero">Consejero</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNuevoOpen(false)}>Cancelar</Button>
                  <Button onClick={agregarUsuario}>Agregar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b text-xs text-muted-foreground text-left">
                <th className="pb-2 pr-3">Nombre</th>
                <th className="pb-2 pr-3">Correo</th>
                <th className="pb-2 pr-3">Rol</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.correo} className="border-b border-border/50">
                  <td className="py-2 pr-3">{u.nombre}</td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground">{u.correo}</td>
                  <td className="py-2 pr-3">
                    <Badge variant="outline" className="text-[10px]">{u.rol}</Badge>
                  </td>
                  <td className="py-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-danger">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta accion eliminara a {u.nombre} del sistema. ¿Desea continuar?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => eliminarUsuario(u.correo)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Umbrales de Clasificacion de Riesgo" icon={Sliders}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-body">Continuidad Estable (max)</Label>
              <Input type="number" value={umbrales.estable} onChange={(e) => setUmbrales({ ...umbrales, estable: +e.target.value })} className="font-body" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-body">Riesgo Moderado (max)</Label>
              <Input type="number" value={umbrales.moderado} onChange={(e) => setUmbrales({ ...umbrales, moderado: +e.target.value })} className="font-body" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-body">Riesgo Alto (max)</Label>
              <Input type="number" value={umbrales.alto} onChange={(e) => setUmbrales({ ...umbrales, alto: +e.target.value })} className="font-body" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-body">Riesgo Critico (desde)</Label>
              <Input type="number" value={umbrales.critico} onChange={(e) => setUmbrales({ ...umbrales, critico: +e.target.value })} className="font-body" />
            </div>
          </div>
          <Button onClick={guardarUmbrales} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            Guardar Umbrales
          </Button>
        </Section>

        <Section title="Notificaciones" icon={Bell} defaultOpen={false}>
          <div className="space-y-3">
            {[
              { key: "correo", label: "Notificaciones por correo", desc: "Recibir alertas operativas en su correo institucional." },
              { key: "riesgoCritico", label: "Alertas de riesgo critico", desc: "Notificar inmediatamente cuando un estudiante alcanza riesgo critico." },
              { key: "semanal", label: "Resumen semanal", desc: "Enviar resumen ejecutivo cada lunes." },
            ].map((n) => (
              <div key={n.key} className="flex items-start justify-between gap-4 py-2 border-b border-border/40 last:border-0">
                <div>
                  <div className="text-sm font-body font-medium">{n.label}</div>
                  <div className="text-xs text-muted-foreground font-body">{n.desc}</div>
                </div>
                <Switch
                  checked={(notif as any)[n.key]}
                  onCheckedChange={(v) => setNotif({ ...notif, [n.key]: v })}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Historial de Actividad" icon={Activity} defaultOpen={false}>
          <div className="space-y-2">
            {actividad.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-body py-1.5 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground w-36 shrink-0">{a.fecha}</span>
                <span className="flex-1">{a.accion}</span>
                <span className="text-muted-foreground">{a.usuario}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Informacion del Modelo de IA" icon={Brain} defaultOpen={false}>
          <div className="text-sm font-body space-y-2">
            <p>
              El modelo de prediccion de EduAlert utiliza un algoritmo de ponderacion multifactorial
              que evalua variables academicas, socioeconomicas y psicosociales para generar un indice
              de riesgo de desercion entre 0 y 100 para cada estudiante.
            </p>
            <p className="text-xs text-muted-foreground">
              Las variables con mayor peso incluyen: promedio acumulado, materias reprobadas,
              asistencia a clases y semestres perdidos. La precision actual del modelo es del 87.3%
              basada en la validacion cruzada con datos historicos de la institucion.
            </p>
          </div>
        </Section>

        <Section title="Respaldo de Base de Datos" icon={Database} defaultOpen={false}>
          <p className="text-xs text-muted-foreground font-body mb-3">
            Genere un respaldo completo de la base de datos del sistema.
          </p>
          <Button variant="outline" className="text-sm" onClick={generarRespaldo}>
            <Database className="mr-2 h-4 w-4" /> Generar Respaldo
          </Button>
        </Section>
      </div>
    </AppLayout>
  );
};

export default Configuracion;
