import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Minus, GitCompare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const cargues = [
  { id: 1, fecha: "2025-04-15 09:32", estudiantes: 1240, riesgoPromedio: 35.2 },
  { id: 2, fecha: "2024-10-20 14:15", estudiantes: 1180, riesgoPromedio: 37.8 },
  { id: 3, fecha: "2024-04-12 10:45", estudiantes: 1150, riesgoPromedio: 44.1 },
  { id: 4, fecha: "2023-10-18 11:20", estudiantes: 1100, riesgoPromedio: 39.5 },
  { id: 5, fecha: "2023-04-08 08:50", estudiantes: 1050, riesgoPromedio: 42.3 },
];

const comparativa = [
  { codigo: "T60010001", nombre: "Maria Fernanda Lopez", antes: 72, despues: 58, cambio: "mejora" },
  { codigo: "T60010002", nombre: "Carlos Andres Martinez", antes: 45, despues: 68, cambio: "empeoro" },
  { codigo: "T60010003", nombre: "Ana Patricia Gomez", antes: 33, despues: 31, cambio: "estable" },
  { codigo: "T60010004", nombre: "Juan David Rodriguez", antes: 82, despues: 55, cambio: "mejora" },
  { codigo: "T60010005", nombre: "Valentina Morales", antes: 28, despues: 45, cambio: "empeoro" },
  { codigo: "T60010006", nombre: "Sebastian Diaz", antes: 61, despues: 38, cambio: "mejora" },
  { codigo: "T60010007", nombre: "Laura Camila Jimenez", antes: 55, despues: 57, cambio: "estable" },
  { codigo: "T60010008", nombre: "Diego Alejandro Ramirez", antes: 40, despues: 22, cambio: "mejora" },
];

const evolucionCohorte = [
  { periodo: "2023-I", cohorte2021: 38, cohorte2022: 42, cohorte2023: 50 },
  { periodo: "2023-II", cohorte2021: 35, cohorte2022: 39, cohorte2023: 46 },
  { periodo: "2024-I", cohorte2021: 30, cohorte2022: 41, cohorte2023: 43 },
  { periodo: "2024-II", cohorte2021: 28, cohorte2022: 36, cohorte2023: 40 },
  { periodo: "2025-I", cohorte2021: 25, cohorte2022: 33, cohorte2023: 37 },
];

const Historial = () => {
  const [selected, setSelected] = useState<number[]>([1, 2]);

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const mejoras = comparativa.filter((c) => c.cambio === "mejora").length;
  const empeorados = comparativa.filter((c) => c.cambio === "empeoro").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Historial y Seguimiento</h1>
          <p className="text-sm text-muted-foreground font-body">Comparativa entre cargues historicos</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base">Cargues Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3 font-body">Seleccione dos cargues para comparar</p>
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-3">Sel.</th>
                  <th className="pb-2 pr-3">Fecha</th>
                  <th className="pb-2 pr-3">Estudiantes</th>
                  <th className="pb-2">Riesgo Promedio</th>
                </tr>
              </thead>
              <tbody>
                {cargues.map((c) => (
                  <tr key={c.id} className={`border-b border-border/50 cursor-pointer hover:bg-muted/20 ${selected.includes(c.id) ? "bg-accent/10" : ""}`}
                    onClick={() => toggleSelect(c.id)}>
                    <td className="py-2 pr-3">
                      <div className={`w-4 h-4 rounded border ${selected.includes(c.id) ? "bg-primary border-primary" : "border-border"}`} />
                    </td>
                    <td className="py-2 pr-3">{c.fecha}</td>
                    <td className="py-2 pr-3">{c.estudiantes}</td>
                    <td className="py-2">{c.riesgoPromedio}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {selected.length === 2 && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <ArrowDown className="h-5 w-5 text-success mx-auto mb-1" />
                  <div className="text-lg font-heading font-bold">{mejoras}</div>
                  <div className="text-[11px] text-muted-foreground">Mejoraron su riesgo</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Minus className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <div className="text-lg font-heading font-bold">{comparativa.length - mejoras - empeorados}</div>
                  <div className="text-[11px] text-muted-foreground">Se mantuvieron</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <ArrowUp className="h-5 w-5 text-danger mx-auto mb-1" />
                  <div className="text-lg font-heading font-bold">{empeorados}</div>
                  <div className="text-[11px] text-muted-foreground">Empeoraron su riesgo</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base flex items-center gap-2">
                  <GitCompare className="h-4 w-4" /> Tabla Comparativa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground text-left">
                      <th className="pb-2 pr-3">Codigo</th>
                      <th className="pb-2 pr-3">Nombre</th>
                      <th className="pb-2 pr-3">Riesgo Anterior</th>
                      <th className="pb-2 pr-3">Riesgo Actual</th>
                      <th className="pb-2">Cambio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparativa.map((c) => (
                      <tr key={c.codigo} className="border-b border-border/50">
                        <td className="py-2 pr-3 font-mono text-xs">{c.codigo}</td>
                        <td className="py-2 pr-3">{c.nombre}</td>
                        <td className="py-2 pr-3">{c.antes}</td>
                        <td className="py-2 pr-3">{c.despues}</td>
                        <td className="py-2">
                          {c.cambio === "mejora" && <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Mejora</Badge>}
                          {c.cambio === "empeoro" && <Badge className="bg-danger/10 text-danger border-danger/20 text-[10px]">Empeoro</Badge>}
                          {c.cambio === "estable" && <Badge variant="outline" className="text-[10px]">Estable</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base">Evolucion por Cohorte</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={evolucionCohorte}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,15%,85%)" />
                <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="cohorte2021" name="Cohorte 2021" stroke="hsl(213,75%,15%)" strokeWidth={2} />
                <Line type="monotone" dataKey="cohorte2022" name="Cohorte 2022" stroke="hsl(44,52%,54%)" strokeWidth={2} />
                <Line type="monotone" dataKey="cohorte2023" name="Cohorte 2023" stroke="hsl(0,72%,51%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Historial;
