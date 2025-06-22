import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BingoCardProps {
  bingo: {
    id: string;
    name: string;
    tipo: string;
    local: string;
    date: string;
    time: string;
    quantity_of_cartelas: number;
    status: string;
    responsavel_id?: string;
  };
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const BingoCard = ({ bingo, onEdit, onView }: BingoCardProps) => {
  const [responsavel, setResponsavel] = useState<string>("");

  useEffect(() => {
    async function fetchResponsavel() {
      if (bingo.responsavel_id) {
        const { data } = await supabase
          .from("users")
          .select("name")
          .eq("id", bingo.responsavel_id)
          .single();
        setResponsavel(data?.name || "");
      }
    }
    fetchResponsavel();
  }, [bingo.responsavel_id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-500";
      case "agendado":
        return "bg-blue-500";
      case "finalizado":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{bingo.name}</CardTitle>
          <Badge className={`${getStatusColor(bingo.status)} text-white`}>
            {bingo.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {bingo.date
              ? new Date(bingo.date).toLocaleDateString()
              : ""} às {bingo.time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {bingo.local}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {bingo.quantity_of_cartelas} cartelas
          </div>
          <div className="text-sm">
            <span className="font-semibold">Tipo:</span> {bingo.tipo}
          </div>
          {responsavel && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-semibold mr-2">Responsável:</span>{" "}
              {responsavel}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => onView(`/bingos/gestao/${bingo.id}`)}
            className="flex-1"
          >
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
