import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Copy, RotateCcw, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Estudiante } from "@/lib/mockData";
import type { FactorXAI } from "@/lib/xaiData";

interface Props {
  estudiante: Estudiante;
  factores: FactorXAI[];
}

const renderMarkdown = (texto: string) => {
  // Render muy ligero: encabezados ##, listas -, **negrita**
  const lineas = texto.split("\n");
  return lineas.map((l, i) => {
    if (l.startsWith("## ")) {
      return (
        <h3 key={i} className="font-heading text-sm font-bold text-primary mt-4 mb-1 uppercase tracking-wider">
          {l.replace("## ", "")}
        </h3>
      );
    }
    if (l.startsWith("# ")) {
      return <h2 key={i} className="font-heading text-base font-bold text-primary mt-4 mb-2">{l.replace("# ", "")}</h2>;
    }
    if (l.startsWith("- ")) {
      const contenido = l.replace("- ", "");
      return (
        <li key={i} className="text-sm font-body text-foreground ml-4 list-disc marker:text-gold">
          {renderBold(contenido)}
        </li>
      );
    }
    if (l.trim() === "") return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-sm font-body text-foreground leading-relaxed">
        {renderBold(l)}
      </p>
    );
  });
};

const renderBold = (texto: string) => {
  const partes = texto.split(/\*\*(.+?)\*\*/g);
  return partes.map((p, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-primary">{p}</strong> : <span key={i}>{p}</span>
  );
};

export function ExplicacionXAI({ estudiante, factores }: Props) {
  const { toast } = useToast();
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [generado, setGenerado] = useState(false);

  const generar = async () => {
    setCargando(true);
    setTexto("");
    setGenerado(false);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/explicar-riesgo`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          estudiante: {
            nombre: estudiante.nombre,
            codigo: estudiante.codigo,
            programa: estudiante.programa,
            facultad: estudiante.facultad,
            semestre: estudiante.semestre,
            promedioAcumulado: estudiante.promedioAcumulado,
            indiceRiesgo: estudiante.indiceRiesgo,
            clasificacion: estudiante.clasificacion,
          },
          factores,
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "Demasiadas solicitudes", description: "Intenta de nuevo en unos segundos.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "Creditos agotados", description: "Agrega fondos a Lovable AI.", variant: "destructive" });
        } else {
          toast({ title: "Error", description: "No se pudo generar la explicacion.", variant: "destructive" });
        }
        setCargando(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acumulado = "";
      let done = false;

      while (!done) {
        const r = await reader.read();
        if (r.done) break;
        buffer += decoder.decode(r.value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              acumulado += delta;
              setTexto(acumulado);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      setGenerado(true);
    } catch (e) {
      console.error(e);
      toast({ title: "Error de conexion", variant: "destructive" });
    } finally {
      setCargando(false);
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(texto);
    toast({ title: "Copiado", description: "Explicacion copiada al portapapeles." });
  };

  return (
    <Card className="border-l-4 border-l-gold">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" /> Explicacion narrativa generada por IA
            </CardTitle>
            <p className="text-xs font-body text-muted-foreground mt-1">
              Sintesis del modelo XGBoost interpretada con Lovable AI. Diagnostico institucional, factores criticos y recomendaciones priorizadas para el consejero.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-body">Gemini 2.5 Flash</Badge>
            <Badge variant="outline" className="text-[10px] font-body">SHAP grounded</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!texto && !cargando && (
          <div className="text-center py-10 border border-dashed border-border rounded-md bg-secondary/20">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground/60 mb-3" />
            <p className="text-sm font-body text-muted-foreground mb-4">
              Genera un informe interpretativo del modelo para este estudiante.
            </p>
            <Button onClick={generar} className="bg-primary hover:bg-primary/90">
              <Sparkles className="h-4 w-4 mr-2" /> Generar explicacion XAI
            </Button>
          </div>
        )}

        {(texto || cargando) && (
          <div className="space-y-3">
            <div className="prose-sm max-w-none p-4 bg-secondary/30 rounded-md border border-border min-h-[200px]">
              {texto ? (
                renderMarkdown(texto)
              ) : (
                <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Analizando factores y redactando informe...
                </div>
              )}
              {cargando && texto && (
                <span className="inline-block w-2 h-4 bg-gold animate-pulse ml-1 align-middle" />
              )}
            </div>
            {generado && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={copiar}>
                  <Copy className="h-3 w-3 mr-2" /> Copiar
                </Button>
                <Button variant="outline" size="sm" onClick={generar} disabled={cargando}>
                  <RotateCcw className="h-3 w-3 mr-2" /> Regenerar
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
