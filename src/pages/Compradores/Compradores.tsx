import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompradoresDetalhadosByBingoId } from "@/services/bingoGestaoService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { getBingoCartelasInfo } from "@/services/cartelaHelperService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CompradorDetalhado {
  id: string;
  nome: string;
  telefone: string | null;
  numero_cartela: number | null;
  pago: boolean | null;
}

const Compradores = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [compradores, setCompradores] = useState<CompradorDetalhado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CompradorDetalhado | null>(null);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    numero_cartela: "",
    pago: false,
  });
  const [cartelasInfo, setCartelasInfo] = useState<{
    totalPermitidas: number;
    cadastradas: number;
    numerosCadastrados: number[];
  }>({ totalPermitidas: 0, cadastradas: 0, numerosCadastrados: [] });
  const [bingoIdState, setBingoIdState] = useState<string | null>(id || null);

  // Move o schema para dentro do componente para acessar cartelasInfo e editing
  const compradorSchema = z.object({
    nome: z.string().min(2, "Nome obrigatório"),
    telefone: z.string().min(8, "Telefone obrigatório"),
    numero_cartela: z
      .string()
      .min(1, "Informe o número da cartela")
      .refine(
        (val) => {
          const num = Number(val);
          return num >= 1 && num <= cartelasInfo.totalPermitidas;
        },
        {
          message: `Número da cartela deve ser entre 1 e ${cartelasInfo.totalPermitidas}`,
        }
      )
      .refine(
        (val) => {
          const num = Number(val);
          if (editing && editing.numero_cartela === num) return true;
          return !cartelasInfo.numerosCadastrados.includes(num);
        },
        {
          message: "Este número de cartela já está cadastrado para este bingo",
        }
      ),
    pago: z.boolean(),
  });
  type CompradorForm = z.infer<typeof compradorSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CompradorForm>({
    resolver: zodResolver(compradorSchema),
    defaultValues: { nome: "", telefone: "", numero_cartela: "", pago: false },
  });

  useEffect(() => {
    const fetchCompradores = async () => {
      setLoading(true);
      try {
        if (id) {
          setBingoIdState(id); // sempre atualiza o estado
          // Gestão de bingo: busca compradores do bingo
          const data = await getCompradoresDetalhadosByBingoId(id);
          setCompradores(data);
          const info = await getBingoCartelasInfo(id);
          setCartelasInfo(info);
        } else if (user?.role === "proprietario") {
          // Proprietário: busca o bingo do usuário
          const { data: bingos, error: bingoError } = await supabase
            .from("bingos")
            .select("id")
            .eq("responsavel_id", user.id)
            .limit(1);
          if (bingoError) throw bingoError;
          const bingoId = bingos && bingos.length > 0 ? bingos[0].id : null;
          setBingoIdState(bingoId); // armazena o id do bingo do proprietário
          if (bingoId) {
            const info = await getBingoCartelasInfo(bingoId);
            setCartelasInfo(info);
            // Busca compradores vinculados ao bingo do usuário
            const data = await getCompradoresDetalhadosByBingoId(bingoId);
            setCompradores(data);
          } else {
            setCartelasInfo({
              totalPermitidas: 0,
              cadastradas: 0,
              numerosCadastrados: [],
            });
            setCompradores([]);
          }
        }
      } catch (e) {
        setCompradores([]);
      }
      setLoading(false);
    };
    fetchCompradores();
  }, [id, user]);

  const filteredCompradores = compradores.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.telefone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.numero_cartela?.toString() || "").includes(searchTerm)
  );

  const openModal = (comprador?: CompradorDetalhado) => {
    if (comprador) {
      setEditing(comprador);
      reset({
        nome: comprador.nome,
        telefone: comprador.telefone || "",
        numero_cartela: comprador.numero_cartela?.toString() || "",
        pago: !!comprador.pago,
      });
    } else {
      setEditing(null);
      reset({ nome: "", telefone: "", numero_cartela: "", pago: false });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ nome: "", telefone: "", numero_cartela: "", pago: false });
  };

  // Função de submit (criar/editar)
  const onSubmit = async (data: CompradorForm) => {
    if (!bingoIdState) return;
    const cartelaNumero = Number(data.numero_cartela);
    setLoading(true);
    try {
      // Busca a cartela apenas pelo número (cartelas são globais)
      const { data: cartelas, error: errorCartela } = await supabase
        .from("cartelas")
        .select("id")
        .eq("numero", cartelaNumero);
      if (errorCartela || !cartelas || cartelas.length === 0)
        throw errorCartela || new Error("Cartela não encontrada");
      const cartela_id = cartelas[0].id;
      if (editing) {
        // Editar comprador
        const { error } = await supabase
          .from("cartelas_vendidas")
          .update({
            comprador_nome: data.nome,
            comprador_telefone: data.telefone,
            pago: data.pago,
            cartela_id,
            bingo_id: bingoIdState,
          })
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        // Cadastrar novo comprador
        const { error } = await supabase.from("cartelas_vendidas").insert({
          comprador_nome: data.nome,
          comprador_telefone: data.telefone,
          pago: data.pago,
          cartela_id,
          bingo_id: bingoIdState,
        });
        if (error) throw error;
      }
      // Atualiza lista após salvar
      const compradoresAtualizados = await getCompradoresDetalhadosByBingoId(
        bingoIdState
      );
      setCompradores(compradoresAtualizados);
      const info = await getBingoCartelasInfo(bingoIdState);
      setCartelasInfo(info);
      closeModal();
    } catch (e: unknown) {
      const err = e as Error;
      alert(err.message || "Erro ao salvar comprador");
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir comprador
  const handleDeleteComprador = async (compradorId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este comprador?"))
      return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("cartelas_vendidas")
        .delete()
        .eq("id", compradorId);
      if (error) throw error;
      // Atualiza lista após exclusão usando o id do bingo correto
      if (bingoIdState) {
        const data = await getCompradoresDetalhadosByBingoId(bingoIdState);
        setCompradores(data);
        const info = await getBingoCartelasInfo(bingoIdState);
        setCartelasInfo(info);
      }
    } catch (e) {
      alert("Erro ao excluir comprador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compradores</h1>
          <p className="text-gray-600 mt-2">
            Gerencie os compradores das cartelas deste bingo
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Comprador
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, telefone ou cartela..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Compradores</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Carregando...</div>
          ) : filteredCompradores.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">
                Nenhum comprador encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Tente ajustar sua pesquisa"
                  : "Comece cadastrando um comprador"}
              </p>
              <Button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Comprador
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Nome</th>
                    <th className="px-4 py-2 border">Telefone</th>
                    <th className="px-4 py-2 border">Nº Cartela</th>
                    <th className="px-4 py-2 border">Pago?</th>
                    <th className="px-4 py-2 border">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompradores.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-2 border">{c.nome}</td>
                      <td className="px-4 py-2 border">{c.telefone || "-"}</td>
                      <td className="px-4 py-2 border">
                        {c.numero_cartela ?? "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {c.pago ? "Sim" : "Não"}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          className="text-blue-600 hover:underline mr-2"
                          onClick={() => openModal(c)}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeleteComprador(c.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Comprador" : "Novo Comprador"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Nome" {...register("nome")} autoFocus />
            {errors.nome && (
              <span className="text-red-500 text-xs">
                {errors.nome.message}
              </span>
            )}
            <Input placeholder="Telefone" {...register("telefone")} />
            {errors.telefone && (
              <span className="text-red-500 text-xs">
                {errors.telefone.message}
              </span>
            )}
            <Input
              placeholder="Nº Cartela"
              type="number"
              {...register("numero_cartela")}
            />
            <div className="text-xs text-gray-500 mb-1">
              {user?.role === "proprietario" ? (
                <>
                  {`Cartelas cadastradas: ${cartelasInfo.totalPermitidas}`}
                  <br />
                  {`Cartelas vendidas: ${cartelasInfo.cadastradas}`}
                </>
              ) : (
                `Cartelas cadastradas: ${cartelasInfo.cadastradas} / ${cartelasInfo.totalPermitidas}`
              )}
            </div>
            {errors.numero_cartela && (
              <span className="text-red-500 text-xs">
                {errors.numero_cartela.message}
              </span>
            )}
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("pago")} id="pago" />
              <label htmlFor="pago">Pago</label>
            </div>
            <DialogFooter>
              <Button onClick={closeModal} variant="outline" type="button">
                Cancelar
              </Button>
              <Button type="submit">
                {editing ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Compradores;
