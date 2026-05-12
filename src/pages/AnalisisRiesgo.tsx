import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Eye, ChevronDown, Filter } from "lucide-react";
import { mockStudents, facultades, type Estudiante } from "@/lib/mockData";
import { CondicionEspecialBadge } from "@/components/CondicionEspecialBadge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function RiskBar({ value }: { value: number }) {
  const color = value > 65 ? "bg-danger" : value > 30 ? "bg-warning" : "bg-success";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono">{value}</span>
    </div>
  );
}

function ClasificacionBadge({ clasificacion }: { clasificacion: Estudiante["clasificacion"] }) {
  const variants: Record<string, string> = {
    "Riesgo Critico": "bg-danger/10 text-danger border-danger/20",
    "Riesgo Alto": "bg-danger/5 text-danger/80 border-danger/15",
    "Riesgo Moderado": "bg-warning/10 text-warning border-warning/20",
    "Continuidad Estable": "bg-success/10 text-success border-success/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${variants[clasificacion]}`}>
      {clasificacion}
    </span>
  );
}

const mockHistorial = [
  { periodo: "2023-II", riesgo: 45 },
  { periodo: "2024-I", riesgo: 55 },
  { periodo: "2024-II", riesgo: 62 },
  { periodo: "2025-I", riesgo: 71 },
];

