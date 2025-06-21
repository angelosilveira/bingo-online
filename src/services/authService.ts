import { supabase } from "@/integrations/supabase/client";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export class AuthService {
  // Faz login buscando o usuário na tabela users e comparando o hash da senha
  static async login(
    username: string,
    password: string
  ): Promise<Omit<User, "password"> | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, username, phone, role, password, created_at")
      .eq("username", username)
      .maybeSingle();

    if (error || !data) {
      console.log("[AuthService] Usuário não encontrado ou erro:", error, data);
      return null;
    }

    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) {
      console.log("[AuthService] Senha inválida para usuário:", username);
      return null;
    }

    // Remove o hash da senha e retorna o restante
    const { password: _pw, ...userWithoutPassword } = data;
    console.log("[AuthService] Login bem-sucedido:", userWithoutPassword);
    return userWithoutPassword as Omit<User, "password">;
  }
}
