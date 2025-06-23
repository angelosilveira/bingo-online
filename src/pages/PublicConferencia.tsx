
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SorteioBoard from "@/components/sorteio/SorteioBoard";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PublicConferencia = () => {
  const { bingoId } = useParams();
  const [numerosSorteados, setNumerosSorteados] = useState<number[]>([]);
  const [quantidadeCartelas, setQuantidadeCartelas] = useState<number>(0);
  const [bingoNome, setBingoNome] = useState<string>("");

  useEffect(() => {
    if (!bingoId) return;
    // Busca inicial dos dados do bingo
    const fetchBingo = async () => {
      const { data, error } = await supabase
        .from("bingos")
        .select("name, quantity_of_cartelas")
        .eq("id", bingoId)
        .single();
      if (data) {
        setBingoNome(data.name);
        setQuantidadeCartelas(data.quantity_of_cartelas);
      }
    };
    fetchBingo();

    // Busca inicial dos números sorteados
    const fetchNumeros = async () => {
      const { data, error } = await supabase
        .from("numeros_sorteados")
        .select("numero")
        .eq("bingo_id", bingoId)
        .order("created_at", { ascending: true });
      if (data) {
        setNumerosSorteados(data.map((item: any) => item.numero));
      }
    };
    fetchNumeros();

    // Inscreve para atualizações em tempo real na tabela numeros_sorteados
    const channel = supabase
      .channel("public:numeros_sorteados")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "numeros_sorteados",
          filter: `bingo_id=eq.${bingoId}`,
        },
        (payload) => {
          const newNumero = (payload.new as any).numero;
          setNumerosSorteados((prev) => [...prev, newNumero]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