const AnalisisRiesgo = () => {
  const [search, setSearch] = useState("");
  const [facultadFilter, setFacultadFilter] = useState("todas");
  const [riesgoFilter, setRiesgoFilter] = useState("todos");
  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null);
  const [nota, setNota] = useState("");

  const filtered = mockStudents.filter((s) => {
    const matchSearch = search === "" || s.nombre.toLowerCase().includes(search.toLowerCase()) || s.codigo.toLowerCase().includes(search.toLowerCase());
    const matchFacultad = facultadFilter === "todas" || s.facultad === facultadFilter;
    const matchRiesgo = riesgoFilter === "todos" ||
      (riesgoFilter === "critico" && s.indiceRiesgo > 80) ||
      (riesgoFilter === "alto" && s.indiceRiesgo > 65 && s.indiceRiesgo <= 80) ||
      (riesgoFilter === "moderado" && s.indiceRiesgo > 30 && s.indiceRiesgo <= 65) ||
      (riesgoFilter === "estable" && s.indiceRiesgo <= 30);
    return matchSearch && matchFacultad && matchRiesgo;
  });

  const grupos: { key: Estudiante["clasificacion"]; color: string; barra: string }[] = [
    { key: "Riesgo Critico", color: "border-danger/40 bg-danger/5", barra: "bg-danger" },
    { key: "Riesgo Alto", color: "border-danger/30 bg-danger/5", barra: "bg-danger/80" },
    { key: "Riesgo Moderado", color: "border-warning/30 bg-warning/5", barra: "bg-warning" },
    { key: "Continuidad Estable", color: "border-success/30 bg-success/5", barra: "bg-success" },
  ];

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-gradient-to-r from-primary to-[hsl(var(--teal))] text-primary-foreground p-5 shadow-md">
          <h1 className="font-heading text-2xl font-bold">Analisis de Riesgo</h1>
          <p className="text-sm font-body text-primary-foreground/80">
            Resultados del ultimo analisis por estudiante. Despliegue cada categoria para revisarla.
          </p>
        </div>

        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-sm flex items-center gap-2 text-primary">
                  <Filter className="h-4 w-4" /> Filtros de Busqueda
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
                  <Select value={facultadFilter} onValueChange={setFacultadFilter}>
                    <SelectTrigger className="w-48 font-body text-sm">
                      <SelectValue placeholder="Facultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las facultades</SelectItem>
                      {facultades.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={riesgoFilter} onValueChange={setRiesgoFilter}>
                    <SelectTrigger className="w-44 font-body text-sm">
                      <SelectValue placeholder="Nivel de riesgo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los niveles</SelectItem>
                      <SelectItem value="critico">Riesgo Critico</SelectItem>
                      <SelectItem value="alto">Riesgo Alto</SelectItem>
                      <SelectItem value="moderado">Riesgo Moderado</SelectItem>
                      <SelectItem value="estable">Continuidad Estable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {grupos.map((g) => {
          const items = filtered.filter((s) => s.clasificacion === g.key);
          if (items.length === 0) return null;
          const isCritico = g.key === "Riesgo Critico" || g.key === "Riesgo Alto";
          return (
            <Collapsible key={g.key} defaultOpen={isCritico}>
              <Card className={`overflow-hidden ${g.color}`}>
                <CollapsibleTrigger className="w-full group">
                  <CardHeader className="py-3 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block w-1 h-6 rounded ${g.barra}`} />
                      <CardTitle className="font-heading text-sm text-primary">
                        {g.key}
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0 bg-card">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm font-body">
                        <thead>
                          <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                            <th className="p-3">Codigo</th>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Programa / Facultad</th>
                            <th className="p-3">Sem.</th>
                            <th className="p-3">Prom.</th>
                            <th className="p-3">Riesgo</th>
                            <th className="p-3">Factores</th>
                            <th className="p-3">Accion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((s) => (
                            <tr key={s.codigo} className="border-b border-border/50 hover:bg-secondary/40">
                              <td className="p-3 font-mono text-xs">
                                <div className="flex items-center gap-2">
                                  <span>{s.codigo}</span>
                                  <CondicionEspecialBadge condicion={s.condicionEspecial} detalle={s.detalleCondicion} compact />
                                </div>
                              </td>
                              <td className="p-3">{s.nombre}</td>
                              <td className="p-3">
                                <div className="text-xs">{s.programa}</div>
                                <div className="text-[10px] text-muted-foreground">{s.facultad}</div>
                              </td>
                              <td className="p-3 text-center">{s.semestre}</td>
                              <td className="p-3 text-center">{s.promedioAcumulado}</td>
                              <td className="p-3"><RiskBar value={s.indiceRiesgo} /></td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                  {s.factores.map((f, i) => (
                                    <Badge key={i} variant="outline" className="text-[9px] font-normal">{f}</Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(s)} className="h-7 text-xs">
                                  <Eye className="mr-1 h-3 w-3" /> Ver perfil
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

        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground font-body">
              No se encontraron estudiantes con los filtros aplicados.
            </CardContent>
          </Card>
        )}

        <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {selectedStudent && (
              <>
                <SheetHeader>
                  <SheetTitle className="font-heading text-lg">Perfil del Estudiante</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-5">
                  <div className="space-y-2">
                    <h3 className="font-heading text-sm font-semibold">Datos Generales</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs font-body">
                      <div><span className="text-muted-foreground">Codigo:</span> {selectedStudent.codigo}</div>
                      <div><span className="text-muted-foreground">Semestre:</span> {selectedStudent.semestre}</div>
                      <div className="col-span-2"><span className="text-muted-foreground">Nombre:</span> {selectedStudent.nombre}</div>
                      <div><span className="text-muted-foreground">Programa:</span> {selectedStudent.programa}</div>
                      <div><span className="text-muted-foreground">Facultad:</span> {selectedStudent.facultad}</div>
                      <div><span className="text-muted-foreground">Promedio:</span> {selectedStudent.promedioAcumulado}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading text-sm font-semibold">Indice de Riesgo</h3>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-heading font-bold">{selectedStudent.indiceRiesgo}</div>
                      <ClasificacionBadge clasificacion={selectedStudent.clasificacion} />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Factores determinantes:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedStudent.factores.map((f, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedStudent.condicionEspecial !== "ninguna" && (
                    <div className="space-y-2 border border-accent/30 bg-accent/5 rounded-md p-3">
                      <h3 className="font-heading text-sm font-semibold text-accent">Condicion Especial Declarada</h3>
                      <CondicionEspecialBadge
                        condicion={selectedStudent.condicionEspecial}
                        detalle={selectedStudent.detalleCondicion}
                      />
                      {selectedStudent.detalleCondicion && (
                        <p className="text-xs font-body text-foreground/80">{selectedStudent.detalleCondicion}</p>
                      )}
                      <p className="text-[10px] font-body text-muted-foreground">
                        El sistema prioriza adaptaciones del entorno academico para este estudiante.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="font-heading text-sm font-semibold">Historial de Riesgo</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={mockHistorial}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,15%,85%)" />
                        <XAxis dataKey="periodo" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="riesgo" stroke="hsl(213,75%,15%)" strokeWidth={2} dot={{ fill: "hsl(44,52%,54%)", r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading text-sm font-semibold">Notas del Consejero</h3>
                    <textarea
                      className="w-full border border-border rounded-md p-2 text-xs font-body min-h-[80px] bg-background resize-none"
                      placeholder="Registre observaciones sobre este estudiante..."
                      value={nota}
                      onChange={(e) => setNota(e.target.value)}
                    />
                  </div>

                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm">
                    Marcar como "En intervencion activa"
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
};

export default AnalisisRiesgo;
