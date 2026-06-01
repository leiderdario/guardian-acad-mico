import { AppLayout } from "@/components/AppLayout";
import {
  Users,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  Brain,
  Accessibility,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import { mockStudents, riesgoPorFacultad, evolucionHistorica } from "@/lib/mockData";
import { CondicionEspecialBadge } from "@/components/CondicionEspecialBadge";
import { FacultadCodigoChip } from "@/components/FacultadCodigoChip";

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
  const navigate = useNavigate();
  const total = mockStudents.length;
  const alto = mockStudents.filter((s) => s.indiceRiesgo > 65).length;
  const medio = mockStudents.filter((s) => s.indiceRiesgo > 30 && s.indiceRiesgo <= 65).length;
  const estable = mockStudents.filter((s) => s.indiceRiesgo <= 30).length;
  const top10 = mockStudents.slice(0, 10);
  const condicionEspecial = mockStudents.filter((s) => s.condicionEspecial !== "ninguna").length;

  const kpis = [
    { label: "Total Estudiantes", value: total, icon: Users, accent: false },
    { label: "Riesgo Alto / Critico", value: `${alto} (${((alto / total) * 100).toFixed(0)}%)`, icon: AlertTriangle, accent: true },
    { label: "Riesgo Moderado", value: `${medio} (${((medio / total) * 100).toFixed(0)}%)`, icon: TrendingDown, accent: false },
    { label: "Continuidad Estable", value: `${estable} (${((estable / total) * 100).toFixed(0)}%)`, icon: CheckCircle, accent: false },
    { label: "Condicion Especial", value: `${condicionEspecial} (${((condicionEspecial / total) * 100).toFixed(0)}%)`, icon: Accessibility, accent: false },
    { label: "Precision del Modelo", value: "87.3%", icon: Brain, accent: false },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-r from-primary via-primary to-[hsl(var(--teal))] text-primary-foreground p-6 shadow-md">
          <div className="absolute inset-y-0 right-0 w-1.5 bg-accent" />
          <div className="text-[10px] font-body uppercase tracking-[0.25em] text-accent mb-2">
            Universidad de Cartagena · EduAlert
          </div>
          <h1 className="font-heading text-3xl font-bold">Panel General</h1>
          <p className="text-sm font-body mt-1 text-primary-foreground/80">
            Resumen ejecutivo del estado institucional
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((kpi) => (
            <Card
              key={kpi.label}
              className={`relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                kpi.accent ? "border-danger/40 bg-gradient-to-br from-danger/10 to-transparent" : "bg-gradient-to-br from-card to-secondary/40"
              }`}
            >
              <span
                className={`absolute top-0 left-0 right-0 h-1 ${
                  kpi.accent ? "bg-gradient-to-r from-danger to-warning" : "bg-gradient-to-r from-accent to-[hsl(var(--teal))]"
                }`}
              />
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className={`h-4 w-4 ${kpi.accent ? "text-danger" : "text-[hsl(var(--teal))]"}`} />
                </div>
                <div className="text-lg font-heading font-bold text-primary">{kpi.value}</div>
                <div className="text-[11px] text-muted-foreground font-body">{kpi.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-base text-primary">Estudiantes con Mayor Riesgo de Desercion</CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground text-xs">
                        <th className="pb-2 pr-4">Facultad / Codigo</th>
                        <th className="pb-2 pr-4">Nombre</th>
                        <th className="pb-2 pr-4">Programa</th>
                        <th className="pb-2 pr-4">Sem.</th>
                        <th className="pb-2 pr-4">Riesgo</th>
                        <th className="pb-2">Clasificacion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top10.map((s) => (
                        <tr key={s.codigo} className="border-b border-border/50 hover:bg-secondary/40">
                          <td className="py-2 pr-4">
                            <div className="flex items-center gap-2">
                              <FacultadCodigoChip facultad={s.facultad} codigo={s.codigo} />
                              <CondicionEspecialBadge condicion={s.condicionEspecial} detalle={s.detalleCondicion} compact />
                            </div>
                          </td>
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
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-base text-primary">Visualizaciones Analiticas</CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-heading text-sm font-semibold mb-2 text-primary">Distribucion de Riesgo por Facultad</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={riesgoPorFacultad} margin={{ bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="facultad" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="alto" name="Riesgo Alto" fill="hsl(var(--danger))" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="medio" name="Riesgo Medio" fill="hsl(var(--warning))" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="bajo" name="Estable" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold mb-2 text-primary">Evolucion del Riesgo Promedio Institucional</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={evolucionHistorica}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="riesgoPromedio"
                          name="Riesgo Promedio"
                          stroke="hsl(var(--teal))"
                          strokeWidth={2.5}
                          dot={{ fill: "hsl(var(--accent))", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
