import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import {
  Building2, TrendingDown, TrendingUp, Users, AlertTriangle, Target,
  DollarSign, Award, ChevronDown, Download, GraduationCap, Activity,
  ShieldCheck, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell,
} from "recharts";
import { mockStudents, riesgoPorFacultad, evolucionHistorica, facultades } from "@/lib/mockData";

// ===== Mock institucional =====
const COSTO_PROMEDIO_ESTUDIANTE = 4_800_000; // COP por semestre

const metaInstitucional = {
  desercionActual: 18.4,
  desercionMeta: 12.0,
  desercionAnoAnterior: 21.2,
};

const cohortes = [
  { cohorte: "2021-I", admitidos: 1820, retenidos: 1432, desercion: 21.3 },
  { cohorte: "2021-II", admitidos: 1690, retenidos: 1352, desercion: 20.0 },
  { cohorte: "2022-I", admitidos: 1910, retenidos: 1545, desercion: 19.1 },
  { cohorte: "2022-II", admitidos: 1750, retenidos: 1431, desercion: 18.2 },
  { cohorte: "2023-I", admitidos: 1980, retenidos: 1635, desercion: 17.4 },
  { cohorte: "2023-II", admitidos: 1830, retenidos: 1525, desercion: 16.7 },
];

const impactoIntervencion = [
  { mes: "Ene", sinIntervencion: 22.1, conIntervencion: 18.8 },
  { mes: "Feb", sinIntervencion: 22.4, conIntervencion: 18.2 },
  { mes: "Mar", sinIntervencion: 22.8, conIntervencion: 17.5 },
  { mes: "Abr", sinIntervencion: 23.1, conIntervencion: 16.9 },
  { mes: "May", sinIntervencion: 23.0, conIntervencion: 16.1 },
  { mes: "Jun", sinIntervencion: 22.7, conIntervencion: 15.4 },
];

const radarFacultades = facultades.slice(0, 6).map((f) => ({
  facultad: f.length > 12 ? f.slice(0, 10) + "..." : f,
  retencion: 70 + Math.floor(Math.random() * 25),
  intervencion: 50 + Math.floor(Math.random() * 45),
  satisfaccion: 60 + Math.floor(Math.random() * 35),
}));

const distribucionFactores = [
  { nombre: "Academico", valor: 38, color: "hsl(var(--danger))" },
  { nombre: "Economico", valor: 27, color: "hsl(var(--warning))" },
  { nombre: "Personal/Psicosocial", valor: 19, color: "hsl(var(--teal))" },
  { nombre: "Vocacional", valor: 11, color: "hsl(var(--accent))" },
  { nombre: "Otros", valor: 5, color: "hsl(var(--muted-foreground))" },
];

