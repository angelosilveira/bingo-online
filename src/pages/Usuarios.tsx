import React, { useEffect, useState } from "react";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
} from "@/integrations/supabase/users";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserForm from "@/components/user/UserForm";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const usersList = await listUsers();
    if (usersList) {
      setUsers(usersList);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: User["role"];
  }) => {
    // 1. Criar usuário na autenticação do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) {
      console.error("Erro ao criar usuário (Auth):", authError);
      toast({
        title: "Erro ao criar usuário",
        description: authError.message,
        variant: "destructive",
      });
      return;
    }

    if (authData?.user) {
      // 2. Inserir dados adicionais na tabela 'users'
      const newUser = {
        id: authData.user.id, // Usar o ID do usuário da autenticação
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
      };

      const createdUser = await createUser(newUser);

      if (createdUser) {
        toast({
          title: "Sucesso!",
          description: "Usuário criado com sucesso.",
        });
        setIsModalOpen(false); // Fechar modal
        fetchUsers(); // Atualizar lista
      } else {
        // Se a criação na tabela users falhar, considerar reverter a criação na auth (opcional, mais complexo)
        toast({
          title: "Erro ao criar usuário",
          description:
            "Usuário criado na autenticação, mas falha ao salvar dados adicionais.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateUser = async (userData: {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: User["role"];
  }) => {
    if (!editingUser) return;

    const updatedUser = await updateUser(editingUser.id, {
      name: userData.name,
      phone: userData.phone,
      role: userData.role,
    });

    if (updatedUser) {
      toast({
        title: "Sucesso!",
        description: "Usuário atualizado com sucesso.",
      });
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } else {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);

    if (success) {
      toast({
        title: "Sucesso!",
        description: "Usuário excluído com sucesso.",
      });
      fetchUsers(); // Atualizar lista
    } else {
      toast({
        title: "Erro ao excluir usuário",
        description: "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Usuários</h1>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingUser(null); // Limpar usuário em edição ao fechar o modal
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="mb-4">Adicionar Novo Usuário</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Edite os dados do usuário."
                : "Preencha os dados para criar um novo usuário."}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            initialData={editingUser || undefined}
            isEditing={!!editingUser}
          />
        </DialogContent>
      </Dialog>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Nível</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex gap-2">
                  {" "}
                  {/* Adicionado flex e gap para os botões */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá
                          permanentemente o usuário.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Usuarios;
