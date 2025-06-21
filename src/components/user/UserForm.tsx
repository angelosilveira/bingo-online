import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/integrations/supabase/users";
import { supabase } from "@/integrations/supabase/client";

interface UserFormProps {
  onSubmit: (userData: {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: UserRole;
  }) => void;
  initialData?: { name: string; phone: string; role: UserRole }; // Para edição futura
  isEditing?: boolean; // Para edição futura
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  initialData,
  isEditing,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [email, setEmail] = useState(""); // Email e senha apenas para criação
  const [password, setPassword] = useState(""); // Email e senha apenas para criação
  const [role, setRole] = useState<UserRole>(initialData?.role || "usuario");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Para criação, precisamos do email e senha para auth
    if (!isEditing) {
      onSubmit({ name, phone, email, password, role });
    } else {
      // Para edição, apenas nome, telefone e role são atualizados na tabela users
      // A lógica de atualização de email/senha seria separada via auth
      onSubmit({ name, phone, email: "", password: "", role }); // Passa vazio para email/password na edição
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nome
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Telefone
        </Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="col-span-3"
        />
      </div>
      {!isEditing && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
        </>
      )}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">
          Nível de Usuário
        </Label>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as UserRole)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione o nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="proprietario">Proprietário</SelectItem>
            <SelectItem value="usuario">Usuário</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading}>
        {isEditing ? "Salvar Alterações" : "Criar Usuário"}
      </Button>
    </form>
  );
};

export default UserForm;
