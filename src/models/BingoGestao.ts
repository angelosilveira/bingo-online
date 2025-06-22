export interface Bingo {
  id: string;
  nome: string;
  responsavel_id: string;
  responsavel_nome: string;
  data: string;
  total_cartelas: number;
  status: string;
}

export interface ConferenciaItem {
  id: string;
  bingo_id: string;
  numero: number;
  created_at: string;
}

export interface Comprador {
  id: string;
  nome: string;
  email: string;
  qtd_cartelas: number;
}
