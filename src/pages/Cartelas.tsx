import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import CartelaGrid from "@/components/cartela/CartelaGrid";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Cartelas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCartela, setEditingCartela] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [novaCartela, setNovaCartela] = useState({
    numeros: [] as number[],
  });

  const [cartelas, setCartelas] = useState<any[]>([]);

  useEffect(() => {
    fetchCartelas();
  }, []);

  const fetchCartelas = async () => {
    try {
      const { data, error } = await supabase
        .from("cartelas")
        .select("*")
        .order("numero", { ascending: true });

      if (error) throw error;
      setCartelas(data || []);
    } catch (error) {
      console.error("Erro ao buscar cartelas:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar as cartelas",
        variant: "destructive",
      });
    }
  };

  const filteredCartelas = cartelas.filter((cartela) =>
    cartela.numero?.toString().includes(searchTerm)
  );

  // Função utilitária para montar a cartela com símbolo B no centro
  function montarCartelaComSimbolo(numeros: number[]) {
    // Espera 24 números, insere símbolo na posição central (3ª da coluna N)
    if (numeros.length !== 24) return null;
    // Monta as colunas
    const colunas = [
      numeros.slice(0, 5), // B
      numeros.slice(5, 10), // I
      numeros.slice(10, 14), // N (faltando 1)
      numeros.slice(14, 19), // G
      numeros.slice(19, 24), // O
    ];
    // Insere símbolo na posição central da coluna N (posição 2, zero-based)
    colunas[2].splice(2, 0, -1); // -1 será o símbolo
    // Junta tudo em um array único de 25 posições
    return [
      ...colunas[0],
      ...colunas[1],
      ...colunas[2],
      ...colunas[3],
      ...colunas[4],
    ];
  }

  const handleSaveCartela = async () => {
    // Validação: só pode ter 24 números
    if (novaCartela.numeros.length !== 24) {
      alert(
        "A cartela deve ter exatamente 24 números! O centro será preenchido automaticamente com o símbolo."
      );
      return;
    }
    // Monta a cartela final com símbolo
    const cartelaFinal = montarCartelaComSimbolo(novaCartela.numeros);
    if (!cartelaFinal) {
      alert("Erro ao montar a cartela.");
      return;
    }

    setLoading(true);
    try {
      if (editingCartela) {
        // Editar cartela existente
        const { error } = await supabase
          .from("cartelas")
          .update({ numeros: cartelaFinal })
          .eq("id", editingCartela.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Cartela atualizada com sucesso!",
        });
      } else {
        // Criar nova cartela
        const { data, error } = await supabase.rpc("generate_cartela_numero");
        if (error) throw error;

        const { error: insertError } = await supabase.from("cartelas").insert({
          numero: data,
          numeros: cartelaFinal,
        });

        if (insertError) throw insertError;

        toast({
          title: "Sucesso",
          description: "Cartela criada com sucesso!",
        });
      }

      setShowForm(false);
      setEditingCartela(null);
      setNovaCartela({ numeros: [] });
      fetchCartelas();
    } catch (error) {
      console.error("Erro ao salvar cartela:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a cartela",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCartela = (cartela: any) => {
    // Remove o símbolo para edição
    const numerosSemSimbolo = cartela.numeros.filter(
      (n: any) => typeof n === "number"
    );
    setEditingCartela(cartela);
    setNovaCartela({
      numeros: numerosSemSimbolo,
    });
    setShowForm(true);
  };

  const handleDeleteCartela = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta cartela?")) {
      try {
        const { error } = await supabase.from("cartelas").delete().eq("id", id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Cartela excluída com sucesso!",
        });
        fetchCartelas();
      } catch (error) {
        console.error("Erro ao excluir cartela:", error);
        toast({
          title: "Erro",
          description: "Erro ao excluir a cartela",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
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
              <CartelaGrid
                numeroCartela={
                  editingCartela ? editingCartela.numero : cartelas.length + 1
                }
                numeros={
                  showForm && !editingCartela
                    ? novaCartela.numeros
                    : novaCartela.numeros
                }
                onChange={(numeros) =>
                  setNovaCartela((prev) => ({ ...prev, numeros }))
                }
              />

              <div className="flex gap-2">
                <Button onClick={handleSaveCartela} disabled={loading}>
                  {loading
                    ? "Salvando..."
                    : editingCartela
                    ? "Atualizar"
                    : "Salvar"}{" "}
                  Cartela
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCartela(null);
                    setNovaCartela({ numeros: [] });
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
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma cartela encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Tente ajustar sua pesquisa"
                : "Comece criando sua primeira cartela"}
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
              <Card
                key={cartela.id}
                className="hover:shadow-lg transition-shadow"
              >
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
    </>
  );
};

export default Cartelas;
