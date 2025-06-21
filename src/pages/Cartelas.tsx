
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import CartelaGrid from "@/components/cartela/CartelaGrid";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

const Cartelas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCartela, setEditingCartela] = useState<any>(null);
  const [novaCartela, setNovaCartela] = useState({
    numero: "",
    numeros: [] as number[]
  });

  // Mock data - substituir por dados do Supabase
  const [cartelas, setCartelas] = useState([
    {
      id: "1",
      numero: 1,
      numeros: [1, 5, 12, 18, 23, 31, 45, 52, 63, 67, 2, 8, 15, 29, 44]
    },
    {
      id: "2", 
      numero: 2,
      numeros: [3, 7, 14, 22, 28, 33, 41, 56, 61, 72, 4, 9, 16, 25, 47]
    }
  ]);

  const filteredCartelas = cartelas.filter(cartela =>
    cartela.numero.toString().includes(searchTerm)
  );

  const handleSaveCartela = () => {
    if (novaCartela.numeros.length !== 15) {
      alert("A cartela deve ter exatamente 15 números!");
      return;
    }

    if (editingCartela) {
      // Editar cartela existente
      setCartelas(prev => prev.map(c => 
        c.id === editingCartela.id 
          ? { ...c, numero: parseInt(novaCartela.numero), numeros: novaCartela.numeros }
          : c
      ));
    } else {
      // Criar nova cartela
      const newCartela = {
        id: Date.now().toString(),
        numero: parseInt(novaCartela.numero),
        numeros: novaCartela.numeros
      };
      setCartelas(prev => [...prev, newCartela]);
    }

    setShowForm(false);
    setEditingCartela(null);
    setNovaCartela({ numero: "", numeros: [] });
  };

  const handleEditCartela = (cartela: any) => {
    setEditingCartela(cartela);
    setNovaCartela({
      numero: cartela.numero.toString(),
      numeros: cartela.numeros
    });
    setShowForm(true);
  };

  const handleDeleteCartela = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta cartela?")) {
      setCartelas(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cartelas</h1>
            <p className="text-gray-600 mt-2">
              Gerencie as cartelas disponíveis para seus bingos
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Cartela
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingCartela ? "Editar Cartela" : "Nova Cartela"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Número da Cartela
                </label>
                <Input
                  type="number"
                  value={novaCartela.numero}
                  onChange={(e) => setNovaCartela(prev => ({ ...prev, numero: e.target.value }))}
                  placeholder="Ex: 1"
                  className="max-w-xs"
                />
              </div>
              
              <CartelaGrid
                numeroCartela={parseInt(novaCartela.numero) || 0}
                numeros={novaCartela.numeros}
                onChange={(numeros) => setNovaCartela(prev => ({ ...prev, numeros }))}
              />
              
              <div className="flex gap-2">
                <Button onClick={handleSaveCartela}>
                  {editingCartela ? "Atualizar" : "Salvar"} Cartela
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingCartela(null);
                    setNovaCartela({ numero: "", numeros: [] });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por número da cartela..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredCartelas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma cartela encontrada</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Tente ajustar sua pesquisa" : "Comece criando sua primeira cartela"}
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Cartela
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCartelas.map((cartela) => (
              <Card key={cartela.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Cartela #{cartela.numero}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditCartela(cartela)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCartela(cartela.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CartelaGrid
                    numeroCartela={cartela.numero}
                    numeros={cartela.numeros}
                    onChange={() => {}}
                    readOnly={true}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cartelas;
