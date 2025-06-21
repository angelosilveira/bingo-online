
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Target, CreditCard, Trophy, Plus, BarChart3 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Bingos Ativos",
      value: "3",
      description: "Em andamento",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Cartelas Cadastradas",
      value: "150",
      description: "Total disponível",
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      title: "Cartelas Vendidas",
      value: "89",
      description: "59% vendido",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Prêmios Pendentes",
      value: "2",
      description: "Aguardando sorteio",
      icon: Trophy,
      color: "text-yellow-600",
    },
  ];

  const quickActions = [
    {
      title: "Criar Novo Bingo",
      description: "Configure um novo evento de bingo",
      action: () => navigate("/bingos/novo"),
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Iniciar Conferência",
      description: "Comece o sorteio em tempo real",
      action: () => navigate("/conferencia"),
      icon: Trophy,
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Visão geral do seu sistema de bingo
          </p>
        </div>

        {/* Cards de Estatísticas */}
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
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
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

        {/* Resumo de Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Bingo da Festa Junina criado</p>
                  <p className="text-sm text-gray-500">2 horas atrás</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">45 cartelas vendidas</p>
                  <p className="text-sm text-gray-500">1 dia atrás</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Bingo Beneficente finalizado</p>
                  <p className="text-sm text-gray-500">3 dias atrás</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;
