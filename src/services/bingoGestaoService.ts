
import { Bingo, ConferenciaItem, Comprador } from "../models/BingoGestao";
import { supabase } from "../integrations/supabase/client";

export async function getBingoById(id: string): Promise<Bingo> {
  const { data, error } = await supabase
    .from("bingos")
    .select("*, users:responsavel_id(id, name)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    responsavel_id: data.responsavel_id,
    responsavel_nome: data.users?.name || "",
    date: data.date,
    quantity_of_cartelas: data.quantity_of_cartelas,
    status: data.status,
  };
}

export async function getConferenciaByBingoId(
  bingoId: string
): Promise<ConferenciaItem[]> {
  const { data, error } = await supabase
    .from("numeros_sorteados")
    .select("*")
    .eq("bingo_id", bingoId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as ConferenciaItem[];
}

export async function getCompradoresByBingoId(
  bingoId: string
): Promise<Comprador[]> {
  const { data, error } = await supabase
    .from("cartelas")
    .select("user_id, users: user_id (name), id")
    .eq("bingo_id", bingoId);
  if (error) throw error;
  // Agrupa por comprador e conta cartelas
  const compradoresMap: Record<string, Comprador> = {};
  (data || []).forEach((cartela: any) => {
    const uid = cartela.user_id;
    if (!compradoresMap[uid]) {
      compradoresMap[uid] = {
        id: uid,
        nome: cartela.users?.name || "",
        email: "",
        qtd_cartelas: 0,
      };
    }
    compradoresMap[uid].qtd_cartelas++;
  });
  return Object.values(compradoresMap);
}
