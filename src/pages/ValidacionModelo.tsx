import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from "recharts";
import {
  Brain, Target, Activity, GaugeCircle, ChevronDown, ShieldCheck, Sparkles, Info,
} from "lucide-react";

// ====== Mock metricas del modelo (Gradient Boosting + balanceo SMOTE) ======
const metricas = [
  { label: "Exactitud (Accuracy)", value: "87.3%", icon: Target, hint: "Aciertos globales sobre el total de predicciones" },
  { label: "Precision (Riesgo)", value: "84.1%", icon: ShieldCheck, hint: "De los marcados como riesgo, cuantos realmente desertan" },
  { label: "Sensibilidad (Recall)", value: "82.6%", icon: Activity, hint: "De los desertores reales, cuantos detecta el modelo" },
  { label: "F1-Score", value: "83.3%", icon: GaugeCircle, hint: "Equilibrio armonico entre precision y recall" },
  { label: "AUC-ROC", value: "0.91", icon: Brain, hint: "Capacidad discriminativa global del clasificador" },
  { label: "Kappa de Cohen", value: "0.74", icon: Sparkles, hint: "Acuerdo ajustado por azar; >0.6 es sustancial" },
];

// Matriz de confusion (sobre 1.000 estudiantes en validacion)
const matriz = {
  vp: 248, // verdaderos positivos (riesgo correctamente identificado)
  fn: 52,  // falsos negativos (riesgo no detectado)
  fp: 75,  // falsos positivos (alarma erronea)
  vn: 625, // verdaderos negativos (estables correctamente)
};

// Curva ROC mock
const rocData = [
  { fpr: 0.0, tpr: 0.0 },
  { fpr: 0.05, tpr: 0.42 },
  { fpr: 0.10, tpr: 0.63 },
  { fpr: 0.18, tpr: 0.78 },
  { fpr: 0.28, tpr: 0.86 },
  { fpr: 0.42, tpr: 0.92 },
  { fpr: 0.60, tpr: 0.96 },
  { fpr: 0.80, tpr: 0.99 },
  { fpr: 1.0, tpr: 1.0 },
];

// Importancia de variables (estilo SHAP)
const importancia = [
  { variable: "Promedio acumulado", peso: 0.218 },
  { variable: "Materias reprobadas", peso: 0.176 },
  { variable: "Asistencia a clases", peso: 0.142 },
  { variable: "Semestres perdidos", peso: 0.118 },
  { variable: "Satisfaccion con la carrera", peso: 0.094 },
  { variable: "Estrato socioeconomico", peso: 0.082 },
  { variable: "Trabaja jornada extensa", peso: 0.061 },
  { variable: "Beca o apoyo economico", peso: 0.048 },
  { variable: "Retiro de semestre previo", peso: 0.034 },
  { variable: "Distancia al campus", peso: 0.027 },
];

// Evolucion de precision por reentrenamiento
const evolucion = [
  { version: "v1.0 · 2024-I", accuracy: 76.2, f1: 71.4 },
  { version: "v1.1 · 2024-II", accuracy: 81.5, f1: 78.0 },
  { version: "v2.0 · 2025-I", accuracy: 84.7, f1: 80.9 },
  { version: "v2.1 · 2025-II", accuracy: 87.3, f1: 83.3 },
];

const totalMatriz = matriz.vp + matriz.fn + matriz.fp + matriz.vn;

