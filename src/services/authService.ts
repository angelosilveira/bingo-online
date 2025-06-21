import { supabase } from "@/integrations/supabase/client";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export class AuthService {
  // Faz login buscando o usuário na tabela users e comparando o hash da senha
  static async login(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, username, phone, role, password, created_at")
      .eq("username", username)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) return null;

    // Não retorne o hash da senha para o app
    const { password: _pw, ...userWithoutPassword } = data;
    return userWithoutPassword as User;
  }
}
