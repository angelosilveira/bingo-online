
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SorteioBoard from "@/components/sorteio/SorteioBoard";

const Conferencia = () => {
  const [bingoAtivo, setBingoAtivo] = useState(true);
  const [numerosSorteados, setNumerosSorteados] = useState<number[]>([]);
  const [ranking, setRanking] = useState([
    { cartela: 1, jogador: "João Silva", acertos: 12 },
    { cartela: 15, jogador: "Maria Santos", acertos: 11 },
    { cartela: 8, jogador: "Pedro Oliveira", acertos: 10 },
    { cartela: 23, jogador: "Ana Costa", acertos: 9 },
    { cartela: 42, jogador: "Carlos Lima", acertos: 8 }
  ]);

  const handleSortearNumero = (numero: number) => {
    setNumerosSorteados(prev => [...prev, numero]);
    // Aqui integraria com Firebase/Supabase para sincronização em tempo real
    console.log("Número sorteado:", numero);
  };

  const handleIniciarBingo = () => {
    setBingoAtivo(true);
    setNumerosSorteados([]);
  };

  const handleFinalizarBingo = () => {
    setBingoAtivo(false);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Conferência de Bingo</h1>
          <p className="text-gray-600 mt-2">
            Controle o sorteio e acompanhe o ranking em tempo real
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabuleiro de Sorteio */}
          <div className="lg:col-span-2">
            <SorteioBoard
              numerosSorteados={numerosSorteados}
              onSortear={handleSortearNumero}
              disabled={!bingoAtivo}
            />
          </div>

          {/* Painel de Controle e Ranking */}
          <div className="space-y-6">
            {/* Controles do Bingo */}
            <Card>
              <CardHeader>
                <CardTitle>Controle do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    bingoAtivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {bingoAtivo ? 'Bingo Ativo' : 'Bingo Pausado'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {!bingoAtivo && (
                    <Button
                      onClick={handleIniciarBingo}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Iniciar Bingo
                    </Button>
                  )}
                  
                  {bingoAtivo && (
                    <Button
                      onClick={handleFinalizarBingo}
                      variant="outline"
                      className="w-full"
                    >
                      Pausar Bingo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ranking */}
            <Card>
              <CardHeader>
                <CardTitle>Ranking - Mais Próximos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ranking.map((item, index) => (
                    <div
                      key={item.cartela}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0 ? 'bg-yellow-100' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            Cartela #{item.cartela}
                          </div>
                          <div className="text-xs text-gray-600">
                            {item.jogador}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-blue-600">
                          {item.acertos}
                        </div>
                        <div className="text-xs text-gray-500">acertos</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Números */}
            <Card>
              <CardHeader>
                <CardTitle>Últimos Números</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1">
                  {numerosSorteados.slice(-10).reverse().map((numero, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 rounded p-2 text-center text-sm font-semibold"
                    >
                      {numero}
                    </div>
                  ))}
                </div>
                {numerosSorteados.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum número sorteado ainda
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Conferencia;
