import { useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { barriosCartagena, colorRiesgo } from "@/lib/xaiData";
import { MapPin, Users, AlertTriangle } from "lucide-react";

const MapaCalor = () => {
  useEffect(() => {
    // Fix marker icon paths
  }, []);

  const totalEst = barriosCartagena.reduce((a, b) => a + b.estudiantes, 0);
  const promedioRiesgo = Math.round(
    barriosCartagena.reduce((a, b) => a + b.riesgoPromedio * b.estudiantes, 0) / totalEst
  );
  const barriosCriticos = barriosCartagena.filter(b => b.riesgoPromedio >= 70).length;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-r from-primary via-primary to-[hsl(var(--teal))] text-primary-foreground p-6 shadow-md">
          <div className="absolute inset-y-0 right-0 w-1.5 bg-accent" />
          <div className="text-[10px] font-body uppercase tracking-[0.25em] text-accent mb-2">
            Inteligencia Territorial · Cartagena de Indias
          </div>
          <h1 className="font-heading text-3xl font-bold">Mapa de Calor de Riesgo</h1>
          <p className="text-sm font-body mt-1 text-primary-foreground/80">
            Distribucion geografica de la vulnerabilidad academica por barrio y zona
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <Users className="h-4 w-4 text-teal mb-2" />
              <div className="text-2xl font-heading font-bold text-primary">{totalEst}</div>
              <div className="text-[11px] font-body text-muted-foreground">Estudiantes geolocalizados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <MapPin className="h-4 w-4 text-gold mb-2" />
              <div className="text-2xl font-heading font-bold text-primary">{barriosCartagena.length}</div>
              <div className="text-[11px] font-body text-muted-foreground">Barrios cubiertos</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-danger">
            <CardContent className="p-4">
              <AlertTriangle className="h-4 w-4 text-danger mb-2" />
              <div className="text-2xl font-heading font-bold text-danger">{barriosCriticos}</div>
              <div className="text-[11px] font-body text-muted-foreground">Barrios en zona critica</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-body mb-2">Riesgo promedio</div>
              <div className="text-2xl font-heading font-bold" style={{ color: colorRiesgo(promedioRiesgo) }}>{promedioRiesgo}</div>
              <div className="text-[11px] font-body text-muted-foreground">indice ponderado</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base text-primary">Vista Geoespacial</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[560px] w-full">
                <MapContainer
                  center={[10.41, -75.51]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {barriosCartagena.map((b) => (
                    <CircleMarker
                      key={b.nombre}
                      center={[b.lat, b.lng]}
                      radius={Math.sqrt(b.estudiantes) * 2}
                      pathOptions={{
                        color: colorRiesgo(b.riesgoPromedio),
                        fillColor: colorRiesgo(b.riesgoPromedio),
                        fillOpacity: 0.55,
                        weight: 2,
                      }}
                    >
                      <LeafletTooltip>
                        <strong>{b.nombre}</strong><br />
                        {b.estudiantes} estudiantes · Riesgo {b.riesgoPromedio}
                      </LeafletTooltip>
                      <Popup>
                        <div style={{ fontFamily: "var(--font-body)" }}>
                          <strong>{b.nombre}</strong>
                          <div>Estudiantes: {b.estudiantes}</div>
                          <div>Estrato promedio: {b.estratoPromedio}</div>
                          <div>Riesgo promedio: <strong>{b.riesgoPromedio}</strong></div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base text-primary">Ranking de zonas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
                {[...barriosCartagena].sort((a, b) => b.riesgoPromedio - a.riesgoPromedio).map((b, i) => (
                  <div key={b.nombre} className="flex items-center justify-between p-2 hover:bg-secondary/40 rounded-sm border-l-2" style={{ borderLeftColor: colorRiesgo(b.riesgoPromedio) }}>
                    <div>
                      <div className="text-xs font-body font-semibold text-foreground flex items-center gap-2">
                        <span className="text-muted-foreground tabular-nums">{i + 1}.</span> {b.nombre}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-body">{b.estudiantes} est. · estrato {b.estratoPromedio}</div>
                    </div>
                    <Badge variant="outline" className="font-mono tabular-nums" style={{ borderColor: colorRiesgo(b.riesgoPromedio), color: colorRiesgo(b.riesgoPromedio) }}>
                      {b.riesgoPromedio}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="font-heading text-sm text-primary">Leyenda y metodologia</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-3 text-xs font-body">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: "hsl(var(--success))" }} /> Bajo (&lt;30)</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: "hsl(var(--gold))" }} /> Moderado (30-49)</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: "hsl(var(--warning))" }} /> Alto (50-69)</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: "hsl(var(--danger))" }} /> Critico (≥70)</div>
            <p className="md:col-span-4 text-muted-foreground mt-2">
              El tamaño de cada circulo es proporcional a la cantidad de estudiantes registrados en el barrio. El color refleja el promedio del indice de riesgo ponderado por matricula.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MapaCalor;
