import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
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
              <Link to="/bingos" className="w-full flex items-center gap-2">
                <ArrowLeft size={16} />
                <span>Voltar para Bingos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={
                location.pathname === `/bingo${bingoId}` ||
                location.pathname === `/bingos/gestao/${bingoId}`
              }
            >
              <Link
                to={`/bingo/${bingoId}`}
                className="w-full flex items-center gap-2"
              >
                <Info size={16} />
                <span>Informações Gerais</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === `/bingo${bingoId}/conferencia`}
            >
              <Link
                to={`/bingo/${bingoId}/conferencia`}
                className="w-full flex items-center gap-2"
              >
                <Trophy size={16} />
                <span>Tabela de Conferência</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === `/bingo/${bingoId}/compradores`}
            >
              <Link
                to={`/bingo/${bingoId}/compradores`}
                className="w-full flex items-center gap-2"
              >
                <Users size={16} />
                <span>Compradores</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