const DashboardEjecutivo = () => {
  const total = mockStudents.length;
  const enRiesgo = mockStudents.filter((s) => s.indiceRiesgo > 65).length;
  const totalAdmitidos = cohortes.reduce((a, c) => a + c.admitidos, 0);
  const totalRetenidos = cohortes.reduce((a, c) => a + c.retenidos, 0);
  const tasaRetencion = ((totalRetenidos / totalAdmitidos) * 100).toFixed(1);
  const ahorroEstimado = enRiesgo * 0.42 * COSTO_PROMEDIO_ESTUDIANTE; // 42% conversion rate
  const variacionAnual = metaInstitucional.desercionAnoAnterior - metaInstitucional.desercionActual;
  const progresoMeta =
    ((metaInstitucional.desercionAnoAnterior - metaInstitucional.desercionActual) /
      (metaInstitucional.desercionAnoAnterior - metaInstitucional.desercionMeta)) *
    100;

  const fmtCop = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  const kpis = [
    {
      label: "Tasa de Retencion Global",
      value: `${tasaRetencion}%`,
      delta: "+2.8 pp",
      up: true,
      icon: ShieldCheck,
      hint: "vs cohorte 2021-I",
    },
    {
      label: "Desercion Actual",
      value: `${metaInstitucional.desercionActual}%`,
      delta: `-${variacionAnual.toFixed(1)} pp`,
      up: true,
      icon: TrendingDown,
      hint: "Meta institucional: 12%",
    },
    {
      label: "Estudiantes en Riesgo",
      value: enRiesgo.toLocaleString("es-CO"),
      delta: `${((enRiesgo / total) * 100).toFixed(0)}%`,
      up: false,
      icon: AlertTriangle,
      hint: "Cohorte vigente",
    },
    {
      label: "Ahorro Proyectado",
      value: fmtCop(ahorroEstimado),
      delta: "+18%",
      up: true,
      icon: DollarSign,
      hint: "Intervencion oportuna",
    },
    {
      label: "Cobertura Intervencion",
      value: "73%",
      delta: "+11 pp",
      up: true,
      icon: Target,
      hint: "Casos atendidos / sugeridos",
    },
    {
      label: "Precision del Modelo",
      value: "87.3%",
      delta: "+1.4 pp",
      up: true,
      icon: Activity,
      hint: "Ultima validacion",
    },
  ];

  const handleExport = () => window.print();

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Hero ejecutivo */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary via-primary to-[hsl(var(--teal))] text-primary-foreground p-7 shadow-md">
          <div className="absolute inset-y-0 right-0 w-1.5 bg-accent" />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[10px] font-body uppercase tracking-[0.25em] text-accent mb-2 flex items-center gap-2">
                <Building2 className="h-3 w-3" />
                Vicerrectoria Academica · Universidad de Cartagena
              </div>
              <h1 className="font-heading text-3xl font-bold">Dashboard Ejecutivo</h1>
              <p className="text-sm font-body mt-1 text-primary-foreground/80 max-w-2xl">
                Vision estrategica de retencion estudiantil, impacto de intervenciones y
                avance hacia la meta institucional 2026.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="secondary" size="sm" className="bg-accent text-primary hover:bg-accent/90 border-0">
                <Download className="h-4 w-4 mr-2" />
                Exportar informe
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs ejecutivos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((k) => (
            <Card key={k.label} className="relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-br from-card to-secondary/40">
              <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-[hsl(var(--teal))]" />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <k.icon className="h-4 w-4 text-[hsl(var(--teal))]" />
                  <span className={`text-[10px] font-body flex items-center gap-0.5 ${k.up ? "text-success" : "text-danger"}`}>
                    {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {k.delta}
                  </span>
                </div>
                <div className="text-lg font-heading font-bold text-primary leading-tight">{k.value}</div>
                <div className="text-[11px] text-muted-foreground font-body mt-1">{k.label}</div>
                <div className="text-[9px] text-muted-foreground/70 font-body mt-1 uppercase tracking-wider">{k.hint}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Meta institucional */}
        <Card className="border-accent/40 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
                <Award className="h-4 w-4 text-accent" />
                Avance hacia la Meta Institucional 2026
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                Plan de Desarrollo Institucional
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">Linea base 2024</div>
                <div className="font-heading text-2xl font-bold text-danger">{metaInstitucional.desercionAnoAnterior}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">Estado actual</div>
                <div className="font-heading text-2xl font-bold text-warning">{metaInstitucional.desercionActual}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">Meta 2026</div>
                <div className="font-heading text-2xl font-bold text-success">{metaInstitucional.desercionMeta}%</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-body">
                <span className="text-muted-foreground">Progreso de reduccion</span>
                <span className="font-medium text-primary">{progresoMeta.toFixed(0)}%</span>
              </div>
              <Progress value={progresoMeta} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Impacto y cohortes */}
        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-base text-primary">Impacto de la Intervencion Temprana</CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-heading text-sm font-semibold mb-2 text-primary">Desercion: escenario con y sin intervencion</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={impactoIntervencion}>
                        <defs>
                          <linearGradient id="sinInt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--danger))" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="hsl(var(--danger))" stopOpacity={0.05} />
                          </linearGradient>
                          <linearGradient id="conInt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} unit="%" />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Area type="monotone" dataKey="sinIntervencion" name="Sin intervencion" stroke="hsl(var(--danger))" fill="url(#sinInt)" strokeWidth={2} />
                        <Area type="monotone" dataKey="conIntervencion" name="Con EduAlert" stroke="hsl(var(--success))" fill="url(#conInt)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold mb-2 text-primary">Distribucion de factores de desercion</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={distribucionFactores} dataKey="valor" nameKey="nombre" innerRadius={55} outerRadius={95} paddingAngle={2}>
                          {distribucionFactores.map((d) => (
                            <Cell key={d.nombre} fill={d.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => `${v}%`} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Cohortes */}
        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[hsl(var(--teal))]" />
                  Analisis de Cohortes
                </CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={cohortes}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="cohorte" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} unit="%" />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar yAxisId="left" dataKey="admitidos" name="Admitidos" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                        <Bar yAxisId="left" dataKey="retenidos" name="Retenidos" fill="hsl(var(--teal))" radius={[3, 3, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="desercion" name="% Desercion" stroke="hsl(var(--danger))" strokeWidth={2.5} dot={{ r: 4 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded border border-border bg-secondary/40">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">Cohorte mas reciente</div>
                      <div className="font-heading text-xl font-bold text-primary mt-1">{cohortes[cohortes.length - 1].cohorte}</div>
                      <div className="text-xs font-body text-muted-foreground mt-1">
                        {cohortes[cohortes.length - 1].retenidos.toLocaleString("es-CO")} de {cohortes[cohortes.length - 1].admitidos.toLocaleString("es-CO")} retenidos
                      </div>
                    </div>
                    <div className="p-3 rounded border border-success/30 bg-success/5">
                      <div className="text-[10px] uppercase tracking-wider text-success font-body flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Tendencia
                      </div>
                      <div className="font-heading text-sm font-semibold text-primary mt-1">
                        Reduccion sostenida de 4.6 pp en 6 cohortes
                      </div>
                    </div>
                    <div className="p-3 rounded border border-accent/30 bg-accent/5">
                      <div className="text-[10px] uppercase tracking-wider text-accent-foreground font-body">Retorno estimado</div>
                      <div className="font-heading text-sm font-semibold text-primary mt-1">{fmtCop(ahorroEstimado)}</div>
                      <div className="text-[10px] text-muted-foreground font-body mt-0.5">por matriculas conservadas</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Comparativo facultades */}
        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
                  <Users className="h-4 w-4 text-[hsl(var(--teal))]" />
                  Desempeno comparado por Facultad
                </CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-heading text-sm font-semibold mb-2 text-primary">Distribucion de riesgo</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={riesgoPorFacultad} margin={{ bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="facultad" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="alto" stackId="a" name="Alto" fill="hsl(var(--danger))" />
                        <Bar dataKey="medio" stackId="a" name="Medio" fill="hsl(var(--warning))" />
                        <Bar dataKey="bajo" stackId="a" name="Estable" fill="hsl(var(--success))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold mb-2 text-primary">Indicadores integrados</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarFacultades}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="facultad" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar name="Retencion" dataKey="retencion" stroke="hsl(var(--teal))" fill="hsl(var(--teal))" fillOpacity={0.3} />
                        <Radar name="Intervencion" dataKey="intervencion" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                        <Radar name="Satisfaccion" dataKey="satisfaccion" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Evolucion historica */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base text-primary">Evolucion del Riesgo Promedio Institucional</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={evolucionHistorica}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="riesgoPromedio" name="Riesgo Promedio" stroke="hsl(var(--teal))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recomendaciones estrategicas */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base text-primary">Recomendaciones Estrategicas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm font-body">
              {[
                "Priorizar refuerzo academico en facultades con riesgo alto superior al 25%.",
                "Ampliar cobertura del programa de becas para estudiantes de estratos 1 y 2 identificados en riesgo economico.",
                "Reforzar acompanamiento psicosocial en los primeros 3 semestres, donde se concentra el 62% de la desercion.",
                "Mantener ciclo de reentrenamiento del modelo cada semestre para preservar precision superior al 85%.",
              ].map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent font-bold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-foreground/90">{r}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DashboardEjecutivo;
