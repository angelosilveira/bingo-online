import { useNavigate, useParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Trophy, Users, ArrowLeft, Info } from "lucide-react";

interface BingoGestaoSidebarProps {
  bingoId: string;
}

export default function BingoGestaoSidebar({
  bingoId,
}: BingoGestaoSidebarProps) {
  const navigate = useNavigate();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="text-2xl">🎯</div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">
              Gestão do Bingo
            </h2>
            <p className="text-xs text-sidebar-foreground/70">Administração</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={() => navigate("/bingos")}
                className="w-full flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                <span>Voltar para Bingos</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full flex items-center gap-2">
                <Info size={16} />
                <span>Informações Gerais</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full flex items-center gap-2">
                <Trophy size={16} />
                <span>Tabela de Conferência</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full flex items-center gap-2">
                <Users size={16} />
                <span>Compradores</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
