import { supabase } from "@/integrations/supabase/client";

/**
 * Confere se o número da cartela pertence a uma cartela vendida para o bingo informado.
 * @param bingoId string
 * @param numeroCartela number
 * @returns boolean
 */
export async function isCartelaVendida(
  bingoId: string,
  numeroCartela: number
): Promise<boolean> {
  // Busca a cartela pelo número
  const { data: cartelas, error: errorCartela } = await supabase
    .from("cartelas")
    .select("id")
    .eq("numero", numeroCartela);
  if (errorCartela || !cartelas || cartelas.length === 0) return false;
  const cartelaId = cartelas[0].id;
  // Verifica se existe cartela_vendida para esse bingo e cartela
  const { data: vendida, error: errorVendida } = await supabase
    .from("cartelas_vendidas")
    .select("id")
    .eq("bingo_id", bingoId)
    .eq("cartela_id", cartelaId)
    .maybeSingle();
  if (errorVendida) return false;
  return !!vendida;
}
