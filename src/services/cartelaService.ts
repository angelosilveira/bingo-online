import { supabase } from "@/integrations/supabase/client";

export class CartelaService {
  static async getTotalCartelas(): Promise<number> {
    const { count } = await supabase
      .from("cartelas")
      .select("id", { count: "exact", head: true });
    return count || 0;
  }
}
