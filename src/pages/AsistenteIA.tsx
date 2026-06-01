import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SUGERENCIAS = [
  "¿Cuales son los 3 factores que mas influyen en la desercion en mi facultad?",
  "Redactame un correo para un estudiante de riesgo critico de Ingenieria",
  "Resume el estado institucional para el comite academico",
  "¿Que estrategias funcionan mejor para estudiantes de estrato 1?",
];

const AsistenteIA = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Soy el asistente institucional de EduAlert. Puedo ayudarte a interpretar los datos de riesgo, redactar comunicaciones, sugerir intervenciones y resumir reportes. ¿En que necesitas apoyo?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content !== messages[messages.length - 1]?.content) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
      });

      if (resp.status === 429) { toast.error("Limite de uso alcanzado. Intenta en unos segundos."); setLoading(false); return; }
      if (resp.status === 402) { toast.error("Creditos de IA agotados. Recarga en Workspace."); setLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("Error de gateway");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("No se pudo contactar al asistente IA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1100px] mx-auto">
        <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-r from-primary via-primary to-[hsl(var(--teal))] text-primary-foreground p-6">
          <div className="absolute inset-y-0 right-0 w-1.5 bg-accent" />
          <div className="text-[10px] font-body uppercase tracking-[0.25em] text-accent mb-2">Inteligencia Conversacional</div>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-accent" /> Asistente IA Institucional
          </h1>
          <p className="text-sm font-body mt-1 text-primary-foreground/80">
            Apoyo conversacional para consejeros y coordinadores
          </p>
        </div>

        <Card className="h-[640px] flex flex-col">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="font-heading text-base text-primary flex items-center gap-2">
              <Bot className="h-4 w-4" /> Conversacion
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-lg text-sm font-body whitespace-pre-wrap leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground border border-border"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 rounded-lg bg-secondary border border-border flex items-center gap-2 text-xs font-body text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Pensando...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </CardContent>
          <div className="border-t p-3 space-y-2">
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5">
                {SUGERENCIAS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] font-body px-2.5 py-1 rounded-full border border-border bg-secondary/40 hover:bg-secondary text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Escribe tu pregunta o instruccion..."
                className="resize-none font-body"
                rows={2}
                disabled={loading}
              />
              <Button onClick={() => send()} disabled={loading || !input.trim()} className="bg-primary hover:bg-primary/90 self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AsistenteIA;
