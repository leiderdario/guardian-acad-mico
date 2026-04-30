import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Brain } from "lucide-react";
import { InstitutionalLogo } from "@/components/InstitutionalLogo";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Error de autenticacion", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Acento decorativo dorado */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, hsl(var(--accent)) 0, transparent 40%), radial-gradient(circle at 80% 90%, hsl(var(--accent)) 0, transparent 45%)",
        }}
      />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 inline-flex">
            <InstitutionalLogo size={88} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-primary-foreground mb-1 tracking-wide">
            Universidad de Cartagena
          </h1>
          <div className="w-12 h-px bg-accent mx-auto my-3" />
          <h2 className="font-heading text-3xl text-accent font-semibold tracking-[0.15em]">SIPAD</h2>
          <p className="text-primary-foreground/70 text-sm font-body mt-3 leading-relaxed">
            Sistema de Prediccion y Analisis<br />de Desercion Estudiantil
          </p>
          <div className="inline-flex items-center gap-1.5 mt-5 px-3 py-1 border border-accent/40 bg-accent/5 rounded-full">
            <Brain className="h-3 w-3 text-accent" />
            <span className="text-[10px] font-body uppercase tracking-[0.2em] text-accent font-medium">
              Plataforma con Inteligencia Artificial
            </span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-lg p-8 shadow-2xl space-y-5 border-t-2 border-accent">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-body text-sm">Correo institucional</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@unicartagena.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-body text-sm">Contrasena</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-heading tracking-wide"
            disabled={loading}
          >
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? "Ingresando..." : "Ingresar al Sistema"}
          </Button>
        </form>

        <p className="text-center text-primary-foreground/50 text-xs mt-6 font-body tracking-wide">
          Universidad de Cartagena · SIPAD · Acceso institucional restringido
        </p>
      </div>
    </div>
  );
};

export default Login;
