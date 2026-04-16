import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Shield } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border bg-card px-4 shrink-0">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-accent" />
              <div className="flex flex-col leading-tight">
                <span className="font-heading text-sm font-bold text-primary tracking-wide">
                  Universidad de Cartagena
                </span>
                <span className="text-[10px] font-body text-muted-foreground tracking-widest uppercase">
                  SIPAD
                </span>
              </div>
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
