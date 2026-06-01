import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import { InstitutionalLogo } from "@/components/InstitutionalLogo";

const slides = [
  {
    tipo: "portada",
    titulo: "EduAlert",
    subtitulo: "Sistema de Prediccion y Analisis de Desercion Estudiantil",
    autor: "Universidad de Cartagena · Facultad de Ingenieria",
    pie: "Proyecto de Grado · Ingenieria de Sistemas",
  },
  {
    tipo: "problema",
    titulo: "El problema",
    bullets: [
      "12.4% de tasa de desercion anual en la Universidad de Cartagena",
      "$8,400 millones COP perdidos cada año en formacion incompleta",
      "La deteccion ocurre demasiado tarde: cuando el estudiante ya se retiro",
      "Las consejerias trabajan reactivamente, sin datos predictivos",
    ],
  },
  {
    tipo: "solucion",
    titulo: "La solucion",
    bullets: [
      "Inteligencia Artificial con 89.1% de precision (XGBoost)",
      "Explicabilidad SHAP: el modelo no es una caja negra",
      "Simulador What-If para evaluar intervenciones antes de aplicarlas",
      "Gemelo digital: proyeccion del estudiante a 4 semestres",
    ],
  },
  {
    tipo: "metricas",
    titulo: "Resultados del modelo",
    grid: [
      { v: "89.1%", l: "Accuracy" },
      { v: "0.93", l: "AUC" },
      { v: "86.8%", l: "F1-Score" },
      { v: "2.3s", l: "Inferencia" },
    ],
  },
  {
    tipo: "impacto",
    titulo: "Impacto institucional proyectado",
    bullets: [
      "Reduccion estimada del 38% en la tasa de desercion al cabo de 2 años",
      "$3,200 millones COP de ahorro anual recuperando estudiantes en riesgo",
      "Intervenciones automatizadas para 100% de los casos criticos",
      "Decision basada en evidencia para Vicerrectoria Academica",
    ],
  },
  {
    tipo: "tecnologia",
    titulo: "Arquitectura tecnologica",
    bullets: [
      "Frontend: React + TypeScript + TailwindCSS",
      "Backend: Edge Functions + Postgres + RLS",
      "Modelo: XGBoost + SHAP + scikit-learn",
      "IA Conversacional: Lovable AI Gateway (Gemini / GPT-5)",
      "Geolocalizacion: Leaflet + OpenStreetMap",
    ],
  },
  {
    tipo: "cierre",
    titulo: "Gracias",
    subtitulo: "Preguntas y comentarios del jurado",
    autor: "Universidad de Cartagena · 2026",
  },
];

const Keynote = () => {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") setIdx((i) => Math.min(slides.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "Escape") navigate("/dashboard");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const s = slides[idx];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(var(--sidebar-background))] text-primary-foreground overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <Button size="sm" variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10" onClick={() => navigate("/dashboard")}>
          <X className="h-4 w-4 mr-1" /> Salir
        </Button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <Button size="sm" variant="ghost" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-accent" : "w-1.5 bg-white/30"}`} />
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))} disabled={idx === slides.length - 1} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="h-full flex items-center justify-center p-12">
        {s.tipo === "portada" || s.tipo === "cierre" ? (
          <div className="text-center max-w-4xl">
            <InstitutionalLogo size={96} />
            <h1 className="font-heading text-7xl md:text-8xl font-bold mt-8 text-accent">{s.titulo}</h1>
            <p className="font-body text-2xl md:text-3xl mt-6 text-primary-foreground/90">{s.subtitulo}</p>
            <p className="font-body text-base mt-8 text-primary-foreground/60 tracking-[0.2em] uppercase">{s.autor}</p>
            {s.pie && <p className="font-body text-sm mt-4 text-accent/80 tracking-[0.3em] uppercase">{s.pie}</p>}
          </div>
        ) : s.grid ? (
          <div className="max-w-5xl w-full">
            <div className="text-[10px] uppercase tracking-[0.35em] text-accent font-body mb-2">{`0${idx + 1} / 0${slides.length}`}</div>
            <h2 className="font-heading text-5xl md:text-6xl font-bold mb-10">{s.titulo}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {s.grid.map((g) => (
                <div key={g.l} className="border-l-2 border-accent pl-5 py-4">
                  <div className="text-6xl md:text-7xl font-heading font-bold text-accent">{g.v}</div>
                  <div className="font-body text-sm mt-2 text-primary-foreground/70 uppercase tracking-wider">{g.l}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl w-full">
            <div className="text-[10px] uppercase tracking-[0.35em] text-accent font-body mb-2">{`0${idx + 1} / 0${slides.length}`}</div>
            <h2 className="font-heading text-5xl md:text-6xl font-bold mb-10">{s.titulo}</h2>
            <ul className="space-y-5">
              {s.bullets?.map((b, i) => (
                <li key={i} className="flex items-start gap-4 font-body text-xl md:text-2xl text-primary-foreground/90">
                  <Sparkles className="h-5 w-5 mt-2 text-accent shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Keynote;
