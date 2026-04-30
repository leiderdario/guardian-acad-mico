import { AppLayout } from "@/components/AppLayout";
import {
  Users,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  Calendar,
  Brain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import { mockStudents, riesgoPorFacultad, evolucionHistorica } from "@/lib/mockData";

function RiskBar({ value }: { value: number }) {
  const color = value > 65 ? "bg-danger" : value > 30 ? "bg-warning" : "bg-success";
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-body tabular-nums">{value}</span>
    </div>
  );
}

const Dashboard = () => {
  const total = mockStudents.length;
  const alto = mockStudents.filter((s) => s.indiceRiesgo > 65).length;
  const medio = mockStudents.filter((s) => s.indiceRiesgo > 30 && s.indiceRiesgo <= 65).length;
  const estable = mockStudents.filter((s) => s.indiceRiesgo <= 30).length;
  const top10 = mockStudents.slice(0, 10);

  const kpis = [
    { label: "Total Estudiantes", value: total, icon: Users, accent: false },
    { label: "Riesgo Alto / Critico", value: `${alto} (${((alto / total) * 100).toFixed(0)}%)`, icon: AlertTriangle, accent: true },
    { label: "Riesgo Moderado", value: `${medio} (${((medio / total) * 100).toFixed(0)}%)`, icon: TrendingDown, accent: false },
    { label: "Continuidad Estable", value: `${estable} (${((estable / total) * 100).toFixed(0)}%)`, icon: CheckCircle, accent: false },
    { label: "Ultimo Cargue", value: "15/04/2025", icon: Calendar, accent: false },
    { label: "Precision del Modelo", value: "87.3%", icon: Brain, accent: false },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-border">
          <div>
            <div className="text-[10px] font-body uppercase tracking-[0.25em] text-accent mb-1">
              Universidad de Cartagena · SIPAD
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Panel General</h1>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Resumen ejecutivo del estado institucional
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent/40 bg-accent/5 rounded-md">
            <Brain className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] font-body uppercase tracking-wider text-accent font-medium">
              Analisis predictivo con Inteligencia Artificial
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((kpi) => (
            <Card
              key={kpi.label}
              className={`relative overflow-hidden transition-shadow hover:shadow-md ${
                kpi.accent ? "border-danger/30 bg-danger/5" : ""
              }`}
            >
              <span
                className={`absolute top-0 left-0 right-0 h-0.5 ${
                  kpi.accent ? "bg-danger" : "bg-accent"
                }`}
              />
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className={`h-4 w-4 ${kpi.accent ? "text-danger" : "text-accent"}`} />
                </div>
                <div className="text-lg font-heading font-bold">{kpi.value}</div>
                <div className="text-[11px] text-muted-foreground font-body">{kpi.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">Estudiantes con Mayor Riesgo de Desercion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-xs">
                    <th className="pb-2 pr-4">Codigo</th>
                    <th className="pb-2 pr-4">Nombre</th>
                    <th className="pb-2 pr-4">Programa</th>
                    <th className="pb-2 pr-4">Sem.</th>
                    <th className="pb-2 pr-4">Riesgo</th>
                    <th className="pb-2">Clasificacion</th>
                  </tr>
                </thead>
                <tbody>
                  {top10.map((s) => (
                    <tr key={s.codigo} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 pr-4 font-mono text-xs">{s.codigo}</td>
                      <td className="py-2 pr-4">{s.nombre}</td>
                      <td className="py-2 pr-4 text-xs text-muted-foreground">{s.programa}</td>
                      <td className="py-2 pr-4 text-center">{s.semestre}</td>
                      <td className="py-2 pr-4"><RiskBar value={s.indiceRiesgo} /></td>
                      <td className="py-2">
                        <Badge variant={s.clasificacion === "Riesgo Critico" ? "destructive" : "secondary"} className="text-[10px]">
                          {s.clasificacion}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base">Distribucion de Riesgo por Facultad</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={riesgoPorFacultad} margin={{ bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,15%,85%)" />
                  <XAxis dataKey="facultad" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="alto" name="Riesgo Alto" fill="hsl(0,72%,51%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="medio" name="Riesgo Medio" fill="hsl(38,92%,50%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="bajo" name="Estable" fill="hsl(142,71%,35%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base">Evolucion del Riesgo Promedio Institucional</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={evolucionHistorica}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,15%,85%)" />
                  <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="riesgoPromedio"
                    name="Riesgo Promedio"
                    stroke="hsl(213,75%,15%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(44,52%,54%)", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
