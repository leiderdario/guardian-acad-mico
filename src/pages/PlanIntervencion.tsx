import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardList,
  ChevronDown,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  UserCog,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { mockStudents, type Estudiante } from "@/lib/mockData";
import { FacultadCodigoChip } from "@/components/FacultadCodigoChip";

type EstadoCaso = "Sugerido" | "Asignado" | "En curso" | "Cerrado exitoso" | "Cerrado sin respuesta";

interface AccionRecomendada {
  titulo: string;
  responsable: string;
  plazoDias: number;
  prioridad: "Alta" | "Media" | "Baja";
  descripcion: string;
}

interface CasoIntervencion {
  estudiante: Estudiante;
  estado: EstadoCaso;
  responsable: string;
  fechaCreacion: string;
  progreso: number;
  acciones: AccionRecomendada[];
  factorPrincipal: string;
}

const ESTADO_STYLE: Record<EstadoCaso, string> = {
  "Sugerido": "bg-muted/60 text-foreground border-border",
  "Asignado": "bg-accent/15 text-accent border-accent/30",
  "En curso": "bg-[hsl(var(--teal))]/15 text-[hsl(var(--teal))] border-[hsl(var(--teal))]/30",
  "Cerrado exitoso": "bg-success/15 text-success border-success/30",
  "Cerrado sin respuesta": "bg-danger/10 text-danger border-danger/30",
};

const ESTADO_ICON: Record<EstadoCaso, typeof Clock> = {
  "Sugerido": Sparkles,
  "Asignado": UserCog,
  "En curso": Clock,
  "Cerrado exitoso": CheckCircle2,
  "Cerrado sin respuesta": AlertCircle,
};

// Reglas de recomendacion segun factores detectados
function generarAcciones(estudiante: Estudiante): AccionRecomendada[] {
  const acciones: AccionRecomendada[] = [];
  const factores = estudiante.factores;

  if (factores.some((f) => f.includes("promedio") || f.includes("reprobadas") || f.includes("segunda matricula"))) {
    acciones.push({
      titulo: "Tutoria academica focalizada",
      responsable: "Centro de Tutorias",
      plazoDias: 7,
      prioridad: "Alta",
      descripcion: "Asignar tutor par en las asignaturas con mas bajo desempeno y agendar tres sesiones semanales.",
    });
  }
  if (factores.some((f) => f.includes("asistencia"))) {
    acciones.push({
      titulo: "Plan de recuperacion de asistencia",
      responsable: "Coordinador de Programa",
      plazoDias: 5,
      prioridad: "Alta",
      descripcion: "Citar al estudiante, identificar barreras de asistencia y firmar compromiso de seguimiento semanal.",
    });
  }
  if (factores.some((f) => f.includes("satisfaccion") || f.includes("retiro"))) {
    acciones.push({
      titulo: "Acompanamiento vocacional",
      responsable: "Bienestar Universitario",
      plazoDias: 10,
      prioridad: "Media",
      descripcion: "Aplicar pruebas de orientacion y revisar opciones de movilidad o cambio de programa.",
    });
  }
  if (factores.some((f) => f.includes("Estrato") || f.includes("Jornada laboral") || f.includes("Distancia"))) {
    acciones.push({
      titulo: "Activar ruta de apoyo socioeconomico",
      responsable: "Bienestar Universitario",
      plazoDias: 14,
      prioridad: "Media",
      descripcion: "Validar elegibilidad para becas, subsidios de transporte o flexibilizacion de horarios.",
    });
  }
  if (factores.some((f) => f.includes("apoyo familiar"))) {
    acciones.push({
      titulo: "Atencion psicosocial",
      responsable: "Departamento de Psicologia",
      plazoDias: 7,
      prioridad: "Alta",
      descripcion: "Agendar valoracion inicial y construir red de apoyo institucional para el estudiante.",
    });
  }
  if (acciones.length === 0) {
    acciones.push({
      titulo: "Seguimiento preventivo",
      responsable: "Consejero Academico",
      plazoDias: 30,
      prioridad: "Baja",
      descripcion: "Mantener monitoreo trimestral del rendimiento y senales tempranas.",
    });
  }
  return acciones;
}

function inicialResponsable(estudiante: Estudiante): string {
  const responsables = [
    "Sin asignar",
    "Lic. Marta Ortega",
    "Lic. Camilo Bermudez",
    "Lic. Patricia Henao",
    "Lic. Ricardo Suarez",
  ];
  const idx = estudiante.codigo.charCodeAt(estudiante.codigo.length - 1) % responsables.length;
  return responsables[idx];
}

function inicialEstado(riesgo: number, idx: number): EstadoCaso {
  if (riesgo > 80) return idx % 3 === 0 ? "En curso" : idx % 3 === 1 ? "Asignado" : "Sugerido";
  if (riesgo > 65) return idx % 2 === 0 ? "Asignado" : "Sugerido";
  return "Sugerido";
}

