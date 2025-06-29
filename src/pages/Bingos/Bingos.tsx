import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import BingoCard from "@/components/bingo/BingoCard";
import { Search, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const bingoSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  tipo: z.string().min(2, "Tipo obrigatório"),
  local: z.string().min(2, "Local obrigatório"),
  date: z.string().min(8, "Data obrigatória"),
  time: z.string().min(2, "Hora obrigatória"),
  quantity_of_cartelas: z.coerce.number().min(1, "Qtd. cartelas obrigatória"),
});
type BingoForm = z.infer<typeof bingoSchema>;

const Bingos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [bingos, setBingos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBingo, setEditingBingo] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BingoForm>({
    resolver: zodResolver(bingoSchema),
    defaultValues: {
      name: "",
      tipo: "",
      local: "",
      date: "",
      time: "",
      quantity_of_cartelas: 1,
    },
  });

  useEffect(() => {
    const fetchBingos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bingos")
        .select(
          "id, name, tipo, local, date, time, quantity_of_cartelas, status, responsavel_id"
        )
        .order("date", { ascending: false });
      if (data) setBingos(data);
      setLoading(false);
    };
    fetchBingos();
  }, []);

  const filteredBingos = bingos.filter(
    (bingo) =>
      bingo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bingo.local?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (id: string) => {
    const bingo = bingos.find((b) => b.id === id);
    console.log("🚀 ~ openEditModal ~ bingo:", bingo);
    if (bingo) {
      setEditingBingo(bingo);
      // Garante formato YYYY-MM-DD para o input date
      let dateValue = bingo.date || "";
      if (dateValue && dateValue.includes("T")) {
        dateValue = dateValue.split("T")[0];
      } else if (dateValue && dateValue.includes("/")) {
        // Se vier como DD/MM/YYYY ou MM/DD/YYYY, converte para YYYY-MM-DD
        const parts = dateValue.split("/");
        if (parts.length === 3) {
          // Heurística: se ano tem 4 dígitos, está no final
          if (parts[2].length === 4) {
            dateValue = `${parts[2]}-${parts[1].padStart(
              2,
              "0"
            )}-${parts[0].padStart(2, "0")}`;
          }
        }
      }
      // Ajusta para o fuso local se vier em formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
      if (dateValue && /^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
        // Se vier com T, pega só a parte da data
        const isoDate = dateValue.split("T")[0];
        // Cria um Date no fuso local (não UTC)
        const [year, month, day] = isoDate.split("-");
        const localDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );
        // Garante que o input receba YYYY-MM-DD no fuso local
        dateValue = localDate.toISOString().slice(0, 10);
      }
      // Ajusta o formato da hora para HH:mm
      let timeValue = bingo.time || "";
      if (timeValue && timeValue.includes("T")) {
        timeValue = timeValue.split("T")[1];
      }
      if (timeValue && timeValue.length === 5) {
        // Já está no formato HH:mm
      } else if (timeValue) {
        // Tenta converter de outros formatos comuns
        const parts = timeValue.split(":");
        if (parts.length === 2) {
          const [hour, minute] = parts;
          timeValue = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
        }
      }
      reset({
        name: bingo.name || "",
        tipo: bingo.tipo || "",
        local: bingo.local || "",
        date: dateValue,
        time: timeValue,
        quantity_of_cartelas: bingo.quantity_of_cartelas || 1,
      });
      setShowEditModal(true);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingBingo(null);
    reset();
  };

  const onEditSubmit = async (data: BingoForm) => {
    if (!editingBingo) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("bingos")
        .update({
          name: data.name,
          tipo: data.tipo,
          local: data.local,
          date: data.date,
          time: data.time,
          quantity_of_cartelas: data.quantity_of_cartelas,
        })
        .eq("id", editingBingo.id);
      if (error) throw error;
      // Atualiza lista
      const { data: updated, error: fetchError } = await supabase
        .from("bingos")
        .select(
          "id, name, tipo, local, date, time, quantity_of_cartelas, status, responsavel_id"
        )
        .order("date", { ascending: false });
      if (updated) setBingos(updated);
      closeEditModal();
    } catch (e) {
      alert("Erro ao salvar alterações");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    openEditModal(id);
  };

  const handleView = (id: string) => {
    // Se já vier com /bingo no início, não duplica
    if (id.startsWith("/bingo")) {
      navigate(id);
    } else {
      navigate(`/bingo/${id}`);
    }
  };

  const handleDeleteBingo = async () => {
    if (!editingBingo) return;
    if (
      !window.confirm(
        "Tem certeza que deseja excluir este bingo? Esta ação não pode ser desfeita."
      )
    )
      return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("bingos")
        .delete()
        .eq("id", editingBingo.id);
      if (error) throw error;
      // Atualiza lista
      setBingos((prev) => prev.filter((b) => b.id !== editingBingo.id));
      closeEditModal();
    } catch (e) {
      alert("Erro ao excluir bingo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Bingos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todos os seus eventos de bingo
            </p>
          </div>
          <Button
            onClick={() => navigate("/bingos/novo")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Bingo
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : filteredBingos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">
              Nenhum bingo encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Tente ajustar sua pesquisa"
                : "Comece criando seu primeiro evento"}
            </p>
            <Button
              onClick={() => navigate("/bingos/novo")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Bingo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBingos.map((bingo) => (
              <BingoCard
                key={bingo.id}
                bingo={bingo}
                onEdit={handleEdit}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showEditModal} onOpenChange={closeEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Bingo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="edit-bingo-nome"
            >
              Nome
            </label>
            <Input
              id="edit-bingo-nome"
              placeholder="Nome"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="edit-bingo-tipo"
            >
              Tipo
            </label>
            <Input
              id="edit-bingo-tipo"
              placeholder="Tipo"
              {...register("tipo")}
            />
            {errors.tipo && (
              <span className="text-red-500 text-xs">
                {errors.tipo.message}
              </span>
            )}
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="edit-bingo-local"
            >
              Local
            </label>
            <Input
              id="edit-bingo-local"
              placeholder="Local"
              {...register("local")}
            />
            {errors.local && (
              <span className="text-red-500 text-xs">
                {errors.local.message}
              </span>
            )}
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="edit-bingo-data"
            >
              Data
            </label>
            <Input
              id="edit-bingo-data"
              placeholder="Data"
              type="date"
              {...register("date")}
            />
            {errors.date && (
              <span className="text-red-500 text-xs">
                {errors.date.message}
              </span>
            )}
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="edit-bingo-hora"
            >
              Hora
            </label>
            <Input
              id="edit-bingo-hora"
              placeholder="Hora"
              type="time"
              {...register("time")}
            />
            {errors.time && (
              <span className="text-red-500 text-xs">
                {errors.time.message}
              </span>
            )}
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="edit-bingo-qtd"
            >
              Qtd. Cartelas
            </label>
            <Input
              id="edit-bingo-qtd"
              placeholder="Qtd. Cartelas"
              type="number"
              {...register("quantity_of_cartelas")}
            />
            {errors.quantity_of_cartelas && (
              <span className="text-red-500 text-xs">
                {errors.quantity_of_cartelas.message}
              </span>
            )}
            <DialogFooter>
              <Button onClick={closeEditModal} variant="outline" type="button">
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteBingo}
                variant="destructive"
                type="button"
              >
                Excluir
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Bingos;
