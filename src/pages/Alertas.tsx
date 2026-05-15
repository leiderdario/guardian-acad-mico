import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Bell, BellRing, Mail, MessageSquare, Smartphone, AlertOctagon, AlertTriangle, Info,
  ChevronDown, CheckCircle2, Clock, Filter, Plus, Trash2, Send, Settings2,
} from "lucide-react";
import { mockStudents } from "@/lib/mockData";
import { FacultadCodigoChip } from "@/components/FacultadCodigoChip";
import { useToast } from "@/hooks/use-toast";

type Severidad = "critica" | "alta" | "media" | "informativa";
type Canal = "correo" | "sms" | "push" | "panel";
type Estado = "nueva" | "vista" | "atendida";

interface Alerta {
  id: string;
  estudianteCodigo: string;
  estudianteNombre: string;
  facultad: string;
  programa: string;
  severidad: Severidad;
  titulo: string;
  detalle: string;
  factor: string;
  fecha: string;
  estado: Estado;
  canales: Canal[];
}

interface Regla {
  id: string;
  nombre: string;
  condicion: string;
  severidad: Severidad;
  canales: Canal[];
  destinatarios: string[];
  activa: boolean;
}

const reglasIniciales: Regla[] = [
  {
    id: "r1",
    nombre: "Riesgo critico detectado",
    condicion: "Indice de riesgo >= 81",
    severidad: "critica",
    canales: ["correo", "push", "panel"],
    destinatarios: ["Consejero asignado", "Coordinador de programa"],
    activa: true,
  },
  {
    id: "r2",
    nombre: "Caida brusca de promedio",
    condicion: "Promedio cae mas de 0.5 puntos en un semestre",
    severidad: "alta",
    canales: ["correo", "panel"],
    destinatarios: ["Consejero asignado"],
    activa: true,
  },
  {
    id: "r3",
    nombre: "Asistencia critica",
    condicion: "Asistencia menor al 60%",
    severidad: "alta",
    canales: ["correo", "sms", "panel"],
    destinatarios: ["Consejero asignado", "Estudiante"],
    activa: true,
  },
  {
    id: "r4",
    nombre: "Tres o mas materias reprobadas",
    condicion: "Materias reprobadas en el periodo >= 3",
    severidad: "alta",
    canales: ["correo", "panel"],
    destinatarios: ["Coordinador de programa"],
    activa: true,
  },
  {
    id: "r5",
    nombre: "Solicitud de retiro de semestre",
    condicion: "Estudiante registra solicitud de retiro",
    severidad: "critica",
    canales: ["correo", "push", "panel"],
    destinatarios: ["Decano", "Bienestar Universitario"],
    activa: true,
  },
  {
    id: "r6",
    nombre: "Riesgo moderado emergente",
    condicion: "Transicion de Continuidad Estable a Riesgo Moderado",
    severidad: "media",
    canales: ["panel"],
    destinatarios: ["Consejero asignado"],
    activa: false,
  },
];

function generarAlertas(): Alerta[] {
  const ahora = Date.now();
  const out: Alerta[] = [];
  let i = 0;
  for (const s of mockStudents) {
    if (s.indiceRiesgo >= 81) {
      out.push({
        id: `a${i++}`,
        estudianteCodigo: s.codigo,
        estudianteNombre: s.nombre,
        facultad: s.facultad,
        programa: s.programa,
        severidad: "critica",
        titulo: "Riesgo critico detectado",
        detalle: `Indice de riesgo ${s.indiceRiesgo} con ${s.factores.length} factores asociados.`,
        factor: s.factores[0] ?? "Multiples factores",
        fecha: new Date(ahora - i * 3600_000).toISOString(),
        estado: i < 3 ? "nueva" : i < 6 ? "vista" : "atendida",
        canales: ["correo", "push", "panel"],
      });
    } else if (s.indiceRiesgo >= 66) {
      out.push({
        id: `a${i++}`,
        estudianteCodigo: s.codigo,
        estudianteNombre: s.nombre,
        facultad: s.facultad,
        programa: s.programa,
        severidad: "alta",
        titulo: s.factores[0] ?? "Riesgo alto",
        detalle: `Indice de riesgo ${s.indiceRiesgo}. Factor principal: ${s.factores[0]}.`,
        factor: s.factores[0] ?? "Riesgo alto",
        fecha: new Date(ahora - i * 3600_000).toISOString(),
        estado: i % 3 === 0 ? "nueva" : "vista",
        canales: ["correo", "panel"],
      });
    } else if (s.indiceRiesgo >= 31 && i % 2 === 0) {
      out.push({
        id: `a${i++}`,
        estudianteCodigo: s.codigo,
        estudianteNombre: s.nombre,
        facultad: s.facultad,
        programa: s.programa,
        severidad: "media",
        titulo: "Riesgo moderado emergente",
        detalle: `Estudiante muestra senales tempranas. Indice ${s.indiceRiesgo}.`,
        factor: s.factores[0] ?? "Indicador temprano",
        fecha: new Date(ahora - i * 3600_000).toISOString(),
        estado: "vista",
        canales: ["panel"],
      });
    }
  }
  return out;
}

