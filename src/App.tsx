import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CargaDatos from "./pages/CargaDatos";
import AnalisisRiesgo from "./pages/AnalisisRiesgo";
import Historial from "./pages/Historial";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";
import ValidacionModelo from "./pages/ValidacionModelo";
import PlanIntervencion from "./pages/PlanIntervencion";
import Alertas from "./pages/Alertas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/carga" element={<CargaDatos />} />
          <Route path="/analisis" element={<AnalisisRiesgo />} />
          <Route path="/validacion" element={<ValidacionModelo />} />
          <Route path="/intervencion" element={<PlanIntervencion />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
