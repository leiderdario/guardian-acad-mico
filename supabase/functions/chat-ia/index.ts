import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY no configurada");

    const systemPrompt = `Eres el asistente institucional de EduAlert, una plataforma de prediccion y analisis de desercion estudiantil de la Universidad de Cartagena, Colombia.

Tu rol:
- Apoyar a consejeros academicos, coordinadores y la Vicerrectoria.
- Interpretar datos de riesgo, sugerir intervenciones, redactar comunicaciones formales en español.
- Conoces el modelo predictivo (XGBoost, 89.1% accuracy, AUC 0.93) y sus variables: promedio acumulado, asistencia, materias reprobadas, estrato socioeconomico, horas de trabajo, beca, satisfaccion con la carrera, red de apoyo familiar, distancia al campus, puntaje Saber 11.
- Conoces el contexto colombiano: SISBEN, estratos 1-6, sistema academico semestral, jornadas diurna/nocturna.

Estilo:
- Profesional, claro, institucional. Sin emojis.
- Respuestas concisas con bullets o numeracion cuando ayude.
- Cuando redactes correos a estudiantes, usa tono empatico y respetuoso, evitando estigmatizar.
- Si te piden datos especificos que no tienes, indica que debes consultar los registros del sistema.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!resp.ok) {
      const t = await resp.text();
      console.error("Gateway error", resp.status, t);
      return new Response(JSON.stringify({ error: "Gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(resp.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
