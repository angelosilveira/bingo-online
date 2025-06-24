import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBingoById,
  getConferenciaByBingoId,
  getCompradoresByBingoId,
} from "@/services/bingoGestaoService";
import { Bingo } from "@/models/BingoGestao";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, CreditCard } from "lucide-react";
import BingoGestaoSidebar from "@/components/bingo/BingoGestaoSidebar";

const BingoGestao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bingo, setBingo] = useState<Bingo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const bingoData = await getBingoById(id!);
      setBingo(bingoData);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  if (!bingo)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Bingo não encontrado.
      </div>
    );

  // Exemplo de dados dinâmicos, substitua pelos dados reais do bingo
  const stats = [
    {
      title: "Cartelas Cadastradas",
      value: bingo.total_cartelas || 0,
      description: "Total disponível",
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      title: "Prêmios Pendentes",
      value: bingo.premios_pendentes || 0,
      description: "Aguardando sorteio",
      icon: Trophy,
      color: "text-yellow-600",
    },
  ];

  const quickActions = [
    {
      title: "Iniciar Conferência",
      description: "Comece o sorteio em tempo real",
      action: () => navigate(`/bingo${id}/conferencia`),
      icon: Trophy,
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <BingoGestaoSidebar bingoId={id!} />
      <main className="flex-1 p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard do Bingo
          </h1>
          <p className="text-gray-600 mt-2">
            Visão geral do bingo: <b>{bingo.nome}</b>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${action.color} text-white`}
                    >
                      <action.icon size={20} />
                    </div>
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  <Button onClick={action.action} className="w-full">
                    Executar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Resumo de Atividades Recentes (pode ser customizado para o bingo) */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Bingo criado</p>
                  <p className="text-sm text-gray-500">
                    {bingo.data ? new Date(bingo.data).toLocaleString() : "-"}
                  </p>
                </div>
              </div>
              {/* Adicione mais atividades conforme necessário */}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BingoGestao;
