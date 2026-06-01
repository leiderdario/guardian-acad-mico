import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Brain, GitBranch, Sparkles, User, Mail, Phone, MapPin,
  TrendingDown, TrendingUp, Activity, GraduationCap, Calendar,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell, ReferenceLine, Area, AreaChart,
} from "recharts";
import { mockStudents } from "@/lib/mockData";
import { generarFactoresXAI, generarProyeccionDigitalTwin } from "@/lib/xaiData";
import { CondicionEspecialBadge } from "@/components/CondicionEspecialBadge";

const PerfilEstudiante = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const estudiante = useMemo(() => mockStudents.find((s) => s.codigo === codigo), [codigo]);

  // What-If sliders
  const [asistencia, setAsistencia] = useState([estudiante ? (estudiante.indiceRiesgo > 50 ? 65 : 90) : 80]);
  const [promedio, setPromedio] = useState([estudiante ? estudiante.promedioAcumulado * 10 : 35]);
  const [tieneBeca, setTieneBeca] = useState([0]);
  const [horasTrabajo, setHorasTrabajo] = useState([estudiante && estudiante.indiceRiesgo > 55 ? 30 : 0]);
  const [tutorias, setTutorias] = useState([2]);

  if (!estudiante) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="font-body text-muted-foreground">Estudiante no encontrado.</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">Volver</Button>
        </div>
      </AppLayout>
    );
  }

  const factores = generarFactoresXAI(estudiante);
  const proyeccion = generarProyeccionDigitalTwin(estudiante.indiceRiesgo);

  // Calculo del riesgo simulado
  const riesgoBase = estudiante.indiceRiesgo;
  const ajusteAsistencia = (80 - asistencia[0]) * 0.4;
  const ajustePromedio = (35 - promedio[0]) * 0.8;
  const ajusteBeca = tieneBeca[0] * -8;
  const ajusteHoras = (horasTrabajo[0] - 10) * 0.3;
  const ajusteTutorias = tutorias[0] * -3;
  const riesgoSimulado = Math.max(
    5,
    Math.min(99, Math.round(riesgoBase + ajusteAsistencia + ajustePromedio + ajusteBeca + ajusteHoras + ajusteTutorias))
  );
  const delta = riesgoSimulado - riesgoBase;

  const colorRiesgo = (r: number) =>
    r > 80 ? "hsl(var(--danger))"
    : r > 65 ? "hsl(var(--danger))"
    : r > 30 ? "hsl(var(--warning))"
    : "hsl(var(--success))";

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link to="/dashboard" className="text-xs font-body text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3 w-3" /> Volver al panel
            </Link>
            <h1 className="font-heading text-3xl font-bold text-primary">{estudiante.nombre}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs font-body font-mono text-muted-foreground">{estudiante.codigo}</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm font-body text-muted-foreground">{estudiante.programa}</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm font-body text-muted-foreground">{estudiante.facultad}</span>
              <CondicionEspecialBadge condicion={estudiante.condicionEspecial} detalle={estudiante.detalleCondicion} compact />
            </div>
          </div>
          <Card className="border-l-4" style={{ borderLeftColor: colorRiesgo(estudiante.indiceRiesgo) }}>
            <CardContent className="p-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body">Indice de Riesgo</div>
              <div className="text-4xl font-heading font-bold mt-1" style={{ color: colorRiesgo(estudiante.indiceRiesgo) }}>
                {estudiante.indiceRiesgo}
              </div>
              <Badge variant={estudiante.indiceRiesgo > 65 ? "destructive" : "secondary"} className="text-[10px] mt-1">
                {estudiante.clasificacion}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="resumen"><User className="h-3 w-3 mr-1.5" /> Perfil 360</TabsTrigger>
            <TabsTrigger value="xai"><Brain className="h-3 w-3 mr-1.5" /> Explicacion IA</TabsTrigger>
            <TabsTrigger value="whatif"><Sparkles className="h-3 w-3 mr-1.5" /> Simulador What-If</TabsTrigger>
            <TabsTrigger value="twin"><GitBranch className="h-3 w-3 mr-1.5" /> Gemelo Digital</TabsTrigger>
          </TabsList>

          {/* ============ RESUMEN ============ */}
          <TabsContent value="resumen" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3"><CardTitle className="font-heading text-sm text-primary">Datos personales</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm font-body">
                  <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" />{estudiante.nombre.toLowerCase().split(" ")[0]}.{estudiante.nombre.toLowerCase().split(" ")[2] || "x"}@unicartagena.edu.co</div>
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" />+57 30{(estudiante.codigo.length % 9)} 4{estudiante.codigo.slice(-6)}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-muted-foreground" />Cartagena, Bolivar</div>
                  <div className="flex items-center gap-2"><Calendar className="h-3 w-3 text-muted-foreground" />Ingreso 2022-I</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="font-heading text-sm text-primary">Trayectoria academica</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm font-body">
                  <div className="flex justify-between"><span className="text-muted-foreground">Semestre actual</span><span className="font-semibold">{estudiante.semestre}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Promedio acumulado</span><span className="font-semibold">{estudiante.promedioAcumulado}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Creditos aprobados</span><span className="font-semibold">{estudiante.semestre * 16}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Asistencia</span><span className="font-semibold">{estudiante.indiceRiesgo > 50 ? "62%" : "91%"}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="font-heading text-sm text-primary">Recomendaciones IA</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-xs font-body">
                  <div className="p-2 bg-gold/10 border-l-2 border-gold rounded-sm">
                    <strong className="text-primary">Tutoria academica:</strong> Asignar 2 sesiones/sem en {estudiante.programa.includes("Ing") ? "Calculo II" : "metodologia"}.
                  </div>
                  <div className="p-2 bg-teal/10 border-l-2 border-teal rounded-sm">
                    <strong className="text-primary">Apoyo psicosocial:</strong> Cita con orientacion en los proximos 7 dias.
                  </div>
                  <div className="p-2 bg-success/10 border-l-2 border-success rounded-sm">
                    <strong className="text-primary">Evaluar beca:</strong> Candidato a apoyo socioeconomico.
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="font-heading text-sm text-primary">Linea de tiempo institucional</CardTitle></CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-3 border-l-2 border-border">
                  {[
                    { fecha: "2026-I", evento: "Evaluacion de riesgo actual", color: "danger" },
                    { fecha: "2025-II", evento: "Reprobo Calculo Diferencial", color: "warning" },
                    { fecha: "2025-I", evento: "Promedio semestral 3.1", color: "warning" },
                    { fecha: "2024-II", evento: "Asistencia 78%", color: "muted" },
                    { fecha: "2022-I", evento: "Ingreso a la Universidad", color: "success" },
                  ].map((e, i) => (
                    <div key={i} className="relative">
                      <span className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-${e.color} border-2 border-background`} />
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">{e.fecha}</div>
                      <div className="text-sm font-body text-foreground">{e.evento}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ XAI ============ */}
          <TabsContent value="xai" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
                  <Brain className="h-4 w-4" /> ¿Por que el modelo predice este riesgo?
                </CardTitle>
                <p className="text-xs font-body text-muted-foreground mt-1">
                  Contribucion de cada variable al puntaje final (analisis SHAP). Las barras a la derecha aumentan el riesgo; a la izquierda lo reducen.
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={factores} layout="vertical" margin={{ left: 130 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[-25, 25]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10 }} width={130} />
                    <Tooltip
                      formatter={(v: number) => [`${v > 0 ? "+" : ""}${v.toFixed(1)} pts`, "Impacto"]}
                      contentStyle={{ fontSize: 11, fontFamily: "var(--font-body)" }}
                    />
                    <ReferenceLine x={0} stroke="hsl(var(--foreground))" />
                    <Bar dataKey="contribucion" radius={[2, 2, 2, 2]}>
                      {factores.map((f, i) => (
                        <Cell key={i} fill={f.contribucion > 0 ? "hsl(var(--danger))" : "hsl(var(--success))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="font-heading text-sm text-danger flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Factores que aumentan el riesgo</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {factores.filter(f => f.contribucion > 0).slice(0, 5).map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-danger/5 rounded-sm border-l-2 border-danger/40">
                      <div>
                        <div className="text-xs font-body font-semibold">{f.nombre}</div>
                        <div className="text-[10px] text-muted-foreground font-body">{f.valor}</div>
                      </div>
                      <span className="text-sm font-mono font-bold text-danger">+{f.contribucion.toFixed(1)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="font-heading text-sm text-success flex items-center gap-2"><TrendingDown className="h-4 w-4" /> Factores protectores</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {factores.filter(f => f.contribucion < 0).slice(0, 5).map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-success/5 rounded-sm border-l-2 border-success/40">
                      <div>
                        <div className="text-xs font-body font-semibold">{f.nombre}</div>
                        <div className="text-[10px] text-muted-foreground font-body">{f.valor}</div>
                      </div>
                      <span className="text-sm font-mono font-bold text-success">{f.contribucion.toFixed(1)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ WHAT-IF ============ */}
          <TabsContent value="whatif" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Simulador "¿Que pasaria si...?"
                </CardTitle>
                <p className="text-xs font-body text-muted-foreground mt-1">
                  Modifica las variables para ver el cambio proyectado del riesgo en tiempo real.
                </p>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  {[
                    { label: "Asistencia a clases", val: asistencia, set: setAsistencia, min: 30, max: 100, unit: "%" },
                    { label: "Promedio acumulado x10", val: promedio, set: setPromedio, min: 10, max: 50, unit: " (=" + (promedio[0]/10).toFixed(1) + ")" },
                    { label: "Recibe beca/apoyo", val: tieneBeca, set: setTieneBeca, min: 0, max: 1, unit: tieneBeca[0] ? " Si" : " No" },
                    { label: "Horas de trabajo semanal", val: horasTrabajo, set: setHorasTrabajo, min: 0, max: 48, unit: " h" },
                    { label: "Tutorias asignadas", val: tutorias, set: setTutorias, min: 0, max: 6, unit: " ses/sem" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-body font-semibold text-foreground">{s.label}</label>
                        <span className="text-xs font-mono text-primary">{s.val[0]}{s.unit}</span>
                      </div>
                      <Slider value={s.val} onValueChange={s.set} min={s.min} max={s.max} step={1} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-secondary/40 to-card rounded-lg p-6 border border-border">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-body text-muted-foreground">Riesgo proyectado</div>
                  <div className="text-7xl font-heading font-bold mt-2" style={{ color: colorRiesgo(riesgoSimulado) }}>
                    {riesgoSimulado}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant={delta < 0 ? "default" : "destructive"} className="font-mono">
                      {delta > 0 ? "+" : ""}{delta} pts vs base ({riesgoBase})
                    </Badge>
                  </div>
                  <div className="mt-4 text-center text-xs font-body text-muted-foreground max-w-xs">
                    {delta < -15
                      ? "Las intervenciones simuladas tienen alto impacto. Implementarlas reduce drasticamente el riesgo."
                      : delta < 0
                      ? "Mejora moderada. Combinar mas factores para mayor impacto."
                      : "No se observa mejora. Revisar otros vectores de intervencion."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ DIGITAL TWIN ============ */}
          <TabsContent value="twin" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
                  <GitBranch className="h-4 w-4" /> Proyeccion del Gemelo Digital
                </CardTitle>
                <p className="text-xs font-body text-muted-foreground mt-1">
                  Evolucion estimada del riesgo de desercion durante los proximos 4 semestres bajo dos escenarios contrafactuales.
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={340}>
                  <AreaChart data={proyeccion}>
                    <defs>
                      <linearGradient id="sin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--danger))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--danger))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="con" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="semestre" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="sinIntervencion" name="Sin intervencion" stroke="hsl(var(--danger))" fill="url(#sin)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="conIntervencion" name="Con plan EduAlert" stroke="hsl(var(--success))" fill="url(#con)" strokeWidth={2.5} />
                    <ReferenceLine y={70} stroke="hsl(var(--warning))" strokeDasharray="3 3" label={{ value: "Umbral critico", fontSize: 10, fill: "hsl(var(--warning))" }} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="grid md:grid-cols-3 gap-3 mt-4">
                  <div className="p-3 bg-danger/10 border-l-2 border-danger rounded-sm">
                    <div className="text-[10px] uppercase font-body text-muted-foreground">Sin intervencion</div>
                    <div className="text-xl font-heading font-bold text-danger">{proyeccion[4].sinIntervencion}%</div>
                    <div className="text-[10px] text-muted-foreground">probabilidad de desercion al final</div>
                  </div>
                  <div className="p-3 bg-success/10 border-l-2 border-success rounded-sm">
                    <div className="text-[10px] uppercase font-body text-muted-foreground">Con intervencion</div>
                    <div className="text-xl font-heading font-bold text-success">{proyeccion[4].conIntervencion}%</div>
                    <div className="text-[10px] text-muted-foreground">probabilidad de desercion al final</div>
                  </div>
                  <div className="p-3 bg-gold/10 border-l-2 border-gold rounded-sm">
                    <div className="text-[10px] uppercase font-body text-muted-foreground">Reduccion estimada</div>
                    <div className="text-xl font-heading font-bold text-gold-dark">
                      −{proyeccion[4].sinIntervencion - proyeccion[4].conIntervencion} pts
                    </div>
                    <div className="text-[10px] text-muted-foreground">impacto del plan automatizado</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default PerfilEstudiante;
