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
import { UserService } from "@/services/userService";

interface UserFormProps {
  onSubmit: (userData: {
    name: string; // Nome completo
    username: string; // Nome de usuário
    phone: string;
    role: UserRole;
    password: string;
  }) => void;
  initialData?: {
    name: string;
    phone: string;
    role: UserRole;
    password?: string;
  }; // Para edição futura
  isEditing?: boolean; // Para edição futura
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  initialData,
  isEditing,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [username, setUsername] = useState(""); // Novo estado para nome de usuário
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [role, setRole] = useState<UserRole>(initialData?.role || "usuario");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(""); // Estado para erro de nome de usuário
  const [password, setPassword] = useState(initialData?.password || ""); // Novo estado para senha

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUsernameError(""); // Limpar erro anterior

    // Validar nome de usuário apenas na criação
    if (!isEditing) {
      const usernameExists = await UserService.checkUsernameExists(username);
      if (usernameExists) {
        setUsernameError("Nome de usuário já existe.");
        setLoading(false);
        return;
      }
      if (!password) {
        setLoading(false);
        return;
      }
    }

    // Chamar onSubmit com os dados ajustados
    onSubmit({ name, username, phone, role, password });

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nome Completo
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
        <Label htmlFor="username" className="text-right">
          Nome de Usuário
        </Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="col-span-3"
          required
        />
        {usernameError && (
          <p className="col-span-4 text-right text-red-500 text-sm">
            {usernameError}
          </p>
        )}
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
      <Button
        type="submit"
        disabled={loading || (!!usernameError && !isEditing)}
      >
        {" "}
        {/* Desabilitar se houver erro de nome de usuário na criação */}
        {isEditing ? "Salvar Alterações" : "Criar Usuário"}
      </Button>
    </form>
  );
};

export default UserForm;
