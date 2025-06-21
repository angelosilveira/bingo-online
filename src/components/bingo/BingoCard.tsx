
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface BingoCardProps {
  bingo: {
    id: string;
    nome: string;
    tipo: string;
    local: string;
    data: string;
    horario: string;
    quantidade_cartelas: number;
    status: string;
  };
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const BingoCard = ({ bingo, onEdit, onView }: BingoCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-500";
      case "agendado": return "bg-blue-500";
      case "finalizado": return "bg-gray-500";
      default: return "bg-yellow-500";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{bingo.nome}</CardTitle>
          <Badge className={`${getStatusColor(bingo.status)} text-white`}>
            {bingo.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(bingo.data).toLocaleDateString()} às {bingo.horario}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {bingo.local}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {bingo.quantidade_cartelas} cartelas
          </div>
          <div className="text-sm">
            <span className="font-semibold">Tipo:</span> {bingo.tipo}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => onView(bingo.id)} className="flex-1">
            Visualizar
          </Button>
          {bingo.status === "agendado" && (
            <Button onClick={() => onEdit(bingo.id)} variant="outline">
              Editar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BingoCard;
