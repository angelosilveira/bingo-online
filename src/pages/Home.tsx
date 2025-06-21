
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Gerenciar Bingos",
      description: "Crie e gerencie seus eventos de bingo",
      action: () => navigate("/bingos"),
      icon: "🎯"
    },
    {
      title: "Cadastrar Cartelas",
      description: "Adicione e configure cartelas para seus eventos",
      action: () => navigate("/cartelas"),
      icon: "🎫"
    },
    {
      title: "Controle de Vendas",
      description: "Gerencie as cartelas vendidas e pagamentos",
      action: () => navigate("/vendas"),
      icon: "💰"
    },
    {
      title: "Conferência de Bingo",
      description: "Execute o sorteio e confira ganhadores em tempo real",
      action: () => navigate("/conferencia"),
      icon: "🏆"
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Bingo Profissional
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie seus eventos de bingo de forma profissional com controle completo 
            de cartelas, vendas e conferência em tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Button onClick={feature.action} className="w-full">
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Pronto para começar seu próximo bingo?
          </h2>
          <p className="text-lg mb-6">
            Crie um novo evento e comece a configurar suas cartelas agora mesmo.
          </p>
          <Button
            onClick={() => navigate("/bingos/novo")}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg"
            size="lg"
          >
            Criar Novo Bingo
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
