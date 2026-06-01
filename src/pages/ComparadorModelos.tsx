import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ReferenceLine, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { metricasModelos, curvaROC } from "@/lib/xaiData";
import { Trophy, Cpu, Timer, Target, Zap } from "lucide-react";

const ComparadorModelos = () => {
  const ganador = [...metricasModelos].sort((a, b) => b.f1 - a.f1)[0];

  const dataRadar = [
    { metrica: "Accuracy", ...Object.fromEntries(metricasModelos.map(m => [m.modelo, m.accuracy])) },
    { metrica: "Precision", ...Object.fromEntries(metricasModelos.map(m => [m.modelo, m.precision])) },
    { metrica: "Recall", ...Object.fromEntries(metricasModelos.map(m => [m.modelo, m.recall])) },
    { metrica: "F1-Score", ...Object.fromEntries(metricasModelos.map(m => [m.modelo, m.f1])) },
    { metrica: "AUC x100", ...Object.fromEntries(metricasModelos.map(m => [m.modelo, m.auc * 100])) },
  ];

  const colores = ["hsl(var(--teal))", "hsl(var(--danger))", "hsl(var(--gold))", "hsl(var(--primary))"];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-r from-primary via-primary to-[hsl(var(--teal))] text-primary-foreground p-6">
          <div className="absolute inset-y-0 right-0 w-1.5 bg-accent" />
          <div className="text-[10px] font-body uppercase tracking-[0.25em] text-accent mb-2">Validacion Algoritmica</div>
          <h1 className="font-heading text-3xl font-bold">Comparador de Modelos Predictivos</h1>
          <p className="text-sm font-body mt-1 text-primary-foreground/80">
            Evaluacion comparativa de algoritmos de Machine Learning aplicados al problema de desercion
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {metricasModelos.map((m, i) => (
            <Card key={m.modelo} className={`relative overflow-hidden ${m.modelo === ganador.modelo ? "border-2 border-gold shadow-lg" : ""}`}>
              {m.modelo === ganador.modelo && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gold text-gold-foreground hover:bg-gold gap-1">
                    <Trophy className="h-3 w-3" /> Mejor F1
                  </Badge>
                </div>
              )}
              <span className="absolute top-0 left-0 right-0 h-1" style={{ background: colores[i] }} />
              <CardContent className="p-4 pt-5">
                <div className="text-xs font-body text-muted-foreground uppercase tracking-wider">{m.modelo}</div>
                <div className="text-3xl font-heading font-bold text-primary mt-2">{m.f1.toFixed(1)}%</div>
                <div className="text-[10px] font-body text-muted-foreground">F1-Score</div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-body">
                  <div><span className="text-muted-foreground">Acc:</span> <strong>{m.accuracy}%</strong></div>
                  <div><span className="text-muted-foreground">AUC:</span> <strong>{m.auc}</strong></div>
                  <div><span className="text-muted-foreground">Prec:</span> <strong>{m.precision}%</strong></div>
                  <div><span className="text-muted-foreground">Rec:</span> <strong>{m.recall}%</strong></div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground font-body">
                  <Timer className="h-3 w-3" /> Entrenamiento: {m.tiempo}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
                <Target className="h-4 w-4" /> Comparacion de metricas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={metricasModelos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="modelo" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 10 }} domain={[60, 100]} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="accuracy" name="Accuracy" fill="hsl(var(--teal))" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="precision" name="Precision" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="recall" name="Recall" fill="hsl(var(--gold))" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="f1" name="F1-Score" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
                <Zap className="h-4 w-4" /> Curvas ROC comparadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="fpr" type="number" domain={[0, 1]} tick={{ fontSize: 10 }} label={{ value: "FPR", fontSize: 10, position: "insideBottom", offset: -2 }} />
                  <YAxis type="number" domain={[0, 1]} tick={{ fontSize: 10 }} label={{ value: "TPR", fontSize: 10, angle: -90, position: "insideLeft" }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  {metricasModelos.map((m, i) => (
                    <Line
                      key={m.modelo}
                      data={curvaROC(m.auc)}
                      type="monotone"
                      dataKey="tpr"
                      name={`${m.modelo} (AUC ${m.auc})`}
                      stroke={colores[i]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
              <Cpu className="h-4 w-4" /> Perfil multidimensional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart data={dataRadar}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metrica" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[60, 100]} tick={{ fontSize: 9 }} />
                {metricasModelos.map((m, i) => (
                  <Radar key={m.modelo} name={m.modelo} dataKey={m.modelo} stroke={colores[i]} fill={colores[i]} fillOpacity={0.12} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gold">
          <CardHeader><CardTitle className="font-heading text-base text-primary">Conclusion del comite tecnico</CardTitle></CardHeader>
          <CardContent className="text-sm font-body text-foreground space-y-2">
            <p>
              Tras la evaluacion cruzada con validacion estratificada (k=5) sobre 4,820 registros academicos historicos,
              el modelo <strong className="text-gold-dark">{ganador.modelo}</strong> obtuvo el mejor balance entre precision y sensibilidad
              (F1 = <strong>{ganador.f1}%</strong>, AUC = <strong>{ganador.auc}</strong>).
            </p>
            <p>
              Se selecciona como modelo en produccion para la plataforma EduAlert, con reentrenamiento programado al cierre de cada periodo academico
              y monitoreo continuo de drift sobre las variables socioeconomicas.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ComparadorModelos;