function fechaMock(idx: number): string {
  const d = new Date();
  d.setDate(d.getDate() - (idx % 14));
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

const PlanIntervencion = () => {
  const casosBase: CasoIntervencion[] = useMemo(
    () =>
      mockStudents
        .filter((e) => e.indiceRiesgo > 50)
        .map((e, idx) => ({
          estudiante: e,
          estado: inicialEstado(e.indiceRiesgo, idx),
          responsable: inicialResponsable(e),
          fechaCreacion: fechaMock(idx),
          progreso: e.indiceRiesgo > 80 ? (idx * 17) % 80 : (idx * 23) % 60,
          acciones: generarAcciones(e),
          factorPrincipal: e.factores[0] ?? "Sin factor identificado",
        })),
    []
  );

  const [casos, setCasos] = useState<CasoIntervencion[]>(casosBase);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [responsableFilter, setResponsableFilter] = useState<string>("todos");
  const [selected, setSelected] = useState<CasoIntervencion | null>(null);

  const responsables = useMemo(
    () => Array.from(new Set(casos.map((c) => c.responsable))),
    [casos]
  );

  const filtrados = casos.filter((c) => {
    const matchSearch =
      search === "" ||
      c.estudiante.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.estudiante.codigo.toLowerCase().includes(search.toLowerCase());
    const matchEstado = estadoFilter === "todos" || c.estado === estadoFilter;
    const matchResp = responsableFilter === "todos" || c.responsable === responsableFilter;
    return matchSearch && matchEstado && matchResp;
  });

  const grupos: { key: EstadoCaso }[] = [
    { key: "Sugerido" },
    { key: "Asignado" },
    { key: "En curso" },
    { key: "Cerrado exitoso" },
    { key: "Cerrado sin respuesta" },
  ];

  const cambiarEstado = (codigo: string, nuevoEstado: EstadoCaso) => {
    setCasos((prev) =>
      prev.map((c) =>
        c.estudiante.codigo === codigo
          ? {
              ...c,
              estado: nuevoEstado,
              progreso:
                nuevoEstado === "Cerrado exitoso"
                  ? 100
                  : nuevoEstado === "En curso"
                  ? Math.max(c.progreso, 40)
                  : nuevoEstado === "Asignado"
                  ? Math.max(c.progreso, 15)
                  : c.progreso,
            }
          : c
      )
    );
    if (selected && selected.estudiante.codigo === codigo) {
      setSelected({ ...selected, estado: nuevoEstado });
    }
  };

  // Metricas
  const totalCasos = casos.length;
  const enCurso = casos.filter((c) => c.estado === "En curso" || c.estado === "Asignado").length;
  const exitosos = casos.filter((c) => c.estado === "Cerrado exitoso").length;
  const tasaCobertura = totalCasos === 0 ? 0 : Math.round(((enCurso + exitosos) / totalCasos) * 100);

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-gradient-to-r from-primary to-[hsl(var(--teal))] text-primary-foreground p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-accent text-accent-foreground rounded-md p-2">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">Plan de Intervencion</h1>
              <p className="text-sm font-body text-primary-foreground/80">
                Acciones sugeridas automaticamente para cada estudiante en riesgo, con seguimiento del estado del caso.
              </p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">Casos abiertos</span>
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="font-heading text-2xl font-bold mt-1">{totalCasos}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">En seguimiento</span>
                <Clock className="h-4 w-4 text-[hsl(var(--teal))]" />
              </div>
              <div className="font-heading text-2xl font-bold mt-1">{enCurso}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">Cierre exitoso</span>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="font-heading text-2xl font-bold mt-1">{exitosos}</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-gradient-to-br from-accent/10 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">Cobertura</span>
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <div className="font-heading text-2xl font-bold mt-1">{tasaCobertura}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-sm flex items-center gap-2 text-primary">
                  <Filter className="h-4 w-4" /> Filtros
                </CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o codigo..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 font-body text-sm"
                    />
                  </div>
                  <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                    <SelectTrigger className="w-44 font-body text-sm">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      {grupos.map((g) => (
                        <SelectItem key={g.key} value={g.key}>{g.key}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={responsableFilter} onValueChange={setResponsableFilter}>
                    <SelectTrigger className="w-52 font-body text-sm">
                      <SelectValue placeholder="Responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los responsables</SelectItem>
                      {responsables.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Casos agrupados por estado */}
        {grupos.map((g) => {
          const items = filtrados.filter((c) => c.estado === g.key);
          if (items.length === 0) return null;
          const Icon = ESTADO_ICON[g.key];
          const defaultOpen = g.key === "Sugerido" || g.key === "Asignado" || g.key === "En curso";
          return (
            <Collapsible key={g.key} defaultOpen={defaultOpen}>
              <Card>
                <CollapsibleTrigger className="w-full group">
                  <CardHeader className="py-3 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${ESTADO_STYLE[g.key]}`}>
                        <Icon className="h-3 w-3" /> {g.key}
                      </span>
                      <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm font-body">
                        <thead>
                          <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                            <th className="p-3">Facultad / Codigo</th>
                            <th className="p-3">Estudiante</th>
                            <th className="p-3">Factor principal</th>
                            <th className="p-3">Acciones</th>
                            <th className="p-3">Responsable</th>
                            <th className="p-3">Progreso</th>
                            <th className="p-3">Apertura</th>
                            <th className="p-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((c) => (
                            <tr key={c.estudiante.codigo} className="border-b border-border/50 hover:bg-secondary/40">
                              <td className="p-3">
                                <FacultadCodigoChip facultad={c.estudiante.facultad} codigo={c.estudiante.codigo} />
                              </td>
                              <td className="p-3">
                                <div className="font-medium">{c.estudiante.nombre}</div>
                                <div className="text-[10px] text-muted-foreground">{c.estudiante.programa}</div>
                              </td>
                              <td className="p-3 text-xs">{c.factorPrincipal}</td>
                              <td className="p-3">
                                <Badge variant="outline" className="text-[10px]">{c.acciones.length} sugerencias</Badge>
                              </td>
                              <td className="p-3 text-xs">{c.responsable}</td>
                              <td className="p-3 w-40">
                                <div className="flex items-center gap-2">
                                  <Progress value={c.progreso} className="h-1.5" />
                                  <span className="text-[10px] font-mono w-8 text-right">{c.progreso}%</span>
                                </div>
                              </td>
                              <td className="p-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> {c.fechaCreacion}
                                </div>
                              </td>
                              <td className="p-3">
                                <Button variant="ghost" size="sm" onClick={() => setSelected(c)} className="h-7 text-xs">
                                  Abrir <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}

        {filtrados.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground font-body">
              No hay casos que coincidan con los filtros seleccionados.
            </CardContent>
          </Card>
        )}

        {/* Detalle */}
        <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            {selected && (
              <>
                <SheetHeader>
                  <SheetTitle className="font-heading text-lg">Caso de Intervencion</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-5">
                  <div className="space-y-2">
                    <FacultadCodigoChip facultad={selected.estudiante.facultad} codigo={selected.estudiante.codigo} />
                    <h3 className="font-heading text-base font-semibold">{selected.estudiante.nombre}</h3>
                    <p className="text-xs text-muted-foreground font-body">
                      {selected.estudiante.programa} · Semestre {selected.estudiante.semestre} · Riesgo{" "}
                      <span className="font-mono font-semibold text-foreground">{selected.estudiante.indiceRiesgo}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-heading text-xs uppercase tracking-wider text-muted-foreground">Estado del caso</h4>
                    <Select value={selected.estado} onValueChange={(v) => cambiarEstado(selected.estudiante.codigo, v as EstadoCaso)}>
                      <SelectTrigger className="font-body text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {grupos.map((g) => (
                          <SelectItem key={g.key} value={g.key}>{g.key}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Progress value={selected.progreso} className="h-1.5 flex-1" />
                      <span className="text-[10px] font-mono">{selected.progreso}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
                      Acciones sugeridas por el modelo
                    </h4>
                    <div className="space-y-2">
                      {selected.acciones.map((a, i) => {
                        const prioStyle =
                          a.prioridad === "Alta"
                            ? "bg-danger/10 text-danger border-danger/30"
                            : a.prioridad === "Media"
                            ? "bg-warning/10 text-warning border-warning/30"
                            : "bg-muted text-muted-foreground border-border";
                        return (
                          <div key={i} className="rounded-md border border-border p-3 bg-card">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="font-heading text-sm font-semibold">{a.titulo}</div>
                              <span className={`text-[10px] px-2 py-0.5 rounded border ${prioStyle}`}>
                                {a.prioridad}
                              </span>
                            </div>
                            <p className="text-xs font-body text-foreground/80 mb-2">{a.descripcion}</p>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <UserCog className="h-3 w-3" /> {a.responsable}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {a.plazoDias} dias
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => cambiarEstado(selected.estudiante.codigo, "Cerrado sin respuesta")}
                      className="text-xs"
                    >
                      Cerrar sin respuesta
                    </Button>
                    <Button
                      onClick={() => cambiarEstado(selected.estudiante.codigo, "Cerrado exitoso")}
                      className="bg-success text-success-foreground hover:bg-success/90 text-xs"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Cerrar exitoso
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
};

export default PlanIntervencion;
