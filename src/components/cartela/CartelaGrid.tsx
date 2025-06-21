
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartelaGridProps {
  numeroCartela: number;
  numeros: number[];
  onChange: (numeros: number[]) => void;
  readOnly?: boolean;
}

const CartelaGrid = ({ numeroCartela, numeros, onChange, readOnly = false }: CartelaGridProps) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>(numeros);

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
      if (selectedNumbers.length >= 15) {
        alert("Você pode selecionar no máximo 15 números por cartela");
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
          {Object.entries(bingoColumns).map(([letter, numbers]) => (
            <div key={letter} className="text-center">
              <div className="font-bold text-lg mb-2 bg-purple-600 text-white py-1 rounded">
                {letter}
              </div>
              <div className="space-y-1">
                {getColumnNumbers(letter as keyof typeof bingoColumns).map(numero => (
                  <div
                    key={numero}
                    className="w-8 h-8 flex items-center justify-center text-xs bg-blue-100 rounded cursor-pointer"
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
            <h4 className="font-semibold mb-2">Selecionar números (máx. 15):</h4>
            <div className="grid grid-cols-15 gap-1 text-xs">
              {Array.from({ length: 75 }, (_, i) => i + 1).map(numero => (
                <button
                  key={numero}
                  onClick={() => handleNumberClick(numero)}
                  className={`w-6 h-6 rounded text-xs ${
                    selectedNumbers.includes(numero)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {numero}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Selecionados: {selectedNumbers.length}/15
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartelaGrid;
