import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import BingoCard from "@/components/bingo/BingoCard";
import { Search, Plus } from "lucide-react";

const Bingos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Dados mockados - substituir por dados do Supabase
  const [bingos] = useState([
    {
      id: "1",
      nome: "Bingo Beneficente da Igreja",
      tipo: "4-premios",
      local: "Salão Paroquial",
      data: "2024-01-15",
      horario: "19:00",
      quantidade_cartelas: 100,
      status: "agendado",
    },
    {
      id: "2",
      nome: "Bingo do Clube de Mães",
      tipo: "2-premios",
      local: "Centro Comunitário",
      data: "2024-01-20",
      horario: "15:00",
      quantidade_cartelas: 50,
      status: "ativo",
    },
    {
      id: "3",
      nome: "Super Bingo de Final de Ano",
      tipo: "4-premios",
      local: "Ginásio Municipal",
      data: "2023-12-30",
      horario: "20:00",
      quantidade_cartelas: 200,
      status: "finalizado",
    },
  ]);

  const filteredBingos = bingos.filter(
    (bingo) =>
      bingo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bingo.local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/bingos/editar/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/bingos/${id}`);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Bingos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todos os seus eventos de bingo
            </p>
          </div>
          <Button
            onClick={() => navigate("/bingos/novo")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Bingo
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredBingos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">
              Nenhum bingo encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Tente ajustar sua pesquisa"
                : "Comece criando seu primeiro evento"}
            </p>
            <Button
              onClick={() => navigate("/bingos/novo")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Bingo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBingos.map((bingo) => (
              <BingoCard
                key={bingo.id}
                bingo={bingo}
                onEdit={handleEdit}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Bingos;
