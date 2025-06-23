
export interface Bingo {
  id: string;
  name: string; // Changed from 'nome' to match database
  responsavel_id: string;
  responsavel_nome: string;
  date: string;
  quantity_of_cartelas: number; // Changed from 'total_cartelas' to match database
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
