import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SorteioBoard from "@/components/sorteio/SorteioBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// @ts-ignore
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const PublicConferencia = () => {
  const { bingoId } = useParams();
  const [numerosSorteados, setNumerosSorteados] = useState<number[]>([]);
  const [quantidadeCartelas, setQuantidadeCartelas] = useState<number>(0);
  const [bingoNome, setBingoNome] = useState<string>("");

  useEffect(() => {
    // Conecta ao socket.io
    const socket = io(SOCKET_URL, { query: { bingoId } });

    socket.on("connect", () => {
      // Solicita o estado inicial do bingo
      socket.emit("join-bingo", bingoId);
    });

    socket.on(
      "bingo-state",
      (data: {
        numerosSorteados: number[];
        quantidadeCartelas: number;
        nome: string;
      }) => {
        setNumerosSorteados(data.numerosSorteados);
        setQuantidadeCartelas(data.quantidadeCartelas);
        setBingoNome(data.nome);
      }
    );

    socket.on("numero-sorteado", (numero: number) => {
      setNumerosSorteados((prev) => [...prev, numero]);
    });

    return () => {
      socket.disconnect();
    };
  }, [bingoId]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Conferência Pública
        </h1>
        <h2 className="text-xl text-center mb-2 text-blue-700">{bingoNome}</h2>
        <div className="text-center text-gray-600 mb-6">
          Cartelas no bingo:{" "}
          <span className="font-bold">{quantidadeCartelas}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabuleiro de Sorteio */}
        <div className="lg:col-span-2">
          <SorteioBoard
            numerosSorteados={numerosSorteados}
            onSortear={() => {}}
            disabled={true}
            quantidadeCartelas={quantidadeCartelas}
          />
        </div>
        {/* Painel de Ranking e Histórico */}
        <div className="space-y-6">
          {/* Ranking - pode ser adaptado para dados reais via socket */}
          <Card>
            <CardHeader>
              <CardTitle>Ranking - Mais Próximos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-4">
                Ranking em tempo real em breve...
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
                              {/* Exibe letra do número */}
                              {(() => {
                                if (numero <= 15) return "B";
                                if (numero <= 30) return "I";
                                if (numero <= 45) return "N";
                                if (numero <= 60) return "G";
                                return "O";
                              })()}
                            </div>
                            <div className="font-bold">{numero}</div>
                          </div>
                        ))}
                    </div>
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
                              {(() => {
                                if (numero <= 15) return "B";
                                if (numero <= 30) return "I";
                                if (numero <= 45) return "N";
                                if (numero <= 60) return "G";
                                return "O";
                              })()}
                              -{numero}
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
        </div>
      </div>
    </div>
  );
};

export default PublicConferencia;
