import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CartelaGridProps {
  numeroCartela: number;
  numeros: (number | string)[];
  onChange: (numeros: number[]) => void;
  readOnly?: boolean;
}

const CartelaGrid = ({
  numeroCartela,
  numeros,
  onChange,
  readOnly = false,
}: CartelaGridProps) => {
  const [selectedNumbers, setSelectedNumbers] =
    useState<(number | string)[]>(numeros);

  useEffect(() => {
    setSelectedNumbers(numeros);
  }, [numeros]);

  const bingoColumns = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  };

  const handleNumberClick = (numero: number | string) => {
    if (readOnly) return;
    if (typeof numero !== "number") return;

    // Descobre a letra da coluna do número
    let letter: keyof typeof bingoColumns | undefined;
    for (const [l, nums] of Object.entries(bingoColumns)) {
      if (nums.includes(numero)) {
        letter = l as keyof typeof bingoColumns;
        break;
      }
    }
    if (!letter) return;

    // Limite de seleção por coluna
    let maxPorColuna = 5;
    if (letter === "N") maxPorColuna = 4; // Só 4 números na N

    // Conta quantos já estão selecionados para essa letra
    const selectedInColumn = selectedNumbers.filter(
      (n) =>
        typeof n === "number" && bingoColumns[letter!].includes(n as number)
    ).length;

    let newNumbers;
    if (selectedNumbers.includes(numero)) {
      newNumbers = selectedNumbers.filter((n) => n !== numero);
    } else {
      if (selectedInColumn >= maxPorColuna) {
        alert(
          `Você só pode selecionar até ${maxPorColuna} número${
            maxPorColuna > 1 ? "s" : ""
          } para a letra ${letter}`
        );
        return;
      }
      if (selectedNumbers.length >= 24) {
        alert("Você pode selecionar no máximo 24 números por cartela");
        return;
      }
      newNumbers = [...selectedNumbers, numero].sort(
        (a, b) => Number(a) - Number(b)
      );
    }

    setSelectedNumbers(newNumbers);
    onChange(newNumbers.filter((n) => typeof n === "number") as number[]);
  };

  const getColumnNumbers = (letter: keyof typeof bingoColumns) => {
    if (letter === "N") {
      // Para a coluna N, insere o símbolo na posição 2 (índice 2)
      const nums = bingoColumns[letter].filter((num) =>
        selectedNumbers.includes(num)
      );
      // Usa -1 como placeholder para o símbolo
      const numsWithSymbol = [...nums];
      numsWithSymbol.splice(2, 0, -1);
      return numsWithSymbol;
    }
    return bingoColumns[letter].filter((num) => selectedNumbers.includes(num));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Cartela #{numeroCartela}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Object.entries(bingoColumns).map(([letter]) => (
            <div key={letter} className="text-center">
              <div className="font-bold text-3xl mb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded h-16 flex items-center justify-center">
                {letter}
              </div>
              <div className="space-y-1">
                {getColumnNumbers(letter as keyof typeof bingoColumns).map(
                  (numero, idx) => (
                    <div
                      key={idx}
                      className="h-12 flex items-center justify-center text-lg font-semibold rounded bg-blue-100"
                    >
                      {numero === -1 ? "🅱️" : numero}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {!readOnly && (
          <div>
            <h4 className="font-semibold mb-2">
              Selecionar números (máx. 25):
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(bingoColumns).map(([letter, numbers]) => (
                <div key={letter} className="text-center">
                  <div className="font-bold text-lg mb-2 bg-purple-600 text-white py-1 rounded">
                    {letter}
                  </div>
                  <div className="space-y-1">
                    {numbers.map((numero) => (
                      <button
                        key={numero}
                        onClick={() => handleNumberClick(numero)}
                        className={`h-12 w-full rounded text-lg font-semibold ${
                          selectedNumbers.includes(numero)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {numero}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Selecionados: {selectedNumbers.length}/25
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartelaGrid;
