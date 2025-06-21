import { supabase } from "./client";
import { Database } from "./types";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type UserRole = Database["public"]["Enums"]["role_type"];

// Função para listar todos os usuários
export async function listUsers(): Promise<User[] | null> {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    console.error("Erro ao listar usuários:", error);
    return null;
  }

  return data;
}

// Função para obter um usuário por ID
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Erro ao obter usuário com ID ${id}:`, error);
    return null;
  }

  return data;
}

// Função para criar um novo usuário (apenas dados da tabela users)
// A criação da conta de autenticação (email/senha) deve ser feita separadamente
export async function createUser(userData: UserInsert): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar usuário:", error);
    return null;
  }

  return data;
}

// Função para atualizar um usuário
export async function updateUser(
  id: string,
  userData: UserUpdate
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
    return null;
  }

  return data;
}

// Função para excluir um usuário
export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    console.error(`Erro ao excluir usuário com ID ${id}:`, error);
    return false;
  }

  // Nota: A exclusão da conta de autenticação associada deve ser tratada separadamente
  return true;
}
