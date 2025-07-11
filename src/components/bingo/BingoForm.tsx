
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserService } from "@/services/userService";
import { CartelaService } from "@/services/cartelaService";

interface BingoFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const BingoForm = ({ onSubmit, initialData }: BingoFormProps) => {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || "",
    tipo: initialData?.tipo || "",
    premio1: initialData?.premio1 || "",
    premio2: initialData?.premio2 || "",
    premio3: initialData?.premio3 || "",
    premio4: initialData?.premio4 || "",
    local: initialData?.local || "",
    data: initialData?.data || "",
    horario: initialData?.horario || "",
    quantidade_cartelas: initialData?.quantidade_cartelas || "",
    observacoes: initialData?.observacoes || "",
    responsavel_id: initialData?.responsavel_id || "",
  });

  const [responsaveis, setResponsaveis] = useState<
    { id: string; name: string }[]
  >([]);
  const [totalCartelas, setTotalCartelas] = useState<number>(0);
  const [cartelasError, setCartelasError] = useState<string>("");

  useEffect(() => {
    // Buscar usuários com role proprietario ou user
    UserService.listUsers().then((users) => {
      setResponsaveis(
        users
          .filter((u) => u.role === "proprietario")
          .map((u) => ({ id: u.id, name: u.name }))
      );
    });
    // Buscar total de cartelas cadastradas
    CartelaService.getTotalCartelas().then(setTotalCartelas);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCartelasError("");
    if (Number(formData.quantidade_cartelas) > totalCartelas) {
      setCartelasError(
        `A quantidade de cartelas não pode ser maior que o total cadastrado (${totalCartelas}).`
      );
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Editar Bingo" : "Novo Bingo"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Bingo</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="responsavel">Nome do Responsável</Label>
            <Select
              onValueChange={(value) => handleChange("responsavel_id", value)}
              value={formData.responsavel_id || ""}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {responsaveis.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tipo">Tipo de Bingo</Label>
            <Select
              onValueChange={(value) => handleChange("tipo", value)}
              value={formData.tipo}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-premio">1 Prêmio</SelectItem>
                <SelectItem value="2-premios">2 Prêmios</SelectItem>
                <SelectItem value="3-premios">3 Prêmios</SelectItem>
                <SelectItem value="4-premios">4 Prêmios</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="premio1">1º Prêmio</Label>
              <Input
                id="premio1"
                value={formData.premio1}
                onChange={(e) => handleChange("premio1", e.target.value)}
                required
              />
            </div>
            {(formData.tipo === "2-premios" ||
              formData.tipo === "3-premios" ||
              formData.tipo === "4-premios") && (
              <div>
                <Label htmlFor="premio2">2º Prêmio</Label>
                <Input
                  id="premio2"
                  value={formData.premio2}
                  onChange={(e) => handleChange("premio2", e.target.value)}
                />
              </div>
            )}
            {(formData.tipo === "3-premios" ||
              formData.tipo === "4-premios") && (
              <div>
                <Label htmlFor="premio3">3º Prêmio</Label>
                <Input
                  id="premio3"
                  value={formData.premio3}
                  onChange={(e) => handleChange("premio3", e.target.value)}
                />
              </div>
            )}
            {formData.tipo === "4-premios" && (
              <div>
                <Label htmlFor="premio4">4º Prêmio</Label>
                <Input
                  id="premio4"
                  value={formData.premio4}
                  onChange={(e) => handleChange("premio4", e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="local">Local</Label>
            <Input
              id="local"
              value={formData.local}
              onChange={(e) => handleChange("local", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => handleChange("data", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={formData.horario}
                onChange={(e) => handleChange("horario", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quantidade_cartelas">Quantidade de Cartelas</Label>
            <Input
              id="quantidade_cartelas"
              type="number"
              min="1"
              value={formData.quantidade_cartelas}
              onChange={(e) =>
                handleChange("quantidade_cartelas", e.target.value)
              }
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Cartelas cadastradas no sistema:{" "}
              <span className="font-bold">{totalCartelas}</span>
            </div>
            {cartelasError && (
              <div className="text-xs text-red-500 mt-1">{cartelasError}</div>
            )}
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            {initialData ? "Atualizar Bingo" : "Criar Bingo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BingoForm;
