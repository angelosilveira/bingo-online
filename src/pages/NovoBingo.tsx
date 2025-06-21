import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BingoForm from "@/components/bingo/BingoForm";
import { useToast } from "@/hooks/use-toast";

const NovoBingo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    // Aqui integraria com Supabase
    console.log("Dados do novo bingo:", data);

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
