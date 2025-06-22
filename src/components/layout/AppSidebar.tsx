import {
  Home,
  Target,
  CreditCard,
  Trophy,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  {
    title: "Início",
    url: "/",
    icon: Home,
  },
  {
    title: "Meus Bingos",
    url: "/bingos",
    icon: Target,
  },
  {
    title: "Cartelas",
    url: "/cartelas",
    icon: CreditCard,
  },
  {
    title: "Conferência",
    url: "/conferencia",
    icon: Trophy,
  },
  {
    title: "Usuários",
    url: "/usuarios",
    icon: Users,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Se for proprietario, só mostra Conferência
  const filteredMenuItems =
    user?.role === "proprietario"
      ? menuItems.filter((item) => item.title === "Conferência")
      : menuItems;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="text-2xl">🎯</div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">
              Sistema de Bingo
            </h2>
            <p className="text-xs text-sidebar-foreground/70">
              Gerenciamento Profissional
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Só mostra ações rápidas se não for proprietario */}
        {user?.role !== "proprietario" && (
          <SidebarGroup>
            <SidebarGroupLabel>Ações Rápidas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => navigate("/bingos/novo")}
                      className="w-full flex items-center gap-2"
                    >
                      <Settings size={16} />
                      <span>Novo Bingo</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  signOut();
                  navigate("/auth");
                }}
              >
                <LogOut size={16} />
                <span>Sair</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
