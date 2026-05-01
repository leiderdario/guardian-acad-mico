import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { InstitutionalLogo } from "@/components/InstitutionalLogo";
import { Brain } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center border-b border-border bg-card px-4 md:px-6 shrink-0 shadow-[0_1px_0_0_hsl(var(--accent)/0.15)]">
            <SidebarTrigger className="mr-3 md:mr-4" />
            <div className="flex items-center gap-3 min-w-0">
              <InstitutionalLogo size={36} />
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-heading text-sm md:text-[15px] font-bold text-primary tracking-wide truncate">
                  EduAlert · Universidad de Cartagena
                </span>
                <span className="text-[10px] font-body text-muted-foreground tracking-[0.2em] uppercase">
                  Prediccion y Analisis de Desercion
                </span>
              </div>
            </div>
            <div className="ml-auto hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 border border-accent/40 bg-accent/5 rounded-full">
              <Brain className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-body uppercase tracking-widest text-accent font-medium">
                Inteligencia Artificial
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
