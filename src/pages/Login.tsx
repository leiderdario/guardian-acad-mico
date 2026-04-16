import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogIn } from "lucide-react";
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
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-primary-foreground mb-1">
            Universidad de Cartagena
          </h1>
          <div className="w-16 h-0.5 bg-accent mx-auto my-3" />
          <h2 className="font-heading text-xl text-accent font-semibold">SIPAD</h2>
          <p className="text-primary-foreground/70 text-sm font-body mt-2 leading-relaxed">
            Sistema de Prediccion y Analisis de Desercion Estudiantil
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-lg p-8 shadow-xl space-y-5">
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
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? "Ingresando..." : "Ingresar al Sistema"}
          </Button>
        </form>

        <p className="text-center text-primary-foreground/50 text-xs mt-6 font-body">
          Universidad de Cartagena — Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default Login;
