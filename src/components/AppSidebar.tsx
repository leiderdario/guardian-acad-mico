import {
  LayoutDashboard,
  Upload,
  AlertTriangle,
  History,
  FileText,
  Settings,
  LogOut,
  GaugeCircle,
  ClipboardList,
  BellRing,
} from "lucide-react";
import { InstitutionalLogo } from "@/components/InstitutionalLogo";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const items = [
  { title: "Panel General", url: "/dashboard", icon: LayoutDashboard },
  { title: "Carga de Datos", url: "/carga", icon: Upload },
  { title: "Analisis de Riesgo", url: "/analisis", icon: AlertTriangle },
  { title: "Validacion del Modelo", url: "/validacion", icon: GaugeCircle },
  { title: "Plan de Intervencion", url: "/intervencion", icon: ClipboardList },
  { title: "Alertas y Notificaciones", url: "/alertas", icon: BellRing },
  { title: "Historial y Seguimiento", url: "/historial", icon: History },
  { title: "Reportes", url: "/reportes", icon: FileText },
  { title: "Configuracion", url: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar">
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border/60">
          <InstitutionalLogo size={collapsed ? 28 : 36} />
          {!collapsed && (
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-heading text-base font-bold text-sidebar-foreground tracking-wide">
                EduAlert
              </span>
              <span className="text-[9px] text-sidebar-primary/80 tracking-[0.2em] uppercase font-medium">
                Prediccion con IA
              </span>
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-sidebar border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
              <LogOut className="mr-2 h-4 w-4 shrink-0" />
              {!collapsed && <span>Cerrar Sesion</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