const ValidacionModelo = () => {
  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-r from-primary via-primary to-[hsl(var(--teal))] text-primary-foreground p-6 shadow-md">
          <div className="absolute inset-y-0 right-0 w-1.5 bg-accent" />
          <div className="text-[10px] font-body uppercase tracking-[0.25em] text-accent mb-2">
            Universidad de Cartagena · EduAlert
          </div>
          <h1 className="font-heading text-3xl font-bold">Validacion del Modelo Predictivo</h1>
          <p className="text-sm font-body mt-1 text-primary-foreground/80 max-w-3xl">
            Metricas de desempeno, matriz de confusion y explicabilidad del clasificador
            de riesgo de desercion estudiantil entrenado sobre cohortes 2018-2024.
          </p>
        </div>

        {/* Ficha tecnica */}
        <Card className="border-l-4 border-l-[hsl(var(--teal))]">
          <CardContent className="p-4 grid md:grid-cols-4 gap-4 text-sm font-body">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Algoritmo</div>
              <div className="font-heading text-primary font-semibold">Gradient Boosting (XGBoost)</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Cohortes</div>
              <div className="font-heading text-primary font-semibold">2018-I a 2024-II · 14.382 reg.</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Validacion</div>
              <div className="font-heading text-primary font-semibold">K-Fold estratificado (k=10)</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Ultimo reentrenamiento</div>
              <div className="font-heading text-primary font-semibold">14 may 2026</div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metricas.map((m) => (
            <Card key={m.label} className="relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all bg-gradient-to-br from-card to-secondary/40">
              <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-[hsl(var(--teal))]" />
              <CardContent className="p-4">
                <m.icon className="h-4 w-4 text-[hsl(var(--teal))] mb-2" />
                <div className="text-xl font-heading font-bold text-primary tabular-nums">{m.value}</div>
                <div className="text-[11px] text-muted-foreground font-body mt-0.5">{m.label}</div>
                <div className="text-[10px] text-muted-foreground/80 font-body mt-1 leading-snug">{m.hint}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Matriz de confusion */}
        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-base text-primary">Matriz de Confusion</CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="grid grid-cols-[120px_1fr_1fr] gap-1 text-xs font-body">
                    <div></div>
                    <div className="text-center font-semibold text-muted-foreground py-2">Predijo: Riesgo</div>
                    <div className="text-center font-semibold text-muted-foreground py-2">Predijo: Estable</div>

                    <div className="flex items-center justify-end pr-2 font-semibold text-muted-foreground">Real: Riesgo</div>
                    <div className="bg-success/15 border border-success/40 rounded-md p-4 text-center">
                      <div className="text-2xl font-heading font-bold text-success">{matriz.vp}</div>
                      <div className="text-[10px] uppercase tracking-wider text-success/80 mt-1">Verdaderos Positivos</div>
                    </div>
                    <div className="bg-danger/15 border border-danger/40 rounded-md p-4 text-center">
                      <div className="text-2xl font-heading font-bold text-danger">{matriz.fn}</div>
                      <div className="text-[10px] uppercase tracking-wider text-danger/80 mt-1">Falsos Negativos</div>
                    </div>

                    <div className="flex items-center justify-end pr-2 font-semibold text-muted-foreground">Real: Estable</div>
                    <div className="bg-warning/15 border border-warning/40 rounded-md p-4 text-center">
                      <div className="text-2xl font-heading font-bold text-warning">{matriz.fp}</div>
                      <div className="text-[10px] uppercase tracking-wider text-warning/80 mt-1">Falsos Positivos</div>
                    </div>
                    <div className="bg-success/15 border border-success/40 rounded-md p-4 text-center">
                      <div className="text-2xl font-heading font-bold text-success">{matriz.vn}</div>
                      <div className="text-[10px] uppercase tracking-wider text-success/80 mt-1">Verdaderos Negativos</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-body mt-3 flex items-start gap-1.5">
                    <Info className="h-3 w-3 mt-0.5 shrink-0" />
                    Sobre {totalMatriz.toLocaleString()} estudiantes del conjunto de validacion. Un falso negativo
                    representa un estudiante en riesgo que el sistema no alcanzo a detectar.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading text-sm font-semibold mb-2 text-primary">Curva ROC · AUC = 0.91</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={rocData} margin={{ top: 10, right: 10, bottom: 30, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="fpr" type="number" domain={[0, 1]} tick={{ fontSize: 10 }} label={{ value: "Tasa de Falsos Positivos", position: "insideBottom", offset: -10, style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }} />
                      <YAxis type="number" domain={[0, 1]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="tpr" name="Tasa Verdaderos Positivos" stroke="hsl(var(--teal))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 3 }} />
                      <Line type="linear" dataKey="fpr" name="Azar" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Importancia de variables (SHAP) */}
        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-base text-primary">Explicabilidad · Importancia de Variables (SHAP)</CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={importancia} layout="vertical" margin={{ left: 30, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 0.25]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <YAxis type="category" dataKey="variable" tick={{ fontSize: 11 }} width={170} />
                    <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                    <Bar dataKey="peso" name="Contribucion al modelo" radius={[0, 4, 4, 0]}>
                      {importancia.map((_, i) => (
                        <Cell key={i} fill={i < 3 ? "hsl(var(--danger))" : i < 6 ? "hsl(var(--warning))" : "hsl(var(--teal))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-[11px] text-muted-foreground font-body mt-2 flex items-start gap-1.5">
                  <Info className="h-3 w-3 mt-0.5 shrink-0" />
                  Las tres variables academicas (promedio, reprobadas, asistencia) concentran el 53.6% del poder
                  predictivo. Esto guia las acciones de intervencion temprana de Bienestar Universitario.
                </p>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Evolucion de versiones */}
        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-base text-primary">Evolucion del Modelo entre Reentrenamientos</CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={evolucion}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="version" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="accuracy" name="Exactitud" stroke="hsl(var(--teal))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
                    <Line type="monotone" dataKey="f1" name="F1-Score" stroke="hsl(var(--accent))" strokeWidth={2.5} strokeDasharray="5 3" dot={{ fill: "hsl(var(--teal))", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-[10px]">+11.1 pts exactitud vs v1.0</Badge>
                  <Badge variant="secondary" className="text-[10px]">+11.9 pts F1 vs v1.0</Badge>
                  <Badge className="text-[10px] bg-[hsl(var(--teal))] text-[hsl(var(--teal-foreground))] hover:bg-[hsl(var(--teal))]">Modelo en produccion: v2.1</Badge>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </AppLayout>
  );
};

export default ValidacionModelo;
