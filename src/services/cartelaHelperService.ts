import { supabase } from "@/integrations/supabase/client";

export async function getBingoCartelasInfo(bingoId: string) {
  // Busca quantidade total de cartelas permitidas
  const { data: bingo, error: errorBingo } = await supabase
    .from("bingos")
    .select("quantity_of_cartelas")
    .eq("id", bingoId)
    .single();
  if (errorBingo) throw errorBingo;
  // Busca cartelas_vendidas desse bingo e faz join para pegar o número da cartela
  const { data: vendidas, error: errorVendidas } = await supabase
    .from("cartelas_vendidas")
    .select("cartela_id, cartelas(numero)");
  if (errorVendidas) throw errorVendidas;
  const numerosCadastrados = (vendidas || [])
    .map((v: any) => v.cartelas?.numero)
    .filter((n: number | null) => n != null);
  return {
    totalPermitidas: bingo?.quantity_of_cartelas || 0,
    cadastradas: numerosCadastrados.length,
    numerosCadastrados,
  };
}
