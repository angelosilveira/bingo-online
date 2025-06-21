// src/services/userService.ts
import { supabase } from "@/integrations/supabase/client";
import { User, CreateUserData, UpdateUserData } from "@/models/User";
import bcrypt from "bcryptjs";

export class UserService {
  // Listar todos os usuários
  static async listUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("id,name,username,phone,role,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }

    return (data as User[]) || [];
  }

  static async checkUsernameExists(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows returned
      console.error("Erro ao verificar username:", error);
      throw error;
    }

    return !!data;
  }

  // Criar novo usuário (apenas na tabela users, sem autenticação)
  static async createUser(userData: CreateUserData): Promise<User | null> {
    try {
      // Verificar se o username já existe
      const usernameExists = await this.checkUsernameExists(userData.username);
      if (usernameExists) {
        throw new Error("Nome de usuário já está em uso");
      }

      // Gerar hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Inserir dados na tabela users (com hash da senha)
      const { data, error } = await supabase
        .from("users")
        .insert({
          name: userData.name,
          username: userData.username,
          phone: userData.phone,
          role: userData.role,
          password: hashedPassword,
        })
        .select("id,name,username,phone,role,password,created_at")
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return null;
    }
  }

  // Atualizar usuário
  static async updateUser(
    userId: string,
    userData: UpdateUserData
  ): Promise<User | null> {
    try {
      // Atualizar dados na tabela users (sem username)
      const { data, error } = await supabase
        .from("users")
        .update({
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select("id,name,username,phone,role,created_at")
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  // Excluir usuário
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      // 1. Excluir da tabela users
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (deleteError) {
        throw deleteError;
      }

      return true;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      return false;
    }
  }

  // Buscar usuário por ID
  static async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id,name,username,phone,role,created_at")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }

    return data;
  }
}