const severidadConfig: Record<Severidad, { label: string; icon: any; className: string; chip: string }> = {
  critica: {
    label: "Critica",
    icon: AlertOctagon,
    className: "border-l-4 border-l-danger bg-danger/5",
    chip: "bg-danger/15 text-danger border-danger/30",
  },
  alta: {
    label: "Alta",
    icon: AlertTriangle,
    className: "border-l-4 border-l-warning bg-warning/5",
    chip: "bg-warning/15 text-warning border-warning/30",
  },
  media: {
    label: "Media",
    icon: BellRing,
    className: "border-l-4 border-l-accent bg-accent/5",
    chip: "bg-accent/15 text-accent border-accent/30",
  },
  informativa: {
    label: "Informativa",
    icon: Info,
    className: "border-l-4 border-l-muted-foreground/40 bg-muted/20",
    chip: "bg-muted text-muted-foreground border-border",
  },
};

const canalIcon: Record<Canal, any> = {
  correo: Mail,
  sms: MessageSquare,
  push: Smartphone,
  panel: Bell,
};

const Alertas = () => {
  const { toast } = useToast();
  const [alertas, setAlertas] = useState<Alerta[]>(() => generarAlertas());
  const [reglas, setReglas] = useState<Regla[]>(reglasIniciales);
  const [filtroSeveridad, setFiltroSeveridad] = useState<string>("todas");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [tab, setTab] = useState("feed");

  const [prefs, setPrefs] = useState({
    correo: true,
    sms: false,
    push: true,
    resumenDiario: true,
    horaResumen: "08:00",
    silencioInicio: "20:00",
    silencioFin: "07:00",
    soloCriticas: false,
  });

  const [nuevaReglaOpen, setNuevaReglaOpen] = useState(false);
  const [nuevaRegla, setNuevaRegla] = useState<Partial<Regla>>({
    nombre: "",
    condicion: "",
    severidad: "media",
    canales: ["panel"],
    activa: true,
  });

  const filtradas = useMemo(() => {
    return alertas.filter((a) => {
      if (filtroSeveridad !== "todas" && a.severidad !== filtroSeveridad) return false;
      if (filtroEstado !== "todos" && a.estado !== filtroEstado) return false;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        if (
          !a.estudianteNombre.toLowerCase().includes(q) &&
          !a.estudianteCodigo.toLowerCase().includes(q) &&
          !a.titulo.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [alertas, filtroSeveridad, filtroEstado, busqueda]);

  const stats = useMemo(() => ({
    nuevas: alertas.filter((a) => a.estado === "nueva").length,
    criticas: alertas.filter((a) => a.severidad === "critica").length,
    altas: alertas.filter((a) => a.severidad === "alta").length,
    atendidas: alertas.filter((a) => a.estado === "atendida").length,
    total: alertas.length,
  }), [alertas]);

  const marcarComo = (id: string, estado: Estado) => {
    setAlertas((arr) => arr.map((a) => (a.id === id ? { ...a, estado } : a)));
  };

  const marcarTodasVistas = () => {
    setAlertas((arr) => arr.map((a) => (a.estado === "nueva" ? { ...a, estado: "vista" } : a)));
    toast({ title: "Bandeja actualizada", description: "Todas las alertas nuevas se marcaron como vistas." });
  };

  const reenviar = (a: Alerta) => {
    toast({
      title: "Notificacion reenviada",
      description: `Se reenvio la alerta de ${a.estudianteNombre} por ${a.canales.join(", ")}.`,
    });
  };

  const toggleRegla = (id: string) => {
    setReglas((r) => r.map((x) => (x.id === id ? { ...x, activa: !x.activa } : x)));
  };

  const eliminarRegla = (id: string) => {
    setReglas((r) => r.filter((x) => x.id !== id));
    toast({ title: "Regla eliminada" });
  };

  const crearRegla = () => {
    if (!nuevaRegla.nombre || !nuevaRegla.condicion) {
      toast({ title: "Datos incompletos", description: "Nombre y condicion son obligatorios.", variant: "destructive" });
      return;
    }
    const r: Regla = {
      id: `r${Date.now()}`,
      nombre: nuevaRegla.nombre!,
      condicion: nuevaRegla.condicion!,
      severidad: (nuevaRegla.severidad as Severidad) ?? "media",
      canales: (nuevaRegla.canales as Canal[]) ?? ["panel"],
      destinatarios: ["Consejero asignado"],
      activa: nuevaRegla.activa ?? true,
    };
    setReglas((arr) => [r, ...arr]);
    setNuevaReglaOpen(false);
    setNuevaRegla({ nombre: "", condicion: "", severidad: "media", canales: ["panel"], activa: true });
    toast({ title: "Regla creada", description: "Se aplicara en el proximo ciclo de evaluacion." });
  };

  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const horas = Math.floor(diff / 3600_000);
    if (horas < 1) return "Hace minutos";
    if (horas < 24) return `Hace ${horas} h`;
    return `Hace ${Math.floor(horas / 24)} d`;
  };

  return (
    <AppLayout>
      <div className="space-y-5 max-w-6xl">
        <div className="rounded-lg border border-border bg-gradient-to-r from-primary to-[hsl(var(--teal))] text-primary-foreground p-5 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
                <BellRing className="h-6 w-6" /> Alertas Tempranas y Notificaciones
              </h1>
              <p className="text-sm font-body text-primary-foreground/80 mt-1">
                Centro institucional de avisos generados por el modelo predictivo de EduAlert
              </p>
            </div>
            {stats.nuevas > 0 && (
              <Badge className="bg-accent text-accent-foreground font-heading text-sm px-3 py-1">
                {stats.nuevas} nuevas
              </Badge>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total", val: stats.total, icon: Bell, color: "text-primary" },
            { label: "Nuevas", val: stats.nuevas, icon: BellRing, color: "text-accent" },
            { label: "Criticas", val: stats.criticas, icon: AlertOctagon, color: "text-danger" },
            { label: "Altas", val: stats.altas, icon: AlertTriangle, color: "text-warning" },
            { label: "Atendidas", val: stats.atendidas, icon: CheckCircle2, color: "text-success" },
          ].map((k) => (
            <Card key={k.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-body text-muted-foreground">{k.label}</div>
                    <div className={`text-2xl font-heading font-bold ${k.color}`}>{k.val}</div>
                  </div>
                  <k.icon className={`h-5 w-5 ${k.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="feed">Bandeja de alertas</TabsTrigger>
            <TabsTrigger value="reglas">Reglas configuradas</TabsTrigger>
            <TabsTrigger value="prefs">Preferencias</TabsTrigger>
          </TabsList>

          {/* FEED */}
          <TabsContent value="feed" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <Label className="text-xs font-body">Buscar</Label>
                    <Input
                      placeholder="Codigo, nombre o titulo..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-body">Severidad</Label>
                    <Select value={filtroSeveridad} onValueChange={setFiltroSeveridad}>
                      <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="critica">Critica</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="informativa">Informativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-body">Estado</Label>
                    <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="nueva">Nuevas</SelectItem>
                        <SelectItem value="vista">Vistas</SelectItem>
                        <SelectItem value="atendida">Atendidas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" onClick={marcarTodasVistas}>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Marcar todas vistas
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {filtradas.length === 0 && (
                <Card><CardContent className="p-8 text-center text-sm text-muted-foreground font-body">
                  Sin alertas que coincidan con los filtros.
                </CardContent></Card>
              )}
              {filtradas.map((a) => {
                const cfg = severidadConfig[a.severidad];
                const Icon = cfg.icon;
                return (
                  <Collapsible key={a.id}>
                    <Card className={cfg.className}>
                      <CollapsibleTrigger className="w-full text-left group">
                        <div className="p-4 flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-heading font-semibold text-sm">{a.titulo}</span>
                              <Badge variant="outline" className={`text-[10px] ${cfg.chip}`}>{cfg.label}</Badge>
                              {a.estado === "nueva" && (
                                <Badge className="bg-accent text-accent-foreground text-[10px]">Nueva</Badge>
                              )}
                              {a.estado === "atendida" && (
                                <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">Atendida</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-2 flex-wrap">
                              <span>{a.estudianteNombre}</span>
                              <span>·</span>
                              <FacultadCodigoChip codigo={a.estudianteCodigo} facultad={a.facultad} />
                              <span>·</span>
                              <Clock className="h-3 w-3" />
                              <span>{formatFecha(a.fecha)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {a.canales.map((c) => {
                              const CI = canalIcon[c];
                              return <CI key={c} className="h-3.5 w-3.5 text-muted-foreground" />;
                            })}
                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 ml-2" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-4 pl-12 space-y-3">
                          <p className="text-sm font-body">{a.detalle}</p>
                          <div className="text-xs font-body text-muted-foreground">
                            <span className="font-medium text-foreground">Programa:</span> {a.programa}
                            <span className="mx-2">·</span>
                            <span className="font-medium text-foreground">Factor disparador:</span> {a.factor}
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {a.estado !== "atendida" && (
                              <Button size="sm" variant="outline" onClick={() => marcarComo(a.id, "atendida")}>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Marcar atendida
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => reenviar(a)}>
                              <Send className="h-3.5 w-3.5 mr-2" /> Reenviar notificacion
                            </Button>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          </TabsContent>

          {/* REGLAS */}
          <TabsContent value="reglas" className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-body text-muted-foreground">
                Las reglas se evaluan automaticamente despues de cada cargue de datos o ejecucion del modelo.
              </p>
              <Dialog open={nuevaReglaOpen} onOpenChange={setNuevaReglaOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" /> Nueva regla
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-heading">Crear regla de alerta</DialogTitle>
                    <DialogDescription className="font-body">
                      Defina la condicion y los canales por los que se notificara.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <div>
                      <Label className="text-xs font-body">Nombre</Label>
                      <Input value={nuevaRegla.nombre ?? ""} onChange={(e) => setNuevaRegla({ ...nuevaRegla, nombre: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs font-body">Condicion</Label>
                      <Input
                        placeholder="Ej: Promedio < 3.0 y asistencia < 70%"
                        value={nuevaRegla.condicion ?? ""}
                        onChange={(e) => setNuevaRegla({ ...nuevaRegla, condicion: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-body">Severidad</Label>
                      <Select
                        value={nuevaRegla.severidad}
                        onValueChange={(v) => setNuevaRegla({ ...nuevaRegla, severidad: v as Severidad })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critica">Critica</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="informativa">Informativa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNuevaReglaOpen(false)}>Cancelar</Button>
                    <Button onClick={crearRegla}>Crear regla</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {reglas.map((r) => {
              const cfg = severidadConfig[r.severidad];
              return (
                <Card key={r.id} className={r.activa ? "" : "opacity-60"}>
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-semibold text-sm">{r.nombre}</span>
                        <Badge variant="outline" className={`text-[10px] ${cfg.chip}`}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs font-body text-muted-foreground">
                        <Filter className="h-3 w-3 inline mr-1" /> {r.condicion}
                      </p>
                      <div className="flex items-center gap-3 pt-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          {r.canales.map((c) => {
                            const CI = canalIcon[c];
                            return (
                              <Badge key={c} variant="outline" className="text-[10px] gap-1 px-1.5">
                                <CI className="h-3 w-3" /> {c}
                              </Badge>
                            );
                          })}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-body">
                          Notifica a: {r.destinatarios.join(", ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch checked={r.activa} onCheckedChange={() => toggleRegla(r.id)} />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-danger" onClick={() => eliminarRegla(r.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* PREFERENCIAS */}
          <TabsContent value="prefs" className="space-y-3 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base flex items-center gap-2 text-primary">
                  <Settings2 className="h-4 w-4" /> Canales personales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { k: "correo", label: "Notificaciones por correo institucional", icon: Mail },
                  { k: "push", label: "Notificaciones push en el panel", icon: Smartphone },
                  { k: "sms", label: "Mensajes SMS para alertas criticas", icon: MessageSquare },
                ].map((c) => (
                  <div key={c.k} className="flex items-center justify-between gap-4 py-1.5 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-3">
                      <c.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-body">{c.label}</span>
                    </div>
                    <Switch
                      checked={(prefs as any)[c.k]}
                      onCheckedChange={(v) => setPrefs({ ...prefs, [c.k]: v })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base flex items-center gap-2 text-primary">
                  <Clock className="h-4 w-4" /> Horarios y resumenes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-4 py-1.5">
                  <div>
                    <div className="text-sm font-body font-medium">Resumen diario</div>
                    <div className="text-xs text-muted-foreground font-body">Recibira un consolidado de las alertas del dia.</div>
                  </div>
                  <Switch checked={prefs.resumenDiario} onCheckedChange={(v) => setPrefs({ ...prefs, resumenDiario: v })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-body">Hora del resumen</Label>
                    <Input type="time" value={prefs.horaResumen} onChange={(e) => setPrefs({ ...prefs, horaResumen: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs font-body">Silencio desde</Label>
                    <Input type="time" value={prefs.silencioInicio} onChange={(e) => setPrefs({ ...prefs, silencioInicio: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs font-body">Silencio hasta</Label>
                    <Input type="time" value={prefs.silencioFin} onChange={(e) => setPrefs({ ...prefs, silencioFin: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/40">
                  <div>
                    <div className="text-sm font-body font-medium">Solo alertas criticas durante silencio</div>
                    <div className="text-xs text-muted-foreground font-body">Permite que las alertas criticas atraviesen el horario de silencio.</div>
                  </div>
                  <Switch checked={prefs.soloCriticas} onCheckedChange={(v) => setPrefs({ ...prefs, soloCriticas: v })} />
                </div>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                  onClick={() => toast({ title: "Preferencias guardadas", description: "Se aplicaran a todas sus notificaciones." })}
                >
                  Guardar preferencias
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Alertas;
