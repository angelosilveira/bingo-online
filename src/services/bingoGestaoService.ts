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

export async function getCompradoresDetalhadosByBingoId(bingoId: string) {
  // Busca todas as cartelas do bingo
  const { data: cartelas, error: errorCartelas } = await supabase
    .from("cartelas")
    .select("id, numero");
  if (errorCartelas) throw errorCartelas;
  const cartelaIds = (cartelas || []).map((c: any) => c.id);
  if (cartelaIds.length === 0) return [];
  // Busca compradores das cartelas
  const { data: vendidos, error: errorVendidos } = await supabase
    .from("cartelas_vendidas")
    .select("id, comprador_nome, comprador_telefone, pago, cartela_id")
    .in("cartela_id", cartelaIds);
  if (errorVendidos) throw errorVendidos;
  // Junta os dados
  return (vendidos || []).map((v: any) => {
    const cartela = (cartelas || []).find((c: any) => c.id === v.cartela_id);
    return {
      id: v.id,
      nome: v.comprador_nome,
      telefone: v.comprador_telefone,
      numero_cartela: cartela?.numero,
      pago: v.pago,
    };
  });
}
