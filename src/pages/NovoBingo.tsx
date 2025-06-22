import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BingoForm from "@/components/bingo/BingoForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NovoBingo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    // Insere o bingo no Supabase
    const { error } = await supabase.from("bingos").insert({
      name: data.nome,
      tipo: data.tipo,
      local: data.local,
      date: data.data,
      time: data.horario,
      quantity_of_cartelas: Number(data.quantidade_cartelas),
      status: "agendado",
      responsavel_id: data.responsavel_id,
    });

    if (error) {
      toast({
        title: "Erro ao criar bingo",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bingo criado com sucesso!",
      description: "Seu evento foi cadastrado e está pronto para configuração.",
    });
    navigate("/bingos");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Bingo</h1>
          <p className="text-gray-600 mt-2">
            Preencha os dados do seu evento de bingo
          </p>
        </div>

        <BingoForm onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default NovoBingo;
