
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CartelaGridProps {
  numeroCartela: number;
  numeros: number[];
  onChange: (numeros: number[]) => void;
  readOnly?: boolean;
}

const CartelaGrid = ({ numeroCartela, numeros, onChange, readOnly = false }: CartelaGridProps) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>(numeros);

  useEffect(() => {
    setSelectedNumbers(numeros);
  }, [numeros]);

  const bingoColumns = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61)
  };

  const handleNumberClick = (numero: number) => {
    if (readOnly) return;

    let newNumbers;
    if (selectedNumbers.includes(numero)) {
      newNumbers = selectedNumbers.filter(n => n !== numero);
    } else {
      if (selectedNumbers.length >= 25) {
        alert("Você pode selecionar no máximo 25 números por cartela");
        return;
      }
      newNumbers = [...selectedNumbers, numero].sort((a, b) => a - b);
    }
    
    setSelectedNumbers(newNumbers);
    onChange(newNumbers);
  };

  const getColumnNumbers = (letter: keyof typeof bingoColumns) => {
    return bingoColumns[letter].filter(num => selectedNumbers.includes(num));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Cartela #{numeroCartela}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Object.entries(bingoColumns).map(([letter]) => (
            <div key={letter} className="text-center">
              <div className="font-bold text-3xl mb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded h-16 flex items-center justify-center">
                {letter}
              </div>
              <div className="space-y-1">
                {getColumnNumbers(letter as keyof typeof bingoColumns).map(numero => (
                  <div
                    key={numero}
                    className="h-12 flex items-center justify-center text-lg font-semibold rounded bg-blue-100"
                  >
                    {numero}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!readOnly && (
          <div>
            <h4 className="font-semibold mb-2">Selecionar números (máx. 25):</h4>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(bingoColumns).map(([letter, numbers]) => (
                <div key={letter} className="text-center">
                  <div className="font-bold text-lg mb-2 bg-purple-600 text-white py-1 rounded">
                    {letter}
                  </div>
                  <div className="space-y-1">
                    {numbers.map(numero => (
                      <button
                        key={numero}
                        onClick={() => handleNumberClick(numero)}
                        className={`h-12 w-full rounded text-lg font-semibold ${
                          selectedNumbers.includes(numero)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
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
