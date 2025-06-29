import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SorteioBoardProps {
  numerosSorteados: number[];
  onSortear: (numero: number) => void;
  disabled?: boolean;
  quantidadeCartelas?: number;
  quantidadeVendidas?: number; // NOVO: número de cartelas vendidas
}

const SorteioBoard = ({
  numerosSorteados,
  onSortear,
  disabled = false,
  quantidadeCartelas,
  quantidadeVendidas = 0,
}: SorteioBoardProps) => {
  const [ultimoNumero, setUltimoNumero] = useState<number | null>(null);
  const [bingoIniciado, setBingoIniciado] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const bingoColumns = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  };

  const numerosDisponiveis = Array.from({ length: 75 }, (_, i) => i + 1).filter(
    (n) => !numerosSorteados.includes(n)
  );

  const sortearNumero = () => {
    if (numerosDisponiveis.length === 0) return;

    const randomIndex = Math.floor(Math.random() * numerosDisponiveis.length);
    const numeroSorteado = numerosDisponiveis[randomIndex];

    setUltimoNumero(numeroSorteado);
    onSortear(numeroSorteado);
  };

  const getLetraDoNumero = (numero: number): string => {
    if (numero <= 15) return "B";
    if (numero <= 30) return "I";
    if (numero <= 45) return "N";
    if (numero <= 60) return "G";
    return "O";
  };

  // Verifica se há cartelas não vendidas
  const haCartelasNaoVendidas =
    quantidadeCartelas !== undefined &&
    quantidadeVendidas !== undefined &&
    quantidadeVendidas < quantidadeCartelas;

  return (
    <div className="space-y-6">
      {/* Painel de Controle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Controle de Sorteio</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-around text-lg">
            <div>
              <div className="font-bold text-2xl text-blue-600">
                {numerosSorteados.length}
              </div>
              <div className="text-sm text-gray-600">Sorteados</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-green-600">
                {numerosDisponiveis.length}
              </div>
              <div className="text-sm text-gray-600">Restantes</div>
            </div>
            {quantidadeCartelas !== undefined && (
              <div>
                <div className="font-bold text-2xl text-purple-600">
                  {quantidadeCartelas}
                </div>
                <div className="text-sm text-gray-600">Cartelas no Bingo</div>
              </div>
            )}
          </div>

          {ultimoNumero && (
            <div className="bg-yellow-100 p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                Último número sorteado:
              </div>
              <div className="text-4xl font-bold text-yellow-600">
                {getLetraDoNumero(ultimoNumero)}-{ultimoNumero}
              </div>
            </div>
          )}

          {/* Botão de iniciar bingo/modal */}
          {!bingoIniciado ? (
            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              🎲 Iniciar Bingo
            </Button>
          ) : (
            typeof onSortear === "function" &&
            !disabled && (
              <Button
                onClick={sortearNumero}
                disabled={disabled || numerosDisponiveis.length === 0}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                size="lg"
              >
                🎯 Sortear Número
              </Button>
            )
          )}

          {/* Modal de confirmação */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Iniciar Bingo</DialogTitle>
              </DialogHeader>
              <div className="py-2 text-gray-700">
                {haCartelasNaoVendidas ? (
                  <>
                    Existem cartelas que <b>não foram vendidas</b>.
                    <br />
                    Ao iniciar o bingo, <b>apenas as cartelas vendidas</b>{" "}
                    poderão ser conferidas.
                    <br />
                    Tem certeza que deseja iniciar o bingo e descartar as
                    cartelas não vendidas?
                  </>
                ) : (
                  <>Deseja realmente iniciar o bingo?</>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setBingoIniciado(true);
                    setShowModal(false);
                  }}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  Iniciar
                  {haCartelasNaoVendidas ? " e descartar cartelas" : ""}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Tabuleiro BINGO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Tabuleiro de Números</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(bingoColumns).map(([letter, numbers]) => (
              <div key={letter} className="text-center">
                <div className="font-bold text-3xl mb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded h-16 flex items-center justify-center">
                  {letter}
                </div>
                <div className="space-y-1">
                  {numbers.map((numero) => (
                    <div
                      key={numero}
                      className={`h-12 flex items-center justify-center text-lg font-semibold rounded ${
                        numerosSorteados.includes(numero)
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {numero}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SorteioBoard;
