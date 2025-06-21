export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bingos: {
        Row: {
          created_at: string | null
          date: string
          id: string
          local: string | null
          name: string | null
          quantity_of_cartelas: number
          status: string | null
          time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          local?: string | null
          name?: string | null
          quantity_of_cartelas: number
          status?: string | null
          time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          local?: string | null
          name?: string | null
          quantity_of_cartelas?: number
          status?: string | null
          time?: string
        }
        Relationships: []
      }
      cartelas: {
        Row: {
          bingo_id: string | null
          created_at: string | null
          id: string
          numero: number | null
          numeros: number[]
        }
        Insert: {
          bingo_id?: string | null
          created_at?: string | null
          id?: string
          numero?: number | null
          numeros: number[]
        }
        Update: {
          bingo_id?: string | null
          created_at?: string | null
          id?: string
          numero?: number | null
          numeros?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "cartelas_bingo_id_fkey"
            columns: ["bingo_id"]
            isOneToOne: false
            referencedRelation: "bingos"
            referencedColumns: ["id"]
          },
        ]
      }
      cartelas_vendidas: {
        Row: {
          cartela_id: string | null
          comprador_nome: string
          comprador_telefone: string | null
          created_at: string | null
          id: string
          observacoes: string | null
          pago: boolean | null
        }
        Insert: {
          cartela_id?: string | null
          comprador_nome: string
          comprador_telefone?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          pago?: boolean | null
        }
        Update: {
          cartela_id?: string | null
          comprador_nome?: string
          comprador_telefone?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          pago?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cartelas_vendidas_cartela_id_fkey"
            columns: ["cartela_id"]
            isOneToOne: false
            referencedRelation: "cartelas"
            referencedColumns: ["id"]
          },
        ]
      }
      ganhadores: {
        Row: {
          bingo_id: string | null
          cartela_id: string | null
          created_at: string | null
          id: string
          premio_ordem: number
        }
        Insert: {
          bingo_id?: string | null
          cartela_id?: string | null
          created_at?: string | null
          id?: string
          premio_ordem: number
        }
        Update: {
          bingo_id?: string | null
          cartela_id?: string | null
          created_at?: string | null
          id?: string
          premio_ordem?: number
        }
        Relationships: [
          {
            foreignKeyName: "ganhadores_bingo_id_fkey"
            columns: ["bingo_id"]
            isOneToOne: false
            referencedRelation: "bingos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ganhadores_cartela_id_fkey"
            columns: ["cartela_id"]
            isOneToOne: false
            referencedRelation: "cartelas"
            referencedColumns: ["id"]
          },
        ]
      }
      numeros_sorteados: {
        Row: {
          bingo_id: string | null
          id: string
          numero: number
          sorteado_em: string | null
        }
        Insert: {
          bingo_id?: string | null
          id?: string
          numero: number
          sorteado_em?: string | null
        }
        Update: {
          bingo_id?: string | null
          id?: string
          numero?: number
          sorteado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "numeros_sorteados_bingo_id_fkey"
            columns: ["bingo_id"]
            isOneToOne: false
            referencedRelation: "bingos"
            referencedColumns: ["id"]
          },
        ]
      }
      premios: {
        Row: {
          bingo_id: string | null
          descricao: string
          id: string
          ordem: number
        }
        Insert: {
          bingo_id?: string | null
          descricao: string
          id?: string
          ordem: number
        }
        Update: {
          bingo_id?: string | null
          descricao?: string
          id?: string
          ordem?: number
        }
        Relationships: [
          {
            foreignKeyName: "premios_bingo_id_fkey"
            columns: ["bingo_id"]
            isOneToOne: false
            referencedRelation: "bingos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["role_type"]
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
          role: Database["public"]["Enums"]["role_type"]
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["role_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_cartela_numero: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      role_type: "admin" | "proprietario" | "usuario"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      role_type: ["admin", "proprietario", "usuario"],
    },
  },
} as const
