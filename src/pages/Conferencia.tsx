import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SorteioBoard from "@/components/sorteio/SorteioBoard";
import { getBingoCartelasInfo } from "@/services/cartelaHelperService";
import { isCartelaVendida } from "@/services/conferenciaService";
import { useParams } from "react-router-dom";

const Conferencia = () => {
  const [bingoAtivo, setBingoAtivo] = useState(true);
  const [numerosSorteados, setNumerosSorteados] = useState<number[]>([]);
  const [quantidadeVendidas, setQuantidadeVendidas] = useState<number>(0);

  // Dados mockados para  ranking - simulando cartelas próximas de ganhar
  const [ranking, setRanking] = useState([
    { cartela: 1, jogador: "João Silva", acertos: 12, posicao: 1 },
    { cartela: 15, jogador: "Maria Santos", acertos: 11, posicao: 2 },
    { cartela: 8, jogador: "Pedro Oliveira", acertos: 10, posicao: 3 },
    { cartela: 23, jogador: "Ana Costa", acertos: 9, posicao: 4 },
    { cartela: 42, jogador: "Carlos Lima", acertos: 8, posicao: 5 },
  ]);

  const { id: bingoId } = useParams<{ id: string }>();

  const handleSortearNumero = (numero: number) => {
    setNumerosSorteados((prev) => [...prev, numero]);
    // Simular atualização do ranking após cada sorteio
    setRanking((prev) =>
      prev
        .map((item) => ({
          ...item,
          acertos: item.acertos + (Math.random() > 0.7 ? 1 : 0), // Simula chance de acerto
        }))
        .sort((a, b) => b.acertos - a.acertos)
        .map((item, index) => ({
          ...item,
          posicao: index + 1,
        }))
    );

    console.log("Número sorteado:", numero);
  };

  const handleIniciarBingo = () => {
    setBingoAtivo(true);
    setNumerosSorteados([]);
  };

  const handleFinalizarBingo = () => {
    setBingoAtivo(false);
  };

  const getLetraDoNumero = (numero: number): string => {
    if (numero <= 15) return "B";
    if (numero <= 30) return "I";
    if (numero <= 45) return "N";
    if (numero <= 60) return "G";
    return "O";
  };

  // Substitua pelo valor real do bingo ativo se necessário
  const quantidadeCartelas = 100;

  // Buscar quantidade de cartelas vendidas ao montar
  useEffect(() => {
    if (!bingoId) return;
    getBingoCartelasInfo(bingoId).then((info) => {
      setQuantidadeVendidas(info.cadastradas);
    });
  }, [bingoId]);

  // Exemplo de função de conferência de cartela
  async function conferirCartela(numeroCartela: number) {
    if (!bingoId) return alert("Bingo não encontrado!");
    const vendida = await isCartelaVendida(bingoId, numeroCartela);
    if (vendida) {
      alert("Cartela válida! Conferência permitida.");
    } else {
      alert("Esta cartela não foi vendida e não pode ser conferida.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Conferência de Bingo
        </h1>
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
            quantidadeCartelas={quantidadeCartelas}
            quantidadeVendidas={quantidadeVendidas}
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
                <div
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    bingoAtivo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {bingoAtivo ? "Bingo Ativo" : "Bingo Pausado"}
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
                {ranking.slice(0, 5).map((item, index) => (
                  <div
                    key={item.cartela}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0
                        ? "bg-yellow-100 border-2 border-yellow-300"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                            ? "bg-gray-400 text-white"
                            : index === 2
                            ? "bg-orange-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {item.posicao}°
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          Cartela #{item.cartela}
                        </div>
                        <div className="text-xs text-gray-600">
                          {item.jogador}
                        </div>
                        <div className="text-xs text-blue-600">
                          {
                            ranking.filter((r) => r.acertos > item.acertos)
                              .length
                          }{" "}
                          cartelas na frente
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
              <CardTitle>Últimos Números Sorteados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {numerosSorteados.length > 0 ? (
                  <>
                    {/* Últimos 10 números em grade */}
                    <div className="grid grid-cols-5 gap-2">
                      {numerosSorteados
                        .slice(-10)
                        .reverse()
                        .map((numero, index) => (
                          <div
                            key={`${numero}-${index}`}
                            className={`rounded p-2 text-center text-sm font-semibold ${
                              index === 0
                                ? "bg-yellow-200 text-yellow-800 border-2 border-yellow-400"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <div className="text-xs">
                              {getLetraDoNumero(numero)}
                            </div>
                            <div className="font-bold">{numero}</div>
                          </div>
                        ))}
                    </div>

                    {/* Lista completa dos números sorteados */}
                    {numerosSorteados.length > 10 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-xs text-gray-600 mb-2">
                          Todos os números ({numerosSorteados.length}):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {numerosSorteados.map((numero, index) => (
                            <span
                              key={`all-${numero}-${index}`}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {getLetraDoNumero(numero)}-{numero}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum número sorteado ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conferência de Cartela - Exemplo */}
          <Card>
            <CardHeader>
              <CardTitle>Conferência de Cartela</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">
                  Confira se o número da sua cartela está entre as cartelas
                  vendidas. Isso é apenas um exemplo e deve ser adaptado
                  conforme a lógica real de conferência.
                </p>

                {/* Exemplo de uso (adicione um campo de input e botão para testar) */}
                <div className="my-6 flex gap-2 items-end">
                  <input
                    type="number"
                    placeholder="Digite o número da cartela para conferir"
                    className="border rounded px-2 py-1"
                    id="input-conferir-cartela"
                  />
                  <Button
                    onClick={async () => {
                      const input = document.getElementById(
                        "input-conferir-cartela"
                      ) as HTMLInputElement;
                      if (input && input.value) {
                        await conferirCartela(Number(input.value));
                      }
                    }}
                    className="bg-blue-600 text-white"
                  >
                    Conferir Cartela
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Conferencia;
