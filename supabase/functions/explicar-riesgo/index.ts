// Edge Function: explicar-riesgo
// Genera una explicacion narrativa rigurosa del riesgo de desercion de un estudiante
// a partir de los factores SHAP-style calculados por el modelo.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Factor {
  nombre: string;
  contribucion: number;
  valor: string;
  categoria: string;
}

interface Payload {
  estudiante: {
    nombre: string;
    codigo: string;
    programa: string;
    facultad: string;
    semestre: number;
    promedioAcumulado: number;
    indiceRiesgo: number;
    clasificacion: string;
  };
  factores: Factor[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY no configurado");

    const { estudiante, factores } = (await req.json()) as Payload;
    if (!estudiante || !Array.isArray(factores)) {
      return new Response(JSON.stringify({ error: "Payload invalido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const positivos = factores.filter((f) => f.contribucion > 0).slice(0, 6);
    const negativos = factores.filter((f) => f.contribucion < 0).slice(0, 4);

    const tablaPos = positivos
      .map((f) => `- ${f.nombre} (${f.categoria}) = ${f.valor} | aporta +${f.contribucion.toFixed(1)} pts al riesgo`)
      .join("\n");
    const tablaNeg = negativos
      .map((f) => `- ${f.nombre} (${f.categoria}) = ${f.valor} | reduce ${f.contribucion.toFixed(1)} pts el riesgo`)
      .join("\n");

    const systemPrompt = `Eres un analista institucional de la Universidad de Cartagena especializado en analitica academica y modelos predictivos de desercion estudiantil. Redactas explicaciones rigurosas y eticamente responsables para consejeros academicos, basadas en valores SHAP del modelo XGBoost del sistema SIPAD.

Reglas estrictas:
- Espanol formal, institucional, sin emojis ni signos de exclamacion.
- NO inventes cifras ni factores que no esten en los datos provistos.
- Cita siempre el aporte numerico en puntos (ej: "+12 pts").
- Distingue factores academicos, socioeconomicos, psicosociales y demograficos.
- Cierra con recomendaciones accionables priorizadas (3 a 4 acciones concretas).
- Estructura la respuesta con encabezados markdown (##) cortos.
- Maximo 380 palabras.`;

    const userPrompt = `Genera la explicacion XAI para este caso.

ESTUDIANTE
Nombre: ${estudiante.nombre}
Codigo: ${estudiante.codigo}
Programa: ${estudiante.programa} (${estudiante.facultad})
Semestre: ${estudiante.semestre}
Promedio acumulado: ${estudiante.promedioAcumulado}
Indice de riesgo: ${estudiante.indiceRiesgo}/100
Clasificacion: ${estudiante.clasificacion}

FACTORES DE RIESGO (aumentan el riesgo, ordenados por impacto):
${tablaPos || "Ninguno significativo."}

FACTORES PROTECTORES (reducen el riesgo):
${tablaNeg || "Ninguno significativo."}

Estructura requerida:
## Diagnostico del modelo
## Factores criticos
## Factores protectores
## Recomendaciones priorizadas`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de solicitudes alcanzado. Intenta de nuevo en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Creditos de IA agotados. Agrega fondos en Lovable AI." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error en el gateway de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("explicar-riesgo error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
